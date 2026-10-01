(() => {
'use strict';
const DATA=window.REALMS_DATA,$=s=>document.querySelector(s);
const gameRoot=$('#gameRoot'),setupModal=$('#setupModal'),choiceModal=$('#choiceModal'),choiceBody=$('#choiceBody'),choiceActions=$('#choiceActions'),choiceTitle=$('#choiceTitle'),choiceEyebrow=$('#choiceEyebrow');
const REALMS=['Crystal Isle','Blood Moon','Upper Strata','Deadlands','The Endless'];
const COLORS={'Living Geodes':'var(--geo)','Continuum':'var(--continuum)','Harvest':'var(--harvest)','Moondemons':'var(--moon)','Eliteborn':'var(--elite)'};
const CLASSES={'Living Geodes':'geo','Continuum':'continuum','Harvest':'harvest','Moondemons':'moondemons','Eliteborn':'eliteborn'};
let state=null,uid=1,toastTimer=null;
const rand=n=>Math.floor(Math.random()*n),sample=a=>a[rand(a.length)],clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=rand(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function toast(msg){clearTimeout(toastTimer);let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;toastTimer=setTimeout(()=>t.remove(),2300);}
function cardById(id){for(const a of Object.values(DATA.cards)){const c=a.find(x=>x.id===id);if(c)return c;}return null;}
function makeInstance(def,owner){
 const cr=def.type.includes('Creature');
 return {...def,iid:`c${uid++}`,owner,zone:'deck',baseStr:cr?(def.str??0):0,baseHp:cr?(def.hp??0):0,permStr:0,permHp:0,tempStr:0,tempHp:0,currentHp:cr?(def.hp??0):0,pressure:0,cracked:false,folded:false,acted:false,extraActions:0,echo:false,token:false,statuses:{},damageTakenThisRound:0,formation:null,equip:null,nourished:true,everBloodied:false,prisms:[],sigil:null,growth:null,shield:0,tempPrismColors:[]};
}
function makeToken(owner,name,str,hp,extra={}){
 return {id:extra.id||`TOKEN-${name.toUpperCase().replace(/\W/g,'')}`,name,type:'Creature Token',cost:0,resource:0,statsText:`${str}/${hp}`,rules:extra.rules||'',faction:extra.faction||state.players[owner].faction,iid:`t${uid++}`,owner,zone:'board',baseStr:str,baseHp:hp,permStr:0,permHp:0,tempStr:0,tempHp:0,currentHp:hp,pressure:0,cracked:false,folded:false,acted:false,extraActions:0,echo:!!extra.echo,token:true,statuses:{},damageTakenThisRound:0,formation:extra.formation??null,equip:null,nourished:true,everBloodied:false,crackedStr:extra.crackedStr,crackedHp:extra.crackedHp,crackRecipe:extra.crackRecipe||null,prisms:[],sigil:null,growth:null,shield:0,tempPrismColors:[]};
}
function buildPlayer(index,faction,passive,ai=false){
 return {index,name:ai?'AI':`Player ${index+1}`,ai,faction,passive,health:20,deck:shuffle(DATA.cards[faction].map(d=>makeInstance(d,index))),hand:[],board:[],traps:[],fluxes:[],discard:[],banished:[],resource:0,resourceStart:0,pendingResource:0,sequence:0,sequenceDir:1,sequenceHistory:[0],sequenceFrozenTurns:0,sequenceFreezeStartRound:0,skipUsed:0,consumeUsed:false,endlessShiftUsed:false,passiveTriggers:0,nextFormation:1,statuses:{},effects:{},preventNextDamage:0,shatterproof:false,cascadeRemaining:0,placementPassed:false};
}
function maxSlots(p){return p.faction==='Eliteborn'&&p.passive==='We Stand Together'?7:6;}
function formationMembers(p,fid){return fid==null?[]:p.board.filter(x=>x.formation===fid);}
function formationSize(p,uOrFid){const fid=typeof uOrFid==='object'?uOrFid?.formation:uOrFid;if(fid==null)return 1;const m=formationMembers(p,fid);return m.length+m.filter(x=>x.equip).length;}
function equipStats(u){return u?.equip?{str:u.equip.equipStr||0,hp:u.equip.equipHp||0}:{str:0,hp:0};}
function dynamicBonus(u){
 const p=state.players[u.owner];let str=0,hp=0;
 if(p.faction==='Continuum'&&(p.sequence===4||p.sequence===5)){
  if(u.id==='CON-001'){str++;hp++;}if(u.id==='CON-004'){str+=2;hp+=2;}if(u.id==='CON-009')hp+=2;if(u.id==='CON-011')str+=3;if(u.id==='CON-024'){str+=2;hp+=2;}if(u.id==='CON-026'){str+=2;hp+=2;}
 }
 if(p.faction==='Moondemons'&&isBloodiedRaw(u))str+=p.board.filter(x=>x.iid!==u.iid&&x.id==='MON-010'&&isBloodiedRaw(x)).length;
 if(u.faction==='Living Geodes'&&Array.isArray(u.prisms)){
  for(const pr of u.prisms){if(pr.id==='GEO-014'&&pr.chosenColor==='Red'&&u.cracked)str++;if(pr.id==='GEO-017'&&pr.chosenColor==='Green')hp+=2;}
 }
 if(p.faction==='Eliteborn'&&u.formation!=null){
  const fs=formationSize(p,u),m=formationMembers(p,u.formation);
  if(u.id==='ELI-001'&&fs===1)str+=2;if(u.id==='ELI-003'&&fs===2){str+=2;hp++;}if(u.id==='ELI-004'&&fs===3)str++;if(u.id==='ELI-006'&&fs===3){str++;hp++;}if(u.id==='ELI-011'&&fs>=5)str+=Math.min(4,Math.max(0,m.length-1));if(u.id==='ELI-012'&&fs===1){str+=3;hp+=3;}if(u.id==='ELI-023'&&fs===2){str+=2;hp+=2;}
  m.forEach(x=>{if(x.iid===u.iid)return;const xs=formationSize(p,x);if(x.id==='ELI-002'&&xs===2)hp++;if(x.id==='ELI-009'&&xs===5)str++;if(x.id==='ELI-012'&&xs===4){str++;hp++;}if(x.equip?.id==='ELI-029'&&xs>=5)hp++;});
 }
 return {str,hp};
}
function getMaxHp(u){const e=equipStats(u),d=dynamicBonus(u);return Math.max(1,u.baseHp+u.permHp+u.tempHp+e.hp+d.hp);}
function getStr(u){
 const e=equipStats(u),d=dynamicBonus(u);let s=u.baseStr+u.permStr+u.tempStr+e.str+d.str;const p=state.players[u.owner];
 if(p.faction==='Moondemons'&&isBloodiedRaw(u)){if(u.id==='MON-001'&&u.statuses.attacking)s+=2;const t=u.statuses.attackTarget;if((u.id==='MON-005'||u.id==='MON-023')&&t&&t.currentHp<getMaxHp(t))s+=2;}
 if(u.id==='HAR-013'&&u.nourished)s+=2;
 if(u.faction==='Living Geodes'&&u.statuses.attacking){
  if(!u.statuses.violetShardUsed)s+=2*u.prisms.filter(pr=>pr.id==='GEO-013'&&pr.chosenColor==='Red').length;
  if(u.id==='GEO-005'&&u.cracked&&!u.statuses.razorUsed)s+=2;
  if(u.statuses.attackTarget==null)s+=2*u.prisms.filter(pr=>pr.id==='GEO-017'&&pr.chosenColor==='Red').length;
 }
 return Math.max(0,s);
}
function isBloodiedRaw(u){if(!u||u.faction!=='Moondemons')return false;const e=equipStats(u);return u.currentHp<Math.max(1,u.baseHp+u.permHp+u.tempHp+e.hp+(u.statuses.dynamicHp||0));}
function isBloodied(u){return !!u&&u.faction==='Moondemons'&&u.currentHp<getMaxHp(u);}
function syncDynamicHp(p){for(const u of [...p.board]){const next=dynamicBonus(u).hp,old=u.statuses.dynamicHp||0;if(next!==old){u.currentHp+=next-old;u.statuses.dynamicHp=next;}if(u.currentHp<=0&&p.board.includes(u))destroyUnit(u,null,{reason:'static-loss'});}}
function clampHp(u){u.currentHp=clamp(u.currentHp,0,getMaxHp(u));}
function markNourished(u){if(u?.faction==='Harvest')u.nourished=true;}
function discardAttachment(p,c){if(!c)return;c.zone='discard';p.discard.push(c);}
function bloomGrowth(u,reason='trigger'){
 if(!u?.growth||u.growth.bloomed||!state.players[u.owner].board.includes(u))return false;
 const p=state.players[u.owner],gr=u.growth;gr.bloomed=true;gr.bloomRound=state.round;state.log.push(`<strong>${gr.name} BLOOMS</strong> on ${u.name}.`);
 if(gr.growthEffect==='rejuvenation')gr.turns=2;
 if(gr.growthEffect==='carrion'||gr.growthEffect==='predatory')addPermStats(u,2,2);
 if(gr.growthEffect==='rootNetwork')drawOne(p);
 return true;
}
function addTempStats(u,str=0,hp=0,friendly=true){
 if(!u)return;u.tempStr+=str;if(hp){u.tempHp+=hp;u.currentHp+=hp;}if(friendly&&(str>0||hp>0))markNourished(u);
 if(friendly&&u.growth&&!u.growth.bloomed){if(str>0&&u.growth.growthEffect==='thornbloom')bloomGrowth(u,'STR');if(hp>0&&u.growth.growthEffect==='ironroot')bloomGrowth(u,'HP');}
 if(friendly&&str>0&&u.id==='HAR-008'&&!u.statuses.bloomspine){u.statuses.bloomspine=true;healUnit(u,1,'Bloomspine');}
 checkFrenziedFull(u);
}
function addPermStats(u,str=0,hp=0,friendly=true){
 if(!u)return;u.permStr+=str;if(hp){u.permHp+=hp;u.currentHp+=hp;}if(friendly&&(str>0||hp>0))markNourished(u);
 if(friendly&&u.growth&&!u.growth.bloomed){
  if(str>0&&u.growth.growthEffect==='thornbloom')bloomGrowth(u,'STR');
  if(hp>0&&u.growth.growthEffect==='ironroot')bloomGrowth(u,'HP');
  if(u.growth.growthEffect==='rootNetwork'){u.growth.progress=(u.growth.progress||0)+Math.max(0,str)+Math.max(0,hp);if(u.growth.progress>=3)bloomGrowth(u,'3 permanent points');}
 }
 const p=state.players[u.owner];
 if(friendly&&str>0&&u.id==='HAR-008'&&!u.statuses.bloomspine){u.statuses.bloomspine=true;healUnit(u,1,'Bloomspine');}
 if(friendly&&hp>0&&u.id==='HAR-009'&&!u.statuses.overgrowthWarden){u.statuses.overgrowthWarden=true;const other=p.board.filter(x=>x.iid!==u.iid).sort((a,b)=>getMaxHp(a)-getMaxHp(b))[0];if(other)addPermStats(other,0,1);}
 checkFrenziedFull(u);
}
function drawOne(p){if(!p.deck.length){p.health--;state.log.push(`${p.name} fails to draw and loses 1 Health.`);checkWinner();return null;}const c=p.deck.pop();c.zone='hand';p.hand.push(c);return c;}
function drawToFive(p){while(p.hand.length<5&&state.winner===null)drawOne(p);}
function bottomWorst(p){if(!p.hand.length)return;const c=[...p.hand].sort((a,b)=>(b.cost-b.resource)-(a.cost-a.resource))[0];p.hand=p.hand.filter(x=>x.iid!==c.iid);c.zone='deck';p.deck.unshift(c);}
function revealSigil(u,label='SIGIL'){
 if(!u?.sigil)return null;const p=state.players[u.owner],s=u.sigil;u.sigil=null;s.zone='discard';p.discard.push(s);state.log.push(`<strong>${label}: ${s.name}</strong> reveals on ${u.name}.`);return s;
}
function healUnit(u,n,source='effect'){
 if(!u||n<=0||!state.players[u.owner].board.includes(u)||u.statuses.noHeal)return 0;
 const max=getMaxHp(u),before=u.currentHp;
 if(u.sigil?.sigilEffect==='redline'&&u.everBloodied&&before<max&&before+n>=max){revealSigil(u,'SIGIL');n=Math.max(0,max-1-before);u.shield=(u.shield||0)+3;}
 u.currentHp=Math.min(getMaxHp(u),u.currentHp+n);const got=u.currentHp-before;
 if(got&&u.id==='MON-003'&&isBloodied(u)&&!u.statuses.leechDraw){u.statuses.leechDraw=true;drawOne(state.players[u.owner]);bottomWorst(state.players[u.owner]);}
 if(got&&u.growth?.bloomed&&u.growth.growthEffect==='ironroot'&&!u.statuses.ironrootHeal){u.statuses.ironrootHeal=true;u.tempStr++;}
 checkFrenziedFull(u);return got;
}
function checkFrenziedFull(u){if(!u||!state.players[u.owner].board.includes(u))return;const p=state.players[u.owner];if(p.faction!=='Moondemons'||p.passive!=='Frenzied')return;if(isBloodied(u)){u.everBloodied=true;return;}if(u.everBloodied&&u.currentHp>=getMaxHp(u)){if(p.board.some(x=>x.id==='MON-026'&&isBloodied(x))&&!p.statuses.redlineUsed){p.statuses.redlineUsed=true;u.currentHp--;state.log.push(`Vespera's Redline keeps ${u.name} Bloodied.`);return;}state.log.push(`${u.name} healed to full after being Bloodied — Frenzied destroys it.`);destroyUnit(u,null,{reason:'frenzy-full'});}}
function unitHasTaunt(u){const p=state.players[u.owner];if(u.id==='GEO-002'&&u.cracked)return true;if(u.id==='CON-009'&&(p.sequence===4||p.sequence===5))return true;if(u.id==='ELI-004'&&formationSize(p,u)===3)return true;if(u.equip?.id==='ELI-019'&&formationSize(p,u)===2)return true;return false;}
function hasTaunt(p){return p.board.some(unitHasTaunt);}
function chooseFriendly(p,mode='grow'){if(!p.board.length)return null;const a=[...p.board];if(mode==='heal')return a.sort((x,y)=>(getMaxHp(y)-y.currentHp)-(getMaxHp(x)-x.currentHp))[0];if(mode==='weak')return a.sort((x,y)=>(getStr(x)+x.currentHp)-(getStr(y)+y.currentHp))[0];return a.sort((x,y)=>(getStr(y)+getMaxHp(y))-(getStr(x)+getMaxHp(x)))[0];}
function chooseEnemy(owner){const b=state.players[1-owner].board;return b.length?[...b].sort((x,y)=>x.currentHp-y.currentHp)[0]:null;}
function consumeTrap(p,id){const t=p.traps.find(x=>x.id===id);if(!t)return null;p.traps=p.traps.filter(x=>x.iid!==t.iid);t.zone='discard';p.discard.push(t);return t;}
function applyDamage(u,amount,source=null,{combat=false,noDisperse=false,reason='damage'}={}){
 if(!u||amount<=0||state.winner!==null||!state.players[u.owner].board.includes(u))return 0;
 const p=state.players[u.owner];amount=Math.floor(amount);
 if(u.sigil?.sigilEffect==='ward'){const prevented=amount;revealSigil(u,'SIGIL');u.shield=(u.shield||0)+prevented;state.log.push(`${u.name} prevents ${prevented} damage and gains Shield ${prevented}.`);return 0;}
 if(u.shield>0){const r=Math.min(u.shield,amount);u.shield-=r;amount-=r;if(r)state.log.push(`${u.name}'s Shield prevents ${r}.`);}
 if(amount<=0)return 0;
 if(u.faction==='Living Geodes'){
  if(combat&&(reason==='attack'||reason==='retaliation')){const n=u.prisms.filter(pr=>pr.id==='GEO-013'&&pr.chosenColor==='Blue').length;if(n)amount=Math.max(0,amount-n);}
  if(amount>0&&u.prisms.some(pr=>pr.id==='GEO-015'&&pr.chosenColor==='Blue')&&!u.statuses.verdantBlue){u.statuses.verdantBlue=true;amount=Math.max(0,amount-2);}
  const sentinel=p.board.find(x=>x.id==='GEO-022'&&x.cracked&&x.iid!==u.iid&&!x.statuses.faultbornGuard);
  if(amount>0&&sentinel){sentinel.statuses.faultbornGuard=true;amount=Math.max(0,amount-1);}
 }
 if(p.preventNextDamage){const r=Math.min(p.preventNextDamage,amount);p.preventNextDamage-=r;amount-=r;}
 if(amount<=0)return 0;
 if(p.faction==='Eliteborn'&&u.formation!=null&&!noDisperse){
  const m=formationMembers(p,u.formation),fs=formationSize(p,u);const bast=m.find(x=>x.id==='ELI-005'&&formationSize(p,x)===4&&!x.statuses.bastionUsed);
  if(bast){bast.statuses.bastionUsed=true;amount=Math.max(0,amount-2);}
  const caed=m.some(x=>x.id==='ELI-026'),dis=p.passive==='We Stand Together'&&(fs>=5||(caed&&fs>=4));
  if(dis&&m.length>1&&amount){if(caed&&!p.statuses.caedrynDisperse){p.statuses.caedrynDisperse=true;amount=Math.max(0,amount-2);}const q=Math.floor(amount/m.length),r=amount%m.length;m.slice().forEach(x=>p.board.includes(x)&&applyDamage(x,q+(x.iid===u.iid?r:0),source,{combat,noDisperse:true,reason:'disperse'}));return amount;}
 }
 const wasBloodied=isBloodied(u),before=u.currentHp;u.currentHp-=amount;const dealt=Math.min(amount,Math.max(0,before));u.damageTakenThisRound+=amount;
 if(u.faction==='Moondemons'&&u.currentHp<getMaxHp(u))u.everBloodied=true;
 if(u.faction==='Moondemons'&&!wasBloodied&&isBloodied(u)&&u.sigil?.sigilEffect==='bloodwake'){revealSigil(u,'SIGIL');u.tempStr+=3;u.shield=(u.shield||0)+2;}
 if(u.faction==='Living Geodes'&&amount>=3&&u.id==='GEO-024')u.tempStr+=2;
 if(combat&&u.currentHp>0){
  if(u.id==='HAR-002'&&!u.statuses.briar){u.statuses.briar=true;addPermStats(u,0,1);}
  if(u.id==='HAR-010'&&!u.statuses.titheback){u.statuses.titheback=true;addPermStats(u,1,1);}
  if(u.growth?.bloomed&&u.growth.growthEffect==='thornbloom'&&!u.statuses.thornbloomCombat){u.statuses.thornbloomCombat=true;addPermStats(u,0,1);}
  if(u.statuses.brambleReserve&&!u.statuses.brambleSpent){u.statuses.brambleSpent=true;addPermStats(u,0,2);}
 }
 if(u.currentHp<=0){
  if(u.growth&&!u.growth.bloomed&&u.growth.growthEffect==='rejuvenation'){bloomGrowth(u,'fatal damage');u.currentHp=1;}
  else if(u.statuses.deepRoots&&(u.permStr>0||u.permHp>0)){
   let points=Math.min(2,u.permHp+u.permStr),prevent=points*2;
   while(points>0&&u.permHp>0){u.permHp--;points--;}while(points>0&&u.permStr>0){u.permStr--;points--;}
   u.currentHp+=prevent;if(u.currentHp<=0)destroyUnit(u,source,{combat,reason});
  }else destroyUnit(u,source,{combat,reason});
 }
 return dealt;
}
function dealPlayerDamage(i,n,source=null,combat=false){const p=state.players[i];if(combat&&state.flags.has('upperMinor')&&p.board.length>=3){const red=Math.floor(n/2);p.health-=n-red;let left=red,units=[...p.board],k=0;while(left>0&&units.length){const u=units[k++%units.length];if(p.board.includes(u))applyDamage(u,1,source,{combat:true});left--;}}else p.health-=n;checkWinner();}
function destroyUnit(u,source=null,{reason='death',formationCascade=false,combat=false}={}){
 const p=state.players[u.owner];if(!p.board.includes(u))return;const fid=u.formation;
 if(u.equip){discardAttachment(p,u.equip);u.equip=null;}
 if(u.prisms?.length){u.prisms.forEach(x=>discardAttachment(p,x));u.prisms=[];}
 if(u.sigil){discardAttachment(p,u.sigil);u.sigil=null;}
 if(u.growth){discardAttachment(p,u.growth);u.growth=null;}
 p.board=p.board.filter(x=>x.iid!==u.iid);
 const blood=state.flags.has('bloodMajor')&&state.round>=5;
 if(u.echo||blood){u.zone='banished';p.banished.push(u);}else if(state.flags.has('deadMajor')){u.zone='graveState';state.graveState.push(u);}else{u.zone='discard';p.discard.push(u);}
 if(p.faction==='Harvest'){
  p.board.filter(x=>x.id==='HAR-007').forEach(x=>{addPermStats(x,1,0);if(u.permStr>0||u.permHp>0)markNourished(x);});
  p.board.forEach(x=>{if(x.growth?.growthEffect==='carrion'){if(!x.growth.bloomed)bloomGrowth(x,'friendly death');else if(!x.statuses.carrionDeath){x.statuses.carrionDeath=true;healUnit(x,2,'Carrion Bloom');}}});
 }
 if(p.faction==='Harvest'&&p.passive==='Regurgitate'&&p.board.length){
  const t=[...p.board].sort((a,b)=>(getStr(b)+getMaxHp(b))-(getStr(a)+getMaxHp(a)));
  if(p.board.some(x=>x.id==='HAR-026')&&!p.statuses.elderRegurg&&t[1]){p.statuses.elderRegurg=true;addPermStats(t[0],1,1);addPermStats(t[1],1,1);}else addPermStats(t[0],1,1);p.passiveTriggers++;
 }
 if(source&&source.owner!==u.owner&&state.players[source.owner]?.board.includes(source)&&source.growth?.growthEffect==='predatory'&&!source.growth.bloomed)bloomGrowth(source,'combat kill');
 if(p.faction==='Eliteborn'&&p.passive==='Rise as One. Die as One.'&&fid!=null&&!formationCascade){const others=formationMembers(p,fid).slice();if(others.length)state.log.push(`<strong>Formation ${fid} collapses.</strong>`);others.forEach(x=>destroyUnit(x,null,{reason:'formation-wipe',formationCascade:true}));}
 if(u.statuses.lastBeforeFirst){shiftSequence(p,1);if(p.sequence===5)drawOne(p);}
 if(u.statuses.lastBite&&source&&source.owner!==u.owner){applyDamage(source,2,u,{reason:'Last Bite'});const b=p.board.find(isBloodied);if(b)addPermStats(b,0,2);}
 if(state.flags.has('deadMajor')&&!u.echo)offerDeadlandsEcho(p.index);state.log.push(`${u.name} leaves play.`);syncDynamicHp(p);
}
function gainPressure(){return 0;}
function foldUnit(){return false;}
function prismChosenMode(pr){return pr?.modes?.find(m=>m.color===pr.chosenColor)||null;}
function recipeColors(u){
 const out=[];for(const pr of u.prisms||[]){const cs=pr.recipeColors?.length?pr.recipeColors:[pr.chosenColor];cs.filter(Boolean).forEach(x=>out.push(x));}(u.tempPrismColors||[]).forEach(x=>out.push(x));return out;
}
function recipeSatisfied(u){
 if(!u||u.cracked||!Array.isArray(u.crackRecipe)||!u.crackRecipe.length)return false;
 if(u.crackRecipe.length===1&&u.crackRecipe[0]==='Any')return recipeColors(u).length>0;
 const req=[...u.crackRecipe],avail=recipeColors(u),used=new Set;
 for(let i=0;i<avail.length;i++){const j=req.indexOf(avail[i]);if(j>=0){req.splice(j,1);used.add(i);}}
 let wild=0;for(let i=0;i<avail.length;i++)if(!used.has(i)&&avail[i]==='White')wild++;
 while(req.length&&wild>0){req.shift();wild--;}return req.length===0;
}
function missingRecipeColors(u){
 if(!u?.crackRecipe)return[];if(u.crackRecipe[0]==='Any')return recipeColors(u).length?[]:['Any'];
 const req=[...u.crackRecipe],avail=recipeColors(u),used=new Set;
 for(let i=0;i<avail.length;i++){const j=req.indexOf(avail[i]);if(j>=0){req.splice(j,1);used.add(i);}}
 let wild=0;for(let i=0;i<avail.length;i++)if(!used.has(i)&&avail[i]==='White')wild++;
 while(req.length&&wild>0){req.shift();wild--;}return req;
}
function addTempPrismColor(u,color,source='effect'){
 if(!u||u.cracked||!state.players[u.owner].board.includes(u)||!color)return;u.tempPrismColors=u.tempPrismColors||[];u.tempPrismColors.push(color);state.log.push(`${u.name} temporarily gains ${color}.`);if(recipeSatisfied(u))crackUnit(u,source);
}
function attachPrism(p,c,target,color){
 if(!target||target.owner!==p.index||target.faction!=='Living Geodes'||target.prisms.length>=3)return false;
 const oldMax=getMaxHp(target);c.zone='prism';c.chosenColor=color;c.recipeColors=[color];
 if(p.passive==='Fracture'&&!p.statuses.fractureUsed){p.statuses.fractureUsed=true;c.recipeColors=[...c.colors];c.dualRecipe=true;}
 target.prisms.push(c);syncDynamicHp(p);if(getMaxHp(target)>oldMax)target.currentHp+=getMaxHp(target)-oldMax;
 if(target.id==='GEO-009')target.tempStr++;
 if(target.id==='GEO-021'&&!target.statuses.seedPrism){target.statuses.seedPrism=true;healUnit(target,1,'Seed of the Deep');}
 p.board.filter(x=>x.id==='GEO-010'&&x.cracked&&x.iid!==target.iid&&(x.statuses.choirAttach||0)<3).forEach(x=>{x.statuses.choirAttach=(x.statuses.choirAttach||0)+1;x.tempStr++;});
 if(c.dualRecipe&&p.board.some(x=>x.id==='GEO-026'&&x.cracked)&&!p.statuses.aurexFracture){p.statuses.aurexFracture=true;addPermStats(target,1,1);}
 state.log.push(`${p.name} attaches <strong>${c.name}</strong> to ${target.name} as ${color}.`);if(recipeSatisfied(target))crackUnit(target,'Prism');return true;
}
function switchPrismColor(u,pr,color){
 if(!u||!pr||!pr.colors?.includes(color))return false;const p=state.players[u.owner],oldMax=getMaxHp(u);pr.chosenColor=color;if(!pr.dualRecipe)pr.recipeColors=[color];syncDynamicHp(p);const next=getMaxHp(u);if(next>oldMax)u.currentHp+=next-oldMax;else u.currentHp=Math.min(u.currentHp,next);state.log.push(`${pr.name} refracts to ${color} on ${u.name}.`);if(recipeSatisfied(u))crackUnit(u,'Refraction');return true;
}
function checkCrackRecipe(u){if(recipeSatisfied(u))crackUnit(u,'Recipe');}
function crackUnit(u,source='effect'){
 if(!u||u.cracked||!state.players[u.owner].board.includes(u))return;const p=state.players[u.owner],marked=getMaxHp(u)-u.currentHp;u.cracked=true;u.baseStr=u.crackedStr??u.baseStr;u.baseHp=u.crackedHp??u.baseHp;u.currentHp=getMaxHp(u)-marked;state.log.push(`<strong>${u.name} CRACKS.</strong>`);onCrack(u);
 const fused=(u.prisms||[]).map(x=>x.chosenColor).filter(Boolean),echoCount=p.board.some(x=>x.id==='GEO-026'&&x.cracked)&&!p.statuses.aurexKimberlite?2:1;
 if(p.passive==='Kimberlite'&&fused.length){if(echoCount===2)p.statuses.aurexKimberlite=true;p.board.filter(x=>x.faction==='Living Geodes'&&!x.cracked&&x.iid!==u.iid&&!x.statuses.kimberliteEcho).slice().forEach(x=>{x.statuses.kimberliteEcho=true;fused.slice(0,echoCount).forEach(color=>addTempPrismColor(x,color,'Kimberlite'));});p.passiveTriggers++;}
 if(fused.length)p.board.filter(x=>x.faction==='Living Geodes'&&!x.cracked&&x.iid!==u.iid&&x.prisms?.some(pr=>pr.id==='GEO-016'&&pr.chosenColor==='Violet')).forEach(x=>addTempPrismColor(x,fused[0],'Amethyst Relay'));
 p.board.filter(x=>x.id==='GEO-023'&&x.iid!==u.iid).forEach(x=>x.tempStr+=2);if(p.board.includes(u)&&u.currentHp<=0)destroyUnit(u,null,{reason:'post-crack-lethal'});
}
function forceCrack(u){if(u&&!u.cracked)crackUnit(u,'forced');}
function onCrack(u){
 const p=state.players[u.owner];
 if(u.id==='GEO-001'){const e=chooseEnemy(u.owner);if(e)applyDamage(e,2,u);}
 if(u.id==='GEO-004')distributeHeal(p,3);
 if(u.id==='GEO-006'){const e=state.players[1-u.owner].board;if(e.length)u.tempStr+=Math.min(4,Math.max(...e.map(x=>x.baseStr)));}
 if(u.id==='GEO-007')healUnit(u,2,'Deepcore');
 if(u.id==='GEO-008')u.extraActions++;
 if(u.id==='GEO-009')drawOne(p);
 if(u.id==='GEO-011'){drawOne(p);drawOne(p);bottomWorst(p);}
 if(u.id==='GEO-012')healUnit(u,4,'Worldheart');
 if(u.id==='GEO-024')healUnit(u,2,'Glassjaw');
 if(u.id==='GEO-025'&&p.board.length<maxSlots(p))p.board.push(makeToken(p.index,'Shardling',0,3,{id:'GEO-T01',faction:'Living Geodes',crackRecipe:['Any'],crackedStr:3,crackedHp:3}));
 if(u.id==='GEO-026'){drawOne(p);drawOne(p);}
 for(const pr of u.prisms||[]){if(pr.id==='GEO-014'&&pr.chosenColor==='Yellow'&&!u.acted)u.extraActions++;if(pr.id==='GEO-016'&&pr.chosenColor==='Yellow'){drawOne(p);bottomWorst(p);}if(pr.id==='GEO-018'&&pr.chosenColor==='Violet')drawOne(p);}
}
function distributeHeal(p,n){let left=n;while(left--){const h=p.board.filter(x=>x.currentHp<getMaxHp(x)).sort((a,b)=>a.currentHp/getMaxHp(a)-b.currentHp/getMaxHp(b))[0];if(!h)return;healUnit(h,1,'distributed');}}
function formationJoined(p,fid){if(p.faction!=='Eliteborn'||fid==null)return;const m=formationMembers(p,fid),fs=formationSize(p,fid);if(p.passive==='Rise as One. Die as One.'&&fs>=3){let n=1;if(p.board.some(x=>x.id==='ELI-026')&&!p.statuses.caedrynRise){p.statuses.caedrynRise=true;n=2;}m.forEach(x=>addPermStats(x,n,n));p.passiveTriggers++;state.log.push(`Rise: Formation ${fid} reaches ${fs}; members gain +${n}/+${n}.`);}if(fs===3){const a=m.find(x=>x.id==='ELI-006'&&!x.statuses.formed3);if(a){a.statuses.formed3=true;drawOne(p);bottomWorst(p);}}syncDynamicHp(p);}
function ensureFormation(p,u,join=null){if(p.faction!=='Eliteborn')return;u.formation=join?.formation??p.nextFormation++;}
function attachEquip(p,c,target){if(!target||target.owner!==p.index||!p.board.includes(target)||target.equip)return false;target.equip=c;c.zone='equip';target.currentHp+=c.equipHp||0;state.log.push(`${p.name} equips <strong>${c.name}</strong> to ${target.name}.`);formationJoined(p,target.formation);return true;}
function recordSequence(p,n){
 p.sequenceHistory=p.sequenceHistory||[];p.sequenceHistory.push(n);if(p.sequenceHistory.length>14)p.sequenceHistory.shift();checkFluxes(p);
}
function resolveFluxTarget(p,fn){
 if(!p.board.length)return;if(p.ai){fn(chooseFriendly(p));return;}showOptions('FLUX','Choose a creature.',p.board.map(x=>({label:`${x.name} — ${getStr(x)}/${x.currentHp}`,value:x.iid})),id=>{const u=p.board.find(x=>x.iid===id);if(u)fn(u);});
}
function resolveFlux(p,fl){
 p.fluxes=p.fluxes.filter(x=>x.iid!==fl.iid);fl.zone='discard';p.discard.push(fl);state.log.push(`<strong>FLUX — ${fl.name}</strong> activates.`);
 switch(fl.fluxEffect){
  case'freeze4':p.sequence=4;p.sequenceFrozenTurns=3;p.sequenceFreezeStartRound=state.round;syncDynamicHp(p);recordSequence(p,4);break;
  case'closedCircuit':resolveFluxTarget(p,u=>{u.extraActions++;u.tempStr+=2;render();});break;
  case'backstep':drawOne(p);drawOne(p);bottomWorst(p);p.effects.nextDiscount=Math.max(p.effects.nextDiscount||0,1);break;
  case'zeroCrossing':drawOne(p);p.resource+=2;break;
  case'dejaVu':resolveFluxTarget(p,u=>{u.statuses.freeActionOnce=true;render();});break;
  case'fifthReflection':drawOne(p);drawOne(p);p.effects.nextDiscount=Math.max(p.effects.nextDiscount||0,2);break;
 }
}
function checkFluxes(p){
 if(!p?.fluxes?.length)return;const h=p.sequenceHistory||[];
 for(const fl of [...p.fluxes]){const pat=fl.pattern||[];if(h.length<pat.length)continue;const tail=h.slice(-pat.length);if(pat.every((n,i)=>tail[i]===n))resolveFlux(p,fl);}
}
function shiftSequence(p,steps=1,{towardZero=false,causer=null}={}){
 if(p.faction!=='Continuum')return;
 for(let i=0;i<steps;i++){
  if(p.sequenceFrozenTurns>0){p.sequence=4;state.log.push(`${p.name} Sequence is <strong>FROZEN AT 4</strong>.`);continue;}
  const old=p.sequence;
  if(towardZero)p.sequence=Math.max(0,p.sequence-1);
  else if(p.passive==='Loop Back'){p.sequence+=p.sequenceDir;if(p.sequence>=5){p.sequence=5;p.sequenceDir=-1;}else if(p.sequence<=0){p.sequence=0;p.sequenceDir=1;}}
  else p.sequence=(p.sequence+1)%6;
  state.log.push(`${p.name} Sequence ${old} → ${p.sequence}.`);syncDynamicHp(p);recordSequence(p,p.sequence);
  if(p.sequence===5&&old!==5)sequenceComplete(p,causer);
  if(old===5&&p.sequence===4)p.board.filter(x=>x.id==='CON-024').forEach(x=>x.extraActions++);
  if(old>=4&&p.sequence>=4){p.board.filter(x=>x.id==='CON-002'&&!x.statuses.bell).forEach(x=>{x.statuses.bell=true;x.tempStr+=2;});if(p.passive==='Loop Back'&&p.sequenceDir===-1&&p.board.some(x=>x.id==='CON-026')&&!p.statuses.closedCircuit){p.statuses.closedCircuit=true;p.board.filter(x=>/High Sequence/.test(x.rules||'')).forEach(x=>addTempStats(x,1,1));}}
 }
}
function sequenceComplete(p,causer=null){state.log.push(`<strong>${p.name} COMPLETES Sequence.</strong>`);p.board.slice().forEach(u=>{if(u.id==='CON-003')p.effects.nextDiscount=Math.max(p.effects.nextDiscount||0,2);if(u.id==='CON-005'){healUnit(u,2,'Sequence');p.health=Math.min(20,p.health+2);}if(u.id==='CON-007'){const a=p.board.find(x=>x.iid!==u.iid&&x.acted);if(a)a.extraActions++;}if(u.id==='CON-008'){u.tempStr+=3;u.extraActions++;}if(u.id==='CON-010'||u.id==='CON-023'){drawOne(p);drawOne(p);bottomWorst(p);}if(u.id==='CON-026'){drawOne(p);drawOne(p);p.effects.nextDiscount=Math.max(p.effects.nextDiscount||0,2);}});if(causer==='CON-015')p.resource+=2;if(causer==='CON-020'||causer==='CON-021')drawOne(p);if(causer==='CON-027')p.effects.tripleDiscount=3;if(p.passive==='Skip Ahead'&&p.board.some(x=>x.id==='CON-026')&&p.skipUsed>=2)drawOne(p);}
function moondemonDealtDamage(source,dealt,combat=false){
 if(!source||dealt<=0||source.faction!=='Moondemons'||!state.players[source.owner].board.includes(source)||!isBloodied(source))return;
 const p=state.players[source.owner];
 if(source.sigil?.sigilEffect==='feast'){revealSigil(source,'SIGIL');source.permHp+=2;}
 if(p.passive==='Frenzied'){addPermStats(source,2,2);p.passiveTriggers++;}
 if(source.id==='MON-004'&&combat&&!source.statuses.redjaw){source.statuses.redjaw=true;source.permHp++;}
 let h=2;if(source.id==='MON-026'&&!source.statuses.vesperaRedirect){const a=p.board.find(x=>x.iid!==source.iid&&isBloodied(x));if(a){source.statuses.vesperaRedirect=true;healUnit(a,2,'Vespera');h=0;}}
 healUnit(source,h,'Blood feed');
 if(source.id==='MON-007'&&combat&&isBloodied(source)&&!source.statuses.duelist){source.statuses.duelist=true;source.extraActions++;}
 if(source.id==='MON-002'&&p.board.includes(source))applyDamage(source,1,null,{reason:'self'});
}
function chooseEndless(){const a=['crystalMajor','crystalMinor','bloodMajor','bloodMinor','upperMajor','upperMinor','deadMajor','deadMinor'];while(true){const x=sample(a),y=sample(a.filter(z=>z!==x));if(y==='crystalMinor'&&x!=='crystalMajor')continue;if(y==='deadMinor'&&x!=='deadMajor')continue;if(x==='crystalMinor'&&y!=='crystalMajor')continue;if(x==='deadMinor'&&y!=='deadMajor')continue;return[x,y];}}
function realmFlags(r,b=[]){const s=new Set;if(r==='Crystal Isle'){s.add('crystalMajor');s.add('crystalMinor');}if(r==='Blood Moon'){s.add('bloodMajor');s.add('bloodMinor');}if(r==='Upper Strata'){s.add('upperMajor');s.add('upperMinor');}if(r==='Deadlands'){s.add('deadMajor');s.add('deadMinor');}if(r==='The Endless')b.forEach(x=>s.add(x));return s;}
function startGame(c){uid=1;const realm=c.realm==='Random'?sample(REALMS):c.realm,borrowed=realm==='The Endless'?chooseEndless():[];state={version:'0.9-signature-types-alpha',realm,borrowed,flags:realmFlags(realm,borrowed),mode:c.mode,round:1,phase:'mulligan',initiative:rand(2),active:0,placementPasses:0,winner:null,selected:null,graveState:[],polarityDeaths:[0,0],log:[],preparedRound:0,players:[buildPlayer(0,c.p1Faction,c.p1Passive,c.mode==='watch'),buildPlayer(1,c.p2Faction,c.p2Passive,c.mode!=='hotseat')]};setupModal.classList.remove('open');state.log.push(`${state.players[state.initiative].name} has Initiative. Realm: <strong>${realm}</strong>.`);state.players.forEach(p=>{for(let i=0;i<5;i++)drawOne(p);});beginMulligan(0);}
function prepareRound(){
 for(const p of state.players){
  p.statuses={};p.effects={};p.skipUsed=0;p.consumeUsed=false;p.endlessShiftUsed=false;p.preventNextDamage=0;p.shatterproof=false;p.cascadeRemaining=0;p.sequenceHistory=[p.sequence];
  p.hand.forEach(c=>{if(c.statuses)c.statuses.tempCostReduction=0;});
  p.board.slice().forEach(u=>{u.acted=false;u.extraActions=0;u.tempStr=0;u.tempHp=0;u.damageTakenThisRound=0;u.statuses={};u.tempPrismColors=[];if(u.faction==='Harvest')u.nourished=!!(u.growth?.bloomed&&u.growth.growthEffect==='rootNetwork');});
  syncDynamicHp(p);
  for(const u of p.board.slice()){
   if(u.growth?.bloomed&&u.growth.growthEffect==='rejuvenation'&&state.round>u.growth.bloomRound&&(u.growth.turns||0)>0)healUnit(u,2,'Rejuvenation');
   if(u.faction==='Living Geodes'&&u.prisms?.some(pr=>pr.id==='GEO-015'&&pr.chosenColor==='Green'))healUnit(u,1,'Verdant Prism');
  }
  if(p.faction==='Continuum'){if(p.sequenceFrozenTurns>0&&state.round>p.sequenceFreezeStartRound){p.sequence=4;recordSequence(p,4);}else shiftSequence(p,1);}
  if(p.faction==='Harvest')p.board.filter(x=>x.id==='HAR-006').forEach(o=>p.board.filter(x=>x.iid!==o.iid).slice(0,2).forEach(x=>addPermStats(x,0,1)));
  if(p.faction==='Eliteborn')p.board.slice().forEach(u=>{const fs=formationSize(p,u);if((u.id==='ELI-008'&&fs===4)||(u.id==='ELI-022'&&fs===3))distributeHeal({board:formationMembers(p,u.formation)},2);});
 }
}
function beginMulligan(i){if(state.winner!==null)return;if(i===0&&state.preparedRound!==state.round){prepareRound();state.preparedRound=state.round;}if(i>1)return finishMulligans();const p=state.players[i];state.active=i;if(p.ai){aiMulligan(p);return beginMulligan(i+1);}showMulligan(p,()=>beginMulligan(i+1));}
function aiMulligan(p){drawToFive(p);const ret=p.hand.filter(c=>c.cost>8&&c.resource===1).slice(0,2);p.hand=p.hand.filter(c=>!ret.includes(c));ret.forEach(c=>{c.zone='deck';p.deck.push(c)});p.deck=shuffle(p.deck);drawToFive(p);}
function showMulligan(p,done){choiceEyebrow.textContent=state.round===1?'Opening hand':`Round ${state.round}`;choiceTitle.textContent=`${p.name}: keep or return`;const sel=new Set;choiceBody.innerHTML=`<p class="player-sub">Return any cards, then refill to 5. Your final five generate resources.</p><div class="mulligan-grid">${p.hand.map(c=>`<button class="mulligan-card" data-iid="${c.iid}"><strong>${esc(c.name)}</strong><div class="mini">Cost ${c.cost} • +${c.resource} RES</div></button>`).join('')}</div>`;choiceActions.innerHTML='<button class="btn primary" id="keepHandBtn">Confirm Hand</button>';choiceModal.classList.add('open');choiceBody.querySelectorAll('[data-iid]').forEach(b=>b.onclick=()=>{sel.has(b.dataset.iid)?sel.delete(b.dataset.iid):sel.add(b.dataset.iid);b.classList.toggle('return');});$('#keepHandBtn').onclick=()=>{const ret=p.hand.filter(c=>sel.has(c.iid));p.hand=p.hand.filter(c=>!sel.has(c.iid));ret.forEach(c=>{c.zone='deck';p.deck.push(c)});p.deck=shuffle(p.deck);drawToFive(p);closeChoice();done();};}
function finishMulligans(){for(const p of state.players){p.resourceStart=p.hand.slice(0,5).reduce((s,c)=>s+c.resource,0);p.resource=p.resourceStart;p.placementPassed=false;}state.phase='placement';state.active=state.initiative;state.placementPasses=0;state.log.push(`<strong>Round ${state.round}</strong> begins. Resources ${state.players[0].resource}/${state.players[1].resource}.`);render();maybeAI();}
function effectiveCost(p,c,consume=false){
 if(c.type==='Flux')return 0;
 let n=c.cost;const next=p.effects.nextDiscount||0;if(next)n-=next;if((p.effects.tripleDiscount||0)>0)n--;if(c.statuses?.tempCostReduction)n-=c.statuses.tempCostReduction;
 if(c.type==='Prism'&&(p.effects.prismDiscountCount||0)>0)n-=p.effects.prismDiscountAmount||0;
 const conSpell=c.type==='Spell'&&(p.sequence===4||p.sequence===5)&&p.board.some(x=>x.id==='CON-025')&&!p.statuses.spellDisc;if(conSpell)n-=2;
 const eliteEquip=c.type==='Equip'&&p.board.some(x=>x.id==='ELI-024'&&formationSize(p,x)===4)&&!p.statuses.engDisc;if(eliteEquip)n--;
 if(consume){if(next)p.effects.nextDiscount=0;if((p.effects.tripleDiscount||0)>0)p.effects.tripleDiscount--;if(c.statuses?.tempCostReduction)c.statuses.tempCostReduction=0;if(c.type==='Prism'&&(p.effects.prismDiscountCount||0)>0)p.effects.prismDiscountCount--;if(conSpell)p.statuses.spellDisc=true;if(eliteEquip)p.statuses.engDisc=true;}
 return Math.max(1,n);
}
function selectedFriendly(p){return state.selected?p.board.find(x=>x.iid===state.selected.iid)||null:null;}
function selectedEnemy(p){return state.selected?state.players[1-p.index].board.find(x=>x.iid===state.selected.iid)||null:null;}
function spellTargetPlan(c,p){
 const id=c.id;
 const singleFriendly=new Set(['GEO-027','GEO-028','GEO-030','HAR-020','HAR-030','CON-019','CON-020','MON-019','MON-020','MON-027']);
 const singleEnemy=new Set(['CON-030']);
 if(singleFriendly.has(id))return {kind:'single',scope:'friendly'};
 if(singleEnemy.has(id))return {kind:'single',scope:'enemy'};
 if(id==='HAR-019'||id==='HAR-027'||id==='HAR-028'||id==='HAR-029')return {kind:'multi',scope:'friendly',count:2};
 if(id==='MON-028')return {kind:'multi',scope:'friendly',count:3,optional:true};
 if(id==='MON-030')return {kind:'dual'};
 if(id==='ELI-016')return {kind:'formation'};
 if(id==='ELI-017')return {kind:'reinforce'};
 return null;
}
function legalSpellCandidates(c,p,scope){
 let a=scope==='enemy'?state.players[1-p.index].board:p.board;
 if(c.id.startsWith('GEO-'))a=a.filter(x=>x.faction==='Living Geodes'&&!x.cracked);
 if(c.id==='GEO-027'||c.id==='GEO-030')a=a.filter(x=>x.prisms?.length);
 if(c.id.startsWith('MON-'))a=a.filter(x=>x.faction==='Moondemons');
 if(c.id==='MON-019'||c.id==='MON-020'||c.id==='MON-027'||c.id==='MON-030')a=a.filter(isBloodied);
 if(c.id==='HAR-030')a=a.filter(x=>x.permStr>0||x.permHp>0);
 return a;
}
function requestSpellTargets(p,c,done){
 const plan=spellTargetPlan(c,p);if(!plan)return done([]);
 if(plan.kind==='single'){
  const a=legalSpellCandidates(c,p,plan.scope);if(!a.length){toast('No legal target for '+c.name+'.');return false;}
  showOptions('Choose Target',c.name,a.map(x=>({label:`${x.name} — STR ${getStr(x)} • HP ${x.currentHp}/${getMaxHp(x)}`,value:x.iid})),id=>done([id]));return true;
 }
 if(plan.kind==='multi'){
  const a=legalSpellCandidates(c,p,plan.scope),need=plan.optional?1:plan.count;if(a.length<need){toast('Not enough legal targets for '+c.name+'.');return false;}
  const picks=[];const chooseN=step=>{
   const left=a.filter(x=>!picks.includes(x.iid)),opts=left.map(x=>({label:`${x.name} — ${getStr(x)}/${x.currentHp}`,value:x.iid}));
   if(plan.optional&&step>1)opts.push({label:'Finish choosing',value:'__done__'});
   showOptions(`Choose Target ${step}`,c.name,opts,v=>{if(v==='__done__')return done(picks);picks.push(v);if(step>=plan.count||left.length===1)done(picks);else chooseN(step+1);});
  };chooseN(1);return true;
 }
 if(plan.kind==='dual'){
  const friends=legalSpellCandidates(c,p,'friendly'),enemies=state.players[1-p.index].board.filter(x=>x.currentHp<getMaxHp(x));
  if(!friends.length||!enemies.length){toast('No legal target pair for '+c.name+'.');return false;}
  showOptions('Choose Attacker',c.name,friends.map(x=>({label:x.name,value:x.iid})),fid=>showOptions('Choose Enemy',c.name,enemies.map(x=>({label:x.name,value:x.iid})),eid=>done([fid,eid])));return true;
 }
 if(plan.kind==='formation'){
  const ids=[...new Set(p.board.map(x=>x.formation).filter(x=>x!=null))];if(!ids.length){toast('No Formation to target.');return false;}
  showOptions('Choose Formation',c.name,ids.map(fid=>({label:`Formation ${fid} — size ${formationSize(p,fid)}`,value:'F:'+fid})),id=>done([id]));return true;
 }
 if(plan.kind==='reinforce'){
  const slots=Math.min(2,maxSlots(p)-p.board.length);if(slots<=0){toast('No open creature slot for Reinforce.');return false;}
  const ids=[...new Set(p.board.map(x=>x.formation).filter(x=>x!=null))],picks=[];const chooseRecruit=step=>{
   const opts=ids.map(fid=>({label:`Join Formation ${fid} — size ${formationSize(p,fid)}`,value:'R:'+fid}));
   if(step===2&&picks[0]==='NEW')opts.push({label:"Join Recruit 1's new Formation",value:'FIRST'});
   opts.push({label:'Stand alone — new Formation (1)',value:'NEW'});
   showOptions('Reinforce',`Place Recruit ${step} of ${slots}`,opts,v=>{picks.push(v);if(step<slots)chooseRecruit(step+1);else done(picks);});
  };chooseRecruit(1);return true;
 }
 return done([]);
}
function playCard(i,iid,{ai=false,formationChoice=undefined,equipTargetId=null,spellTargetsReady=false,attachTargetId=null,prismColor=null}={}){
 if(state.phase!=='placement'||state.active!==i||state.winner!==null)return false;
 const p=state.players[i],c=p.hand.find(x=>x.iid===iid);if(!c)return false;const cost=effectiveCost(p,c,false);
 if(p.resource<cost){if(!ai)toast(`Need ${cost} resources.`);return false;}
 if(c.type.includes('Creature')&&p.board.length>=maxSlots(p)){if(!ai)toast('No creature slot.');return false;}
 if(c.type==='Spell'&&!ai&&!spellTargetsReady&&spellTargetPlan(c,p)){const opened=requestSpellTargets(p,c,ids=>{c.statuses.castTargets=ids;playCard(i,iid,{spellTargetsReady:true});});return opened!==false;}
 if(p.faction==='Eliteborn'&&c.type.includes('Creature')&&!ai&&formationChoice===undefined){
  const ids=[...new Set(p.board.map(x=>x.formation).filter(x=>x!=null))],opts=ids.map(fid=>({label:`Join Formation ${fid} — size ${formationSize(p,fid)}`,value:String(fid)}));opts.push({label:'Stand alone — start Formation (1)',value:'new'});showOptions('Eliteborn Formation',`Where does ${c.name} connect?`,opts,v=>playCard(i,iid,{formationChoice:v}));return true;
 }
 if(c.type==='Equip'&&!ai&&!equipTargetId){
  const opts=p.board.filter(x=>!x.equip).map(x=>({label:`${x.name} — Formation ${formationSize(p,x)} — ${getStr(x)}/${x.currentHp}`,value:x.iid}));if(!opts.length){toast('Every creature already has an Equip.');return false;}showOptions('Eliteborn Equip',`Attach ${c.name} to which creature?`,opts,v=>playCard(i,iid,{equipTargetId:v}));return true;
 }
 if(c.type==='Prism'&&!ai&&!attachTargetId){
  const a=p.board.filter(x=>x.faction==='Living Geodes'&&x.prisms.length<3);if(!a.length){toast('No Geode has an open Prism slot.');return false;}
  showOptions('Choose Geode',c.name,a.map(x=>({label:`${x.name} — ${x.cracked?'CRACKED':'Needs '+missingRecipeColors(x).join(' + ')}`,value:x.iid})),id=>playCard(i,iid,{attachTargetId:id}));return true;
 }
 if(c.type==='Prism'&&!ai&&attachTargetId&&!prismColor){
  showOptions('Choose Prism Color',c.name,c.modes.map(m=>({label:`${m.color.toUpperCase()} — ${m.text.replace(/^[A-Z]+ — /,'')}`,value:m.color})),color=>playCard(i,iid,{attachTargetId,prismColor:color}));return true;
 }
 if((c.type==='Sigil'||c.type==='Growth')&&!ai&&!attachTargetId){
  const a=p.board.filter(x=>c.type==='Sigil'?(x.faction==='Moondemons'&&!x.sigil):(x.faction==='Harvest'&&!x.growth));if(!a.length){toast('No legal ally attachment slot.');return false;}
  showOptions(c.type,`Attach ${c.name}`,a.map(x=>({label:`${x.name} — ${getStr(x)}/${x.currentHp}`,value:x.iid})),id=>playCard(i,iid,{attachTargetId:id}));return true;
 }
 let target=null;
 if(c.type==='Equip'){target=ai?p.board.filter(x=>!x.equip).sort((a,b)=>formationSize(p,b)-formationSize(p,a)||getStr(b)-getStr(a))[0]:p.board.find(x=>x.iid===equipTargetId);if(!target||target.equip)return false;}
 if(c.type==='Prism'){
  target=ai?p.board.filter(x=>x.faction==='Living Geodes'&&x.prisms.length<3).sort((a,b)=>Number(a.cracked)-Number(b.cracked)||missingRecipeColors(a).length-missingRecipeColors(b).length)[0]:p.board.find(x=>x.iid===attachTargetId);
  if(!target)return false;if(ai){const miss=missingRecipeColors(target),m=c.modes.find(x=>miss.includes(x.color))||c.modes[0];prismColor=m.color;}
 }
 if(c.type==='Sigil'||c.type==='Growth'){target=ai?p.board.filter(x=>c.type==='Sigil'?(x.faction==='Moondemons'&&!x.sigil):(x.faction==='Harvest'&&!x.growth)).sort((a,b)=>(getStr(b)+getMaxHp(b))-(getStr(a)+getMaxHp(a)))[0]:p.board.find(x=>x.iid===attachTargetId);if(!target)return false;}
 p.resource-=effectiveCost(p,c,true);p.hand=p.hand.filter(x=>x.iid!==iid);state.placementPasses=0;
 if(c.type.includes('Creature')){
  c.zone='board';c.baseStr=c.str??0;c.baseHp=c.hp??1;c.currentHp=c.baseHp;c.nourished=true;
  if(p.faction==='Eliteborn'){let join=null;if(ai)join=p.board.filter(x=>x.formation!=null).sort((a,b)=>formationSize(p,b)-formationSize(p,a))[0]||null;else if(formationChoice!=='new')join=p.board.find(x=>String(x.formation)===String(formationChoice))||null;ensureFormation(p,c,join);}
  p.board.push(c);state.log.push(`${p.name} plays <strong>${c.name}</strong>${c.formation!=null?` in Formation ${c.formation}`:''}.`);onPlay(c,p);if(c.formation!=null)formationJoined(p,c.formation);
 }else if(c.type==='Equip')attachEquip(p,c,target);
 else if(c.type==='Prism')attachPrism(p,c,target,prismColor);
 else if(c.type==='Sigil'){target.sigil=c;c.zone='sigil';state.log.push(`${p.name} sets a face-down Sigil on ${target.name}.`);}
 else if(c.type==='Growth'){target.growth=c;c.zone='growth';c.bloomed=false;c.progress=0;state.log.push(`${p.name} plants <strong>${c.name}</strong> on ${target.name}.`);}
 else if(c.type==='Flux'){c.zone='flux';p.fluxes.push(c);state.log.push(`${p.name} arms <strong>FLUX — ${c.name}</strong>.`);checkFluxes(p);}
 else{c.zone='discard';resolveSpell(c,p);p.discard.push(c);state.log.push(`${p.name} casts <strong>${c.name}</strong>.`);}
 state.selected=null;checkWinner();if(state.winner===null)advancePlacement(i);return true;
}
function onPlay(c,p){
 if(c.id==='GEO-022'&&p.board.some(x=>x.iid!==c.iid&&x.prisms?.length))c.shield+=2;
 if(c.id==='CON-012')shiftSequence(p,1);
 if(c.id==='CON-021')shiftSequence(p,1,{causer:c.id});
}
function resolveSpell(c,p){
 const ids=c.statuses.castTargets||[],own=id=>p.board.find(x=>x.iid===id),enemy=id=>state.players[1-p.index].board.find(x=>x.iid===id);
 const chosen=ids.map(own).filter(Boolean),f=chosen[0]||null;
 switch(c.id){
  case'GEO-019':{const x=drawOne(p);if(x?.type==='Prism')x.statuses.tempCostReduction=1;break;}
  case'GEO-020':{const a=p.discard.filter(x=>x.type==='Prism');if(a.length){const take=x=>{p.discard=p.discard.filter(y=>y.iid!==x.iid);x.zone='hand';p.hand.push(x);p.effects.prismDiscountCount=1;p.effects.prismDiscountAmount=1;};if(p.ai)take(a[a.length-1]);else showOptions('Crystal Recall','Return which Prism?',a.map(x=>({label:x.name,value:x.iid})),id=>{const x=a.find(y=>y.iid===id);if(x)take(x);render();});}break;}
  case'GEO-027':if(f&&f.prisms.length){const choose=pr=>{const other=pr.colors.find(x=>x!==pr.chosenColor)||pr.colors[0];switchPrismColor(f,pr,other);};if(p.ai)choose(f.prisms[0]);else showOptions('Refraction Shift','Switch which Prism?',f.prisms.map(x=>({label:`${x.name} — ${x.chosenColor}`,value:x.iid})),id=>{const pr=f.prisms.find(x=>x.iid===id);if(pr)choose(pr);render();});}break;
  case'GEO-028':if(f){const colors=['Red','Blue','Green','Yellow','Violet','White'];if(p.ai)addTempPrismColor(f,(missingRecipeColors(f)[0]||'Red'),'Spectrum Bridge');else showOptions('Spectrum Bridge','Choose temporary color.',colors.map(x=>({label:x,value:x})),x=>{addTempPrismColor(f,x,'Spectrum Bridge');render();});}break;
  case'GEO-029':p.effects.prismDiscountCount=2;p.effects.prismDiscountAmount=2;break;
  case'GEO-030':if(f){const miss=missingRecipeColors(f);if(miss.length){if(p.ai)addTempPrismColor(f,miss[0],'Perfect Facet');else showOptions('Perfect Facet','Satisfy which missing color?',[...new Set(miss)].map(x=>({label:x,value:x})),x=>{addTempPrismColor(f,x,'Perfect Facet');render();});}}break;
  case'HAR-019':chosen.slice(0,2).forEach(x=>addPermStats(x,1,1));break;
  case'HAR-020':if(f)f.statuses.brambleReserve=true;break;
  case'HAR-027':if(chosen.length>=2){const [a,b]=chosen;if(a.permStr>=a.permHp&&a.permStr>0)addPermStats(b,1,0);else if(a.permHp>0)addPermStats(b,0,1);}break;
  case'HAR-028':if(chosen.length>=2){destroyUnit(chosen[0],null,{reason:'Cull and Compost'});drawOne(p);drawOne(p);if(p.board.includes(chosen[1]))addPermStats(chosen[1],0,2);}break;
  case'HAR-029':if(chosen.length>=2){const [a,b]=chosen;let n=Math.min(4,a.permStr+a.permHp),s=Math.min(n,a.permStr);a.permStr-=s;n-=s;const h=Math.min(n,a.permHp);a.permHp-=h;a.currentHp=Math.min(a.currentHp,getMaxHp(a));addPermStats(b,s,h);}break;
  case'HAR-030':if(f)f.statuses.deepRoots=true;break;
  case'CON-019':if(f)f.statuses.phaseShelter=true;break;
  case'CON-020':if(f)f.statuses.lastBeforeFirst=true;break;
  case'CON-027':shiftSequence(p,1,{causer:c.id});if(p.sequence>=4)p.effects.tripleDiscount=3;break;
  case'CON-028':shiftSequence(p,2,{causer:c.id});break;
  case'CON-029':if(p.sequence===5){p.sequence=0;recordSequence(p,0);drawOne(p);drawOne(p);p.effects.nextDiscount=Math.max(p.effects.nextDiscount||0,2);}break;
  case'CON-030':{shiftSequence(p,1,{causer:c.id});const e=enemy(ids[0]);if(e&&(p.sequence===4||p.sequence===5))e.tempStr-=3;break;}
  case'MON-019':if(f){f.statuses.nextDamageBonus=(f.statuses.nextDamageBonus||0)+2;f.statuses.bloodInWater=true;}break;
  case'MON-020':if(f)f.statuses.lastBite=true;break;
  case'MON-027':p.health-=2;p.resource+=3;if(f&&isBloodied(f))f.tempStr+=2;checkWinner();break;
  case'MON-028':chosen.forEach(x=>{if(isBloodied(x)){healUnit(x,1,'Pack Feeding');x.permHp+=1;}else healUnit(x,2,'Pack Feeding');});break;
  case'MON-029':p.board.filter(isBloodied).forEach(x=>{x.tempStr+=2;x.statuses.moonrage=true;});break;
  case'MON-030':{const a=own(ids[0]),e=enemy(ids[1]);if(a&&e&&isBloodied(a)&&!a.acted)combatAttack(a,e);break;}
  case'ELI-016':{let fid=null;if(ids[0]?.startsWith('F:'))fid=+ids[0].slice(2);if(fid==null&&p.ai){const fs=[...new Set(p.board.map(x=>x.formation).filter(x=>x!=null))];fid=fs.sort((a,b)=>formationSize(p,b)-formationSize(p,a))[0];}if(fid!=null){const n=formationSize(p,fid)>=4?2:1;formationMembers(p,fid).forEach(x=>x.tempStr+=n);}break;}
  case'ELI-017':{if(ids.length){let first=null;for(let j=0;j<ids.length&&p.board.length<maxSlots(p);j++){const pick=ids[j],u=makeToken(p.index,'Recruit',1,1,{faction:'Eliteborn'});let join=null;if(pick.startsWith('R:'))join=p.board.find(x=>x.formation===+pick.slice(2))||null;else if(pick==='FIRST')join=first;ensureFormation(p,u,join);p.board.push(u);if(j===0)first=u;formationJoined(p,u.formation);}}else for(let j=0;j<2&&p.board.length<maxSlots(p);j++){const u=makeToken(p.index,'Recruit',1,1,{faction:'Eliteborn'});ensureFormation(p,u,p.board[0]);p.board.push(u);formationJoined(p,u.formation);}break;}
  default:break;
 }
 delete c.statuses.castTargets;
}
function useSkipAhead(p,ai=false){const max=p.board.some(x=>x.id==='CON-026')?2:1;if(p.faction!=='Continuum'||p.passive!=='Skip Ahead'||p.skipUsed>=max||!p.hand.length||p.sequence===5)return false;const go=c=>{p.hand=p.hand.filter(x=>x.iid!==c.iid);c.zone='discard';p.discard.push(c);p.skipUsed++;shiftSequence(p,1);state.log.push(`${p.name} uses Skip Ahead, discarding ${c.name}.`);};if(ai){go([...p.hand].sort((a,b)=>a.cost-b.cost)[0]);return true;}showOptions('Skip Ahead','Discard one card to Shift Sequence +1.',p.hand.map(c=>({label:`${c.name} — Cost ${c.cost}`,value:c.iid})),id=>{const c=p.hand.find(x=>x.iid===id);if(c){go(c);render();}});return true;}
function useConsume(p,ai=false){if(p.faction!=='Harvest'||p.passive!=='Consume'||p.consumeUsed||p.board.length<2)return false;const finish=(s,t,stat)=>{let n=s.cost+(p.board.some(x=>x.id==='HAR-026')?2:0);n=Math.min(9,n);destroyUnit(s,null,{reason:'consume'});if(p.board.includes(t))addPermStats(t,stat==='str'?n:0,stat==='hp'?n:0);p.consumeUsed=true;state.log.push(`${p.name} Consumes ${s.name}; ${t.name} gains +${n} ${stat.toUpperCase()}.`);};if(ai){const s=chooseFriendly(p,'weak'),t=p.board.find(x=>x.iid!==s.iid);if(t)finish(s,t,'hp');return !!t;}showOptions('Consume','Choose ally to consume.',p.board.map(x=>({label:`${x.name} — Cost ${x.cost}`,value:x.iid})),sid=>{const s=p.board.find(x=>x.iid===sid);if(!s)return;showOptions('Consume','Choose survivor.',p.board.filter(x=>x.iid!==sid).map(x=>({label:x.name,value:x.iid})),tid=>{const t=p.board.find(x=>x.iid===tid);if(!t)return;showOptions('Consume','Choose stat.',[{label:'STR',value:'str'},{label:'HP',value:'hp'}],stat=>{finish(s,t,stat);render();});});});return true;}
function passPlacement(i){if(state.phase!=='placement'||state.active!==i)return;state.placementPasses++;state.log.push(`${state.players[i].name} passes Placement.`);if(state.placementPasses>=2)beginCombat();else{state.active=1-i;render();maybeAI();}}
function advancePlacement(i){state.active=1-i;render();maybeAI();}
function beginCombat(){state.phase='combat';state.active=state.initiative;state.players.forEach(p=>p.board.forEach(u=>u.acted=false));state.bloodOpeningLeft=state.flags.has('bloodMinor')?2:0;state.bloodOpeningPlayer=state.initiative;state.log.push('<strong>Combat begins.</strong>');render();maybeAI();}
function readyUnits(p){return p.board.filter(x=>!x.acted||x.extraActions>0);}
function combatAttack(a,t=null){
 if(state.phase!=='combat'||state.active!==a.owner||!state.players[a.owner].board.includes(a)||(a.acted&&a.extraActions<=0))return false;
 const p=state.players[a.owner],e=state.players[1-a.owner];if(!t&&hasTaunt(e)){toast('Taunt must be attacked.');return false;}if(t&&hasTaunt(e)&&!unitHasTaunt(t)){toast('Taunt must be attacked.');return false;}
 if(a.statuses.freeActionOnce)a.statuses.freeActionOnce=false;else if(a.acted&&a.extraActions>0)a.extraActions--;else a.acted=true;
 if(a.sigil?.sigilEffect==='fang'&&isBloodied(a)){revealSigil(a,'SIGIL');a.tempStr+=3;a.statuses.fangAfterCombat=true;}
 a.statuses.attacking=true;a.statuses.attackTarget=t;
 let atk=getStr(a)+(a.statuses.nextDamageBonus||0);a.statuses.nextDamageBonus=0;
 const targetWasDamaged=t?t.currentHp<getMaxHp(t):false;
 if(!t){dealPlayerDamage(e.index,atk,a,true);moondemonDealtDamage(a,atk,false);state.log.push(`${a.name} attacks ${e.name} for ${atk}.`);}
 else{
  const ret=getStr(t),tb=t.currentHp,ab=a.currentHp,noRet=a.id==='MON-024'&&isBloodied(a)&&t.currentHp<getMaxHp(t);
  applyDamage(t,atk,a,{combat:true,reason:'attack'});
  if(p.board.includes(a)&&!noRet)applyDamage(a,ret,t,{combat:true,reason:'retaliation'});
  if(p.board.includes(a))moondemonDealtDamage(a,Math.min(atk,Math.max(0,tb)),true);
  if(!noRet&&e.board.includes(t))moondemonDealtDamage(t,Math.min(ret,Math.max(0,ab)),true);
  if(p.board.includes(a)&&!noRet&&ret>0&&a.sigil?.sigilEffect==='reprisal'){revealSigil(a,'SIGIL');if(e.board.includes(t))applyDamage(t,2,a,{reason:'Reprisal Sigil'});}
  if(p.board.includes(a)&&a.growth?.bloomed&&a.growth.growthEffect==='predatory'&&!a.statuses.predatoryHit){a.statuses.predatoryHit=true;healUnit(a,2,'Predatory Bloom');}
  if(p.board.includes(a)&&a.statuses.bloodInWater&&targetWasDamaged){a.statuses.bloodInWater=false;drawOne(p);bottomWorst(p);}
  state.log.push(`${a.name} attacks ${t.name}: ${atk}${noRet?' / no retaliation':` / ${ret} retaliation`}.`);
  if(a.statuses.moonrage&&p.board.includes(a))applyDamage(a,1,null,{reason:'self'});
 }
 if(a.faction==='Living Geodes'&&p.board.includes(a)){a.statuses.violetShardUsed=true;if(a.id==='GEO-005')a.statuses.razorUsed=true;}
 if(a.statuses.fangAfterCombat&&p.board.includes(a)){a.statuses.fangAfterCombat=false;applyDamage(a,1,null,{reason:'Fang Sigil'});}
 delete a.statuses.attacking;delete a.statuses.attackTarget;advanceCombat(a.owner);return true;
}
function passCombat(i){const p=state.players[i],u=readyUnits(p)[0];if(u){if(u.acted&&u.extraActions>0)u.extraActions--;else u.acted=true;}advanceCombat(i);}
function advanceCombat(i){if(state.winner!==null)return;const p=state.players[i],o=state.players[1-i];if(!readyUnits(p).length&&!readyUnits(o).length)return endRound();if(state.bloodOpeningPlayer===i&&state.bloodOpeningLeft>0){state.bloodOpeningLeft--;state.active=state.bloodOpeningLeft>0&&readyUnits(p).length?i:(readyUnits(o).length?1-i:i);}else state.active=readyUnits(o).length?1-i:i;render();maybeAI();}
function endRound(){
 state.log.push(`<strong>Round ${state.round} ends.</strong>`);
 for(const p of state.players){
  if(p.faction==='Harvest')p.board.slice().forEach(u=>{if(p.board.includes(u)&&!u.nourished)applyDamage(u,1,null,{reason:'wither'});});
  for(const u of p.board.slice()){
   if(u.growth?.bloomed&&u.growth.growthEffect==='rejuvenation'&&state.round>u.growth.bloomRound&&(u.growth.turns||0)>0){
    healUnit(u,2,'Rejuvenation');u.growth.turns--;if(u.growth.turns<=0){discardAttachment(p,u.growth);u.growth=null;}
   }
  }
  if(p.faction==='Moondemons'&&p.passive==='Bloodthirst')p.board.slice().forEach(u=>{if(p.board.includes(u)&&isBloodied(u)){u.currentHp--;if(u.currentHp<=0){const n=p.board.some(x=>x.id==='MON-026')&&!p.statuses.vesperaBT?3:2;if(n===3)p.statuses.vesperaBT=true;destroyUnit(u,null,{reason:'bloodthirst'});p.board.slice().forEach(x=>addPermStats(x,n,n));}}});
  if(p.faction==='Continuum'&&p.sequenceFrozenTurns>0&&state.round>p.sequenceFreezeStartRound)p.sequenceFrozenTurns--;
 }
 const lavas=state.players.flatMap(p=>p.board.filter(x=>x.id==='GEO-003'&&x.cracked));
 lavas.forEach(l=>state.players[1-l.owner].board.slice().forEach(u=>applyDamage(u,1,l,{reason:'Lava Geode'})));
 if(state.flags.has('crystalMajor')&&state.round%2===0)polarity();
 if(state.flags.has('upperMajor'))state.players.forEach(p=>{if(p.resource>0)p.health-=Math.ceil(p.resource/2);});
 checkWinner();if(state.winner!==null)return render();state.round++;state.initiative=1-state.initiative;state.phase='mulligan';state.selected=null;beginMulligan(0);
}
function polarity(){state.log.push('<strong>Crystal Isle: Polarity Shift.</strong>');for(const p of state.players)for(const u of p.board.slice()){const s=getStr(u),hp=u.currentHp;u.baseStr=hp;u.baseHp=s;u.permStr=u.permHp=u.tempStr=u.tempHp=0;u.currentHp=s;if(u.currentHp<=0){state.polarityDeaths[u.owner]++;destroyUnit(u,null,{reason:'polarity'});}}}
function checkWinner(){if(!state)return;const a=state.players[0].health<=0,b=state.players[1].health<=0;if(a&&b)endGame('draw','Both players reached 0.');else if(a)endGame(1,'Player 1 reached 0.');else if(b)endGame(0,'Player 2 reached 0.');}
function endGame(w,why){if(state.winner!==null)return;state.winner=w;state.phase='gameover';state.log.push(`<strong>${w==='draw'?'DRAW':state.players[w].name+' WINS'}.</strong> ${why}`);render();}
function offerDeadlandsEcho(i){const p=state.players[i];if(state.graveState.length)p.statuses.echoOffer=true;}
function summonEcho(p,c){const cost=Math.max(1,Math.ceil(c.cost/2));if(p.resource<cost||p.board.length>=maxSlots(p))return;p.resource-=cost;const e=makeToken(p.index,`Echo: ${c.name}`,1,1,{id:c.id,echo:true,rules:c.rules,faction:c.faction});p.board.push(e);state.log.push(`${p.name} summons Grave Echo — ${c.name}.`);}
function maybeAI(){if(!state||state.winner!==null)return;const p=state.players[state.active];if(!p?.ai)return;setTimeout(()=>{if(!state||state.winner!==null||state.active!==p.index)return;if(state.phase==='placement')aiPlacement(p);else if(state.phase==='combat')aiCombat(p);},120);}
function aiPlacement(p){
 if(p.faction==='Harvest'&&p.passive==='Consume'&&!p.consumeUsed&&p.board.length>=2&&Math.random()<.12){if(useConsume(p,true)){state.active=1-p.index;render();maybeAI();return;}}
 if(p.faction==='Continuum'&&p.passive==='Skip Ahead'&&p.sequence>=3&&Math.random()<.35){if(useSkipAhead(p,true)){state.active=1-p.index;render();maybeAI();return;}}
 const a=p.hand.filter(c=>{
  if(effectiveCost(p,c)>p.resource)return false;
  if(c.type.includes('Creature')&&p.board.length>=maxSlots(p))return false;
  if(c.type==='Equip'&&!p.board.some(x=>!x.equip))return false;
  if(c.type==='Prism'&&!p.board.some(x=>x.faction==='Living Geodes'&&x.prisms.length<3))return false;
  if(c.type==='Sigil'&&!p.board.some(x=>x.faction==='Moondemons'&&!x.sigil))return false;
  if(c.type==='Growth'&&!p.board.some(x=>x.faction==='Harvest'&&!x.growth))return false;
  return true;
 });
 if(!a.length)return passPlacement(p.index);
 a.sort((x,y)=>{const score=c=>(c.type.includes('Creature')?10:0)+(c.type==='Prism'||c.type==='Growth'||c.type==='Sigil'||c.type==='Flux'?7:4)+(c.str||0)+(c.hp||0)*.5-c.cost*.2;return score(y)-score(x);});
 playCard(p.index,a[0].iid,{ai:true});
}
function aiCombat(p){const r=readyUnits(p).sort((a,b)=>getStr(b)-getStr(a));if(!r.length)return passCombat(p.index);const a=r[0],e=state.players[1-p.index],taunt=e.board.filter(unitHasTaunt);let t=taunt[0]||e.board.filter(x=>x.currentHp<=getStr(a)).sort((x,y)=>x.currentHp-y.currentHp)[0]||null;if(!t&&e.board.length&&Math.random()<.45)t=chooseEnemy(p.index);combatAttack(a,t);}
function realmDescription(){if(state.realm==='Crystal Isle')return 'Every 2 rounds: Polarity Shift. Five Polarity deaths loses.';if(state.realm==='Blood Moon')return 'Round 5+: destroyed creatures are banished. Initiative gets first two combat actions.';if(state.realm==='Upper Strata')return 'End round: 1 Health per 2 unspent RES. 3+ creatures redirect half direct combat damage.';if(state.realm==='Deadlands')return 'Destroyed creatures enter one shared Grave State.';return `Borrowed: ${state.borrowed.join(' + ')}.`;}
function recipeText(u){return (u.crackRecipe||[]).join(' + ').toUpperCase();}
function cardHTML(c,zone,hidden=false,hideSecrets=false){
 if(hidden)return `<div class="card-back">CARD</div>`;
 const cr=c.type.includes('Creature'),p=state.players[c.owner],sel=state.selected?.iid===c.iid?' selected':'',acted=c.acted&&c.extraActions<=0?' acted':'',legend=c.legendary?' legendary':'';
 let badges='';
 if(cr){
  badges=`<span class="badge str">STR ${getStr(c)}</span><span class="badge hp">HP ${c.currentHp}/${getMaxHp(c)}</span>`;
  if(c.shield>0)badges+=`<span class="badge shield">SHIELD ${c.shield}</span>`;
  if(c.faction==='Living Geodes'){
   badges+=c.cracked?'<span class="badge cracked">CRACKED</span>':`<span class="badge recipe">${esc(recipeText(c))}</span>`;
   if(c.prisms?.length)badges+=`<span class="badge prism">${c.prisms.map(x=>esc(x.chosenColor||'?')).join(' • ')}</span>`;
  }
  if(isBloodied(c))badges+='<span class="badge danger">BLOODIED</span>';
  if(c.sigil)badges+=`<span class="badge sigil">${hideSecrets?'SIGIL • FACE DOWN':'SIGIL • '+esc(c.sigil.name)}</span>`;
  if(c.growth)badges+=`<span class="badge growth">GROWTH • ${esc(c.growth.name)} • ${c.growth.bloomed?'BLOOM':'DORMANT'}</span>`;
  if(c.formation!=null)badges+=`<span class="badge">F${formationSize(p,c)}</span>`;
  if(c.equip)badges+=`<span class="badge">EQ ${esc(c.equip.name)}</span>`;
 }
 return `<article class="card ${CLASSES[c.faction]}${sel}${acted}${legend}" data-card="1" data-iid="${c.iid}" data-owner="${c.owner}" data-zone="${zone}"><div class="card-head"><div class="card-name">${esc(c.name)}</div><div class="card-meta"><span>${esc(c.type)}</span><span>${esc(c.id)}</span></div></div><span class="card-cost">${c.cost}</span><div class="card-body"><div class="card-rules">${esc(c.rules)}</div><div class="card-stats">${badges}</div></div>${zone==='hand'?`<span class="card-resource">+${c.resource} RES</span>`:''}</article>`;
}
function playerHTML(p){
 const visible=state.mode==='hotseat'?state.active===p.index:p.index===0,slots=[];
 for(let i=0;i<7;i++){const u=p.board[i],locked=i>=maxSlots(p);slots.push(`<div class="slot ${u?'':'empty'}" ${locked?'style="opacity:.25"':''}>${u?cardHTML(u,'board',false,!visible):''}</div>`);}
 const flux=p.fluxes?.length?`<div class="zone-label"><span>Armed FLUX</span><span>${p.fluxes.length}</span></div><div class="signature-row">${p.fluxes.map(x=>`<div class="signature-chip flux"><strong>${esc(x.name)}</strong><span>${esc((x.pattern||[]).join(' → '))}</span></div>`).join('')}</div>`:'';
 return `<section class="player-zone${state.active===p.index?' active':''}"><header class="player-header"><div class="player-id"><span class="faction-dot" style="background:${COLORS[p.faction]}"></span><div><div class="player-name">${esc(p.name)} — ${esc(p.faction)}</div><div class="player-sub">${esc(p.passive)}</div></div></div><div class="statbar"><span class="stat">♥ <b>${p.health}</b></span><span class="stat">RES <b>${p.resource}</b>/${p.resourceStart}</span>${p.faction==='Continuum'?`<span class="stat">SEQ <b>${p.sequence}</b> ${p.passive==='Loop Back'?(p.sequenceDir>0?'→':'←'):''}${p.sequenceFrozenTurns>0?' ❄':''}</span>`:''}<span class="stat">Deck <b>${p.deck.length}</b></span></div></header><div class="board-wrap"><div class="zone-label"><span>Battlefield</span><span>${p.board.length}/${maxSlots(p)}</span></div><div class="board-grid">${slots.join('')}</div>${flux}</div><div class="hand-wrap"><div class="zone-label"><span>${visible?'Hand':'Hidden Hand'}</span><span>${p.hand.length}</span></div><div class="hand">${visible?p.hand.map(c=>cardHTML(c,'hand')).join(''):`<div class="card-back">${p.hand.length} CARDS</div>`}</div></div></section>`;
}
function getSelected(){if(!state?.selected)return null;for(const p of state.players){const c=[...p.board,...p.hand].find(x=>x.iid===state.selected.iid);if(c)return c;}return null;}
function controlsHTML(){if(state.winner!==null)return `<section class="controls"><div class="action-panel"><strong>${state.winner==='draw'?'DRAW':state.players[state.winner].name+' WINS'}</strong><button class="btn primary" data-action="new">New Match</button></div></section>`;const p=state.players[state.active];let a='';if(!p.ai&&state.phase==='placement'){a+='<button class="btn" data-action="pass-placement">Pass Placement</button>';if(p.faction==='Continuum'&&p.passive==='Skip Ahead'&&p.hand.length)a+='<button class="btn good" data-action="skip">Skip Ahead</button>';if(p.faction==='Harvest'&&p.passive==='Consume'&&!p.consumeUsed&&p.board.length>=2)a+='<button class="btn good" data-action="consume">Consume</button>';if(state.realm==='The Endless'&&!p.endlessShiftUsed)a+='<button class="btn" data-action="endless">Endless Shift</button>';}if(!p.ai&&state.phase==='combat'){a+='<button class="btn" data-action="pass-combat">Burn / Pass</button>';if(state.selected?.owner===p.index)a+='<button class="btn danger" data-action="attack-player">Attack Player</button>';}const c=getSelected();return `<section class="controls"><div class="action-panel">${a||'<span class="player-sub">Choose a card or action.</span>'}</div><div class="inspector"><h3>${c?esc(c.name):'v0.8 test controls'}</h3><p>${c?esc(c.rules):'Eliteborn: tap a battlefield creature first, then play a Creature to join its Formation or an Equip to attach it. No selected creature = new Formation.'}</p>${c?.type.includes('Creature')?'<div class="referee-grid"><button class="btn small" data-ref="damage">Damage 1</button><button class="btn small" data-ref="heal">Heal 1</button><button class="btn small" data-ref="pressure">+1 Pressure</button><button class="btn small danger" data-ref="destroy">Destroy</button></div>':''}</div></section>`;}
function render(){if(!state){gameRoot.innerHTML='<div class="prototype-note">Start a match to enter REALMS.</div>';return;}gameRoot.innerHTML=`<section class="realm-banner"><div><div class="eyebrow">Round ${state.round} • ${state.players[state.initiative].name} Initiative</div><strong>${esc(state.realm)}</strong></div><div class="realm-effects">${esc(realmDescription())}</div></section>${playerHTML(state.players[1])}${playerHTML(state.players[0])}${controlsHTML()}<section class="log-panel"><div class="zone-label"><span>Match Log</span><span>${state.log.length}</span></div><div class="log">${[...state.log].reverse().map(x=>`<div class="log-line">${x}</div>`).join('')}</div></section>`;wire();}
function wire(){document.querySelectorAll('[data-card="1"]').forEach(el=>el.onclick=()=>{const p=state.players[+el.dataset.owner],c=[...p.hand,...p.board].find(x=>x.iid===el.dataset.iid);if(!c)return;if(el.dataset.zone==='hand'&&state.phase==='placement'&&state.active===p.index&&!p.ai){playCard(p.index,c.iid);return;}if(el.dataset.zone==='board'&&state.phase==='combat'&&c.owner!==state.active&&state.selected?.owner===state.active){const a=getSelected();if(a)combatAttack(a,c);return;}state.selected={iid:c.iid,owner:c.owner,zone:el.dataset.zone};render();});document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>handleAction(b.dataset.action));document.querySelectorAll('[data-ref]').forEach(b=>b.onclick=()=>handleRef(b.dataset.ref));}
function handleAction(x){const p=state.players[state.active];if(x==='new')setupModal.classList.add('open');if(x==='pass-placement')passPlacement(p.index);if(x==='pass-combat')passCombat(p.index);if(x==='attack-player'){const a=getSelected();if(a)combatAttack(a,null);}if(x==='skip')useSkipAhead(p);if(x==='consume')useConsume(p);if(x==='endless')useEndlessShift(p);}
function handleRef(x){const c=getSelected();if(!c||!c.type.includes('Creature'))return;if(x==='damage')applyDamage(c,1);if(x==='heal')healUnit(c,1,'Ref');if(x==='pressure')gainPressure(c,1,'Ref');if(x==='destroy')destroyUnit(c);render();}
function useEndlessShift(p){if(p.endlessShiftUsed||!p.hand.length)return;showOptions('The Endless','Banish one card, draw one.',p.hand.map(c=>({label:c.name,value:c.iid})),id=>{const c=p.hand.find(x=>x.iid===id);p.hand=p.hand.filter(x=>x.iid!==id);c.zone='banished';p.banished.push(c);drawOne(p);p.endlessShiftUsed=true;render();});}
function showOptions(eyebrow,title,opts,pick,{cancel=true}={}){choiceEyebrow.textContent=eyebrow;choiceTitle.textContent=title;choiceBody.innerHTML=`<div class="choice-list">${opts.map(o=>`<button class="choice-option" data-val="${esc(o.value)}">${esc(o.label)}</button>`).join('')}</div>`;choiceActions.innerHTML=cancel?'<button class="btn ghost" id="choiceCancelBtn">Cancel</button>':'';choiceModal.classList.add('open');choiceBody.querySelectorAll('[data-val]').forEach(b=>b.onclick=()=>{const v=b.dataset.val;closeChoice();pick(v);});if($('#choiceCancelBtn'))$('#choiceCancelBtn').onclick=closeChoice;}
function closeChoice(){choiceModal.classList.remove('open');choiceBody.innerHTML='';choiceActions.innerHTML='';}
function populateSetup(){const f=Object.keys(DATA.factions),a=$('#p1Faction'),b=$('#p2Faction');a.innerHTML=f.map(x=>`<option>${esc(x)}</option>`).join('');b.innerHTML=a.innerHTML;b.value='Moondemons';const fill=(fs,ps)=>{$(ps).innerHTML=Object.keys(DATA.factions[$(fs).value].passives).map(x=>`<option>${esc(x)}</option>`).join('');};a.onchange=()=>fill('#p1Faction','#p1Passive');b.onchange=()=>fill('#p2Faction','#p2Passive');fill('#p1Faction','#p1Passive');fill('#p2Faction','#p2Passive');$('#startBtn').onclick=()=>startGame({mode:$('#modeSelect').value,realm:$('#realmSelect').value,p1Faction:a.value,p1Passive:$('#p1Passive').value,p2Faction:b.value,p2Passive:$('#p2Passive').value});$('#newGameBtn').onclick=()=>setupModal.classList.add('open');$('#rulesBtn').onclick=()=>$('#rulesModal').classList.add('open');document.querySelectorAll('[data-close]').forEach(x=>x.onclick=()=>$('#'+x.dataset.close).classList.remove('open'));}


/* --- Gameplay readability pass v0.8-R1 ---
   Presentation-only layer: phase communication, action cadence, combat motion,
   retaliation visibility, trigger beats, recent actions, and Geode Pressure readability.
   Core economy and combat rules are intentionally unchanged.
*/
const READABILITY={phaseQueue:[],phaseBusy:false,beatQueue:[],beatBusy:false};

function ensureReadabilityState(){
  if(!state)return;
  if(!Array.isArray(state.uiEvents))state.uiEvents=[];
  if(typeof state.uiBusy!=='boolean')state.uiBusy=false;
}
function readablePhaseName(){
  if(!state)return '';
  if(state.phase==='mulligan')return 'HAND';
  if(state.phase==='placement')return 'PLACEMENT';
  if(state.phase==='combat')return 'ACTION';
  if(state.phase==='gameover')return 'COMPLETE';
  return String(state.phase||'').toUpperCase();
}
function readableActorLabel(){
  if(!state||state.winner!==null)return '';
  const p=state.players[state.active];
  if(!p)return '';
  if(state.phase==='combat'){
    if(state.mode==='ai')return p.index===0?'YOUR ACTION':'OPPONENT ACTION';
    return (p.name+' ACTION').toUpperCase();
  }
  if(state.phase==='placement'){
    if(state.mode==='ai')return p.index===0?'YOUR PLACEMENT':'OPPONENT PLACEMENT';
    return (p.name+' PLACEMENT').toUpperCase();
  }
  return '';
}
function pushUIEvent(kind,title,detail=''){
  ensureReadabilityState();
  if(!state)return;
  state.uiEvents.push({kind,title,detail,round:state.round});
  if(state.uiEvents.length>80)state.uiEvents.splice(0,state.uiEvents.length-80);
}
function queueBeat(title,detail='',kind='effect'){
  READABILITY.beatQueue.push({title,detail,kind});
  if(READABILITY.beatQueue.length>18)READABILITY.beatQueue.splice(0,READABILITY.beatQueue.length-18);
  if(!state?.uiBusy)pumpBeat();
}
function pumpBeat(){
  if(READABILITY.beatBusy||!READABILITY.beatQueue.length)return;
  READABILITY.beatBusy=true;
  const item=READABILITY.beatQueue.shift();
  const el=document.createElement('div');
  el.className='trigger-beat '+item.kind;
  el.innerHTML='<strong>'+esc(item.title)+'</strong>'+(item.detail?'<span>'+esc(item.detail)+'</span>':'');
  document.body.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('show'));
  setTimeout(()=>el.classList.remove('show'),560);
  setTimeout(()=>{el.remove();READABILITY.beatBusy=false;pumpBeat();},760);
}
function queuePhase(title,detail=''){
  READABILITY.phaseQueue.push({title,detail});
  pumpPhase();
}
function pumpPhase(){
  if(READABILITY.phaseBusy||!READABILITY.phaseQueue.length)return;
  READABILITY.phaseBusy=true;
  const item=READABILITY.phaseQueue.shift();
  const el=document.createElement('div');
  el.className='phase-pop';
  el.innerHTML='<div class="phase-pop-kicker">REALMS</div><strong>'+esc(item.title)+'</strong>'+(item.detail?'<span>'+esc(item.detail)+'</span>':'');
  document.body.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('show'));
  setTimeout(()=>el.classList.remove('show'),760);
  setTimeout(()=>{el.remove();READABILITY.phaseBusy=false;pumpPhase();},980);
}
function showDamageFloat(rect,text,kind){
  if(!rect)return;
  const el=document.createElement('div');
  el.className='damage-float '+(kind||'');
  el.textContent=text;
  el.style.left=(rect.left+rect.width/2)+'px';
  el.style.top=(rect.top+rect.height/2)+'px';
  document.body.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('show'));
  setTimeout(()=>el.remove(),820);
}
function showCombatSummary(attacker,target,atk,ret,noRet){
  const el=document.createElement('div');
  el.className='combat-summary';
  el.innerHTML='<div class="combat-summary-label">ACTION RESOLVES</div><strong>'+esc(attacker.name)+' → '+esc(target?target.name:'PLAYER')+'</strong><div class="combat-numbers"><span>'+atk+' DAMAGE</span>'+(target?'<span>'+esc(noRet?'NO RETALIATION':ret+' RETALIATION')+'</span>':'')+'</div>';
  document.body.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('show'));
  setTimeout(()=>el.classList.remove('show'),760);
  setTimeout(()=>el.remove(),980);
}
function makeCombatGhost(el){
  if(!el)return null;
  const rect=el.getBoundingClientRect(),clone=el.cloneNode(true);
  clone.classList.add('combat-ghost');
  clone.removeAttribute('data-card');
  clone.style.left=rect.left+'px';
  clone.style.top=rect.top+'px';
  clone.style.width=rect.width+'px';
  clone.style.height=rect.height+'px';
  document.body.appendChild(clone);
  return {node:clone,rect};
}
function combatTargetRect(owner,target){
  if(target){
    const el=document.querySelector('[data-card="1"][data-iid="'+target.iid+'"][data-zone="board"]');
    return el?el.getBoundingClientRect():null;
  }
  const zones=document.querySelectorAll('.player-zone');
  const opponent=1-owner;
  const zone=zones[opponent===1?0:1];
  const el=zone?.querySelector('.player-header')||zone;
  return el?el.getBoundingClientRect():null;
}
function finishCombatReadability(){
  if(!state)return;
  state.uiBusy=false;
  gameRoot.classList.remove('ui-busy');
  render();
  pumpBeat();
  maybeAI();
}
function animateCombatReadability(ghost,targetRect,atk,ret,target,noRet,attacker){
  showCombatSummary(attacker,target,atk,ret,noRet);
  if(!ghost||!targetRect){
    setTimeout(finishCombatReadability,850);
    return;
  }
  const ar=ghost.rect;
  const dx=(targetRect.left+targetRect.width/2)-(ar.left+ar.width/2);
  const dy=(targetRect.top+targetRect.height/2)-(ar.top+ar.height/2);
  setTimeout(()=>showDamageFloat(targetRect,'-'+atk,'damage'),250);
  if(target&&!noRet)setTimeout(()=>showDamageFloat(ar,'-'+ret,'retaliation'),330);
  let done=false;
  const finish=()=>{
    if(done)return;
    done=true;
    ghost.node.remove();
    setTimeout(finishCombatReadability,180);
  };
  if(ghost.node.animate){
    const anim=ghost.node.animate([
      {transform:'translate3d(0,0,0) scale(1)',offset:0},
      {transform:'translate3d('+(dx*.82)+'px,'+(dy*.82)+'px,0) scale(1.06)',offset:.58},
      {transform:'translate3d('+dx+'px,'+dy+'px,0) scale(.98)',offset:.72},
      {transform:'translate3d(0,0,0) scale(1)',offset:1}
    ],{duration:650,easing:'cubic-bezier(.22,.75,.26,1)'});
    anim.finished.then(finish).catch(finish);
  }else{
    ghost.node.style.transform='translate3d('+dx+'px,'+dy+'px,0)';
    setTimeout(finish,650);
  }
  setTimeout(finish,780);
}

const _readabilityCardHTML=cardHTML;
cardHTML=function(c,zone,hidden=false){
  let html=_readabilityCardHTML(c,zone,hidden);
  if(hidden||zone!=='board'||!c?.type?.includes('Creature'))return html;
  let extra='';
  if(c.faction==='Living Geodes'){
    const threshold=Math.max(1,c.cracked?(c.fold||1):(c.crack||1));
    const current=Math.min(threshold,Math.max(0,c.pressure||0));
    let pips='';
    for(let i=0;i<threshold;i++)pips+='<i class="pressure-pip'+(i<current?' filled':'')+'"></i>';
    extra+='<div class="pressure-meter '+(c.cracked?'fold-risk':'crack-build')+'"><div class="pressure-copy"><b>PRESSURE '+current+'/'+threshold+'</b><span>'+(c.cracked?'→ FOLD':'→ CRACK')+'</span></div><div class="pressure-pips">'+pips+'</div></div>';
  }
  if(c.acted&&c.extraActions<=0)extra+='<div class="acted-ribbon">ACTED</div>';
  return html.replace('</article>',extra+'</article>');
};

function enhanceReadabilityDOM(){
  if(!state)return;
  ensureReadabilityState();
  const realm=gameRoot.querySelector('.realm-banner');
  if(realm){
    const strip=document.createElement('div');
    strip.className='phase-strip readability-phase-strip';
    ['HAND','PLACEMENT','ACTION','END'].forEach(name=>{
      const span=document.createElement('span');
      span.className='pill'+(readablePhaseName()===name?' active':'');
      span.textContent=name;
      strip.appendChild(span);
    });
    realm.appendChild(strip);
  }
  const actor=readableActorLabel();
  if(actor&&state.winner===null){
    const turn=document.createElement('section');
    turn.className='turn-banner '+(state.phase==='combat'?'action':'placement');
    let sub=state.phase==='combat'?'Choose one ready creature, then choose its target. The target retaliates automatically and damage is simultaneous.':'Play one card or pass. Players alternate Placement.';
    turn.innerHTML='<strong>'+esc(actor)+'</strong><span>'+esc(sub)+'</span>';
    const realmEl=gameRoot.querySelector('.realm-banner');
    if(realmEl)realmEl.insertAdjacentElement('afterend',turn);
  }
  if(state.phase==='combat'&&state.selected?.owner===state.active){
    const attacker=getSelected();
    if(attacker&&state.players[state.active].board.includes(attacker)&&(!attacker.acted||attacker.extraActions>0)){
      const enemy=state.players[1-state.active],taunt=hasTaunt(enemy);
      document.querySelectorAll('[data-card="1"][data-owner="'+(1-state.active)+'"][data-zone="board"]').forEach(el=>{
        const u=enemy.board.find(x=>x.iid===el.dataset.iid);
        if(u&&(!taunt||unitHasTaunt(u)))el.classList.add('targetable','enemy');
      });

      const zones=gameRoot.querySelectorAll('.player-zone');
      const enemyZone=zones[enemy.index===1?0:1];
      if(enemyZone){
        const playerTarget=document.createElement('button');
        playerTarget.type='button';
        playerTarget.className='player-direct-target'+(taunt?' blocked':'');
        playerTarget.disabled=taunt;
        playerTarget.innerHTML=taunt
          ? '<strong>PLAYER BLOCKED</strong><span>Destroy or bypass Taunt first.</span>'
          : '<strong>ATTACK PLAYER</strong><span>Direct target • ♥ '+enemy.health+'</span>';
        if(!taunt){
          enemyZone.classList.add('player-targetable');
          playerTarget.addEventListener('click',ev=>{
            ev.preventDefault();
            ev.stopPropagation();
            const chosen=getSelected();
            if(chosen)combatAttack(chosen,null);
          });
        }
        const header=enemyZone.querySelector('.player-header');
        if(header)header.insertAdjacentElement('afterend',playerTarget);
        else enemyZone.prepend(playerTarget);
      }
    }
  }
  const passBtn=gameRoot.querySelector('[data-action="pass-combat"]');
  if(passBtn)passBtn.textContent='Pass Action';
  const actionPanel=gameRoot.querySelector('.action-panel');
  if(actionPanel&&state.phase==='combat'&&!state.players[state.active].ai){
    const hint=document.createElement('span');
    hint.className='action-hint';
    hint.textContent=state.selected?.owner===state.active?'Choose a highlighted enemy creature or ATTACK PLAYER. Retaliation resolves automatically against creatures.':'Choose a ready creature to act.';
    actionPanel.prepend(hint);
  }
  const logPanel=gameRoot.querySelector('.log-panel');
  if(logPanel){
    const recent=document.createElement('section');
    recent.className='recent-panel';
    const items=state.uiEvents.slice(-6).reverse();
    recent.innerHTML='<div class="zone-label"><span>Recent Action</span><span>'+state.uiEvents.length+'</span></div><div class="recent-list">'+(items.length?items.map(x=>'<div class="recent-line '+esc(x.kind)+'"><strong>'+esc(x.title)+'</strong>'+(x.detail?'<span>'+esc(x.detail)+'</span>':'')+'</div>').join(''):'<div class="player-sub">Actions will appear here as they resolve.</div>')+'</div>';
    logPanel.insertAdjacentElement('beforebegin',recent);
  }
}
const _readabilityRender=render;
render=function(){
  _readabilityRender();
  enhanceReadabilityDOM();
};

const _readabilityMaybeAI=maybeAI;
maybeAI=function(){
  if(state?.uiBusy)return;
  return _readabilityMaybeAI();
};

const _readabilityBeginMulligan=beginMulligan;
beginMulligan=function(i){
  if(state&&i===0){
    pushUIEvent('phase','HAND PHASE','Keep or return cards, then refill to five.');
    queuePhase('HAND PHASE','Keep or return cards, then refill to five.');
  }
  return _readabilityBeginMulligan(i);
};
const _readabilityFinishMulligans=finishMulligans;
finishMulligans=function(){
  const out=_readabilityFinishMulligans();
  if(state){
    pushUIEvent('phase','PLACEMENT PHASE','Players alternate one play or pass.');
    queuePhase('PLACEMENT PHASE','Players alternate one play or pass.');
    render();
  }
  return out;
};
const _readabilityBeginCombat=beginCombat;
beginCombat=function(){
  const out=_readabilityBeginCombat();
  if(state){
    pushUIEvent('phase','ACTION PHASE','Attacks alternate. Targets retaliate automatically.');
    queuePhase('ACTION PHASE','Attacks alternate. Targets retaliate automatically.');
    render();
  }
  return out;
};
const _readabilityEndRound=endRound;
endRound=function(){
  if(state){
    pushUIEvent('phase','END PHASE','Resolving end-of-round effects.');
    queuePhase('END PHASE','Resolving end-of-round effects.');
  }
  return _readabilityEndRound();
};

const _readabilityPlayCard=playCard;
playCard=function(i,iid,opts={}){
  const p=state?.players?.[i],c=p?.hand?.find(x=>x.iid===iid),name=c?.name,type=c?.type;
  const out=_readabilityPlayCard(i,iid,opts);
  if(out&&p&&c&&!p.hand.some(x=>x.iid===iid)){
    pushUIEvent('play',(p.name+' plays '+name),type||'Card');
  }
  return out;
};
const _readabilityGainPressure=gainPressure;
gainPressure=function(u,n=1,source='effect',chain=null){
  const name=u?.name,owner=u?.owner,wasOnBoard=!!(u&&state?.players?.[owner]?.board?.includes(u));
  if(state&&name&&wasOnBoard){
    pushUIEvent('pressure',name+' gains Pressure','+'+n+' • '+source);
    queueBeat('PRESSURE +'+n,name+' • '+source,'pressure');
  }
  return _readabilityGainPressure(u,n,source,chain);
};
const _readabilityCrackUnit=crackUnit;
crackUnit=function(u,source='effect'){
  const name=u?.name,was=!!u?.cracked;
  const out=_readabilityCrackUnit(u,source);
  if(state&&name&&!was&&u?.cracked){
    pushUIEvent('crack',name+' CRACKS','Transformed into its Cracked form.');
    queueBeat('CRACK!',name,'crack');
  }
  return out;
};
const _readabilityFoldUnit=foldUnit;
foldUnit=function(u){
  const name=u?.name;
  if(state&&name){
    pushUIEvent('fold',name+' FOLDS','Pressure reached its Fold threshold.');
    queueBeat('FOLD!',name,'fold');
  }
  return _readabilityFoldUnit(u);
};
const _readabilitySequenceComplete=sequenceComplete;
sequenceComplete=function(p,causer=null){
  if(state&&p){
    pushUIEvent('sequence',p.name+' completes Sequence','Sequence reached 5.');
    queueBeat('SEQUENCE COMPLETE',p.name,'sequence');
  }
  return _readabilitySequenceComplete(p,causer);
};
const _readabilityDestroyUnit=destroyUnit;
destroyUnit=function(u,source=null,opts={}){
  const p=u?state?.players?.[u.owner]:null,name=u?.name,was=!!(u&&p?.board?.includes(u));
  const out=_readabilityDestroyUnit(u,source,opts);
  if(state&&was&&name&&!p?.board?.includes(u)&&opts?.reason!=='fold'){
    pushUIEvent('death',name+' leaves play',opts?.reason||'destroyed');
  }
  return out;
};
const _readabilityCombatAttack=combatAttack;
combatAttack=function(a,t=null){
  if(!state||state.uiBusy)return false;
  const p=state.players[a?.owner],e=state.players[1-(a?.owner??0)];
  if(!a||!p?.board.includes(a))return false;
  const attackerEl=document.querySelector('[data-card="1"][data-iid="'+a.iid+'"][data-zone="board"]');
  const ghost=makeCombatGhost(attackerEl);
  const targetRect=combatTargetRect(a.owner,t);
  const atk=getStr(a)+(a.statuses.nextDamageBonus||0);
  const ret=t?getStr(t):0;
  const noRet=!!(t&&a.id==='MON-024'&&isBloodied(a)&&t.currentHp<getMaxHp(t));
  const attackerName=a.name,targetName=t?t.name:e.name;
  state.uiBusy=true;
  gameRoot.classList.add('ui-busy');
  const ok=_readabilityCombatAttack(a,t);
  if(!ok){
    state.uiBusy=false;
    gameRoot.classList.remove('ui-busy');
    ghost?.node?.remove();
    return false;
  }
  const detail=t?(atk+' damage • '+(noRet?'no retaliation':ret+' retaliation')):(atk+' direct damage');
  pushUIEvent('combat',attackerName+' → '+targetName,detail);
  animateCombatReadability(ghost,targetRect,atk,ret,t,noRet,a);
  return true;
};

window.REALMS_DEBUG={getState:()=>state,startGame,playCard,combatAttack,gainPressure,shiftSequence};populateSetup();render();
})();
