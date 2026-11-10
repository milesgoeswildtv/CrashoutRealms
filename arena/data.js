export const FACTIONS = [
 {id:"prismites",name:"Prismites",realm:"Crystal Isle",special:"Prism",accent:"#8acbd1",identity:"Invest colour, then fuse your crystal line."},
 {id:"moon-demons",name:"Moon Demons",realm:"The Lost Star",special:"Sigil",accent:"#b58abf",identity:"Mark combat and answer from the shadows."},
 {id:"eliteborn",name:"Eliteborn",realm:"Upper Strata",special:"Force",accent:"#d5c49b",identity:"Commit Forces and build a unified formation."},
 {id:"displacers",name:"Displacers",realm:"The Endless",special:"Synchrony",accent:"#8ca5d8",identity:"Route your plays through a shifting sequence."},
 {id:"harvesters",name:"Harvesters",realm:"Deadlands",special:"Yield",accent:"#a3b17c",identity:"Turn losses into a resource for the next strike."}
];
const unitNames=["Initiate","Warden","Stalker","Mender","Vanguard","Sentinel","Seeker","Reclaimer","Architect","Herald","Ravager","Keeper","Strider","Adept","Colossus","Oracle","Marauder","Binder","Ascendant","Sovereign"];
const specials=["First Sign","Second Sign","Third Sign","Fourth Sign","Fifth Sign","Sixth Sign","Seventh Sign","Eighth Sign","Ninth Sign","Final Sign"];
export function buildCatalogue(factionId){
 const f=FACTIONS.find(x=>x.id===factionId);
 const units=unitNames.map((n,i)=>({id:f.id+"-U"+String(i+1).padStart(2,"0"),name:f.name+" "+n,type:"Unit",family:"Unit",faction:f.id,cost:1+Math.floor(i/4),resource:i%2?1:2,str:1+(i%4)+Math.floor(i/7),hp:2+(i%5),rarity:i===19?"Legendary":i>14?"Rare":"Common",text:unitText(f.id,i)}));
 const sig=specials.map((n,i)=>({id:f.id+"-S"+String(i+1).padStart(2,"0"),name:f.name+" "+n,type:f.special,family:"Special",faction:f.id,cost:2+(i%4),resource:i%2?1:2,str:0,hp:0,rarity:i===9?"Epic":"Uncommon",text:specialText(f.id,i)}));
 return [...units,...sig];
}
function unitText(id,i){const lines={
 prismites:["On play: gain a Prism charge.","When fused: your ally gains +1 STR.","The first Special you play each round costs 1 less."],
 "moon-demons":["When this attacks: mark the target.","When damaged: gain a Sigil mark.","When this defeats a Unit: restore 1 Health."],
 eliteborn:["When played beside an ally: gain +1 HP.","When a Force resolves: gain +1 STR this round.","Adjacent allies gain +1 HP."],
 displacers:["Sequence 1: draw 1, then discard 1.","Sequence 2: gain +1 STR this round.","Sequence 3+: ready this Unit once."],
 harvesters:["When a friendly Unit dies: gain 1 Yield.","On play: if a Unit died this turn, gain +1 STR.","When this defeats a Unit: gain 1 Yield."]
};return lines[id][i%3]}
function specialText(id,i){const lines={
 prismites:["Attach a Prism: chosen ally gains +1 STR.","Fuse two allied Units: combine their STR and HP into one open slot.","Give an ally +2 HP."],
 "moon-demons":["Set a hidden Sigil on an ally; trigger on its next combat.","After combat: deal 2 damage to the attacker.","Mark an enemy; the next attack against it gains +2 STR."],
 eliteborn:["Commit a Force: two adjacent allies gain +1/+1.","Formation: protect an ally from the next 2 damage.","Break a Formation: deal 2 damage to an enemy."],
 displacers:["Advance Sequence by 1; draw 1.","Synchrony: repeat the last Unit's on-play effect.","Reset Sequence; your next card costs 1 less."],
 harvesters:["Yield: spend 1 death mark to deal 2 damage.","Bloom: all friendly Units gain +1 HP.","Return a fallen Unit as a 1/1 Echo."]
};return lines[id][i%3]}
export const CATALOGUE=Object.fromEntries(FACTIONS.map(f=>[f.id,buildCatalogue(f.id)]));
export const REALM_STAGES = Object.fromEntries(FACTIONS.map(f=>[f.realm,[
 {name:"Awakening",round:1,law:"The Realm awakens. Both sides establish their first line.",modifier:"opening"},
 {name:"Convergence",round:3,law:"The Realm's pressure rises. The first Special each turn costs 1 less.",modifier:"special-discount"},
 {name:"Ascendance",round:6,law:"The Realm reaches its final stage. Units gain +1 STR on their first attack each round.",modifier:"final"}
]]));
export function starterDeck(factionId){return CATALOGUE[factionId].filter(c=>c.type==="Unit").slice(0,20).concat(CATALOGUE[factionId].filter(c=>c.type!=="Unit"));}
