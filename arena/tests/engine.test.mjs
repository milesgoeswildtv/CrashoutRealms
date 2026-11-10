import test from "node:test";
import assert from "node:assert/strict";
import {FACTIONS,CATALOGUE,REALM_STAGES,starterDeck,createMatch,begin,playCard,passPlacement,attack,effectiveCost} from "../engine.js";

test("five current factions map to five current Realms",()=>{
 assert.deepEqual(FACTIONS.map(f=>f.realm),["Crystal Isle","The Lost Star","Upper Strata","The Endless","Deadlands"]);
 assert.equal(new Set(FACTIONS.map(f=>f.realm)).size,5);
});
test("five factions have 30-card prototype lists and Eliteborn uses its approved 20+10 roster",()=>{
 for(const f of FACTIONS){assert.equal(CATALOGUE[f.id].length,30);assert.equal(starterDeck(f.id).length,30);}
 assert.equal(CATALOGUE.eliteborn.filter(c=>c.type==="Unit").length,20);
 assert.equal(CATALOGUE.eliteborn.filter(c=>c.type==="Formation").length,6);
 assert.equal(CATALOGUE.eliteborn.filter(c=>c.type==="Apex Formation").length,4);
 assert.equal(CATALOGUE.eliteborn[0].name,"Axiom Seeker");
 assert.equal(CATALOGUE.eliteborn[29].name,"Pandemonium");
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
 s.players[0].board[1]={name:"C",str:2,hp:3,damage:0,acted:false};
 s.players[1].board[0]={name:"B",str:2,hp:3,damage:0,acted:false};
 attack(s,0,0,0);assert.equal(s.players[0].board[0].damage,2);assert.equal(s.players[1].board[0],null);
 const before=s.players[1].health;s.active=0;attack(s,0,1,-1);assert.equal(s.players[1].health,before-2);
});
test("combat does not end while an unspent Unit remains",()=>{
 const s=createMatch({playerFaction:"prismites",opponentFaction:"moon-demons"});begin(s);s.phase="combat";s.active=0;
 s.players[0].board[0]={name:"A",str:1,hp:4,damage:0,acted:false};
 s.players[0].board[1]={name:"B",str:1,hp:4,damage:0,acted:false};
 attack(s,0,0,-1);
 assert.equal(s.phase,"combat");assert.equal(s.active,1);
});
test("every Realm exposes a three-stage progression contract",()=>{
 for(const f of FACTIONS){assert.equal(REALM_STAGES[f.realm].length,3);assert.deepEqual(REALM_STAGES[f.realm].map(x=>x.round),[1,3,6]);}
});
test("Convergence discounts only the first Special played each turn",()=>{
 const s=createMatch({playerFaction:"prismites",opponentFaction:"moon-demons"});begin(s);s.stage=1;
 const p=s.players[0],special=CATALOGUE.prismites.find(c=>c.type==="Prism");p.hand=[special];
 assert.equal(effectiveCost(s,p,special),Math.max(1,special.cost-1));
 p.stageSpecialUsed=true;assert.equal(effectiveCost(s,p,special),special.cost);
});

test("Eliteborn dual-Force Formation combines current STR and current HP into one slot",()=>{
 const s=createMatch({playerFaction:"eliteborn",opponentFaction:"prismites"});begin(s);
 const p=s.players[0],units=CATALOGUE.eliteborn;
 p.hand=[units.find(c=>c.id==="ELI-021")];p.resource=20;
 p.board[0]={...units.find(c=>c.id==="ELI-001"),owner:0,damage:1,acted:false};
 p.board[2]={...units.find(c=>c.id==="ELI-006"),owner:0,damage:0,acted:false};
 assert.equal(playCard(s,0,0,-1),true);
 const formed=p.board[0];
 assert.equal(formed.isFormation,true);assert.equal(formed.str,5);assert.equal(formed.hp,6);
 assert.equal(formed.damage,0);assert.equal(formed.components.length,2);assert.equal(p.board[2],null);
 assert.equal(formed.formationCard.id,"ELI-021");assert.equal(p.discard.length,0);
});
test("Eliteborn Apex Formation requires five Units of its matching Force",()=>{
 const s=createMatch({playerFaction:"eliteborn",opponentFaction:"prismites"});begin(s);
 const p=s.players[0],units=CATALOGUE.eliteborn;
 p.hand=[units.find(c=>c.id==="ELI-029")];p.resource=20;
 for(let i=0;i<4;i++)p.board[i]={...units[i],owner:0,damage:0,acted:false};
 assert.equal(playCard(s,0,0,-1),false);
 p.board[4]={...units[4],owner:0,damage:0,acted:false};
 assert.equal(playCard(s,0,0,-1),true);
 assert.equal(p.board.find(x=>x?.isFormation).components.length,5);
});
test("when an Eliteborn Formation breaks, its components and attached card enter discard",()=>{
 const s=createMatch({playerFaction:"eliteborn",opponentFaction:"prismites"});begin(s);
 const p=s.players[0],e=s.players[1],units=CATALOGUE.eliteborn;
 p.hand=[units.find(c=>c.id==="ELI-021")];p.resource=20;
 p.board[0]={...units.find(c=>c.id==="ELI-001"),owner:0,damage:0,acted:false};
 p.board[2]={...units.find(c=>c.id==="ELI-006"),owner:0,damage:0,acted:false};
 playCard(s,0,0,-1);
 e.board[0]={name:"Breaker",type:"Unit",str:20,hp:30,damage:0,acted:false};
 s.phase="combat";s.active=1;
 attack(s,1,0,0);
 assert.equal(p.board[0],null);assert.equal(p.discard.length,3);
 assert.ok(p.discard.some(c=>c.id==="ELI-021"));
});
