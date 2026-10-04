export const FACTIONS = {
  GEO: {
    code: 'GEO', name: 'Living Geodes', thesis: 'Geology learned how to live.',
    materials: ['Dark mineral', 'Faceted stone', 'Restrained crystal', 'Selective metal reinforcement'],
    palette: ['Charcoal', 'Stone', 'Card-specific Prism colors'],
    motifs: ['Fracture planes', 'Facets', 'Crystal sockets', 'Pressure seams'],
    keep: ['Geology-first anatomy', 'Impossible mineral ecosystems', 'Radical silhouette diversity', 'Creature agency and locomotion'],
    avoid: ['Normal animals wearing crystals', 'Universal rainbow trim', 'Gold lattice over every surface', 'Static monument creatures'],
    diversity: 'Across a family, push grounded, towering, floating, burrowed, radial, colony-like, asymmetric and shearing body plans.',
    approved: 'Prefer the first five-card concept family: geology-first organisms, living obstruction, volcanic chamber, suspended nodule, shearing predator.',
    rejected: 'Do not regress toward crystal dragons, crystal lizards, or cute rock pets.',
    accent: '#9bbbd1', accent2: '#6f8ea5', deep: '#111820', metal: '#b6c1ca'
  },
  MON: {
    code: 'MON', name: 'Moondemons', thesis: 'Beauty conceals lunar predation.',
    materials: ['Blackened silver', 'Moonstone', 'Black glass', 'Polished dark metal'],
    palette: ['Black', 'Moon white', 'Silver', 'Muted violet', 'Restrained crimson'],
    motifs: ['Crescents', 'Lunar seals', 'Orbit lines', 'Living sigil geometry'],
    keep: ['Beautiful diverse adults', 'Visible glowing sigil tattoos', 'Lunar ritual civilization', 'Horror through behavior and wounds'],
    avoid: ['Vampires', 'Fang-forward designs', 'Same pale model repeated', 'Monster transformation as the species reveal'],
    diversity: 'Vary gender presentation, skin tone, age, face, body build, hair, costume silhouette, sigil placement and pose.',
    approved: 'Keep the moonlit world and approved Bloodtrail Cub quality. The beautiful being is already the demon.',
    rejected: 'Reject vampire-court shorthand and repeated silver-haired pale characters.',
    accent: '#b8a9d8', accent2: '#6d5f91', deep: '#100e18', metal: '#b9bac7'
  },
  ELI: {
    code: 'ELI', name: 'Eliteborn', thesis: 'Perfection became biological.',
    materials: ['Living ivory', 'Polished living gold', 'Deep blue tissue', 'Ceramic-like shell'],
    palette: ['Ivory', 'Living gold', 'Royal blue', 'White'],
    motifs: ['Mathematical symmetry', 'Radiant geometry', 'Formation spacing', 'Ordered lines'],
    keep: ['Radiant monumental civilization', 'Civic superiority', 'Hierarchy visible in anatomy', 'Formation-specialized castes'],
    avoid: ['Humans', 'Humanoids', 'Fantasy knights', 'Robots', 'Paladin kingdom shorthand'],
    diversity: 'Different castes may be different species/body plans, unified by exact geometry, symmetry and role specialization.',
    approved: 'Keep the strongest white/blue/gold civilization world; replace every humanoid inhabitant with alien biological castes.',
    rejected: 'No priests, scholars, captains or guards as ordinary human bodies in armor.',
    accent: '#d6b46a', accent2: '#204a72', deep: '#111820', metal: '#eee2c3'
  },
  HAR: {
    code: 'HAR', name: 'Harvest', thesis: 'Life is a resource.',
    materials: ['Bark', 'Bone-like growth', 'Chitin', 'Organic fiber', 'Reclaimed metal'],
    palette: ['Dark earth', 'Bone', 'Dead green', 'Charcoal', 'Rust red'],
    motifs: ['Roots', 'Graft seams', 'Seeds', 'Thorns', 'Growth rings', 'Biomass channels'],
    keep: ['Predatory ecology', 'Biomass processing', 'Hostile agriculture', 'Nothing-is-wasted philosophy'],
    avoid: ['Humanoid cultist army', 'Evil farmers', 'Scythe priests', 'Generic red faction styling'],
    diversity: 'Represent different ecological strategies: cultivation, defensive growth, self-consumption, graft-transfer, predatory feeding.',
    approved: 'Keep hostile agricultural environments and material language; playable creatures must themselves perform harvesting biologically.',
    rejected: 'Reject troop-lineup logic and humanoid priests/farmers/soldiers as the creature family.',
    accent: '#9b6a53', accent2: '#5f6b51', deep: '#17120f', metal: '#b5a491'
  },
  CON: {
    code: 'CON', name: 'Continuum', thesis: 'Information became alive.',
    materials: ['Black glass', 'Silver procedural linework', 'Polished dark surfaces', 'Luminous insets'],
    palette: ['Black', 'White', 'Silver', 'Ice blue', 'Pale violet'],
    motifs: ['Recursion', 'Orbit lines', 'Temporal echoes', 'Partial rendering', 'Impossible continuity'],
    keep: ['Abstract nonhumanoid information-life', 'Recursive geometry', 'Spatial impossibility', 'Living processes'],
    avoid: ['Robots', 'Androids', 'Cyberpunk humans', 'Chronomancer mages', 'Generic cosmic wizards'],
    diversity: 'Use scouts, oscillators, recursion engines, horizon-scale entities, zero-state witnesses, path phenomena and nonhuman processes.',
    approved: 'The first abstract five-card family is the benchmark: software ecology rather than time wizards.',
    rejected: 'Do not regress into cloaked people with portals.',
    accent: '#b8c9ff', accent2: '#8d76c9', deep: '#0e111a', metal: '#d8e0ee'
  }
};

export const CARDS = [
  {id:'GEO-001',name:'Pebbleheart Hatchling',faction:'GEO',type:'Creature',cost:2,resource:2,str:1,hp:4,mechanic:'Dormant 1/4 — Crack Red+Blue → Cracked 4/4',rules:'Crack — Deal 2 damage to an enemy creature.',recipe:['Red','Blue'],artDirection:'Juvenile unstable geological life; a newly accreting mineral organism. Avoid baby-dragon anatomy.'},
  {id:'GEO-002',name:'Quartz Bulwark',faction:'GEO',type:'Creature',cost:3,resource:2,str:1,hp:6,mechanic:'Dormant 1/6 — Crack Blue+Blue → Cracked 3/8',rules:'Cracked — Taunt.',recipe:['Blue','Blue'],artDirection:'Living fault block / moving escarpment / territorial obstruction. Not a turtle.'},
  {id:'GEO-003',name:'Lava Geode',faction:'GEO',type:'Creature',cost:3,resource:1,str:2,hp:5,mechanic:'Dormant 2/5 — Crack Red+Red → Cracked 5/5',rules:'Cracked — The first time Lava Geode attacks each round, deal 1 additional damage to its target after combat.',recipe:['Red','Red'],artDirection:'Mobile magma chamber and pressure organism. No fire dragon.'},
  {id:'GEO-004',name:'Lumen Nodule',faction:'GEO',type:'Creature',cost:4,resource:2,str:1,hp:5,mechanic:'Dormant 1/5 — Crack Green+Blue → Cracked 3/7',rules:'Crack — Restore 3 HP divided among friendly creatures.',recipe:['Green','Blue'],artDirection:'Suspended/radial restorative mineral organism. Push far from quadruped anatomy.'},
  {id:'GEO-005',name:'Razor Geode',faction:'GEO',type:'Creature',cost:4,resource:1,str:3,hp:4,mechanic:'Dormant 3/4 — Crack Red+Violet → Cracked 6/4',rules:'Cracked — The first time Razor Geode attacks each round, it gains +2 STR for that combat.',recipe:['Red','Violet'],artDirection:'Shearing/fracture-plane predator with sliding geological layers. No blade-wing dragon.'},

  {id:'MON-001',name:'Bloodtrail Cub',faction:'MON',type:'Creature',cost:2,resource:1,str:2,hp:3,mechanic:'Bloodied',rules:'Bloodied — Bloodtrail Cub has +2 STR while attacking.',artDirection:'Adult low-ranking lunar tracker following injury/blood. Visible glowing sigils. Cub is rank, not age.'},
  {id:'MON-002',name:'Scar Dancer',faction:'MON',type:'Creature',cost:3,resource:2,str:3,hp:4,mechanic:'Bloodied',rules:'Bloodied — After Scar Dancer deals damage and its universal 2-HP restore resolves, you may deal 1 damage to Scar Dancer.',artDirection:'Distinct adult ritual combat dancer; wound activates/intensifies sigils. Full-body motion, not vampire ballerina.'},
  {id:'MON-003',name:'Pale Leech',faction:'MON',type:'Creature',cost:3,resource:2,str:2,hp:5,mechanic:'Bloodied',rules:'Bloodied — The first time each round Pale Leech restores HP from dealing damage, draw 1 card, then put 1 card from your hand on the bottom of your deck.',artDirection:'Androgynous adult; restoration power reroutes through throat/sternum/palm sigils. No biting or blood drinking.'},
  {id:'MON-004',name:'Redjaw Raider',faction:'MON',type:'Creature',cost:4,resource:2,str:4,hp:5,mechanic:'Bloodied',rules:'Bloodied — The first time each round Redjaw Raider deals combat damage, it gains +1 maximum HP permanently without restoring HP.',artDirection:'Broad lunar raider with geometric crimson jaw/throat sigil. Redjaw is a sigil, not a bloody mouth.'},
  {id:'MON-005',name:'Woundrunner',faction:'MON',type:'Creature',cost:4,resource:1,str:4,hp:4,mechanic:'Bloodied',rules:'Bloodied — Woundrunner has +2 STR while attacking an already-damaged enemy creature.',artDirection:'Wiry pursuit specialist with sigils along legs/spine and a full-speed silhouette.'},

  {id:'ELI-001',name:'Page of the Line',faction:'ELI',type:'Creature',cost:2,resource:1,str:1,hp:3,mechanic:'Formation (1)',rules:'Formation (1) — Page of the Line has +2 STR.',artDirection:'Compact nonhumanoid alien caste with perfect self-contained geometry. No knight.'},
  {id:'ELI-002',name:'Banner Squire',faction:'ELI',type:'Creature',cost:3,resource:2,str:1,hp:4,mechanic:'Formation (2)',rules:'Formation (2) — The other creature in this Formation has +0 STR / +1 maximum and current HP.',artDirection:'Tall nonhumanoid support caste with biological signal crest and partner-facing support anatomy.'},
  {id:'ELI-003',name:'Twinblade Cadet',faction:'ELI',type:'Creature',cost:3,resource:2,str:2,hp:3,mechanic:'Formation (2)',rules:'Formation (2) — Twinblade Cadet has +2 STR / +1 maximum and current HP.',artDirection:'Low fast pair-caste with mirrored biological cutting appendages. No dual-wielding humanoid.'},
  {id:'ELI-004',name:'Oathguard',faction:'ELI',type:'Creature',cost:4,resource:2,str:3,hp:5,mechanic:'Formation (3)',rules:'Formation (3) — Oathguard has Taunt and +1 STR.',artDirection:'Large tri-radial living bastion. Shielding must be anatomy, not carried equipment.'},
  {id:'ELI-005',name:'Bastion Captain',faction:'ELI',type:'Creature',cost:4,resource:1,str:2,hp:6,mechanic:'Formation (4)',rules:'Formation (4) — The first damage dealt to a creature in this Formation each round is reduced by 2 before any Disperse split.',artDirection:'Radial command caste with four precise biological signaling/shield structures. Nonhumanoid.'},

  {id:'HAR-001',name:'Furrow Keeper',faction:'HAR',type:'Creature',cost:3,resource:2,str:1,hp:4,mechanic:'Lifeblood',rules:'At the end of your round before Wither, another friendly Harvest creature gains +1 maximum and current HP permanently.',artDirection:'Low wide multi-limbed cultivating organism with living plow/root anatomy. No humanoid farmer.'},
  {id:'HAR-002',name:'Briarback',faction:'HAR',type:'Creature',cost:4,resource:2,str:3,hp:5,mechanic:'Lifeblood',rules:'The first time each round Briarback survives creature combat damage, it gains +1 maximum and current HP permanently.',artDirection:'Heavy bark/thorn organism whose trauma triggers new defensive growth. Avoid normal beast + decorative vines.'},
  {id:'HAR-003',name:'Hollow Grazer',faction:'HAR',type:'Creature',cost:4,resource:1,str:3,hp:5,mechanic:'Lifeblood',rules:"Before attacking, you may reduce Hollow Grazer's maximum and current HP by 2 permanently, minimum 1. If you do, it gains +3 STR this round.",artDirection:'Tall hollow seed-husk-like grazer that consumes its own body mass to attack. Not zombie deer.'},
  {id:'HAR-004',name:'Graftkeeper',faction:'HAR',type:'Creature',cost:4,resource:2,str:2,hp:5,mechanic:'Lifeblood',rules:'On play, move up to 2 permanent STR or maximum-HP bonus points from your other friendly creatures onto Graftkeeper in any combination.',artDirection:'Many-appendage grafting organism with sap tubes, root needles and tissue-transfer anatomy. No plague doctor.'},
  {id:'HAR-005',name:'Blightmouth',faction:'HAR',type:'Creature',cost:4,resource:1,str:3,hp:4,mechanic:'Lifeblood',rules:'The first time each round Blightmouth gains STR or maximum HP, its next damage dealt this round is increased by 2.',artDirection:'Low predator with processing bloom mouth and root/insect locomotion. No humanoid monster helmet.'},

  {id:'CON-001',name:'Firststep Scout',faction:'CON',type:'Creature',cost:1,resource:1,str:2,hp:3,mechanic:'High Sequence (4/5)',rules:'High Sequence (4/5) — Firststep Scout has +1 STR / +1 maximum and current HP.',artDirection:'Small low abstract information-organism with vector ribbons around a dark data core and future-state echo.'},
  {id:'CON-002',name:'Second Bell Adept',faction:'CON',type:'Creature',cost:2,resource:2,str:2,hp:4,mechanic:'High Sequence (4/5)',rules:'High Sequence (4/5) — The first time each round your Sequence changes while remaining at 4 or 5, Second Bell Adept gains +2 STR this round.',artDirection:'Suspended dual-state oscillator with two interlocked phase-shifted bodies. Not humanoid.'},
  {id:'CON-003',name:'Third Motion Engine',faction:'CON',type:'Creature',cost:3,resource:1,str:2,hp:5,mechanic:'Sequence Complete',rules:'Sequence Complete — Your next card this round costs 2 less, minimum 1.',artDirection:'Recursive three-stage spiral organism/process; outer ribbon, rotating lattice, compression core. Not a turbine.'},
  {id:'CON-004',name:'Fourth Horizon',faction:'CON',type:'Creature',cost:5,resource:1,str:4,hp:5,mechanic:'High Sequence (4/5)',rules:'High Sequence (4/5) — Fourth Horizon has +2 STR / +2 maximum and current HP.',artDirection:'Horizon-scale living spatial organism occupying multiple offset planes. Not spaceship or bridge.'},
  {id:'CON-005',name:'Zero Point Witness',faction:'CON',type:'Creature',cost:2,resource:2,str:2,hp:4,mechanic:'Sequence Complete',rules:'Sequence Complete — Restore 2 Health to yourself and 2 HP to Zero Point Witness.',artDirection:'Radial organism centered on a black absence; parts missing yet still casting reflections. Not eyeball/portal.'}
];

export const STATUS = ['NOT STARTED','CONCEPT','ART REVIEW','APPROVED ART','CARD BUILT','QA PASS','LOCKED','REWORK'];
export const FAMILY_STATUS = ['DRAFT','REDIRECT','APPROVED'];
