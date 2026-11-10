import test from "node:test";
import assert from "node:assert/strict";
import {FACTIONS,CATALOGUE,starterDeck} from "../engine.js";
import {validateDeck} from "../deck-rules.js";
test("approved prototype deck limits: 30 cards, four standard Units, one Legendary or Special",()=>{
 for(const f of FACTIONS){
  const deck=starterDeck(f.id);
  assert.equal(validateDeck(deck).valid,true);
  assert.equal(validateDeck(deck.slice(0,29)).valid,false);
  const standard=CATALOGUE[f.id].find(c=>c.type==="Unit"&&c.rarity!=="Legendary");
  const legendary=CATALOGUE[f.id].find(c=>c.rarity==="Legendary");
  const special=CATALOGUE[f.id].find(c=>c.type!=="Unit");
  assert.ok(standard&&legendary&&special);
  assert.ok(validateDeck(Array(5).fill(standard).concat(deck.slice(5))).errors.some(x=>x.includes("maximum 4")));
  assert.ok(validateDeck([legendary,legendary,...deck.slice(2)]).errors.some(x=>x.includes("maximum 1")));
  assert.ok(validateDeck([special,special,...deck.slice(2)]).errors.some(x=>x.includes("maximum 1")));
 }
});
