
(function(){
'use strict';

var VERSION='REALMS MASTER CHASSIS v1';
var SEED_CARDS=[{"id":"GEO-001","name":"Pebbleheart Hatchling","type":"Creature","cost":2,"resource":2,"str":1,"hp":4,"rules":"Crack — Deal 2 damage to an enemy creature.","faction":"GEO","factionName":"Living Geodes","mechanicText":"Dormant 1/4 — Crack Red+Blue → Cracked 4/4","crackRecipe":["Red","Blue"]},{"id":"GEO-002","name":"Quartz Bulwark","type":"Creature","cost":3,"resource":2,"str":1,"hp":6,"rules":"Cracked — Taunt.","faction":"GEO","factionName":"Living Geodes","mechanicText":"Dormant 1/6 — Crack Blue+Blue → Cracked 3/8","crackRecipe":["Blue","Blue"]},{"id":"GEO-003","name":"Lava Geode","type":"Creature","cost":3,"resource":1,"str":2,"hp":5,"rules":"Cracked — The first time Lava Geode attacks each round, deal 1 additional damage to its target after combat.","faction":"GEO","factionName":"Living Geodes","mechanicText":"Dormant 2/5 — Crack Red+Red → Cracked 5/5","crackRecipe":["Red","Red"]},{"id":"GEO-004","name":"Lumen Nodule","type":"Creature","cost":4,"resource":2,"str":1,"hp":5,"rules":"Crack — Restore 3 HP divided among friendly creatures.","faction":"GEO","factionName":"Living Geodes","mechanicText":"Dormant 1/5 — Crack Green+Blue → Cracked 3/7","crackRecipe":["Green","Blue"]},{"id":"GEO-005","name":"Razor Geode","type":"Creature","cost":4,"resource":1,"str":3,"hp":4,"rules":"Cracked — The first time Razor Geode attacks each round, it gains +2 STR for that combat.","faction":"GEO","factionName":"Living Geodes","mechanicText":"Dormant 3/4 — Crack Red+Violet → Cracked 6/4","crackRecipe":["Red","Violet"]},{"id":"MON-001","name":"Bloodtrail Cub","type":"Creature","cost":2,"resource":1,"str":2,"hp":3,"rules":"Bloodied - Bloodtrail Cub has +2 STR while attacking.","faction":"MON","factionName":"Moon Demons","mechanicText":"2/3","crackRecipe":null},{"id":"MON-002","name":"Scar Dancer","type":"Creature","cost":3,"resource":2,"str":3,"hp":4,"rules":"Bloodied - After Scar Dancer deals damage and its universal 2-HP restore resolves, you may deal 1 damage to Scar Dancer.","faction":"MON","factionName":"Moon Demons","mechanicText":"3/4","crackRecipe":null},{"id":"MON-003","name":"Pale Leech","type":"Creature","cost":3,"resource":2,"str":2,"hp":5,"rules":"Bloodied - The first time each round Pale Leech restores HP from dealing damage, draw 1 card, then put 1 card from your hand on the bottom of your deck.","faction":"MON","factionName":"Moon Demons","mechanicText":"2/5","crackRecipe":null},{"id":"MON-004","name":"Redjaw Raider","type":"Creature","cost":4,"resource":2,"str":4,"hp":5,"rules":"Bloodied - The first time each round Redjaw Raider deals combat damage, it gains +1 maximum HP permanently without restoring HP.","faction":"MON","factionName":"Moon Demons","mechanicText":"4/5","crackRecipe":null},{"id":"MON-005","name":"Woundrunner","type":"Creature","cost":4,"resource":1,"str":4,"hp":4,"rules":"Bloodied - Woundrunner has +2 STR while attacking an already-damaged enemy creature.","faction":"MON","factionName":"Moon Demons","mechanicText":"4/4","crackRecipe":null},{"id":"ELI-001","name":"Page of the Line","type":"Creature","cost":2,"resource":1,"str":1,"hp":3,"rules":"Formation (1) - Page of the Line has +2 STR.","faction":"ELI","factionName":"Eliteborn","mechanicText":"1/3","crackRecipe":null},{"id":"ELI-002","name":"Banner Squire","type":"Creature","cost":3,"resource":2,"str":1,"hp":4,"rules":"Formation (2) - The other creature in this Formation has +0 STR / +1 maximum and current HP.","faction":"ELI","factionName":"Eliteborn","mechanicText":"1/4","crackRecipe":null},{"id":"ELI-003","name":"Twinblade Cadet","type":"Creature","cost":3,"resource":2,"str":2,"hp":3,"rules":"Formation (2) - Twinblade Cadet has +2 STR / +1 maximum and current HP.","faction":"ELI","factionName":"Eliteborn","mechanicText":"2/3","crackRecipe":null},{"id":"ELI-004","name":"Oathguard","type":"Creature","cost":4,"resource":2,"str":3,"hp":5,"rules":"Formation (3) - Oathguard has Taunt and +1 STR.","faction":"ELI","factionName":"Eliteborn","mechanicText":"3/5","crackRecipe":null},{"id":"ELI-005","name":"Bastion Captain","type":"Creature","cost":4,"resource":1,"str":2,"hp":6,"rules":"Formation (4) - The first damage dealt to a creature in this Formation each round is reduced by 2 before any Disperse split.","faction":"ELI","factionName":"Eliteborn","mechanicText":"2/6","crackRecipe":null},{"id":"HAR-001","name":"Furrow Keeper","type":"Creature","cost":3,"resource":2,"str":1,"hp":4,"rules":"At the end of your round before Wither, another friendly Harvest creature gains +1 maximum and current HP permanently.","faction":"HAR","factionName":"Harvest","mechanicText":"1/4","crackRecipe":null},{"id":"HAR-002","name":"Briarback","type":"Creature","cost":4,"resource":2,"str":3,"hp":5,"rules":"The first time each round Briarback survives creature combat damage, it gains +1 maximum and current HP permanently.","faction":"HAR","factionName":"Harvest","mechanicText":"3/5","crackRecipe":null},{"id":"HAR-003","name":"Hollow Grazer","type":"Creature","cost":4,"resource":1,"str":3,"hp":5,"rules":"Before attacking, you may reduce Hollow Grazer's maximum and current HP by 2 permanently, minimum 1. If you do, it gains +3 STR this round.","faction":"HAR","factionName":"Harvest","mechanicText":"3/5","crackRecipe":null},{"id":"HAR-004","name":"Graftkeeper","type":"Creature","cost":4,"resource":2,"str":2,"hp":5,"rules":"On play, move up to 2 permanent STR or maximum-HP bonus points from your other friendly creatures onto Graftkeeper in any combination.","faction":"HAR","factionName":"Harvest","mechanicText":"2/5","crackRecipe":null},{"id":"HAR-005","name":"Blightmouth","type":"Creature","cost":4,"resource":1,"str":3,"hp":4,"rules":"The first time each round Blightmouth gains STR or maximum HP, its next damage dealt this round is increased by 2.","faction":"HAR","factionName":"Harvest","mechanicText":"3/4","crackRecipe":null},{"id":"CON-001","name":"Firststep Scout","type":"Creature","cost":1,"resource":1,"str":2,"hp":3,"rules":"High Sequence (4/5) - Firststep Scout has +1 STR / +1 maximum and current HP.","faction":"CON","factionName":"Continuum","mechanicText":"2/3","crackRecipe":null},{"id":"CON-002","name":"Second Bell Adept","type":"Creature","cost":2,"resource":2,"str":2,"hp":4,"rules":"High Sequence (4/5) - The first time each round your Sequence changes while remaining at 4 or 5, Second Bell Adept gains +2 STR this round.","faction":"CON","factionName":"Continuum","mechanicText":"2/4","crackRecipe":null},{"id":"CON-003","name":"Third Motion Engine","type":"Creature","cost":3,"resource":1,"str":2,"hp":5,"rules":"Sequence Complete - Your next card this round costs 2 less, minimum 1.","faction":"CON","factionName":"Continuum","mechanicText":"2/5","crackRecipe":null},{"id":"CON-004","name":"Fourth Horizon","type":"Creature","cost":5,"resource":1,"str":4,"hp":5,"rules":"High Sequence (4/5) - Fourth Horizon has +2 STR / +2 maximum and current HP.","faction":"CON","factionName":"Continuum","mechanicText":"4/5","crackRecipe":null},{"id":"CON-005","name":"Zero Point Witness","type":"Creature","cost":2,"resource":2,"str":2,"hp":4,"rules":"Sequence Complete - Restore 2 Health to yourself and 2 HP to Zero Point Witness.","faction":"CON","factionName":"Continuum","mechanicText":"2/4","crackRecipe":null}];

var FACTIONS={
GEO:{code:'GEO',name:'Living Geodes',thesis:'Geology learned how to live.',className:'f-GEO',
materials:['dark mineral','faceted stone','restrained crystal','selective metal'],
palette:['#10161a','#8dbcc9','#667c82','#c5d6d8'],
motifs:['fracture planes','facets','crystal sockets','pressure seams'],
keep:['geology-first anatomy','impossible mineral life','radical silhouette diversity','recipe colors as biology'],
avoid:['normal animals with crystals attached','rainbow body colors','universal gold lattice','static monuments posing as creatures'],
direction:'Living Geodes are geological organisms. Anatomy, locomotion and behavior must arise from accretion, faulting, pressure, fracture, mineral growth, magma, erosion or crystal structure. For creature color biology, use only the colors in that card’s current Crack Recipe.'},
MON:{code:'MON',name:'Moon Demons',thesis:'Beauty hiding lunar demonic nature.',className:'f-MON',
materials:['blackened silver','moonstone','black glass','dark polished metal'],
palette:['#0b0d16','#c9c9d6','#8e6aa7','#481f37'],
motifs:['crescents','lunar seals','orbit lines','glowing sigil geometry'],
keep:['beautiful diverse adults','mandatory luminous sigil tattoos','controlled ritual horror','moonlit elegance'],
avoid:['vampire shorthand','same pale silver-haired person repeated','red horned demons','monster-transformation as the secret'],
direction:'Moon Demons are beautiful adult lunar beings whose demonic identity is revealed through visible living sigils, ritual behavior, wounds and unsettling supernatural details. They are not vampires, undead, or generic monsters. Cast diversity is mandatory.'},
ELI:{code:'ELI',name:'Eliteborn',thesis:'Perfection became biological.',className:'f-ELI',
materials:['ivory','living gold','deep royal blue','ceramic-like biological shell'],
palette:['#f0eadb','#c7a54f','#1f3c64','#17191c'],
motifs:['perfect symmetry','formation spacing','radiant geometry','ordered biological interfaces'],
keep:['nonhuman biological castes','formation anatomy','radiant monumental civilization','hierarchy encoded in bodies'],
avoid:['humans','humanoids','paladins','priests','robots'],
direction:'Eliteborn inhabitants are nonhuman and nonhumanoid alien biological castes. Rank, exact Formation size, support role and hierarchy are physically encoded into anatomy. Preserve the radiant ivory/gold/deep-blue civilization, but reject the human knight species direction.'},
HAR:{code:'HAR',name:'Harvest',thesis:'Nature processes life into nourishment.',className:'f-HAR',
materials:['bark','bone-like substrate','chitin','dried fiber','oxidized reclaimed metal'],
palette:['#17130f','#8b624a','#77735a','#c6baa4'],
motifs:['roots','graft seams','seed structures','thorns','growth rings','biomass channels'],
keep:['predatory ecology','biological processing','cultivation horror','reclaimed organic infrastructure'],
avoid:['humanoid cultist troop lineups','evil farmers','generic reaper army','armor-first creature design'],
direction:'Harvest is predatory ecology. Playable creatures are organisms whose anatomy performs cultivation, reclamation, grafting, self-consumption, feeding, transport or processing. Nature itself is the harvesting civilization.'},
CON:{code:'CON',name:'Continuum',thesis:'Information became alive.',className:'f-CON',
materials:['black glass','silver-white procedural structures','ice-blue light','pale violet insets'],
palette:['#0a0c12','#d6e4ff','#8ca7d9','#78629c'],
motifs:['recursion','orbit paths','temporal echoes','partial rendering','impossible spatial continuity'],
keep:['abstract nonhumanoid information-life','living process identity','recursive geometry','spatial impossibility'],
avoid:['robots','androids','chronomancer mages','generic cosmic fantasy people'],
direction:'Continuum is an ecosystem of living information and temporal processes. Prefer abstract nonhumanoid beings, recursive states, predictive echoes, missing geometry, spatial impossibility and clean procedural elegance.'}
};

var ART={
'GEO-001':'Juvenile geological life, unstable and still accreting. The body should visibly assemble from stone and the current Crack Recipe colors. Avoid baby-dragon anatomy.',
'GEO-002':'A living fault block / moving escarpment. Defensive mass and territorial obstruction; nearly architectural, but clearly alive. Avoid turtle shorthand.',
'GEO-003':'A mobile magma chamber built from basalt pressure anatomy. Volcanic life rather than a fire dragon; heat and eruption explain locomotion.',
'GEO-004':'A suspended or radial restorative mineral organism. Push away from quadrupeds. Light is biological function, and crystal body colors follow the current recipe exactly.',
'GEO-005':'A shearing predator built from overlapping fracture planes and sliding mineral layers. Speed comes from geology, not blade wings.',
'MON-001':'Adult low-ranking lunar tracker. Controlled, intelligent pursuit; visible low-rank glowing sigils. “Cub” is rank, not age. No wolf or vampire cues.',
'MON-002':'A clearly different adult individual: ritual combat dancer whose wound activates brighter sigils and greater danger. Full-body motion, not a repeated crouched hunter.',
'MON-003':'A beautiful androgynous adult whose restoration energy is rerouted through throat/sternum/palm sigils into violence. No biting or blood feeding.',
'MON-004':'Broad athletic adult raider with a crimson geometric jaw/throat sigil. The red jaw is magical marking, not blood around the mouth or vampire fangs.',
'MON-005':'Wiry long-distance pursuit specialist. Leg/spine sigils stretch into afterimages while chasing already-wounded prey. Distinct casting from every prior card.',
'HAR-001':'Low, wide cultivating organism with root/plow anatomy that enriches soil and grows allied biomass. No humanoid farmer or scythe user.',
'HAR-002':'Heavy organism whose damaged bark/cambium erupts into stronger permanent defensive growth. Plant-forward anatomy, not a normal animal with vines.',
'HAR-003':'Tall hollow grazer that literally consumes its own stored body mass to become more dangerous. Seed-husk logic; not zombie-deer shorthand.',
'HAR-004':'Nonhumanoid grafting organism with specialized sap tubes, clamps, root needles and transferred tissues. Biology performs the surgery; no plague doctor.',
'HAR-005':'Low predatory organism with a processing-bloom mouth and clear locomotion. Nourishment visibly primes the next strike. Avoid generic carnivorous plant.',
'ELI-001':'Compact, perfectly ordered nonhumanoid solo caste. Minimal bilateral geometry that becomes self-contained and dangerous at Formation (1). No knight silhouette.',
'ELI-002':'Tall nonhumanoid partner-support caste with biological signaling crest and a body that visibly curves or interfaces toward one ally. No literal banner carrier.',
'ELI-003':'Low fast pair-caste with mirrored biological cutting appendages whose attack geometry becomes complete beside one partner. No dual-wielding humanoid.',
'ELI-004':'Large tri-radial living bastion. Three defensive planes and anatomy make Formation (3) readable. Shielding is body structure, not equipment.',
'ELI-005':'Elaborate four-axis command caste with radial biological signaling/shield organs that stabilize a four-unit Formation. No crown, cape, robot, or human commander.',
'CON-001':'Small low abstract information organism with translucent vector-ribbon limbs around a dark data core and a faint future-state echo.',
'CON-002':'Suspended dual-state oscillator made from two phase-shifted interlocked bodies around a void. “Two-ness” is structural, not a literal number.',
'CON-003':'Three-stage recursive motion organism: outer spiral, rotating lattice, compression core. It appears to move through itself; not a machine turbine.',
'CON-004':'Horizon-scale living spatial entity existing in several offset planes at once. Its body intersects the environment without reading as a spaceship or bridge.',
'CON-005':'Radial organism centered on a black absence: its missing center is part of its biology. Parts can be absent yet still cast reflections. Not a portal or eyeball.'
};

var STATUS=['NOT STARTED','CONCEPT','ART REVIEW','APPROVED ART','CARD BUILT','QA PASS','LOCKED','REWORK'];
var FAMILY=['DRAFT','REDIRECT','APPROVED'];
var state=loadState();
var artCache={};
var currentRoute='overview';
var selectedCard='GEO-001';
var selectedFaction='GEO';
var reviewMode='FULL';
var safeZones=false;
var cardScale=1;

function defaultState(){
  var proto={};
  Object.keys(FACTIONS).forEach(function(f){proto[f]={approval:'DRAFT',notes:'',checks:{silhouette:'NOT_RUN',repetition:'NOT_RUN',identity:'NOT_RUN'}};});
  return {overrides:{},prototype:proto,settings:{faction:'ALL',density:'COMFORTABLE'},manualQA:{},activity:[{text:'Visual Production Studio initialized',at:new Date().toLocaleString()}]};
}
function loadState(){try{var raw=localStorage.getItem('realms-visual-studio-v1');return raw?Object.assign(defaultState(),JSON.parse(raw)):defaultState();}catch(e){return defaultState();}}
function saveState(){localStorage.setItem('realms-visual-studio-v1',JSON.stringify(state));}
function activity(text){state.activity.unshift({text:text,at:new Date().toLocaleString()});state.activity=state.activity.slice(0,20);saveState();}
function getCard(id){var base=SEED_CARDS.find(function(c){return c.id===id;});if(!base)return null;var o=state.overrides[id]||{};var c=Object.assign({},base,o);c.status=c.status||'NOT STARTED';c.artStatus=c.artStatus||'MISSING';c.qaStatus=c.qaStatus||'NOT_RUN';c.reviewNotes=c.reviewNotes||'';c.locked=!!c.locked;c.transform=c.transform||{x:50,y:50,zoom:1};c.artDirection=ART[id]||'';return c;}
function allCards(){return SEED_CARDS.map(function(c){return getCard(c.id);});}
function updateCard(id,patch,note){state.overrides[id]=Object.assign({},state.overrides[id]||{},patch);if(note)activity(note);else saveState();}
function factionOf(code){return FACTIONS[code]||FACTIONS.GEO;}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
function badge(v){var k=String(v||'').toLowerCase().replace(/\s+/g,'-');return '<span class="badge '+k+'">'+esc(v)+'</span>';}
function percent(n,d){return d?Math.round(n/d*100):0;}
function artFor(id){return artCache[id]||null;}
function db(){return new Promise(function(resolve,reject){var r=indexedDB.open('realms-visual-studio-art',1);r.onupgradeneeded=function(){if(!r.result.objectStoreNames.contains('art'))r.result.createObjectStore('art');};r.onsuccess=function(){resolve(r.result);};r.onerror=function(){reject(r.error);};});}
function storeArt(id,data){return db().then(function(x){return new Promise(function(resolve,reject){var t=x.transaction('art','readwrite');t.objectStore('art').put(data,id);t.oncomplete=function(){x.close();resolve();};t.onerror=function(){reject(t.error);};});});}
function deleteArt(id){return db().then(function(x){return new Promise(function(resolve,reject){var t=x.transaction('art','readwrite');t.objectStore('art').delete(id);t.oncomplete=function(){x.close();resolve();};t.onerror=function(){reject(t.error);};});});}
function loadArts(){return db().then(function(x){return new Promise(function(resolve){var t=x.transaction('art','readonly'),s=t.objectStore('art'),r=s.openCursor();r.onsuccess=function(){var c=r.result;if(c){artCache[c.key]=c.value;c.continue();}else{x.close();resolve();}};r.onerror=function(){x.close();resolve();};});}).catch(function(){});}

function autoQA(c){
 var q=[];
 q.push({label:'Resource present',ok:Number.isFinite(c.resource)});
 q.push({label:'Cost present',ok:Number.isFinite(c.cost)});
 q.push({label:'Card ID present',ok:!!c.id});
 q.push({label:'Creature STR / HP present',ok:c.type!=='Creature'||(Number.isFinite(c.str)&&Number.isFinite(c.hp))});
 q.push({label:'Artwork assigned',ok:!!artFor(c.id)});
 q.push({label:'Rules fit risk',ok:(c.rules||'').length<215,warn:(c.rules||'').length>=170&&(c.rules||'').length<215});
 q.push({label:'Title fit risk',ok:(c.name||'').length<34,warn:(c.name||'').length>=27&&(c.name||'').length<34});
 if(c.faction==='GEO')q.push({label:'Crack Recipe metadata',ok:Array.isArray(c.crackRecipe)&&c.crackRecipe.length>0});
 return q;
}
function qaState(c){var q=autoQA(c);if(q.some(function(x){return !x.ok&&!x.warn;}))return'FAIL';if(q.some(function(x){return x.warn;}))return'WARN';return'PASS';}
function progress(){var cs=allCards();return percent(cs.filter(function(c){return c.status==='QA PASS'||c.status==='LOCKED';}).length,cs.length);}

function cardHTML(c,opt){
 opt=opt||{};var f=factionOf(c.faction),art=artFor(c.id),classes='realms-card '+f.className+(opt.safe?' card-safe':'');
 var mech=c.mechanicText||'';var rulesRisk=(c.rules||'').length>=215?' risk':'';
 var artInner=art&&!opt.templateOnly?'<img src="'+art+'" alt="" style="object-position:'+c.transform.x+'% '+c.transform.y+'%;transform:scale('+c.transform.zoom+')">':'<div class="placeholder"><span>ART NOT ASSIGNED</span><small>'+esc(f.thesis)+'</small></div>';
 if(opt.artOnly)return '<div class="'+classes+'"><div class="art-window" style="height:100%">'+artInner+'</div></div>';
 return '<div class="'+classes+'" data-card="'+c.id+'">'+
 '<div class="card-head"><div class="card-corner"><small>RESOURCE</small><b>+'+c.resource+'</b></div><div class="card-title"><h3>'+esc(c.name)+'</h3><p>'+esc(f.name.toUpperCase())+'</p></div><div class="card-corner"><small>COST</small><b>'+c.cost+'</b></div></div>'+
 '<div class="art-window">'+artInner+'</div>'+
 '<div class="type-bar">'+esc(String(c.type).toUpperCase())+'</div>'+
 (mech?'<div class="mechanic-strip"><b>MECHANIC</b> · '+esc(mech)+'</div>':'')+
 '<div class="rules'+rulesRisk+'">'+esc(c.rules)+'</div>'+
 '<div class="card-foot"><div class="stat"><small>STR</small><b>'+(c.str==null?'—':c.str)+'</b></div><div class="card-id">'+esc(c.id)+'</div><div class="stat"><small>HP</small><b>'+(c.hp==null?'—':c.hp)+'</b></div></div></div>';
}

function shell(){
 var p=progress();
 return '<div class="app"><aside class="sidebar" id="sidebar"><div class="brand"><div class="brand-mark"><span>R</span></div><div><h1>REALMS</h1><small>VISUAL PRODUCTION STUDIO</small></div></div>'+
 '<nav class="nav">'+navButton('overview','Overview')+navButton('library','Card Library')+navButton('review','Prototype Review')+navButton('studio','Card Studio')+navButton('lab','Template Lab')+navButton('bibles','Faction Bibles')+navButton('qa','QA Center')+navButton('batches','Batches')+navButton('settings','Settings')+'</nav>'+
 '<div class="side-foot"><span>MASTER TEMPLATE</span><strong>'+VERSION+'</strong><span>LOCAL-FIRST · FREE STATIC BUILD</span></div></aside>'+
 '<main class="main"><div class="topbar"><button class="mobile-menu" data-action="menu">☰</button><div class="search"><input id="globalSearch" placeholder="Search cards, IDs, rules…"></div>'+
 '<select class="top-select" id="globalFaction"><option value="ALL">All factions</option>'+Object.keys(FACTIONS).map(function(k){return'<option value="'+k+'" '+(state.settings.faction===k?'selected':'')+'>'+esc(FACTIONS[k].name)+'</option>';}).join('')+'</select>'+
 '<div class="progress-mini"><small><span>PROJECT PROGRESS</span><b>'+p+'%</b></small><div class="track"><i style="width:'+p+'%"></i></div></div></div><div class="workspace" id="page"></div></main></div>';
}
function navButton(route,label){return'<button data-route="'+route+'" class="'+(currentRoute===route?'active':'')+'">'+label+'<span>›</span></button>';}
function head(eye,title,desc,actions){return'<div class="page-head"><div><div class="eyebrow">'+eye+'</div><h2>'+title+'</h2><p>'+desc+'</p></div><div class="actions">'+(actions||'')+'</div></div>';}

function render(){
 document.getElementById('app').innerHTML=shell();
 var page=document.getElementById('page');
 if(currentRoute==='overview')page.innerHTML=overviewPage();
 else if(currentRoute==='library')page.innerHTML=libraryPage();
 else if(currentRoute==='review')page.innerHTML=reviewPage();
 else if(currentRoute==='studio')page.innerHTML=studioPage();
 else if(currentRoute==='lab')page.innerHTML=labPage();
 else if(currentRoute==='bibles')page.innerHTML=biblesPage();
 else if(currentRoute==='qa')page.innerHTML=qaPage();
 else if(currentRoute==='batches')page.innerHTML=batchesPage();
 else if(currentRoute==='settings')page.innerHTML=settingsPage();
 attachPageHandlers();
}
function overviewPage(){
 var cs=allCards(),missing=cs.filter(function(c){return !artFor(c.id);}).length,blocked=cs.filter(function(c){return qaState(c)==='FAIL';}).length,ready=cs.filter(function(c){return c.status==='QA PASS'||c.status==='LOCKED';}).length;
 var factionTiles=Object.keys(FACTIONS).map(function(f){var set=cs.filter(function(c){return c.faction===f;});return'<div class="faction-tile '+FACTIONS[f].className+'"><strong>'+f+'</strong><b>'+esc(FACTIONS[f].name)+'</b><span>'+set.length+' prototype cards</span><small>'+state.prototype[f].approval+' FAMILY</small></div>';}).join('');
 var statuses=STATUS.map(function(s){var n=cs.filter(function(c){return c.status===s;}).length;return'<div class="status-line">'+badge(s)+'<div class="track"><i style="width:'+percent(n,cs.length)+'%"></i></div><b>'+n+'</b></div>';}).join('');
 var recent=state.activity.slice(0,6).map(function(a){return'<div class="check"><span>'+esc(a.text)+'</span><small>'+esc(a.at)+'</small></div>';}).join('')||'<div class="empty">No activity yet.</div>';
 return head('Production control','Overview','One chassis. Five material identities. Twenty-five current v0.9 prototype cards.','<button class="btn primary" data-route="studio">Open Card Studio</button>')+
 '<div class="grid metrics"><div class="metric"><span>Total cards</span><b>'+cs.length+'</b><small>001–005 across five factions</small></div><div class="metric"><span>Production ready</span><b>'+ready+'</b><small>QA pass or locked</small></div><div class="metric"><span>QA blockers</span><b>'+blocked+'</b><small>Automated blocking checks</small></div><div class="metric"><span>Art missing</span><b>'+missing+'</b><small>Local artwork not assigned</small></div></div>'+
 '<div class="faction-row" style="margin-top:12px">'+factionTiles+'</div><div class="grid overview-grid"><section class="panel"><div class="section-title"><div><span>PIPELINE</span><h3>Production status</h3></div></div><div class="status-stack">'+statuses+'</div></section>'+
 '<section class="panel"><div class="section-title"><div><span>RECENT</span><h3>Activity</h3></div></div>'+recent+'</section></div>';
}
function libraryPage(){
 var f=state.settings.faction||'ALL';
 return head('Roster browser','Card Library','Search, filter and open authoritative prototype records.','<button class="btn" data-action="toggle-library">Grid / list</button>')+
 '<div class="filters"><input id="libSearch" placeholder="Search name, ID or rules"><select id="libFaction"><option value="ALL">All factions</option>'+Object.keys(FACTIONS).map(function(k){return'<option value="'+k+'" '+(f===k?'selected':'')+'>'+esc(FACTIONS[k].name)+'</option>';}).join('')+'</select><select id="libStatus"><option value="ALL">All statuses</option>'+STATUS.map(function(s){return'<option>'+s+'</option>';}).join('')+'</select><select id="libArt"><option value="ALL">Any art state</option><option value="MISSING">Missing art</option><option value="ASSIGNED">Assigned art</option></select></div><div class="library-grid" id="libraryResults">'+libraryCards('',f,'ALL','ALL')+'</div>';
}
function libraryCards(query,faction,status,art){
 query=(query||'').toLowerCase();return allCards().filter(function(c){
  var hit=!query||(c.name+' '+c.id+' '+c.rules).toLowerCase().indexOf(query)>=0;
  return hit&&(faction==='ALL'||c.faction===faction)&&(status==='ALL'||c.status===status)&&(art==='ALL'||(art==='MISSING'?!artFor(c.id):!!artFor(c.id)));
 }).map(function(c){return'<article class="library-item">'+cardHTML(c)+'<header><div><small>'+c.id+'</small><h4>'+esc(c.name)+'</h4></div>'+badge(qaState(c))+'</header><footer>'+badge(c.status)+'<button class="btn" data-open-card="'+c.id+'">Open</button></footer></article>';}).join('')||'<div class="empty">No matching cards.</div>';
}
function reviewPage(){
 var f=selectedFaction,def=FACTIONS[f],set=allCards().filter(function(c){return c.faction===f;}),p=state.prototype[f];
 var tabs=Object.keys(FACTIONS).map(function(k){return'<button class="tab '+FACTIONS[k].className+' '+(k===f?'active':'')+'" data-review-faction="'+k+'">'+esc(FACTIONS[k].name)+'</button>';}).join('');
 var cards=set.map(function(c){return'<div><button style="border:0;background:none;padding:0;width:100%" data-open-card="'+c.id+'">'+cardHTML(c,{artOnly:reviewMode==='ART',templateOnly:reviewMode==='TEMPLATE'})+'</button><div style="margin-top:8px;display:flex;justify-content:space-between">'+badge(c.status)+badge(qaState(c))+'</div></div>';}).join('');
 var checks=['silhouette','repetition','identity'].map(function(k){var label={silhouette:'Silhouette range is meaningful',repetition:'No repeated body-plan / character shortcut',identity:'Faction reads without card labels'}[k];return'<div class="check"><span>'+label+'</span><select data-proto-check="'+k+'">'+qaOptions(p.checks[k])+'</select></div>';}).join('');
 return head('Five-card family gate','Prototype Review','Judge the current 001–005 family through the one universal chassis.',badge(p.approval)+' <button class="btn good" data-family="APPROVED">Approve family</button><button class="btn danger" data-family="REDIRECT">Redirect</button>')+
 '<div class="tabs">'+tabs+'</div><div class="review-toolbar"><div class="seg"><button data-review-mode="FULL" class="'+(reviewMode==='FULL'?'active':'')+'">Complete cards</button><button data-review-mode="ART" class="'+(reviewMode==='ART'?'active':'')+'">Art only</button><button data-review-mode="TEMPLATE" class="'+(reviewMode==='TEMPLATE'?'active':'')+'">Template only</button></div><span class="eyebrow">'+esc(def.thesis)+'</span></div>'+
 '<div class="five '+def.className+'">'+cards+'</div><div class="review-meta"><section class="panel"><div class="section-title"><div><span>FAMILY QA</span><h3>Visual range</h3></div></div>'+checks+'</section><section class="panel"><div class="section-title"><div><span>REVIEW NOTES</span><h3>'+esc(def.name)+'</h3></div></div><textarea id="familyNotes" style="width:100%;min-height:130px;background:#0d0f12;color:var(--text);border:1px solid var(--line);padding:10px">'+esc(p.notes)+'</textarea><button class="btn" data-action="save-family-notes" style="margin-top:8px">Save notes</button></section></div>';
}
function qaOptions(v){return['NOT_RUN','PASS','FAIL','N/A'].map(function(x){return'<option value="'+x+'" '+(x===v?'selected':'')+'>'+x+'</option>';}).join('');}
function studioPage(){
 var c=getCard(selectedCard)||allCards()[0],f=FACTIONS[c.faction],locked=c.locked;
 return head(c.id+' · Authoritative v0.9 card data',esc(c.name),'Seed records come from REALMS_150_Cards_v0.9_Signature_Systems.json. Local edits are overrides.',badge(c.status)+' '+badge(qaState(c)))+
 '<div class="studio '+f.className+'"><aside class="studio-col"><div class="section-title"><div><span>01 · CARD RECORD</span><h3>Authoritative data</h3></div></div>'+
 field('Name','name',c.name,locked)+twoFields(c,locked)+
 '<div class="field"><label>Rules '+overrideMark(c.id,'rules')+'</label><textarea data-edit="rules" rows="6" '+(locked?'disabled':'')+'>'+esc(c.rules)+'</textarea></div>'+
 '<div class="field"><label>Mechanic / stats line</label><textarea data-edit="mechanicText" rows="3" '+(locked?'disabled':'')+'>'+esc(c.mechanicText||'')+'</textarea></div>'+
 '<div class="art-brief">'+esc(c.artDirection)+(c.crackRecipe?'<br><br><b>Current recipe:</b> '+esc(c.crackRecipe.join(' + '))+' — body crystal colors must follow this recipe.':'')+'</div>'+
 '<button class="btn" data-action="reset-card" '+(locked?'disabled':'')+'>Reset local overrides</button></aside>'+
 '<section class="studio-stage"><div class="stage-toolbar"><div><button class="btn ghost" data-action="zoom-out">−</button> <span id="zoomLabel">'+Math.round(cardScale*100)+'%</span> <button class="btn ghost" data-action="zoom-in">+</button></div><label><input type="checkbox" id="safeToggle" '+(safeZones?'checked':'')+'> Safe zones</label></div><div class="card-holder"><div id="stageCard" style="transform:scale('+cardScale+');transform-origin:center">'+cardHTML(c,{safe:safeZones})+'</div></div></section>'+
 '<aside class="studio-col"><div class="section-title"><div><span>02 · PRODUCTION</span><h3>Artwork & approval</h3></div>'+ (locked?badge('LOCKED'):'') +'</div>'+
 '<div class="upload"><b>'+(artFor(c.id)?'Replace local artwork':'Assign local artwork')+'</b><br><small>Stored in this browser via IndexedDB</small><input id="artUpload" type="file" accept="image/*" '+(locked?'disabled':'')+'></div>'+
 (artFor(c.id)?'<button class="btn danger" data-action="remove-art" '+(locked?'disabled':'')+'>Remove art</button>':'')+
 slider('Crop X','x',c.transform.x,0,100,1,locked)+slider('Crop Y','y',c.transform.y,0,100,1,locked)+slider('Art zoom','zoom',c.transform.zoom,1,2.5,.05,locked)+
 '<div class="field"><label>Production status</label><select id="statusSelect" '+(locked?'disabled':'')+'>'+STATUS.map(function(s){return'<option value="'+s+'" '+(s===c.status?'selected':'')+'>'+s+'</option>';}).join('')+'</select></div>'+
 '<div class="field"><label>Reviewer notes</label><textarea id="reviewNotes" rows="4" '+(locked?'disabled':'')+'>'+esc(c.reviewNotes)+'</textarea></div>'+
 '<div class="qa-mini">'+autoQA(c).map(function(q){return'<div><span>'+q.label+'</span>'+badge(q.ok?(q.warn?'WARN':'PASS'):'FAIL')+'</div>';}).join('')+'</div>'+
 '<div class="action-grid"><button class="btn good" data-action="approve-art" '+(locked?'disabled':'')+'>Approve art</button><button class="btn danger" data-action="rework" '+(locked?'disabled':'')+'>Reject / rework</button><button class="btn" data-action="toggle-lock">'+(locked?'Unlock card':'Lock card')+'</button><button class="btn primary" data-action="export-png">Export PNG</button></div></aside></div>';
}
function field(label,key,value,locked){return'<div class="field"><label>'+label+' '+overrideMark(selectedCard,key)+'</label><input data-edit="'+key+'" value="'+esc(value)+'" '+(locked?'disabled':'')+'></div>';}
function twoFields(c,locked){return'<div class="two">'+field('Resource','resource',c.resource,locked)+field('Cost','cost',c.cost,locked)+field('STR','str',c.str,locked)+field('HP','hp',c.hp,locked)+'</div>';}
function overrideMark(id,key){return state.overrides[id]&&Object.prototype.hasOwnProperty.call(state.overrides[id],key)?'<span class="override">LOCAL OVERRIDE</span>':'';}
function slider(label,key,val,min,max,step,locked){return'<div class="slider-row"><span>'+label+'</span><input type="range" data-transform="'+key+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'" '+(locked?'disabled':'')+'><b>'+val+'</b></div>';}
function labPage(){
 var sample=getCard('GEO-001');var grids=Object.keys(FACTIONS).map(function(f){var c=Object.assign({},sample,{faction:f,factionName:FACTIONS[f].name,id:f+'-TEMPLATE'});return'<div class="lab-card '+FACTIONS[f].className+'"><label><span>'+esc(FACTIONS[f].name)+'</span><b>IDENTICAL GEOMETRY</b></label>'+cardHTML(c,{safe:safeZones})+'</div>';}).join('');
 return head('Chassis authority','Template Lab','One card geometry, five faction skins. Information architecture is not draggable.','<span class="unity">UNITY CHECK · LOCKED GEOMETRY</span>')+
 '<div class="panel lab-controls"><div class="field"><label>Sample card</label><select id="labSample">'+allCards().map(function(c){return'<option value="'+c.id+'">'+c.id+' · '+esc(c.name)+'</option>';}).join('')+'</select></div><div class="field"><label>Safe zones</label><button class="btn" data-action="toggle-safe">'+(safeZones?'Hide':'Show')+'</button></div><div class="notice">Locked: Resource top-left · Cost top-right · Name/Faction centered · Art · Type · Mechanic · Rules · STR/ID/HP.</div></div><div class="lab-grid" id="labGrid">'+grids+'</div>';
}
function biblesPage(){
 var def=FACTIONS[selectedFaction];
 var tabs=Object.keys(FACTIONS).map(function(k){return'<button class="tab '+FACTIONS[k].className+' '+(k===selectedFaction?'active':'')+'" data-bible-faction="'+k+'">'+esc(FACTIONS[k].name)+'</button>';}).join('');
 return head('Art direction canon','Faction Bibles','Fast-reference guardrails for visual review and concept generation.')+'<div class="tabs">'+tabs+'</div>'+
 '<article class="bible '+def.className+'"><div class="bible-head"><div class="eyebrow">'+def.code+'</div><h3>“'+esc(def.thesis)+'”</h3><p>'+esc(def.direction)+'</p></div><div class="bible-grid">'+
 bibleList('KEEP',def.keep)+bibleList('AVOID',def.avoid)+bibleList('MATERIALS',def.materials)+bibleList('MOTIFS',def.motifs)+
 '<section><h4>CORE PALETTE</h4><div class="palette">'+def.palette.map(function(p){return'<span class="swatch" style="background:'+p+'"></span>';}).join('')+'</div></section>'+
 '<section><h4>CURRENT PROTOTYPE DECISION</h4><p>'+selectionText(def.code)+'</p></section><section><h4>REFERENCE IMAGES</h4><p>Use the Drive gallery and approved card art as review references. Card-specific artwork can be uploaded locally in Card Studio.</p></section><section><h4>CHASSIS RULE</h4><p>Faction identity changes material, color and ornament. It never moves Resource, Cost, title, art, rules, STR, HP or ID zones.</p></section></div></article>';
}
function bibleList(title,items){return'<section><h4>'+title+'</h4><ul>'+items.map(function(x){return'<li>'+esc(x)+'</li>';}).join('')+'</ul></section>';}
function selectionText(code){return {GEO:'Preferred concept family: geology-first Set 1. Preserve impossible formations; correct every card to current v0.9 Crack Recipe colors.',CON:'Preferred family: abstract Continuum Set 1. Preserve nonhumanoid information-life; reject later time-wizard drift.',ELI:'Keep radiant world language, but reject humanoid inhabitants. Rebuild species as nonhumanoid biological castes.',MON:'Keep lunar world language. Cast must be diverse adults with mandatory glowing sigils; reject vampire drift.',HAR:'Keep biomass-processing world/material language. Reject cultist troop lineups; organisms themselves do the harvesting.'}[code];}
function qaPage(){
 var cards=allCards(),f=state.settings.faction||'ALL';if(f!=='ALL')cards=cards.filter(function(c){return c.faction===f;});
 return head('Readiness gate','QA Center','Automated structural checks plus faction-specific human review.')+'<div class="qa-list">'+cards.map(function(c){var auto=autoQA(c),manual=manualChecks(c);return'<article class="qa-card '+FACTIONS[c.faction].className+'"><header><div><span class="eyebrow">'+c.id+'</span> <b>'+esc(c.name)+'</b></div>'+badge(qaState(c))+'</header><div class="qa-body"><section><div class="section-title"><div><span>AUTOMATIC</span><h3>Structural</h3></div></div>'+auto.map(function(q){return'<div class="check"><span>'+q.label+'</span>'+badge(q.ok?(q.warn?'WARN':'PASS'):'FAIL')+'</div>';}).join('')+'</section><section><div class="section-title"><div><span>MANUAL</span><h3>Faction art</h3></div></div>'+manual.map(function(q){var key=c.id+'::'+q.id,val=(state.manualQA[key]||{}).status||'NOT_RUN';return'<div class="check"><span>'+q.label+'</span><select data-manual-qa="'+key+'">'+qaOptions(val)+'</select></div>';}).join('')+'</section></div></article>';}).join('')+'</div>';
}
function manualChecks(c){
 var base={GEO:[['recipe','Crystal-body colors match current recipe'],['geology','Anatomy is geology-first'],['distinct','Silhouette is distinct from adjacent Geodes']],
 MON:[['sigil','Visible glowing lunar sigils'],['vampire','Not vampire-coded'],['casting','Distinct individual casting']],
 ELI:[['nonhuman','Clearly nonhuman'],['nonhumanoid','Clearly nonhumanoid'],['formation','Formation role visible in anatomy']],
 HAR:[['biology','Biology performs harvesting function'],['troop','Not humanoid troop/cultist default'],['ecology','Reads as predatory ecology']],
 CON:[['info','Reads as living information/process'],['robot','Not robot/android'],['mage','Not chronomancer-mage default']]};
 return base[c.faction].map(function(x){return{id:x[0],label:x[1]};});
}
function batchesPage(){
 return head('Production waves','Batches','Prototype 001–005 sets now; future batches remain placeholders.')+'<div class="batch-grid">'+Object.keys(FACTIONS).map(function(f){var set=allCards().filter(function(c){return c.faction===f;}),done=set.filter(function(c){return c.status==='QA PASS'||c.status==='LOCKED';}).length,missing=set.filter(function(c){return !artFor(c.id);}).length,blocked=set.filter(function(c){return qaState(c)==='FAIL';}).length;return'<article class="batch '+FACTIONS[f].className+'"><span class="eyebrow">'+esc(FACTIONS[f].name)+'</span><h3>PROTOTYPE 001–005</h3>'+badge(state.prototype[f].approval)+'<div class="track" style="margin-top:14px"><i style="width:'+percent(done,5)+'%"></i></div><div class="batch-stats"><div><b>'+done+'/5</b><span>complete</span></div><div><b>'+missing+'</b><span>missing art</span></div><div><b>'+blocked+'</b><span>QA blocked</span></div></div><button class="btn" data-review-faction="'+f+'">Review family</button></article>';}).join('')+
 Object.keys(FACTIONS).map(function(f){return'<article class="batch" style="opacity:.5"><span class="eyebrow">'+esc(FACTIONS[f].name)+'</span><h3>FUTURE 006–010</h3><p style="font-size:10px;color:var(--muted)">Placeholder only. Do not create records until the prototype family is approved.</p></article>';}).join('')+'</div>';
}
function settingsPage(){
 return head('Local prototype','Settings','Free static architecture: no paid backend, no authentication, no server dependency.')+'<div class="settings"><section class="panel"><div class="section-title"><div><span>TEMPLATE</span><h3>'+VERSION+'</h3></div></div><div class="notice">Card geometry is locked. Faction skins own materials and colors, not layout.</div></section><section class="panel"><div class="section-title"><div><span>LOCAL DATA</span><h3>Backup & restore</h3></div></div><p style="font-size:10px;color:var(--muted)">Statuses, notes and overrides use localStorage. Card art uses IndexedDB in this browser.</p><div class="actions"><button class="btn" data-action="export-json">Export JSON</button><label class="btn">Import JSON<input id="importJson" type="file" accept="application/json" hidden></label><button class="btn danger" data-action="reset-all">Reset local data</button></div></section><section class="panel"><div class="section-title"><div><span>HOSTING</span><h3>Cloudflare Pages ready</h3></div></div><p style="font-size:10px;color:var(--muted)">This studio is static HTML/CSS/JS and requires no build command. It can be hosted from this folder for free.</p></section><section class="panel"><div class="section-title"><div><span>AUTHORITATIVE SOURCE</span><h3>REALMS v0.9</h3></div></div><p style="font-size:10px;color:var(--muted)">Seed data comes from the current repository v0.9 signature-system roster. Local edits never rewrite that source file.</p></section></div>';
}

function attachPageHandlers(){
 document.querySelectorAll('[data-route]').forEach(function(x){x.addEventListener('click',function(){currentRoute=x.getAttribute('data-route');render();});});
 var gf=document.getElementById('globalFaction');if(gf)gf.addEventListener('change',function(){state.settings.faction=gf.value;saveState();if(gf.value!=='ALL')selectedFaction=gf.value;render();});
 var gs=document.getElementById('globalSearch');if(gs)gs.addEventListener('keydown',function(e){if(e.key==='Enter'){currentRoute='library';render();setTimeout(function(){var q=document.getElementById('libSearch');if(q){q.value=gs.value;filterLibrary();}},0);}});
 document.querySelectorAll('[data-open-card]').forEach(function(x){x.addEventListener('click',function(e){e.preventDefault();selectedCard=x.getAttribute('data-open-card');currentRoute='studio';render();});});
 document.querySelectorAll('[data-review-faction]').forEach(function(x){x.addEventListener('click',function(){selectedFaction=x.getAttribute('data-review-faction');currentRoute='review';render();});});
 document.querySelectorAll('[data-bible-faction]').forEach(function(x){x.addEventListener('click',function(){selectedFaction=x.getAttribute('data-bible-faction');render();});});
 var lq=document.getElementById('libSearch'),lf=document.getElementById('libFaction'),ls=document.getElementById('libStatus'),la=document.getElementById('libArt');[lq,lf,ls,la].forEach(function(x){if(x)x.addEventListener(x.tagName==='INPUT'?'input':'change',filterLibrary);});
 document.querySelectorAll('[data-review-mode]').forEach(function(x){x.addEventListener('click',function(){reviewMode=x.getAttribute('data-review-mode');render();});});
 document.querySelectorAll('[data-family]').forEach(function(x){x.addEventListener('click',function(){var v=x.getAttribute('data-family');if(v==='APPROVED'&&!confirm('Approve this five-card visual family?'))return;state.prototype[selectedFaction].approval=v;activity(selectedFaction+' family '+v.toLowerCase());render();});});
 document.querySelectorAll('[data-proto-check]').forEach(function(x){x.addEventListener('change',function(){state.prototype[selectedFaction].checks[x.getAttribute('data-proto-check')]=x.value;saveState();});});
 document.querySelectorAll('[data-manual-qa]').forEach(function(x){x.addEventListener('change',function(){var key=x.getAttribute('data-manual-qa');state.manualQA[key]={status:x.value};saveState();});});
 var fn=document.getElementById('familyNotes');var sf=document.querySelector('[data-action="save-family-notes"]');if(sf)sf.addEventListener('click',function(){state.prototype[selectedFaction].notes=fn.value;activity(selectedFaction+' family notes updated');});
 document.querySelectorAll('[data-edit]').forEach(function(x){x.addEventListener('change',function(){var key=x.getAttribute('data-edit'),v=x.value;if(['resource','cost','str','hp'].indexOf(key)>=0)v=Number(v);updateCard(selectedCard,Object.fromEntries([[key,v]]),selectedCard+' '+key+' updated');render();});});
 document.querySelectorAll('[data-transform]').forEach(function(x){x.addEventListener('input',function(){var c=getCard(selectedCard),t=Object.assign({},c.transform);t[x.getAttribute('data-transform')]=Number(x.value);updateCard(selectedCard,{transform:t});var stage=document.getElementById('stageCard');if(stage)stage.innerHTML=cardHTML(getCard(selectedCard),{safe:safeZones});});x.addEventListener('change',function(){activity(selectedCard+' artwork crop updated');render();});});
 var st=document.getElementById('statusSelect');if(st)st.addEventListener('change',function(){updateCard(selectedCard,{status:st.value},selectedCard+' status → '+st.value);render();});
 var rn=document.getElementById('reviewNotes');if(rn)rn.addEventListener('change',function(){updateCard(selectedCard,{reviewNotes:rn.value},selectedCard+' review notes updated');});
 var up=document.getElementById('artUpload');if(up)up.addEventListener('change',function(){var file=up.files&&up.files[0];if(!file)return;var r=new FileReader();r.onload=function(){var data=String(r.result);storeArt(selectedCard,data).then(function(){artCache[selectedCard]=data;updateCard(selectedCard,{artStatus:'ASSIGNED',status:'ART REVIEW'},selectedCard+' artwork assigned');render();});};r.readAsDataURL(file);});
 var safe=document.getElementById('safeToggle');if(safe)safe.addEventListener('change',function(){safeZones=safe.checked;render();});
 var imp=document.getElementById('importJson');if(imp)imp.addEventListener('change',importJson);
 var lab=document.getElementById('labSample');if(lab)lab.addEventListener('change',function(){var s=getCard(lab.value);document.getElementById('labGrid').innerHTML=Object.keys(FACTIONS).map(function(f){var c=Object.assign({},s,{faction:f,id:f+'-TEMPLATE'});return'<div class="lab-card '+FACTIONS[f].className+'"><label><span>'+esc(FACTIONS[f].name)+'</span><b>IDENTICAL GEOMETRY</b></label>'+cardHTML(c,{safe:safeZones})+'</div>';}).join('');});
 document.querySelectorAll('[data-action]').forEach(function(x){var a=x.getAttribute('data-action');if(a==='menu')x.onclick=function(){document.getElementById('sidebar').classList.toggle('open');};if(a==='reset-card')x.onclick=resetCard;if(a==='remove-art')x.onclick=removeArt;if(a==='zoom-in')x.onclick=function(){cardScale=Math.min(1.35,cardScale+.1);render();};if(a==='zoom-out')x.onclick=function(){cardScale=Math.max(.7,cardScale-.1);render();};if(a==='approve-art')x.onclick=function(){updateCard(selectedCard,{artStatus:'APPROVED',status:'APPROVED ART'},selectedCard+' art approved');render();};if(a==='rework')x.onclick=function(){updateCard(selectedCard,{artStatus:'REJECTED',status:'REWORK'},selectedCard+' redirected to rework');render();};if(a==='toggle-lock')x.onclick=toggleLock;if(a==='export-png')x.onclick=exportPng;if(a==='toggle-safe')x.onclick=function(){safeZones=!safeZones;render();};if(a==='export-json')x.onclick=exportJson;if(a==='reset-all')x.onclick=resetAll;});
}
function filterLibrary(){var out=document.getElementById('libraryResults');if(!out)return;var q=document.getElementById('libSearch').value,f=document.getElementById('libFaction').value,s=document.getElementById('libStatus').value,a=document.getElementById('libArt').value;out.innerHTML=libraryCards(q,f,s,a);out.querySelectorAll('[data-open-card]').forEach(function(x){x.onclick=function(){selectedCard=x.getAttribute('data-open-card');currentRoute='studio';render();};});}
function resetCard(){if(!confirm('Reset local overrides for '+selectedCard+'?'))return;delete state.overrides[selectedCard];activity(selectedCard+' reset to authoritative seed');render();}
function removeArt(){if(!confirm('Remove locally assigned art for '+selectedCard+'?'))return;deleteArt(selectedCard).then(function(){delete artCache[selectedCard];updateCard(selectedCard,{artStatus:'MISSING'},selectedCard+' artwork removed');render();});}
function toggleLock(){var c=getCard(selectedCard);if(c.locked){if(!confirm('Unlock '+selectedCard+' for editing?'))return;updateCard(selectedCard,{locked:false,status:'QA PASS'},selectedCard+' unlocked');render();return;}if(qaState(c)!=='PASS'){alert('Card cannot lock until automated QA passes. Assign artwork and clear structural blockers first.');return;}if(!confirm('Lock '+selectedCard+'? Editing will be frozen until explicitly unlocked.'))return;updateCard(selectedCard,{locked:true,status:'LOCKED',qaStatus:'PASS'},selectedCard+' locked');render();}
function exportJson(){var blob=new Blob([JSON.stringify({version:VERSION,exportedAt:new Date().toISOString(),state:state},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='realms-visual-studio-backup.json';a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},1000);}
function importJson(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var obj=JSON.parse(String(r.result));if(!obj.state||!obj.state.overrides||!obj.state.prototype)throw new Error('Invalid backup');if(!confirm('Replace local Studio state with this backup?'))return;state=obj.state;saveState();activity('Local state imported');render();}catch(err){alert('Import failed: '+err.message);}};r.readAsText(f);}
function resetAll(){if(!confirm('Reset every local status, note, override and QA mark? Uploaded art will remain unless removed card by card.'))return;state=defaultState();saveState();render();}
function exportPng(){
 var target=document.querySelector('#stageCard .realms-card');if(!target){return;}
 var clone=target.cloneNode(true);var styles='<style>'+document.querySelector('style[data-export]')?.textContent+'</style>';
 var xml='<svg xmlns="http://www.w3.org/2000/svg" width="750" height="1050"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:750px;height:1050px;background:#090a0c">'+clone.outerHTML+'</div></foreignObject></svg>';
 var blob=new Blob([xml],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),img=new Image();
 img.onload=function(){var canvas=document.createElement('canvas');canvas.width=750;canvas.height=1050;var ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,750,1050);URL.revokeObjectURL(url);var a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download=selectedCard+'-'+getCard(selectedCard).name.replace(/\s+/g,'-')+'.png';a.click();};img.onerror=function(){URL.revokeObjectURL(url);alert('PNG export is not supported by this browser for this card. Use browser screenshot/print for now.');};img.src=url;
}

loadArts().finally(function(){render();});
})();