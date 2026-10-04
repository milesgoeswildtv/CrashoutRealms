window.REALMS_STUDIO_DATA = (() => {
  const statuses = ["NOT STARTED","CONCEPT","ART REVIEW","APPROVED ART","CARD BUILT","QA PASS","LOCKED","REWORK"];
  const familyApproval = ["DRAFT","REDIRECT","APPROVED"];

  const factions = {
    GEO: {
      code:"GEO", name:"Living Geodes", realm:"Crystal Isle", thesis:"Geology learned how to live.",
      materials:["dark mineral","faceted stone","restrained crystal","selective metal reinforcement"],
      palette:["charcoal","pale stone","red prism","blue prism","green prism","violet prism"],
      motifs:["fracture planes","facets","crystal sockets","pressure seams","mineral strata"],
      keep:["geology-first anatomy","impossible mineral ecosystems","radical silhouette variety","Prism colors treated as biology"],
      avoid:["normal animals with crystals glued on","rainbow crystal noise","gold lattice everywhere","statue/monument creatures"],
      approved:"Use the selected geology-first prototype family as the conceptual anchor. Quartz should feel like a living obstruction; Lumen should feel suspended/radial; Razor should feel like fracture and shear made predatory.",
      rejected:"Do not regress into generic crystal dragons, crystal turtles, or normal quadrupeds wearing gemstones.",
      diversity:"Across a family: accretor, wall/escapement, volcanic chamber, radial healer, shearing predator, then continue into rooted, colony, cocoon, burrower, parasitic and world-organ forms.",
      skin:{accent:"#8fb7d9",accent2:"#6e8195",metal:"#85909a",dark:"#11151b",soft:"#e7e0d2"}
    },
    MON: {
      code:"MON", name:"Moondemons", realm:"Blood Moon", thesis:"Beauty conceals lunar predation.",
      materials:["blackened silver","moonstone","black glass","polished dark metal"],
      palette:["black","silver","moon white","muted violet","midnight blue","restrained crimson"],
      motifs:["crescents","lunar seals","orbit lines","glowing sigil geometry","black reflective insets"],
      keep:["beautiful adult lunar beings","visible glowing sigil tattoos","ritual elegance","diverse people","moonlit architecture"],
      avoid:["vampire court shorthand","fang-forward identity","same pale woman repeated","red demon skin","monster transformation as the reveal"],
      approved:"The beauty is the demon. Sigils are living lunar systems embedded in the body. Blood supports mechanics but does not define the species.",
      rejected:"Pale clone cast, vampire nobility, bats/coffins, or a hidden ugly monster form.",
      diversity:"Vary gender presentation, skin tone, age within adulthood, face structure, hair, body build, costume silhouette, sigil placement, pose and temperament.",
      skin:{accent:"#c7c2da",accent2:"#6f608d",metal:"#9a96a8",dark:"#0d0d14",soft:"#eeeaf0"}
    },
    ELI: {
      code:"ELI", name:"Eliteborn", realm:"Upper Strata", thesis:"Perfection became biological.",
      materials:["ivory","living gold","deep royal blue","ceramic-like biological shell"],
      palette:["ivory","warm gold","deep blue","white","black accents"],
      motifs:["mathematical symmetry","radiant geometry","formation spacing","ordered lines","civic precision"],
      keep:["radiant monumental civilization","prestige and hierarchy","formation anatomy","nonhuman biological castes"],
      avoid:["human paladins","humanoid priests","generic knights","robots","human kingdom default"],
      approved:"Keep the ivory/deep-blue/gold civilization language, but inhabitants are alien living castes whose social role and formation size are encoded into anatomy.",
      rejected:"Human or humanoid fantasy military/civic lineups, no matter how polished.",
      diversity:"Solo caste, partner-support caste, paired attack caste, tri-radial protector, four-axis command organism; later castes may be radically different species inside one engineered biosystem.",
      skin:{accent:"#d6b260",accent2:"#254a76",metal:"#b79a58",dark:"#10151a",soft:"#f2ead8"}
    },
    HAR: {
      code:"HAR", name:"Harvest", realm:"Deadlands", thesis:"Life is nourishment. Death is agriculture.",
      materials:["bark","bone-like insets","chitin","dried organic fiber","oxidized reclaimed metal"],
      palette:["dark earth","dead green","bone","charcoal","restrained rust/crimson"],
      motifs:["roots","graft seams","seed structures","thorn hooks","growth rings","biomass channels"],
      keep:["predatory ecology","biological processing","cultivation horror","reclaimed organic infrastructure"],
      avoid:["humanoid cultist troop lineup","evil farmers","generic scythe priests","red evil faction everywhere"],
      approved:"Playable subjects are organisms whose biology performs cultivation, reclamation, grafting, self-consumption or predatory feeding.",
      rejected:"Masked clerics, robed farmers and soldier lineups as the faction's primary creature language.",
      diversity:"Cultivator, trauma-grower, self-consuming grazer, graft-transfer organism, processing predator; continue into fungal colonies, nursery organisms, carrion processors and symbiotic engines.",
      skin:{accent:"#8a684d",accent2:"#62694c",metal:"#7b6c5a",dark:"#17130f",soft:"#eadbc2"}
    },
    CON: {
      code:"CON", name:"Continuum", realm:"The Endless", thesis:"Information became alive.",
      materials:["black glass","silver-white procedural linework","dark polished surfaces","ice-blue/violet luminous insets"],
      palette:["black","white","silver","ice blue","restrained violet"],
      motifs:["recursion","orbit paths","temporal echoes","partial rendering","impossible spatial continuity"],
      keep:["abstract nonhumanoid information-life","recursive geometry","living processes","spatial impossibility","clean procedural elegance"],
      avoid:["robots","androids","cyberpunk humans","chronomancer mages","generic cosmic wizardry"],
      approved:"Use the abstract first prototype family as the anchor: software/time processes that happen to be alive, with different state behaviors and scales.",
      rejected:"Later humanoid mage directions and generic cosmic-fantasy people.",
      diversity:"First-state scout, dual-state oscillator, recursive motion process, horizon-scale spatial organism, zero-state witness; later cards can include broken renders, prediction ghosts, missing geometry and impossible recursive ecologies.",
      skin:{accent:"#b7d9ef",accent2:"#836fb8",metal:"#a8b9c7",dark:"#0a0d14",soft:"#edf2f4"}
    }
  };

  const defaults = {status:"NOT STARTED",artStatus:"MISSING",qaStatus:"NOT_RUN",reviewNotes:"",locked:false,batch:"PROTOTYPE 001–005",artTransform:{x:50,y:50,zoom:1}};
  const card = (c) => Object.assign({}, defaults, c);

  const cards = [
    card({id:"GEO-001",name:"Pebbleheart Hatchling",faction:"GEO",type:"Creature",cost:2,resource:2,str:1,hp:4,crackedStr:4,crackedHp:4,mechanicLabel:"Crack Recipe",mechanicText:"Red + Blue → Cracked 4/4",rules:"Crack — Deal 2 damage to an enemy creature.",allowedPrismColors:["Red","Blue"],artDirection:"Juvenile unstable geological life; newly accreting mineral body; not a baby dragon. Show red and blue Prism biology only, balanced, with neutral stone allowed."}),
    card({id:"GEO-002",name:"Quartz Bulwark",faction:"GEO",type:"Creature",cost:3,resource:2,str:1,hp:6,crackedStr:3,crackedHp:8,mechanicLabel:"Crack Recipe",mechanicText:"Blue + Blue → Cracked 3/8",rules:"Cracked — Taunt.",allowedPrismColors:["Blue","Blue"],artDirection:"Living fault block / moving escarpment / defensive obstruction; not a turtle. Blue Prism biology should dominate almost completely."}),
    card({id:"GEO-003",name:"Lava Geode",faction:"GEO",type:"Creature",cost:3,resource:1,str:2,hp:5,crackedStr:5,crackedHp:5,mechanicLabel:"Crack Recipe",mechanicText:"Red + Red → Cracked 5/5",rules:"Cracked — The first time Lava Geode attacks each round, deal 1 additional damage to its target after combat.",allowedPrismColors:["Red","Red"],artDirection:"Mobile magma chamber / volcanic pressure organism; no fire dragon. Red crystal biology only with black basalt and heat-white highlights."}),
    card({id:"GEO-004",name:"Lumen Nodule",faction:"GEO",type:"Creature",cost:4,resource:2,str:1,hp:5,crackedStr:3,crackedHp:7,mechanicLabel:"Crack Recipe",mechanicText:"Green + Blue → Cracked 3/7",rules:"Crack — Restore 3 HP divided among friendly creatures.",allowedPrismColors:["Green","Blue"],artDirection:"Suspended/radial luminous restorative organism; non-quadruped. Green + blue Prism biology, roughly balanced, sensing and redistributing mineral light."}),
    card({id:"GEO-005",name:"Razor Geode",faction:"GEO",type:"Creature",cost:4,resource:1,str:3,hp:4,crackedStr:6,crackedHp:4,mechanicLabel:"Crack Recipe",mechanicText:"Red + Violet → Cracked 6/4",rules:"Cracked — The first time Razor Geode attacks each round, it gains +2 STR for that combat.",allowedPrismColors:["Red","Violet"],artDirection:"Shearing/fracture-plane predator with sliding geological layers; no blade-wing dragon. Red + violet crystal biology with neutral dark stone support."}),

    card({id:"HAR-001",name:"Furrow Keeper",faction:"HAR",type:"Creature",cost:3,resource:2,str:1,hp:4,rules:"At the end of your round before Wither, another friendly Harvest creature gains +1 maximum and current HP permanently.",artDirection:"Low wide multi-limbed cultivating organism with living plow/root anatomy that enriches soil and allied life; no humanoid farmer."}),
    card({id:"HAR-002",name:"Briarback",faction:"HAR",type:"Creature",cost:4,resource:2,str:3,hp:5,rules:"The first time each round Briarback survives creature combat damage, it gains +1 maximum and current HP permanently.",artDirection:"Heavy bark/thorn organism whose trauma triggers aggressive defensive growth; not a normal animal with vines pasted on."}),
    card({id:"HAR-003",name:"Hollow Grazer",faction:"HAR",type:"Creature",cost:4,resource:1,str:3,hp:5,rules:"Before attacking, you may reduce Hollow Grazer's maximum and current HP by 2 permanently, minimum 1. If you do, it gains +3 STR this round.",artDirection:"Tall hollow seed-husk-like grazer that consumes its own body mass to attack; half-lush/half-depleted body state; not zombie deer."}),
    card({id:"HAR-004",name:"Graftkeeper",faction:"HAR",type:"Creature",cost:4,resource:2,str:2,hp:5,rules:"On play, move up to 2 permanent STR or maximum-HP bonus points from your other friendly creatures onto Graftkeeper in any combination.",artDirection:"Nonhumanoid multi-appendage grafting organism with sap tubes, root needles and tissue-transfer anatomy; no plague doctor or gardener."}),
    card({id:"HAR-005",name:"Blightmouth",faction:"HAR",type:"Creature",cost:4,resource:1,str:3,hp:4,rules:"The first time each round Blightmouth gains STR or maximum HP, its next damage dealt this round is increased by 2.",artDirection:"Low predatory organism with a processing-bloom mouth, concentric feeding rings and root/insect locomotion; not a humanoid in monster armor."}),

    card({id:"CON-001",name:"Firststep Scout",faction:"CON",type:"Creature",cost:1,resource:1,str:2,hp:3,rules:"High Sequence (4/5) — Firststep Scout has +1 STR / +1 maximum and current HP.",mechanicLabel:"Sequence",mechanicText:"High Sequence 4/5",artDirection:"Small low abstract living-information organism; vector ribbons around dark data core; faint future-state echo; nonhumanoid."}),
    card({id:"CON-002",name:"Second Bell Adept",faction:"CON",type:"Creature",cost:2,resource:2,str:2,hp:4,rules:"High Sequence (4/5) — The first time each round your Sequence changes while remaining at 4 or 5, Second Bell Adept gains +2 STR this round.",mechanicLabel:"Sequence",mechanicText:"Oscillation at 4 ↔ 5",artDirection:"Suspended dual-state oscillator with two interlocked phase-shifted bodies around a central void; not humanoid and not a literal bell."}),
    card({id:"CON-003",name:"Third Motion Engine",faction:"CON",type:"Creature",cost:3,resource:1,str:2,hp:5,rules:"Sequence Complete — Your next card this round costs 2 less, minimum 1.",mechanicLabel:"Sequence",mechanicText:"Sequence Complete",artDirection:"Recursive three-stage spiral process-organism: outer ribbon, rotating lattice, compression core; must feel alive, not like a mechanical turbine."}),
    card({id:"CON-004",name:"Fourth Horizon",faction:"CON",type:"Creature",cost:5,resource:1,str:4,hp:5,rules:"High Sequence (4/5) — Fourth Horizon has +2 STR / +2 maximum and current HP.",mechanicLabel:"Sequence",mechanicText:"High Sequence 4/5",artDirection:"Horizon-scale living spatial organism occupying multiple offset planes at once; challenge scale and perspective; not a spaceship or architecture pretending to be a creature."}),
    card({id:"CON-005",name:"Zero Point Witness",faction:"CON",type:"Creature",cost:2,resource:2,str:2,hp:4,rules:"Sequence Complete — Restore 2 Health to yourself and 2 HP to Zero Point Witness.",mechanicLabel:"Sequence",mechanicText:"Sequence Complete / Reset",artDirection:"Radial organism centered on a black absence/missing center; portions absent yet still cast reflections; not a giant eye or decorative portal."}),

    card({id:"MON-001",name:"Bloodtrail Cub",faction:"MON",type:"Creature",cost:2,resource:1,str:2,hp:3,rules:"Bloodied — Bloodtrail Cub has +2 STR while attacking.",mechanicLabel:"SIGIL / BLOODIED",mechanicText:"Adult low-rank tracker",artDirection:"Adult low-ranking lunar tracker, controlled and intelligent, following a blood trail. Visible low-rank glowing lunar sigils. 'Cub' is rank, not age. No wolf or vampire shorthand."}),
    card({id:"MON-002",name:"Scar Dancer",faction:"MON",type:"Creature",cost:3,resource:2,str:3,hp:4,rules:"Bloodied — After Scar Dancer deals damage and its universal 2-HP restore resolves, you may deal 1 damage to Scar Dancer.",mechanicLabel:"SIGIL / BLOODIED",mechanicText:"Ritual injury → control",artDirection:"Dark-skinned adult woman, tall/lean ritual combat dancer, distinct braids/hair; torso/leg sigils flare around a deliberate wound. Graceful, controlled, not vampire-ballerina."}),
    card({id:"MON-003",name:"Pale Leech",faction:"MON",type:"Creature",cost:3,resource:2,str:2,hp:5,rules:"Bloodied — The first time each round Pale Leech restores HP from dealing damage, draw 1 card, then put 1 card from your hand on the bottom of your deck.",mechanicLabel:"SIGIL / BLOODIED",mechanicText:"Restoration rerouted",artDirection:"Beautiful androgynous adult man, porcelain-pale skin, short white hair, narrow delicate face; restoration current routes through throat/sternum/palm sigils. No biting or feeding imagery."}),
    card({id:"MON-004",name:"Redjaw Raider",faction:"MON",type:"Creature",cost:4,resource:2,str:4,hp:5,rules:"Bloodied — The first time each round Redjaw Raider deals combat damage, it gains +1 maximum HP permanently without restoring HP.",mechanicLabel:"SIGIL / BLOODIED",mechanicText:"Crimson jaw-seal",artDirection:"Tan/brown-skinned adult man, broad athletic build, heavier lunar armor, crimson geometric jaw/throat sigil. Redjaw is a living seal, not blood around the mouth."}),
    card({id:"MON-005",name:"Woundrunner",faction:"MON",type:"Creature",cost:4,resource:1,str:4,hp:4,rules:"Bloodied — Woundrunner has +2 STR while attacking an already-damaged enemy creature.",mechanicLabel:"SIGIL / BLOODIED",mechanicText:"Pursuit specialist",artDirection:"Dark-skinned adult woman with wiry runner build; sigils along legs/spine; full-speed pursuit of wounded prey. Distinct pose, face and costume from the other four."}),

    card({id:"ELI-001",name:"Page of the Line",faction:"ELI",type:"Creature",cost:2,resource:1,str:1,hp:3,rules:"Formation (1) — Page of the Line has +2 STR.",mechanicLabel:"FORMATION",mechanicText:"Exactly 1",artDirection:"Compact nonhumanoid alien caste with perfect bilateral geometry and one decisive forward attack structure. No helmet, shield, biped, knight or robot."}),
    card({id:"ELI-002",name:"Banner Squire",faction:"ELI",type:"Creature",cost:3,resource:2,str:1,hp:4,rules:"Formation (2) — The other creature in this Formation has +0 STR / +1 maximum and current HP.",mechanicLabel:"FORMATION",mechanicText:"Exactly 2",artDirection:"Tall nonhumanoid support caste with a biological signal crest/membrane and partner-facing support anatomy. No literal flag carrier."}),
    card({id:"ELI-003",name:"Twinblade Cadet",faction:"ELI",type:"Creature",cost:3,resource:2,str:2,hp:3,rules:"Formation (2) — Twinblade Cadet has +2 STR / +1 maximum and current HP.",mechanicLabel:"FORMATION",mechanicText:"Exactly 2",artDirection:"Low fast nonhumanoid pair-caste with mirrored biological cutting appendages whose attack geometry completes beside a partner. No dual-wielding humanoid."}),
    card({id:"ELI-004",name:"Oathguard",faction:"ELI",type:"Creature",cost:4,resource:2,str:3,hp:5,rules:"Formation (3) — Oathguard has Taunt and +1 STR.",mechanicLabel:"FORMATION",mechanicText:"Exactly 3",artDirection:"Large tri-radial living bastion with three defensive planes; shielding is anatomy, not equipment. Ivory shell, blue membranes, living-gold ribs."}),
    card({id:"ELI-005",name:"Bastion Captain",faction:"ELI",type:"Creature",cost:4,resource:1,str:2,hp:6,rules:"Formation (4) — The first damage dealt to a creature in this Formation each round is reduced by 2 before any Disperse split.",mechanicLabel:"FORMATION",mechanicText:"Exactly 4",artDirection:"Larger radial command caste with four precise biological signal/shield structures. Calm, architectural, organic and unmistakably nonhumanoid."})
  ];

  const currentSystems = {
    GEO:"PRISMATIC CRACK — Prisms attach to friendly Geodes; chosen Prism colors satisfy Crack Recipes. Cracked Geodes keep fused Prisms and do not Fold.",
    MON:"BLOODIED + SIGILS — Bloodied Moondemons restore 2 HP after dealing damage to another target; Sigils are hidden ally attachments that reveal on prerequisites.",
    ELI:"FORMATION — Formation size counts Creatures plus attached Equips. Exact Formation size activates printed effects.",
    HAR:"LIFEBLOOD + GROWTH — Nourishment prevents Wither; Growth cards attach dormant and Bloom when prerequisites are met.",
    CON:"SEQUENCE + FLUX — Sequence persists 0–5; zero-cost FLUX cards arm and trigger on printed ordered patterns."
  };

  return {statuses,familyApproval,factions,cards,currentSystems,templateVersion:"REALMS MASTER CHASSIS v1 / v0.9 data"};
})();
