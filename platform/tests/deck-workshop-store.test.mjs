import test from "node:test";
import assert from "node:assert/strict";
import { normalizeDeckStore } from "../game/deck-workshop-store.mjs";

const realms=[{id:"upper-strata"},{id:"lost-star"}];
const cards=[{id:"ELI-001"},{id:"ELI-006"}];
function idFactory(){let n=0;return ()=>`generated-${++n}`;}

test("migrates the legacy single-deck shape without losing valid data",()=>{
  const store=normalizeDeckStore({name:"  First  ",realm:"lost-star",cards:["ELI-001","UNKNOWN"]},{makeId:idFactory(),realms,cards});
  assert.equal(store.decks.length,1);
  assert.equal(store.activeId,store.decks[0].id);
  assert.equal(store.decks[0].name,"First");
  assert.equal(store.decks[0].realm,"lost-star");
  assert.deepEqual(store.decks[0].cards,["ELI-001"]);
});

test("keeps independent saved decks and the selected active deck",()=>{
  const saved={activeId:"second",decks:[
    {id:"first",name:"One",realm:"upper-strata",cards:["ELI-001"]},
    {id:"second",name:"Two",realm:"lost-star",cards:["ELI-006"]}
  ]};
  const store=normalizeDeckStore(saved,{makeId:idFactory(),realms,cards});
  assert.equal(store.activeId,"second");
  assert.deepEqual(store.decks.map(deck=>deck.cards),[["ELI-001"],["ELI-006"]]);
});

test("replaces duplicate or missing deck IDs so deck switching remains unambiguous",()=>{
  const store=normalizeDeckStore({activeId:"same",decks:[
    {id:"same",name:"One",cards:[]},
    {id:"same",name:"Two",cards:[]},
    {name:"Three",cards:[]}
  ]},{makeId:idFactory(),realms,cards});
  assert.equal(new Set(store.decks.map(deck=>deck.id)).size,3);
  assert.equal(store.activeId,"same");
});

test("falls back to the first deck when the saved active ID is stale",()=>{
  const store=normalizeDeckStore({activeId:"missing",decks:[
    {id:"first",name:"One",cards:[]},
    {id:"second",name:"Two",cards:[]}
  ]},{makeId:idFactory(),realms,cards});
  assert.equal(store.activeId,"first");
});

test("creates a safe empty deck when storage is absent or malformed",()=>{
  for(const saved of [null,"broken",{}, {decks:[]} ]){
    const store=normalizeDeckStore(saved,{makeId:idFactory(),realms,cards});
    assert.equal(store.decks.length,1);
    assert.equal(store.decks[0].name,"My First Deck");
    assert.equal(store.decks[0].realm,"");
    assert.deepEqual(store.decks[0].cards,[]);
  }
});

test("normalizes invalid Realm values, unknown cards, and unsafe deck names",()=>{
  const store=normalizeDeckStore({decks:[{id:"one",name:"  ".padEnd(60,"x"),realm:"not-a-realm",cards:["ELI-001",7,"UNKNOWN"]}]},{makeId:idFactory(),realms,cards});
  assert.equal(store.decks[0].name.length,48);
  assert.equal(store.decks[0].realm,"");
  assert.deepEqual(store.decks[0].cards,["ELI-001"]);
});
