import test from "node:test";
import assert from "node:assert/strict";
import {FACTIONS,starterDeck} from "../engine.js";
import {validateDeck} from "../deck-rules.js";
test("all faction starter lists satisfy the prototype 30-card deck contract",()=>{
 for(const f of FACTIONS){assert.equal(validateDeck(starterDeck(f.id)).valid,true,f.name);assert.equal(validateDeck(starterDeck(f.id).slice(0,29)).valid,false,f.name);}
});
test("standard Units allow four copies but not five",()=>{
 const unit={id:"unit-a",name:"Unit A",type:"Unit",rarity:"Common"};
 assert.equal(validateDeck(Array(4).fill(unit),{size:4}).valid,true);
 assert.ok(validateDeck([unit,unit,unit,unit,unit]).errors.some(x=>x.includes("maximum 4")));
});
test("Legendary Units and Special cards are limited to one copy",()=>{
 const legendary={id:"legend-a",name:"Legend A",type:"Unit",rarity:"Legendary"};
 const special={id:"special-a",name:"Special A",type:"Sigil",rarity:"Uncommon"};
 assert.ok(validateDeck([legendary,legendary]).errors.some(x=>x.includes("maximum 1")));
 assert.ok(validateDeck([special,special]).errors.some(x=>x.includes("maximum 1")));
});
