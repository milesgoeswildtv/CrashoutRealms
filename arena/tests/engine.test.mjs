import test from "node:test";
import assert from "node:assert/strict";
import {FACTIONS,CATALOGUE,REALM_STAGES,starterDeck,createMatch,begin,playCard,passPlacement,attack} from "../engine.js";

test("five current factions map to five current Realms",()=>{
 assert.deepEqual(FACTIONS.map(f=>f.realm),["Crystal Isle","The Lost Star","Upper Strata","The Endless","Deadlands"]);
 assert.equal(new Set(FACTIONS.map(f=>f.realm)).size,5);
});
test("each faction has a 30-card playable prototype catalogue and one Special family",()=>{
 for(const f of FACTIONS){assert.equal(CATALOGUE[f.id].length,30);assert.equal(CATALOGUE[f.id].filter(c=>c.type==="Unit").length,20);assert.equal(CATALOGUE[f.id].filter(c=>c.type!=="Unit").length,10);assert.equal(starterDeck(f.id).length,30);assert.ok(CATALOGUE[f.id].filter(c=>c.type!=="Unit").every(c=>c.type===f.special));}
});
test("match opens at 20 Health with six slots and a five-card hand",()=>{
 const s=createMatch({playerFaction:"prismites",opponentFaction:"moon-demons"});begin(s);
 assert.equal(s.players[0].health,20);assert.equal(s.players[0].board.length,6);assert.equal(s.players[0].hand.length,5);assert.equal(s.phase,"placement");assert.equal(s.round,1);
});
test("playing a card hands off priority but does not count as a pass",()=>{
 const s=createMatch({playerFaction:"prismites",opponentFaction:"moon-demons"});begin(s);
 const p=s.players[0],i=p.hand.findIndex(c=>c.type==="Unit"&&c.cost<=p.resource);assert.ok(i>=0);
 assert.equal(playCard(s,0,i,0),true);assert.equal(s.passes,0);assert.equal(s.active,1);assert.ok(p.board[0]);
});
test("two consecutive explicit passes begin combat",()=>{
 const s=createMatch({playerFaction:"prismites",opponentFaction:"moon-demons"});begin(s);
 assert.equal(passPlacement(s,0),true);assert.equal(s.phase,"placement");assert.equal(passPlacement(s,1),true);assert.equal(s.phase,"combat");
});
test("Unit combat applies simultaneous retaliation and direct attacks hit Health",()=>{
 const s=createMatch({playerFaction:"prismites",opponentFaction:"moon-demons"});begin(s);s.phase="combat";s.active=0;
 s.players[0].board[0]={name:"A",str:3,hp:4,damage:0,acted:false};
 s.players[1].board[0]={name:"B",str:2,hp:3,damage:0,acted:false};
 attack(s,0,0,0);assert.equal(s.players[0].board[0].damage,2);assert.equal(s.players[1].board[0],null);
 s.players[0].board[1]={name:"C",str:2,hp:3,damage:0,acted:false};const before=s.players[1].health;s.active=0;attack(s,0,1,-1);assert.equal(s.players[1].health,before-2);
});
test("every Realm exposes a three-stage progression contract",()=>{
 for(const f of FACTIONS){assert.equal(REALM_STAGES[f.realm].length,3);assert.deepEqual(REALM_STAGES[f.realm].map(x=>x.round),[1,3,6]);}
});
