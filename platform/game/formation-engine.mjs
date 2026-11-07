import { ELITEBORN_CARDS, ELITEBORN_UNITS, ELITEBORN_FORMATIONS, getCard } from "./eliteborn-catalogue.mjs";

const clone = value => structuredClone(value);
const makeRng = seed => { let state = seed >>> 0; return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; }; };
const shuffle = (items, rng) => { const out=[...items]; for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];} return out; };
const makeDeck = () => ELITEBORN_CARDS.map(card=>card.id);
const prepareDeck = deck => Array.isArray(deck) ? deck.filter(id=>cardById(id)) : makeDeck();
const player = (id,name,deck,rng) => ({id,name,health:20,deck:shuffle(deck,rng),hand:[],discard:[],board:[],resource:0,acted:false});
const log = (state,message) => state.log.push({turn:state.turn,message});
const draw = p => { if(!p.deck.length) return false; p.hand.push(p.deck.shift()); return true; };
const unitCount = p => p.board.length;
const cardById = id => getCard(id);
const forceCounts = (p,ids) => ids.map(id=>cardById(id)).filter(c=>c?.type==="UNIT").reduce((a,c)=>(a[c.force]=(a[c.force]||0)+1,a),{});
const sumStats = units => units.reduce((a,u)=>({str:a.str+u.str,hp:a.hp+u.hp,maxHp:a.maxHp+u.maxHp}),{str:0,hp:0,maxHp:0});
const entityFor = (id,owner,card) => ({entityId:id,cardId:card.id,name:card.name,force:card.force,str:card.str,hp:card.hp,maxHp:card.hp,attacked:false,componentIds:[],formation:false});
function nextEntity(state,owner,card){return entityFor(`e${++state.entitySeq}`,owner,card);}
function drawToFive(p){while(p.hand.length<5&&draw(p)){};}
function beginTurn(state,side){
  const p=state.players[side]; state.active=side; state.turn++; p.board.forEach(u=>{u.attacked=false;u.str=u.baseStr??u.str;});
  drawToFive(p); p.resource=p.hand.reduce((n,id)=>n+(cardById(id)?.resource||0),0);
  log(state,`${p.name} begins turn ${state.turn} with ${p.resource} resources.`);
}
export function createMatch({seed=1,deckA,deckB,realm=null}={}){
  const rng=makeRng(seed),a=player("you","YOU",prepareDeck(deckA),rng),b=player("bot","RIVAL",prepareDeck(deckB),rng);
  const state={players:{you:a,bot:b},active:"you",turn:0,phase:"main",winner:null,log:[],entitySeq:0,seed,realm:realm?clone(realm):null};
  for(let i=0;i<5;i++){draw(a);draw(b);}
  beginTurn(state,"you");
  return state;
}
function requireTurn(state,side){if(state.winner)throw new Error("The match is over.");if(state.active!==side)throw new Error("It is not your turn.");}
export function canForm(state,side,formationId,componentIds){
  const formation=cardById(formationId); if(!formation||formation.type==="UNIT")return {ok:false,reason:"Choose a Formation card."};
  const p=state.players[side], selected=componentIds.map(id=>p.board.find(u=>u.entityId===id));
  if(selected.some(x=>!x)||selected.length!==formation.requires.length)return {ok:false,reason:`Select exactly ${formation.requires.length} Units.`};
  if(new Set(componentIds).size!==componentIds.length)return {ok:false,reason:"A Unit can only be selected once."};
  const forces=selected.map(x=>x.force).sort(),required=[...formation.requires].sort();
  if(forces.join("|")!==required.join("|"))return {ok:false,reason:`Requires ${formation.requires.join(" + ")}.`};
  if(selected.some(x=>x.formation||x.hp<=0))return {ok:false,reason:"Only living, unformed Units can combine."};
  const totals=sumStats(selected);
  return {ok:true,formation,selected,totals};
}
export function playCard(state,side,cardId){
  requireTurn(state,side); const p=state.players[side],index=p.hand.indexOf(cardId),card=cardById(cardId);
  if(index<0||!card)throw new Error("That card is not in your hand.");
  if(card.type!=="UNIT")throw new Error("Formation cards need selected board components.");
  if(p.resource<card.cost)throw new Error("Not enough resources.");
  if(unitCount(p)>=6)throw new Error("Your six Unit positions are full.");
  p.resource-=card.cost;p.hand.splice(index,1);
  const entity=nextEntity(state,side,card);entity.baseStr=entity.str;p.board.push(entity);
  log(state,`${p.name} deploys ${card.name} (${entity.str}/${entity.hp}).`);
  return entity.entityId;
}
export function formUnits(state,side,formationId,componentIds){
  requireTurn(state,side);const p=state.players[side],index=p.hand.indexOf(formationId),validation=canForm(state,side,formationId,componentIds);
  if(index<0)throw new Error("That Formation card is not in your hand.");
  if(!validation.ok)throw new Error(validation.reason);
  if(p.resource<validation.formation.cost)throw new Error("Not enough resources.");
  const {selected,totals,formation}=validation;
  p.resource-=formation.cost;p.hand.splice(index,1);
  const ids=new Set(componentIds);p.board=p.board.filter(u=>!ids.has(u.entityId));
  const formed=nextEntity(state,side,formation);Object.assign(formed,{str:totals.str,hp:totals.hp,maxHp:totals.maxHp,baseStr:totals.str,formation:true,componentIds:[...componentIds],componentCardIds:selected.map(u=>u.cardId)});
  Object.assign(formed,{formationCardId:formation.id});p.board.push(formed);
  log(state,`${p.name} combines ${selected.map(u=>u.name).join(" + ")} into ${formation.name} (${formed.str}/${formed.hp}).`);
  return formed.entityId;
}
export function attack(state,side,attackerId,targetId=null){
  requireTurn(state,side);const p=state.players[side],enemy=state.players[side==="you"?"bot":"you"];
  const attacker=p.board.find(u=>u.entityId===attackerId);if(!attacker||attacker.attacked||attacker.hp<=0)throw new Error("That Unit cannot attack.");
  if(targetId){const target=enemy.board.find(u=>u.entityId===targetId);if(!target||target.hp<=0)throw new Error("Invalid target.");const damage=attacker.str;target.hp-=damage;attacker.hp-=target.str;log(state,`${attacker.name} deals ${damage} to ${target.name}; takes ${target.str} in return.`);if(target.hp<=0)destroy(enemy,target);if(attacker.hp<=0)destroy(p,attacker);}
  else{enemy.health-=attacker.str;log(state,`${attacker.name} hits ${enemy.name} for ${attacker.str}.`);}
  attacker.attacked=true;if(enemy.health<=0)state.winner=side;return state;
}
function destroy(owner,unit){owner.board=owner.board.filter(u=>u.entityId!==unit.entityId);owner.discard.push(...(unit.formation?[...unit.componentCardIds,unit.formationCardId]:[unit.cardId]));}
export function endTurn(state,side){
  requireTurn(state,side);const p=state.players[side];log(state,`${p.name} ends the turn.`);
  const next=side==="you"?"bot":"you";
  if(next==="bot"){botTurn(state);}
  else beginTurn(state,"bot");
  return state;
}
function botTurn(state){
  const side="bot",p=state.players.bot,enemy=state.players.you;state.active=side;state.turn++;drawToFive(p);p.resource=p.hand.reduce((n,id)=>n+(cardById(id)?.resource||0),0);log(state,`RIVAL begins turn ${state.turn} with ${p.resource} resources.`);
  let guard=0,changed=true;
  while(changed&&guard++<10){changed=false;const affordable=p.hand.map(id=>cardById(id)).filter(c=>c&&c.type==="UNIT"&&c.cost<=p.resource&&p.board.length<6).sort((a,b)=>a.cost-b.cost)[0];if(affordable){playCard(state,side,affordable.id);changed=true;}}
  for(const u of [...p.board])if(!u.attacked&&u.hp>0){const target=[...enemy.board].sort((a,b)=>a.hp-b.hp)[0];attack(state,side,u.entityId,target?.entityId||null);if(state.winner)return;}
  log(state,"RIVAL ends the turn.");beginTurn(state,"you");
}
export function snapshot(state){return clone(state);}
export function getLegalFormations(state,side){
  return state.players[side].hand.map(cardById).filter(c=>c&&c.type!=="UNIT").map(card=>({card,combinations:[]})).filter(x=>x.card.requires.length===2||x.card.requires.length===5);
}
