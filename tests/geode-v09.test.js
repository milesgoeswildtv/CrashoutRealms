const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class FakeElement {
  constructor(document) {
    this.document = document;
    this.dataset = {};
    this.value = '';
    this._innerHTML = '';
    this.optionButtons = [];
    this.classList = {add() {}, remove() {}, contains() { return false; }};
    this.style = {};
  }
  set innerHTML(value) {
    this._innerHTML = value;
    this.optionButtons = [...String(value).matchAll(/data-val="([^"]*)"/g)].map(match => {
      const button = new FakeElement(this.document);
      button.dataset.val = match[1];
      return button;
    });
  }
  get innerHTML() { return this._innerHTML; }
  querySelector() { return null; }
  querySelectorAll(selector) {
    if (selector !== '[data-val]') return [];
    return this.optionButtons;
  }
  appendChild() {}
  prepend() {}
  insertAdjacentElement() {}
  remove() {}
  removeAttribute() {}
  cloneNode() { return new FakeElement(this.document); }
  getBoundingClientRect() { return {left: 0, top: 0, width: 10, height: 10}; }
}

function loadRuntime() {
  const elements = new Map();
  const document = {
    body: new FakeElement(),
    createElement() { return new FakeElement(document); },
    querySelector(selector) {
      if (!selector.startsWith('#')) return null;
      if (!elements.has(selector)) elements.set(selector, new FakeElement(document));
      return elements.get(selector);
    },
    querySelectorAll() { return []; }
  };
  document.body.document = document;
  document.querySelector('#p1Faction').value = 'Living Geodes';
  document.querySelector('#p2Faction').value = 'Moondemons';
  const context = {console, document, setTimeout() { return 0; }, clearTimeout() {},
    queueMicrotask, requestAnimationFrame(fn) { fn(); }, Math};
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('src-v09/cards.js', 'utf8'), context);
  vm.runInContext(fs.readFileSync('src-v09/game.js', 'utf8'), context);
  const debug = context.REALMS_DEBUG;
  debug.startGame({mode: 'hotseat', realm: 'Crystal Isle', p1Faction: 'Living Geodes',
    p1Passive: 'Kimberlite', p2Faction: 'Living Geodes', p2Passive: 'Fracture'});
  return {debug, elements, click(value) {
    const body = elements.get('#choiceBody');
    const button = body.querySelectorAll('[data-val]').find(x => x.dataset.val === String(value));
    assert.ok(button, `choice ${value} is available`);
    button.onclick();
  }};
}

function unit(runtime, id, owner) {
  const {debug} = runtime;
  return debug.geodes.makeInstance(debug.geodes.cardById(id), owner);
}

function resetBoard(runtime, ai = false) {
  const state = runtime.debug.getState();
  state.phase = 'placement';
  state.active = 0;
  state.winner = null;
  state.choiceDepth = 0;
  state.choicePending = false;
  state.players[0].ai = ai;
  state.players[0].board = [];
  state.players[1].board = [];
  return state;
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const pebble = unit(runtime, 'GEO-001', 0);
  const first = unit(runtime, 'GEO-002', 1);
  const chosen = unit(runtime, 'GEO-003', 1);
  state.players[0].board.push(pebble);
  state.players[1].board.push(first, chosen);
  const firstHp = first.currentHp;
  const chosenHp = chosen.currentHp;
  runtime.debug.geodes.crackUnit(pebble, 'test');
  assert.equal(state.choicePending, true, 'Pebbleheart waits for a human target');
  assert.equal(state.active, 0, 'placement does not advance during the choice');
  runtime.click(chosen.iid);
  assert.equal(first.currentHp, firstHp);
  assert.equal(chosen.currentHp, chosenHp - 2, 'the exact selected enemy takes damage');
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const lumen = unit(runtime, 'GEO-004', 0);
  const ally = unit(runtime, 'GEO-002', 0);
  ally.currentHp -= 3;
  state.players[0].board.push(lumen, ally);
  runtime.debug.geodes.crackUnit(lumen, 'test');
  assert.equal(state.choicePending, true, 'Lumen waits for human allocation');
  runtime.click(ally.iid);
  runtime.click(ally.iid);
  runtime.click(ally.iid);
  assert.equal(ally.currentHp, runtime.debug.geodes.getMaxHp(ally), 'all three points may heal one creature');
  assert.equal(state.choicePending, false);
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime, true);
  const pebble = unit(runtime, 'GEO-001', 0);
  const high = unit(runtime, 'GEO-002', 1);
  const low = unit(runtime, 'GEO-003', 1);
  low.currentHp = 2;
  state.players[0].board.push(pebble);
  state.players[1].board.push(high, low);
  runtime.debug.geodes.crackUnit(pebble, 'test');
  assert.equal(low.currentHp, 0, 'AI targets the lowest-current-HP enemy');
  assert.equal(state.choicePending, false);

  const lumen = unit(runtime, 'GEO-004', 0);
  const ally = unit(runtime, 'GEO-002', 0);
  ally.currentHp -= 3;
  state.players[0].board = [lumen, ally];
  runtime.debug.geodes.crackUnit(lumen, 'test');
  assert.equal(ally.currentHp, runtime.debug.geodes.getMaxHp(ally), 'AI allocates all available healing');
  assert.equal(state.choicePending, false);
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const deepcore = unit(runtime, 'GEO-007', 0);
  state.players[0].board.push(deepcore);
  assert.equal(runtime.debug.geodes.unitHasTaunt(deepcore), true, 'Deepcore has Taunt only while Dormant');
  deepcore.cracked = true;
  assert.equal(runtime.debug.geodes.unitHasTaunt(deepcore), false);

  const faultborn = unit(runtime, 'GEO-022', 0);
  faultborn.cracked = true;
  const tide = unit(runtime, 'GEO-016', 0);
  faultborn.prisms.push({card: tide, chosenColor: 'Blue', countsColors: ['Blue']});
  state.players[0].board = [faultborn];
  const hp = faultborn.currentHp;
  runtime.debug.geodes.applyDamage(faultborn, 4, null, {reason: 'test'});
  assert.equal(faultborn.currentHp, hp - 2, 'Faultborn and Tidemoss each reduce their first packet');
  runtime.debug.geodes.applyDamage(faultborn, 2, null, {reason: 'test'});
  assert.equal(faultborn.currentHp, hp - 4, 'neither first-damage reducer repeats');
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const mirror = unit(runtime, 'GEO-006', 0);
  const small = unit(runtime, 'GEO-001', 1);
  const large = unit(runtime, 'GEO-024', 1);
  state.players[0].board = [mirror];
  state.players[1].board = [small, large];
  runtime.debug.geodes.crackUnit(mirror, 'test');
  runtime.click(small.iid);
  assert.equal(mirror.tempStr, 1, 'Mirrorstone copies the selected enemy, not the largest enemy');

  const capped = unit(runtime, 'GEO-006', 0);
  state.players[0].board = [capped];
  runtime.debug.geodes.crackUnit(capped, 'test');
  runtime.click(large.iid);
  assert.equal(capped.tempStr, 4, 'Mirrorstone caps printed STR gain at four');
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const host = unit(runtime, 'GEO-012', 0);
  const other = unit(runtime, 'GEO-002', 0);
  const exact = unit(runtime, 'GEO-021', 0);
  host.prisms.push(
    {card: unit(runtime, 'GEO-013', 0), chosenColor: 'Red', countsColors: ['Red']},
    {card: unit(runtime, 'GEO-014', 0), chosenColor: 'Red', countsColors: ['Red']}
  );
  exact.currentHp -= 2;
  other.currentHp -= 2;
  state.players[0].board = [host, other, exact];
  runtime.debug.geodes.endRound();
  assert.equal(state.choicePending, true, 'Worldheart suspends End Phase');
  runtime.click(exact.iid);
  assert.equal(exact.currentHp, runtime.debug.geodes.getMaxHp(exact), 'Worldheart heals the exact selection');
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const host = unit(runtime, 'GEO-007', 0);
  host.crackRecipe = ['Green', 'Green', 'Green', 'Green'];
  const first = unit(runtime, 'GEO-013', 0);
  const second = unit(runtime, 'GEO-014', 0);
  host.prisms.push({card: first, chosenColor: 'Red', countsColors: ['Red']});
  host.prisms.push({card: second, chosenColor: 'Red', countsColors: ['Red']});
  state.players[0].board = [host];
  const refract = unit(runtime, 'GEO-028', 0);
  refract.statuses.castTargets = [host.iid];
  runtime.debug.geodes.resolveSpell(refract, state.players[0]);
  runtime.click('1');
  assert.equal(host.prisms[0].chosenColor, 'Red');
  assert.equal(host.prisms[1].chosenColor, 'Green', 'Refract switches the exact attached Prism');

  const relayTarget = unit(runtime, 'GEO-001', 0);
  const relayOther = unit(runtime, 'GEO-004', 0);
  relayTarget.currentHp -= 2;
  relayOther.currentHp -= 2;
  state.players[0].board = [relayTarget, relayOther];
  const relay = unit(runtime, 'GEO-029', 0);
  relay.statuses.castTargets = [relayOther.iid];
  runtime.debug.geodes.resolveSpell(relay, state.players[0]);
  assert.equal(relayTarget.currentHp, 2);
  assert.equal(relayOther.currentHp, runtime.debug.geodes.getMaxHp(relayOther));
  assert.equal(relayOther.statuses.doubleNextPrism, true, 'Crystal Relay marks the exact target');
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const seed = unit(runtime, 'GEO-021', 0);
  seed.currentHp -= 2;
  seed.crackRecipe = ['Red', 'Blue', 'Green'];
  state.players[0].board = [seed];
  runtime.debug.geodes.attachPrism(state.players[0], unit(runtime, 'GEO-014', 0), seed, 'Red');
  assert.equal(seed.currentHp, 4, 'Seed heals on its first attachment');
  runtime.debug.geodes.attachPrism(state.players[0], unit(runtime, 'GEO-015', 0), seed, 'Red');
  assert.equal(seed.currentHp, 4, 'Seed does not repeat its attachment heal');
  seed.cracked = true;
  runtime.debug.geodes.prepareRound();
  assert.equal(seed.currentHp, 5, 'cracked Seed heals at round start');

  const parasite = unit(runtime, 'GEO-023', 0);
  const receiver = unit(runtime, 'GEO-007', 0);
  parasite.currentHp -= 1;
  receiver.crackRecipe = ['Red', 'Blue', 'Green'];
  state.players[0].board = [parasite, receiver];
  runtime.debug.geodes.attachPrism(state.players[0], unit(runtime, 'GEO-014', 0), parasite, 'Red');
  assert.equal(parasite.tempStr, 0, 'Crystal Parasite ignores its own attachment');
  runtime.debug.geodes.attachPrism(state.players[0], unit(runtime, 'GEO-015', 0), receiver, 'Red');
  assert.equal(parasite.tempStr, 1, 'Crystal Parasite triggers from another Geode');
  assert.equal(parasite.currentHp, runtime.debug.geodes.getMaxHp(parasite));
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const host = unit(runtime, 'GEO-007', 0);
  host.crackRecipe = ['Red', 'Blue', 'Green', 'Green'];
  state.players[0].board = [host];
  runtime.debug.geodes.attachPrism(state.players[0], unit(runtime, 'GEO-015', 0), host, 'Violet');
  assert.equal(host.tempStr, 0, 'Riftglass does not trigger itself');
  runtime.debug.geodes.attachPrism(state.players[0], unit(runtime, 'GEO-013', 0), host, 'Red');
  assert.equal(host.tempStr, 1, 'Riftglass triggers on another attachment');

  const glassjaw = unit(runtime, 'GEO-024', 0);
  state.players[0].board = [glassjaw];
  runtime.debug.geodes.applyDamage(glassjaw, 2, null, {reason: 'test'});
  assert.equal(glassjaw.tempStr, 0);
  runtime.debug.geodes.applyDamage(glassjaw, 3, null, {reason: 'test'});
  assert.equal(state.players[0].board.includes(glassjaw), false, 'Glassjaw gets no trigger when it does not survive');

  const survivor = unit(runtime, 'GEO-024', 0);
  survivor.currentHp = 6;
  state.players[0].board = [survivor];
  runtime.debug.geodes.applyDamage(survivor, 3, null, {reason: 'test'});
  assert.equal(survivor.tempStr, 2, 'Glassjaw triggers after surviving one 3-damage packet');
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const razor = unit(runtime, 'GEO-005', 0);
  razor.cracked = true;
  razor.baseStr = razor.crackedStr;
  razor.statuses.attacking = true;
  state.players[0].board = [razor];
  assert.equal(runtime.debug.geodes.getStr(razor), 8, 'Razor gains +2 in its first combat');
  razor.statuses.razorFirstCombatUsed = true;
  assert.equal(runtime.debug.geodes.getStr(razor), 6, 'Razor bonus is first-combat only');

  const choir = unit(runtime, 'GEO-010', 0);
  choir.cracked = true;
  const receivers = [0, 1, 2, 3].map(() => {
    const receiver = unit(runtime, 'GEO-007', 0);
    receiver.crackRecipe = ['Green', 'Green', 'Green', 'Green'];
    return receiver;
  });
  state.players[0].board = [choir, ...receivers];
  receivers.forEach(receiver => runtime.debug.geodes.attachPrism(
    state.players[0], unit(runtime, 'GEO-014', 0), receiver, 'Red'));
  assert.equal(choir.tempStr, 3, 'Shard Choir triggers on only the first three qualifying attachments');
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const target = unit(runtime, 'GEO-001', 0);
  target.prisms.push({card: unit(runtime, 'GEO-014', 0), chosenColor: 'Red', countsColors: ['Red']});
  state.players[0].board = [target];
  const facet = unit(runtime, 'GEO-020', 0);
  state.players[0].traps = [facet];
  runtime.debug.geodes.applyDamage(target, target.currentHp - 1, null, {reason: 'test'});
  assert.equal(state.players[0].traps.length, 1, 'Emergency Facet ignores nonlethal damage');
  runtime.debug.geodes.applyDamage(target, target.currentHp, null, {reason: 'test'});
  assert.equal(target.cracked, true, 'Emergency Facet cracks a lethal, one-color-short Geode');
  assert.equal(state.players[0].traps.length, 0);

  const notShort = unit(runtime, 'GEO-007', 0);
  notShort.prisms.push({card: unit(runtime, 'GEO-014', 0), chosenColor: 'Red', countsColors: ['Red']});
  state.players[0].board = [notShort];
  state.players[0].traps = [unit(runtime, 'GEO-020', 0)];
  runtime.debug.geodes.applyDamage(notShort, notShort.currentHp, null, {reason: 'test'});
  assert.equal(state.players[0].traps.length, 1, 'Emergency Facet ignores recipes more than one color short');
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const p = state.players[0];
  p.hand = [];
  const untouched = unit(runtime, 'GEO-001', 0);
  const spell = unit(runtime, 'GEO-027', 0);
  const nonPrismA = unit(runtime, 'GEO-002', 0);
  const prismA = unit(runtime, 'GEO-013', 0);
  const nonPrismB = unit(runtime, 'GEO-003', 0);
  const prismB = unit(runtime, 'GEO-014', 0);
  p.deck = [untouched, nonPrismA, prismA, nonPrismB, prismB];
  runtime.debug.geodes.resolveSpell(spell, p);
  runtime.click(prismB.iid);
  runtime.click(nonPrismB.iid);
  runtime.click(prismA.iid);
  runtime.click(nonPrismA.iid);
  assert.equal(p.hand.at(-1).iid, prismB.iid, 'Prismatic Search takes the exact chosen Prism');
  assert.deepEqual(Array.from(p.deck.slice(0, 4), x => x.iid),
    [nonPrismB.iid, prismA.iid, nonPrismA.iid, untouched.iid],
    'Prismatic Search preserves the explicit bottom-first order');
}


{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const p = state.players[0];
  p.prismDiscount = 1;
  runtime.debug.geodes.prepareRound();
  assert.equal(p.prismDiscount, 0, 'unused Prism discounts expire at the round boundary');
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const razor = unit(runtime, 'GEO-005', 0);
  razor.cracked = true;
  razor.baseStr = razor.crackedStr;
  state.players[0].board = [razor];

  state.phase = 'placement';
  state.active = 0;
  assert.equal(runtime.debug.combatAttack(razor, null), false, 'attack is illegal outside Action Phase');
  assert.equal(razor.statuses.prismFirstCombatUsed, undefined, 'failed attack does not spend Violet Shard first-combat bonus');
  assert.equal(razor.statuses.razorFirstCombatUsed, undefined, 'failed attack does not spend Razor first-combat bonus');

  state.phase = 'combat';
  state.active = 0;
  assert.equal(runtime.debug.combatAttack(razor, null), true, 'legal direct attack resolves');
  assert.equal(razor.statuses.prismFirstCombatUsed, true);
  assert.equal(razor.statuses.razorFirstCombatUsed, true);
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const attacker = unit(runtime, 'GEO-001', 0);
  const defender = unit(runtime, 'GEO-007', 1);
  const prism = unit(runtime, 'GEO-014', 1);
  const screen = unit(runtime, 'GEO-019', 1);
  defender.prisms.push({card: prism, chosenColor: 'Red', countsColors: ['Red']});
  state.players[0].board = [attacker];
  state.players[1].board = [defender];
  state.players[1].traps = [screen];

  state.phase = 'placement';
  state.active = 0;
  assert.equal(runtime.debug.combatAttack(attacker, defender), false);
  assert.equal(state.players[1].traps.length, 1, 'illegal attack does not consume Refraction Screen');

  state.phase = 'combat';
  state.active = 0;
  attacker.acted = false;
  assert.equal(runtime.debug.combatAttack(attacker, defender), true);
  assert.equal(state.players[1].traps.length, 0, 'legal attack consumes Refraction Screen');
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const p = state.players[0];
  const host = unit(runtime, 'GEO-007', 0);
  const firstEcho = unit(runtime, 'GEO-018', 0);
  const secondEcho = unit(runtime, 'GEO-018', 0);
  host.prisms = [
    {card: firstEcho, chosenColor: 'Violet', countsColors: ['Violet']},
    {card: secondEcho, chosenColor: 'Violet', countsColors: ['Violet']}
  ];
  p.board = [host];
  p.hand = [unit(runtime, 'GEO-001', 0), unit(runtime, 'GEO-002', 0), unit(runtime, 'GEO-003', 0)];

  runtime.debug.geodes.crackUnit(host, 'test');
  const body = runtime.elements.get('#choiceBody');
  const firstOptions = body.querySelectorAll('[data-val]').map(x => x.dataset.val);
  const removed = firstOptions[0];
  runtime.click(removed);
  const secondOptions = body.querySelectorAll('[data-val]').map(x => x.dataset.val);
  assert.equal(secondOptions.includes(removed), false, 'queued hand-bottom choice refreshes legal options after earlier choice');
  assert.equal(state.choicePending, true, 'second queued hand-bottom choice remains pending');
}

{
  const runtime = loadRuntime();
  const state = resetBoard(runtime);
  const p = state.players[0];
  const host = unit(runtime, 'GEO-001', 0);
  const alignment = unit(runtime, 'GEO-030', 0);
  const prism = unit(runtime, 'GEO-014', 0);
  host.crackRecipe = ['Red', 'Blue'];
  state.players[0].board = [host];
  state.players[0].traps = [alignment];

  runtime.debug.geodes.attachPrism(p, prism, host, 'Red');
  assert.equal(state.players[0].traps.length, 0, 'Perfect Alignment triggers when the attach leaves exactly one color missing');
  assert.equal(p.prismDiscount, 1, 'Perfect Alignment grants the next-Prism discount');
  runtime.debug.geodes.prepareRound();
  assert.equal(p.prismDiscount, 0, 'Perfect Alignment discount cannot carry into the next round');
}

console.log('Living Geodes v0.9 deterministic regression tests passed.');
