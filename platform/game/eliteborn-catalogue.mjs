export const FORCES = Object.freeze(["ORDER", "CHAOS", "LIFE", "DEATH"]);
export const ELITEBORN_CARDS = Object.freeze([
  ["ELI-001","Axiom Seeker","UNIT","ORDER",2,2,2,4,"On play: look at top 5. Take an ORDER Unit; bottom the rest."],
  ["ELI-002","Still Meridian","UNIT","ORDER",3,1,2,5,"First time each round another ally would lose STR or maximum HP: prevent it."],
  ["ELI-003","Perfect Interval","UNIT","ORDER",4,2,3,6,"When this joins a Formation: that Formation gains +0/+3 permanently."],
  ["ELI-004","Unbroken Proof","UNIT","ORDER",5,1,4,7,"On play: choose a Unit. Until end of turn, its STR and maximum HP cannot change."],
  ["ELI-005","Final Measure","UNIT","ORDER",6,2,6,7,"Costs 1 less per other ORDER ally, max 3. If you control 4 other ORDER Units when played: restore all allies to full HP."],
  ["ELI-006","Faultborn Variable","UNIT","CHAOS",2,1,3,3,"On play: randomly gain +2/-1 or -1/+2 permanently."],
  ["ELI-007","Shifting Index","UNIT","CHAOS",3,2,2,5,"Start of turn: randomly gain +2 STR/-1 HP or -1 STR/+2 HP this turn."],
  ["ELI-008","Broken Constant","UNIT","CHAOS",4,1,5,4,"When this joins a Formation: randomly give that Formation +3 STR or +3 HP permanently."],
  ["ELI-009","Manybody Error","UNIT","CHAOS",5,2,4,6,"On play: choose two Units. Swap their current STR/HP pairs."],
  ["ELI-010","Unwritten Result","UNIT","CHAOS",6,1,7,5,"First time this would die: transform it into another random Cost 6 Unit from any Realm at full HP. It remains CHAOS."],
  ["ELI-011","Pulse Origin","UNIT","LIFE",2,2,1,5,"End of turn: restore 1 HP to another ally."],
  ["ELI-012","Second Heart","UNIT","LIFE",3,1,2,6,"First time another ally is healed each turn: +0/+1 permanently."],
  ["ELI-013","Continuance Vessel","UNIT","LIFE",4,2,3,7,"When this joins a Formation: restore 3 HP to that Formation."],
  ["ELI-014","Living Archive","UNIT","LIFE",5,1,4,8,"On play: return a LIFE Unit from discard to your hand."],
  ["ELI-015","Abundance Without End","UNIT","LIFE",6,2,5,9,"End of turn: if every ally is at full HP, all allies gain +0/+1 permanently."],
  ["ELI-016","Quiet Mark","UNIT","DEATH",2,1,3,3,"On play: mark an enemy until this leaves play. First time it takes damage each turn: deal 1 more."],
  ["ELI-017","Last Witness","UNIT","DEATH",3,2,4,4,"Whenever another Unit dies: +1 STR this turn; restore 1 HP."],
  ["ELI-018","Severance Form","UNIT","DEATH",4,1,4,5,"When this joins a Formation: choose a damaged enemy; it loses 2 maximum HP."],
  ["ELI-019","Return of Silence","UNIT","DEATH",5,2,6,5,"On play: return a DEATH Unit from discard to the field with 1 HP. It cannot attack this turn."],
  ["ELI-020","Terminal Principle","UNIT","DEATH",6,1,7,6,"Units destroyed by this are banished. First time this banishes an enemy each turn: restore 2 HP to this."],
  ["ELI-021","Equilibrium","FORMATION",null,3,2,null,null,"Requires CHAOS + ORDER. On play & end of turn: redistribute each board’s current STR and HP separately as evenly as possible. On break: every Unit becomes the highest current STR and highest current HP among Units in play.",["CHAOS","ORDER"]],
  ["ELI-022","Mutation","FORMATION",null,3,1,null,null,"Requires CHAOS + LIFE. On play & start of turn: each component transforms into another random same-Cost Unit from any Realm at full HP; rebuild this Formation from their new stats. On break: if its components are from different Realms, every enemy Unit transforms into a random Unit costing 1 less.",["CHAOS","LIFE"]],
  ["ELI-023","Entropy","FORMATION",null,4,2,null,null,"Requires CHAOS + DEATH. Start of turn: this Formation and all enemies take X damage, where X is the number of turns Entropy has been active. On break from this damage: all enemies gain RUIN.",["CHAOS","DEATH"]],
  ["ELI-024","Harmony","FORMATION",null,3,1,null,null,"Requires ORDER + LIFE. Start of turn: allies restore 1 HP. ORDER/LIFE allies instead gain +1/+2 permanently. On break: all allies gain CONCORD.",["ORDER","LIFE"]],
  ["ELI-025","Stasis","FORMATION",null,4,2,null,null,"Requires ORDER + DEATH. On play & start of turn: reroll every Unit as ACTIVE or STASIS. STASIS Units cannot attack or take damage. On break: banish all STASIS Units.",["ORDER","DEATH"]],
  ["ELI-026","Rebirth","FORMATION",null,4,1,null,null,"Requires LIFE + DEATH. While active, other allies have “On death: respawn with 1 HP.” On break: its components become untargetable REMNANTS. After 2 enemy Unit deaths, both return at full HP, unformed.",["LIFE","DEATH"]],
  ["ELI-027","Genesis","APEX",null,6,2,null,null,"Requires LIFE ×5. On play: randomly mark every Unit ORIGIN or SOURCE. ORIGIN deaths leave REMNANTS and return end of turn at the STR/HP recorded when marked. On break: remove ORIGIN; respawn all dead SOURCE, then remove SOURCE.",["LIFE","LIFE","LIFE","LIFE","LIFE"]],
  ["ELI-028","Extinction","APEX",null,6,1,null,null,"Requires DEATH ×5. While active, Units this Formation kills and all copies in enemy hand/deck are banished. On break: all Units in play gain “On death: banish this and all copies from hand/deck.”",["DEATH","DEATH","DEATH","DEATH","DEATH"]],
  ["ELI-029","Ascendancy","APEX",null,6,2,null,null,"Requires ORDER ×5. While active, allies gain ASCENDENCE. While your board’s total STR+HP is higher, ASCENDENCE Units have +2/+2; this does not stack. On break: ASCENDENCE Units gain +1/+1 permanently.",["ORDER","ORDER","ORDER","ORDER","ORDER"]],
  ["ELI-030","Pandemonium","APEX",null,6,1,null,null,"Requires CHAOS ×5. Start of turn: snapshot every Unit’s current STR/HP; each Unit simultaneously takes a random other Unit’s pair. On break: each Unit randomly gets +1/+1, -1/-1, +1/-1, -1/+1, +2/+2, -2/-2, +2/-2, or -2/+2.",["CHAOS","CHAOS","CHAOS","CHAOS","CHAOS"]]
].map(([id,name,type,force,cost,resource,str,hp,rules,requires])=>Object.freeze({id,name,type,force,cost,resource,str,hp,rules,requires:requires||[]})));

export const ELITEBORN_UNITS = Object.freeze(ELITEBORN_CARDS.filter(card=>card.type==="UNIT"));
export const ELITEBORN_FORMATIONS = Object.freeze(ELITEBORN_CARDS.filter(card=>card.type!=="UNIT"));
export const getCard = id => ELITEBORN_CARDS.find(card=>card.id===id) || null;
