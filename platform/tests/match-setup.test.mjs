import test from "node:test";
import assert from "node:assert/strict";
import { buildLocalMatchConfig } from "../game/match-setup.mjs";
const deck={name:"Upper Strata Test",realm:{id:"upper-strata",name:"Upper Strata",faction:"Eliteborn"},cards:["ELI-001","ELI-006","ELI-011","ELI-016","ELI-002"]};
test("selected deck and Realm are passed into the match engine",()=>{const config=buildLocalMatchConfig(deck);assert.deepEqual(config.deckA,deck.cards);assert.deepEqual(config.realm,deck.realm);});
test("match setup requires a selected Realm",()=>assert.throws(()=>buildLocalMatchConfig({...deck,realm:null}),/Choose a Realm/));
test("match setup requires enough cards to draw the opening hand",()=>assert.throws(()=>buildLocalMatchConfig({...deck,cards:["ELI-001","ELI-006","ELI-011","ELI-016"]}),/at least 5 cards/));
test("unsupported match modes are rejected",()=>assert.throws(()=>buildLocalMatchConfig(deck,"hotseat"),/not available/));
test("malformed card entries are rejected",()=>assert.throws(()=>buildLocalMatchConfig({...deck,cards:["ELI-001",null]}),/invalid or unavailable card/));
