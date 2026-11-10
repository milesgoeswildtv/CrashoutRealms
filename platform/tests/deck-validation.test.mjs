import test from "node:test";
import assert from "node:assert/strict";
import { validateDeck, copyLimitFor } from "../game/deck-validation.mjs";

const realm={id:"upper-strata",name:"Upper Strata",faction:"Eliteborn"};
const catalogue=[
 {id:"U1",name:"Unit One",type:"UNIT",faction:"Eliteborn"},
 {id:"S1",name:"Special One",type:"FORMATION",faction:"Eliteborn"},
 {id:"L1",name:"Legendary One",type:"SPECIAL",special:true,rarity:"LEGENDARY",faction:"Eliteborn"},
 {id:"U2",name:"Other Faction",type:"UNIT",faction:"Prismites"}
];
test("standard Units allow four copies, Special and Legendary allow one",()=>{
 assert.equal(copyLimitFor(catalogue[0]),4);
 assert.equal(copyLimitFor(catalogue[1]),1);
 assert.equal(copyLimitFor(catalogue[2]),1);
});
test("validates confirmed copy limits without inventing a deck size",()=>{
 const result=validateDeck({cards:["U1","U1","U1","U1","S1","L1"],realm,catalogue});
 assert.equal(result.valid,true);
 assert.equal(result.complete,false);
 assert.match(result.warnings[0],/Deck size is not certified/);
});
test("rejects a fifth copy of an individual Unit",()=>{
 const result=validateDeck({cards:Array(5).fill("U1"),realm,catalogue});
 assert.equal(result.valid,false);
 assert.match(result.errors.join(" "),/exceeds the limit of 4/);
});
test("rejects duplicate copies of a Special and Legendary",()=>{
 const result=validateDeck({cards:["S1","S1","L1","L1"],realm,catalogue});
 assert.equal(result.valid,false);
 assert.equal(result.errors.length,2);
});
test("rejects cross-faction cards and unknown IDs",()=>{
 const result=validateDeck({cards:["U2","MISSING"],realm,catalogue});
 assert.equal(result.valid,false);
 assert.match(result.errors.join(" "),/does not belong to Eliteborn/);
 assert.match(result.errors.join(" "),/Unknown card ID/);
});
test("published format size is enforced exactly",()=>{
 assert.equal(validateDeck({cards:["U1"],realm,catalogue,deckSize:1}).complete,true);
 assert.match(validateDeck({cards:[],realm,catalogue,deckSize:1}).errors.join(" "),/exactly 1 cards/);
});
test("missing Realm cannot be marked complete",()=>{
 const result=validateDeck({cards:["U1"],catalogue,deckSize:1});
 assert.equal(result.valid,false);
 assert.equal(result.complete,false);
});
