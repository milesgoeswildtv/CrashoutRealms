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
function makeInstance(def,owner){const cr=def.type.includes('Creature');return {...def,iid:`c${uid++}`,owner,zone:'deck',baseStr:cr?(def.str??0):0,baseHp:cr?(def.hp??0):0,permStr:0,permHp:0,tempStr:0,tempHp:0,currentHp:cr?(def.hp??0):0,pressure:0,cracked:false,folded:false,acted:false,extraActions:0,echo:false,token:false,statuses:{},damageTakenThisRound:0,formation:null,equip:null,nourished:true,everBloodied:false};}
function makeToken(owner,name,str,hp,extra={}){return {id:extra.id||`TOKEN-${name.toUpperCase().replace(/\W/g,'')}`,name,type:'Creature Token',cost:0,resource:0,statsText:`${str}/${hp}`,rules:extra.rules||'',faction:extra.faction||state.players[owner].faction,iid:`t${uid++}`,owner,zone:'board',baseStr:str,baseHp:hp,permStr:0,permHp:0,tempStr:0,tempHp:0,currentHp:hp,pressure:0,cracked:false,folded:false,acted:false,extraActions:0,echo:!!extra.echo,token:true,statuses:{},damageTakenThisRound:0,formation:extra.formation??null,equip:null,nourished:true,everBloodied:false,crack:extra.crack,fold:extra.fold,crackedStr:extra.crackedStr,crackedHp:extra.crackedHp};}
function buildPlayer(index,faction,passive,ai=false){return {index,name:ai?'AI':`Player ${index+1}`,ai,faction,passive,health:20,deck:shuffle(DATA.cards[faction].map(d=>makeInstance(d,index))),hand:[],board:[],traps:[],discard:[],banished:[],resource:0,resourceStart:0,pendingResource:0,sequence:0,sequenceDir:1,skipUsed:0,consumeUsed:false,passiveTriggers:0,nextFormation:1,statuses:{},effects:{},preventNextDamage:0,shatterproof:false,cascadeRemaining:0,placementPassed:false};}
function maxSlots(p){return p.faction==='Eliteborn'&&p.passive==='We Stand Together'?7:6;}
function formationMembers(p,fid){return fid==null?[]:p.board.filter(x=>x.formation===fid);}
function formationSize(p,uOrFid){const fid=typeof uOrFid==='object'?uOrFid?.formation:uOrFid;if(fid==null)return 1;const m=formationMembers(p,fid);return m.length+m.filter(x=>x.equip).length;}
function equipStats(u){return u?.equip?{str:u.equip.equipStr||0,hp:u.equip.equipHp||0}:{str:0,hp:0};}
function dynamicBonus(u){const p=state.players[u.owner];let str=0,hp=0;if(p.faction==='Continuum'&&(p.sequence===4||p.sequence===5)){if(u.id==='CON-001'){str++;hp++;}if(u.id==='CON-004'){str+=2;hp+=2;}if(u.id==='CON-009')hp+=2;if(u.id==='CON-011')str+=3;if(u.id==='CON-024'){str+=2;hp+=2;}if(u.id==='CON-026'){str+=2;hp+=2;}}
 if(p.faction==='Moondemons'&&isBloodiedRaw(u))str+=p.board.filter(x=>x.iid!==u.iid&&x.id==='MON-010'&&isBloodiedRaw(x)).length;
 if(p.faction==='Eliteborn'&&u.formation!=null){const fs=formationSize(p,u),m=formationMembers(p,u.formation);if(u.id==='ELI-001'&&fs===1)str+=2;if(u.id==='ELI-003'&&fs===2){str+=2;hp++;}if(u.id==='ELI-004'&&fs===3)str++;if(u.id==='ELI-006'&&fs===3){str++;hp++;}if(u.id==='ELI-011'&&fs>=5)str+=Math.min(4,Math.max(0,m.length-1));if(u.id==='ELI-012'&&fs===1){str+=3;hp+=3;}if(u.id==='ELI-023'&&fs===2){str+=2;hp+=2;}m.forEach(x=>{if(x.iid===u.iid)return;const xs=formationSize(p,x);if(x.id==='ELI-002'&&xs===2)hp++;if(x.id==='ELI-009'&&xs===5)str++;if(x.id==='ELI-012'&&xs===4){str++;hp++;}if(x.equip?.id==='ELI-029'&&xs>=5)hp++;});}
 return {str,hp};}
function getMaxHp(u){const e=equipStats(u),d=dynamicBonus(u);return Math.max(1,u.baseHp+u.permHp+u.tempHp+e.hp+d.hp);}
function getStr(u){const e=equipStats(u),d=dynamicBonus(u);let s=u.baseStr+u.permStr+u.tempStr+e.str+d.str;const p=state.players[u.owner];if(p.faction==='Moondemons'&&isBloodiedRaw(u)){if(u.id==='MON-001'&&u.statuses.attacking)s+=2;const t=u.statuses.attackTarget;if((u.id==='MON-005'||u.id==='MON-023')&&t&&t.currentHp<getMaxHp(t))s+=2;}if(u.id==='HAR-013'&&u.nourished)s+=2;return Math.max(0,s);}
function isBloodiedRaw(u){if(!u||u.faction!=='Moondemons')return false;const e=equipStats(u);return u.currentHp<Math.max(1,u.baseHp+u.permHp+u.tempHp+e.hp+(u.statuses.dynamicHp||0));}
function isBloodied(u){return !!u&&u.faction==='Moondemons'&&u.currentHp<getMaxHp(u);}
function syncDynamicHp(p){for(const u of [...p.board]){const next=dynamicBonus(u).hp,old=u.statuses.dynamicHp||0;if(next!==old){u.currentHp+=next-old;u.statuses.dynamicHp=next;}if(u.currentHp<=0&&p.board.includes(u))destroyUnit(u,null,{reason:'static-loss'});}}
function clampHp(u){u.currentHp=clamp(u.currentHp,0,getMaxHp(u));}
function markNourished(u){if(u?.faction==='Harvest')u.nourished=true;}
function addTempStats(u,str=0,hp=0,friendly=true){if(!u)return;u.tempStr+=str;if(hp){u.tempHp+=hp;u.currentHp+=hp;}if(friendly&&(str>0||hp>0))markNourished(u);checkFrenziedFull(u);}
function addPermStats(u,str=0,hp=0,friendly=true){if(!u)return;u.permStr+=str;if(hp){u.permHp+=hp;u.currentHp+=hp;}if(friendly&&(str>0||hp>0))markNourished(u);checkFrenziedFull(u);}
function drawOne(p){if(!p.deck.length){p.health--;state.log.push(`${p.name} fails to draw and loses 1 Health.`);checkWinner();return null;}const c=p.deck.pop();c.zone='hand';p.hand.push(c);return c;}
function drawToFive(p){while(p.hand.length<5&&state.winner===null)drawOne(p);}
function bottomWorst(p){if(!p.hand.length)return;const c=[...p.hand].sort((a,b)=>(b.cost-b.resource)-(a.cost-a.resource))[0];p.hand=p.hand.filter(x=>x.iid!==c.iid);c.zone='deck';p.deck.unshift(c);}
function healUnit(u,n,source='effect'){if(!u||n<=0||!state.players[u.owner].board.includes(u)||u.statuses.noHeal)return 0;const before=u.currentHp;u.currentHp=Math.min(getMaxHp(u),u.currentHp+n);const got=u.currentHp-before;if(got&&u.id==='MON-003'&&isBloodied(u)&&!u.statuses.leechDraw){u.statuses.leechDraw=true;drawOne(state.players[u.owner]);bottomWorst(state.players[u.owner]);}checkFrenziedFull(u);return got;}
function checkFrenziedFull(u){if(!u||!state.players[u.owner].board.includes(u))return;const p=state.players[u.owner];if(p.faction!=='Moondemons'||p.passive!=='Frenzied')return;if(isBloodied(u)){u.everBloodied=true;return;}if(u.everBloodied&&u.currentHp>=getMaxHp(u)){if(p.board.some(x=>x.id==='MON-026'&&isBloodied(x))&&!p.statuses.redlineUsed){p.statuses.redlineUsed=true;u.currentHp--;state.log.push(`Vespera's Redline keeps ${u.name} Bloodied.`);return;}state.log.push(`${u.name} healed to full after being Bloodied — Frenzied destroys it.`);destroyUnit(u,null,{reason:'frenzy-full'});}}
function unitHasTaunt(u){const p=state.players[u.owner];if(u.id==='GEO-002'&&u.cracked)return true;if(u.id==='CON-009'&&(p.sequence===4||p.sequence===5))return true;if(u.id==='ELI-004'&&formationSize(p,u)===3)return true;if(u.equip?.id==='ELI-019'&&formationSize(p,u)===2)return true;return false;}
function hasTaunt(p){return p.board.some(unitHasTaunt);}
function chooseFriendly(p,mode='grow'){if(!p.board.length)return null;const a=[...p.board];if(mode==='heal')return a.sort((x,y)=>(getMaxHp(y)-y.currentHp)-(getMaxHp(x)-x.currentHp))[0];if(mode==='weak')return a.sort((x,y)=>(getStr(x)+x.currentHp)-(getStr(y)+y.currentHp))[0];return a.sort((x,y)=>(getStr(y)+getMaxHp(y))-(getStr(x)+getMaxHp(x)))[0];}
function chooseEnemy(owner){const b=state.players[1-owner].board;return b.length?[...b].sort((x,y)=>x.currentHp-y.currentHp)[0]:null;}
function consumeTrap(p,id){const t=p.traps.find(x=>x.id===id);if(!t)return null;p.traps=p.traps.filter(x=>x.iid!==t.iid);t.zone='discard';p.discard.push(t);return t;}
function applyDamage(u,amount,source=null,{combat=false,noDisperse=false,reason='damage'}={}){if(!u||amount<=0||state.winner!==null||!state.players[u.owner].board.includes(u))return 0;const p=state.players[u.owner];amount=Math.floor(amount);if(p.preventNextDamage){const r=Math.min(p.preventNextDamage,amount);p.preventNextDamage-=r;amount-=r;}if(amount<=0)return 0;
 if(p.faction==='Eliteborn'&&u.formation!=null&&!noDisperse){const m=formationMembers(p,u.formation),fs=formationSize(p,u);const bast=m.find(x=>x.id==='ELI-005'&&formationSize(p,x)===4&&!x.statuses.bastionUsed);if(bast){bast.statuses.bastionUsed=true;amount=Math.max(0,amount-2);}const caed=m.some(x=>x.id==='ELI-026'),dis=p.passive==='We Stand Together'&&(fs>=5||(caed&&fs>=4));if(dis&&m.length>1&&amount){if(caed&&!p.statuses.caedrynDisperse){p.statuses.caedrynDisperse=true;amount=Math.max(0,amount-2);}const q=Math.floor(amount/m.length),r=amount%m.length;m.slice().forEach(x=>p.board.includes(x)&&applyDamage(x,q+(x.iid===u.iid?r:0),source,{combat,noDisperse:true,reason:'disperse'}));return amount;}}
 const before=u.currentHp;u.currentHp-=amount;const dealt=Math.min(amount,Math.max(0,before));u.damageTakenThisRound+=amount;if(u.faction==='Moondemons'&&u.currentHp<getMaxHp(u))u.everBloodied=true;if(u.faction==='Living Geodes'&&p.board.includes(u))gainPressure(u,1,'damage');if(!p.board.includes(u))return dealt;
 if(combat&&u.currentHp>0){if(u.id==='HAR-002'&&!u.statuses.briar){u.statuses.briar=true;addPermStats(u,0,1);}if(p.traps.some(t=>t.id==='HAR-010')){consumeTrap(p,'HAR-010');addPermStats(u,1,1);}if(p.traps.some(t=>t.id==='HAR-020')){consumeTrap(p,'HAR-020');addPermStats(u,0,2);}}
 if(u.currentHp<=0){if(p.shatterproof===u.iid){p.shatterproof=false;u.currentHp+=2;if(u.currentHp<=0)destroyUnit(u,source,{combat,reason});}else destroyUnit(u,source,{combat,reason});}return dealt;}
function resolveUpperStrataOvercharge(){
 if(!state?.flags?.has('upperMajor')||state.winner!==null)return [0,0];
 const losses=state.players.map(p=>{
  const loss=Math.ceil(Math.max(0,p.resource||0)/2);
  if(loss>0){
   p.health-=loss;
   state.log.push(`<strong>Upper Strata — Overcharge:</strong> ${p.name} loses ${loss} Health from ${p.resource} unspent resource${p.resource===1?'':'s'}.`);
  }
  return loss;
 });
 return losses;
}
function resolveUpperStrataChainLink(p,n,source=null){
 const incoming=Math.max(0,Math.floor(n));
 if(!incoming)return {incoming:0,playerDamage:0,redirected:0,returned:0};
 const units=[...p.board];
 const redirected=Math.floor(incoming/2);
 let playerDamage=incoming-redirected,returned=0;
 if(redirected<=0||units.length<3){
  p.health-=incoming;
  return {incoming,playerDamage:incoming,redirected:0,returned:0};
 }
 const q=Math.floor(redirected/units.length),r=redirected%units.length;
 const shares=units.map((u,index)=>({u,amount:q+(index<r?1:0)})).filter(x=>x.amount>0);
 for(const share of shares){
  const {u,amount}=share;
  // Chain Link breaks immediately below three creatures. Any already-assigned
  // redirect that can no longer resolve returns to the player; it never vanishes.
  if(p.board.length<3||!p.board.includes(u)){
   playerDamage+=amount;returned+=amount;continue;
  }
  applyDamage(u,amount,source,{combat:true,reason:'chain-link'});
 }
 p.health-=playerDamage;
 state.log.push(`<strong>Upper Strata — Chain Link:</strong> ${incoming} direct damage → ${playerDamage} to ${p.name}, ${redirected-returned} redirected${returned?` • ${returned} returned after Chain Link broke`:''}.`);
 return {incoming,playerDamage,redirected:redirected-returned,returned};
}
function dealPlayerDamage(i,n,source=null,combat=false){
 const p=state.players[i];
 if(combat&&state.flags.has('upperMinor')&&p.board.length>=3)resolveUpperStrataChainLink(p,n,source);
 else p.health-=Math.max(0,Math.floor(n));
 checkWinner();
}
function bloodMoonBanishmentActive(){return !!(state?.flags?.has('bloodMajor')&&state.round>=5);}
function destroyUnit(u,source=null,{reason='death',formationCascade=false}={}){const p=state.players[u.owner];if(!p.board.includes(u))return;const fid=u.formation;if(u.equip){u.equip.zone='discard';p.discard.push(u.equip);u.equip=null;}p.board=p.board.filter(x=>x.iid!==u.iid);const blood=bloodMoonBanishmentActive();if(u.echo||blood){u.zone='banished';p.banished.push(u);}else if(state.flags.has('deadMajor')){u.zone='graveState';state.graveState.push(u);}else{u.zone='discard';p.discard.push(u);}
 if(p.faction==='Harvest'&&p.passive==='Regurgitate'&&p.board.length){const t=[...p.board].sort((a,b)=>(getStr(b)+getMaxHp(b))-(getStr(a)+getMaxHp(a)));if(p.board.some(x=>x.id==='HAR-026')&&!p.statuses.elderRegurg&&t[1]){p.statuses.elderRegurg=true;addPermStats(t[0],1,1);addPermStats(t[1],1,1);}else addPermStats(t[0],1,1);p.passiveTriggers++;}
 if(p.faction==='Eliteborn'&&p.passive==='Rise as One. Die as One.'&&fid!=null&&!formationCascade){const others=formationMembers(p,fid).slice();if(others.length)state.log.push(`<strong>Formation ${fid} collapses.</strong>`);others.forEach(x=>destroyUnit(x,null,{reason:'formation-wipe',formationCascade:true}));}
 if(u.zone==='graveState'&&!u.echo)offerDeadlandsEcho(p.index);state.log.push(`${u.name} leaves play${reason==='fold'?' — <strong>FOLDED</strong>':''}.`);syncDynamicHp(p);}
function gainPressure(u,n=1,source='effect',chain=null){if(!u||u.faction!=='Living Geodes'||!state.players[u.owner].board.includes(u))return;const p=state.players[u.owner];for(let i=0;i<n;i++){if(!p.board.includes(u))return;u.pressure++;const wasCracked=u.cracked;if(wasCracked&&p.passive==='Fracture'){const seen=chain||new Set([u.iid]),cand=p.board.filter(x=>x.faction==='Living Geodes'&&x.iid!==u.iid&&!seen.has(x.iid));if(cand.length){const count=p.board.some(x=>x.id==='GEO-026'&&x.cracked)&&!p.statuses.aurexFracture?Math.min(2,cand.length):1;if(count===2)p.statuses.aurexFracture=true;shuffle(cand).slice(0,count).forEach(t=>{const s=new Set(seen);s.add(t.iid);gainPressure(t,1,'Fracture',s);});p.passiveTriggers++;}}
 if(!p.board.includes(u))return;if(!u.cracked&&u.pressure>=u.crack)crackUnit(u,source);else if(u.cracked&&u.pressure>=u.fold)foldUnit(u);}}
function crackUnit(u,source='effect'){if(!u||u.cracked||!state.players[u.owner].board.includes(u))return;const p=state.players[u.owner],marked=getMaxHp(u)-u.currentHp;u.cracked=true;u.pressure=0;u.baseStr=u.crackedStr??u.baseStr;u.baseHp=u.crackedHp??u.baseHp;u.currentHp=getMaxHp(u)-marked;state.log.push(`<strong>${u.name} CRACKS.</strong>`);onCrack(u);if(p.passive==='Kimberlite'){let amount=1;if(p.board.some(x=>x.id==='GEO-026'&&x.cracked)&&!p.statuses.aurexKimberlite){p.statuses.aurexKimberlite=true;amount=2;}p.board.filter(x=>x.faction==='Living Geodes'&&x.iid!==u.iid).slice().forEach(x=>gainPressure(x,amount,'Kimberlite'));p.passiveTriggers++;}if(p.board.includes(u)&&u.currentHp<=0)destroyUnit(u,null,{reason:'post-crack-lethal'});}
function foldUnit(u){if(u&&state.players[u.owner].board.includes(u))destroyUnit(u,null,{reason:'fold'});}
function forceCrack(u){if(u&&!u.cracked){u.pressure=u.crack;crackUnit(u,'forced');}}
function onCrack(u){const p=state.players[u.owner];if(u.id==='GEO-001'){const e=chooseEnemy(u.owner);if(e)applyDamage(e,2,u);}if(u.id==='GEO-004')distributeHeal(p,3);if(u.id==='GEO-006'){const e=state.players[1-u.owner].board;if(e.length)u.tempStr+=Math.min(4,Math.max(...e.map(x=>x.baseStr)));}if(u.id==='GEO-007')healUnit(u,2,'Deepcore');if(u.id==='GEO-008')u.extraActions++;if(u.id==='GEO-009')drawOne(p);if(u.id==='GEO-011'){drawOne(p);drawOne(p);bottomWorst(p);}if(u.id==='GEO-025'&&p.board.length<maxSlots(p))p.board.push(makeToken(p.index,'Shardling',0,3,{id:'GEO-T01',faction:'Living Geodes',crack:1,fold:2,crackedStr:3,crackedHp:3}));p.board.filter(x=>x.id==='GEO-026'&&x.iid!==u.iid).forEach(x=>healUnit(x,1,'Aurex'));}
function distributeHeal(p,n){let left=n;while(left--){const h=p.board.filter(x=>x.currentHp<getMaxHp(x)).sort((a,b)=>a.currentHp/getMaxHp(a)-b.currentHp/getMaxHp(b))[0];if(!h)return;healUnit(h,1,'distributed');}}
function formationJoined(p,fid){if(p.faction!=='Eliteborn'||fid==null)return;const m=formationMembers(p,fid),fs=formationSize(p,fid);if(p.passive==='Rise as One. Die as One.'&&fs>=3){let n=1;if(p.board.some(x=>x.id==='ELI-026')&&!p.statuses.caedrynRise){p.statuses.caedrynRise=true;n=2;}m.forEach(x=>addPermStats(x,n,n));p.passiveTriggers++;state.log.push(`Rise: Formation ${fid} reaches ${fs}; members gain +${n}/+${n}.`);}if(fs===3){const a=m.find(x=>x.id==='ELI-006'&&!x.statuses.formed3);if(a){a.statuses.formed3=true;drawOne(p);bottomWorst(p);}}syncDynamicHp(p);}
function ensureFormation(p,u,join=null){if(p.faction!=='Eliteborn')return;u.formation=join?.formation??p.nextFormation++;}
function attachEquip(p,c,target){if(!target||target.owner!==p.index||!p.board.includes(target)||target.equip)return false;target.equip=c;c.zone='equip';target.currentHp+=c.equipHp||0;state.log.push(`${p.name} equips <strong>${c.name}</strong> to ${target.name}.`);formationJoined(p,target.formation);return true;}
function shiftSequence(p,steps=1,{towardZero=false,causer=null}={}){if(p.faction!=='Continuum')return;for(let i=0;i<steps;i++){const old=p.sequence;if(towardZero){p.sequence=Math.max(0,p.sequence-1);}else if(p.passive==='Loop Back'){p.sequence+=p.sequenceDir;if(p.sequence>=5){p.sequence=5;p.sequenceDir=-1;}else if(p.sequence<=0){p.sequence=0;p.sequenceDir=1;}}else p.sequence=(p.sequence+1)%6;state.log.push(`${p.name} Sequence ${old} → ${p.sequence}.`);syncDynamicHp(p);if(p.sequence===5&&old!==5)sequenceComplete(p,causer);if(old===5&&p.sequence===4)p.board.filter(x=>x.id==='CON-024').forEach(x=>x.extraActions++);if(old>=4&&p.sequence>=4){p.board.filter(x=>x.id==='CON-002'&&!x.statuses.bell).forEach(x=>{x.statuses.bell=true;x.tempStr+=2;});if(p.passive==='Loop Back'&&p.sequenceDir===-1&&p.board.some(x=>x.id==='CON-026')&&!p.statuses.closedCircuit){p.statuses.closedCircuit=true;p.board.filter(x=>/High Sequence/.test(x.rules||'')).forEach(x=>addTempStats(x,1,1));}}}}
function sequenceComplete(p,causer=null){state.log.push(`<strong>${p.name} COMPLETES Sequence.</strong>`);p.board.slice().forEach(u=>{if(u.id==='CON-003')p.effects.nextDiscount=Math.max(p.effects.nextDiscount||0,2);if(u.id==='CON-005'){healUnit(u,2,'Sequence');p.health=Math.min(20,p.health+2);}if(u.id==='CON-007'){const a=p.board.find(x=>x.iid!==u.iid&&x.acted);if(a)a.extraActions++;}if(u.id==='CON-008'){u.tempStr+=3;u.extraActions++;}if(u.id==='CON-010'||u.id==='CON-023'){drawOne(p);drawOne(p);bottomWorst(p);}if(u.id==='CON-026'){drawOne(p);drawOne(p);p.effects.nextDiscount=Math.max(p.effects.nextDiscount||0,2);}});if(causer==='CON-015')p.resource+=2;if(causer==='CON-020'||causer==='CON-021')drawOne(p);if(causer==='CON-027')p.effects.tripleDiscount=3;if(p.passive==='Skip Ahead'&&p.board.some(x=>x.id==='CON-026')&&p.skipUsed>=2)drawOne(p);}
function moondemonDealtDamage(source,dealt,combat=false){if(!source||dealt<=0||source.faction!=='Moondemons'||!state.players[source.owner].board.includes(source)||!isBloodied(source))return;const p=state.players[source.owner];if(p.passive==='Frenzied'){addPermStats(source,2,2);p.passiveTriggers++;}if(source.id==='MON-004'&&combat&&!source.statuses.redjaw){source.statuses.redjaw=true;source.permHp++;}let h=2;if(source.id==='MON-026'&&!source.statuses.vesperaRedirect){const a=p.board.find(x=>x.iid!==source.iid&&isBloodied(x));if(a){source.statuses.vesperaRedirect=true;healUnit(a,2,'Vespera');h=0;}}healUnit(source,h,'Blood feed');if(source.id==='MON-007'&&combat&&isBloodied(source)&&!source.statuses.duelist){source.statuses.duelist=true;source.extraActions++;}if(source.id==='MON-002'&&p.board.includes(source))applyDamage(source,1,null,{reason:'self'});}
const ENDLESS_EFFECTS=['crystalMajor','crystalMinor','bloodMajor','bloodMinor','upperMajor','upperMinor','deadMajor','deadMinor'];
const REALM_EFFECT_NAMES={
 crystalMajor:'Crystal Polarity Shift',
 crystalMinor:'Crystal Polarity Death',
 bloodMajor:'Blood Moon Banishment',
 bloodMinor:'Blood Moon Initiative Surge',
 upperMajor:'Upper Strata Overcharge',
 upperMinor:'Upper Strata Chain Link',
 deadMajor:'Deadlands Grave State',
 deadMinor:'Deadlands Absorption'
};
function realmEffectName(code){return REALM_EFFECT_NAMES[code]||code;}
function endlessBorrowPairValid(a,b){
 if(!a||!b||a===b||!ENDLESS_EFFECTS.includes(a)||!ENDLESS_EFFECTS.includes(b))return false;
 const s=new Set([a,b]);
 if(s.has('crystalMinor')&&!s.has('crystalMajor'))return false;
 if(s.has('deadMinor')&&!s.has('deadMajor'))return false;
 return true;
}
function endlessBorrowPairs(){
 const out=[];
 for(let i=0;i<ENDLESS_EFFECTS.length;i++)for(let j=i+1;j<ENDLESS_EFFECTS.length;j++){
  const a=ENDLESS_EFFECTS[i],b=ENDLESS_EFFECTS[j];
  if(endlessBorrowPairValid(a,b))out.push([a,b]);
 }
 return out;
}
function chooseEndless(){return sample(endlessBorrowPairs());}
function realmFlags(r,b=[]){const s=new Set;if(r==='Crystal Isle'){s.add('crystalMajor');s.add('crystalMinor');}if(r==='Blood Moon'){s.add('bloodMajor');s.add('bloodMinor');}if(r==='Upper Strata'){s.add('upperMajor');s.add('upperMinor');}if(r==='Deadlands'){s.add('deadMajor');s.add('deadMinor');}if(r==='The Endless')b.forEach(x=>s.add(x));return s;}
function startGame(c){uid=1;const realm=c.realm==='Random'?sample(REALMS):c.realm,borrowed=realm==='The Endless'?chooseEndless():[];state={version:'0.8-mechanics-alpha',realm,borrowed,flags:realmFlags(realm,borrowed),mode:c.mode,round:1,phase:'mulligan',initiative:rand(2),active:0,placementPasses:0,winner:null,selected:null,graveState:[],polarityDeaths:[0,0],log:[],preparedRound:0,players:[buildPlayer(0,c.p1Faction,c.p1Passive,c.mode==='watch'),buildPlayer(1,c.p2Faction,c.p2Passive,c.mode!=='hotseat')]};setupModal.classList.remove('open');state.log.push(`${state.players[state.initiative].name} has Initiative. Realm: <strong>${realm}</strong>.`);if(realm==='The Endless')state.log.push(`The Endless borrows: <strong>${borrowed.map(realmEffectName).join(' + ')}</strong>.`);state.players.forEach(p=>{for(let i=0;i<5;i++)drawOne(p);});beginMulligan(0);}
function prepareRound(){for(const p of state.players){p.statuses={};p.effects={};p.skipUsed=0;p.consumeUsed=false;p.deadlandsAbsorbUsed=false;p.preventNextDamage=0;p.shatterproof=false;p.cascadeRemaining=0;p.board.slice().forEach(u=>{u.acted=false;u.extraActions=0;u.tempStr=0;u.tempHp=0;u.damageTakenThisRound=0;u.statuses={};if(u.faction==='Harvest')u.nourished=false;});syncDynamicHp(p);if(p.faction==='Continuum')shiftSequence(p,1);if(p.faction==='Harvest'){p.board.filter(x=>x.id==='HAR-006').forEach(o=>p.board.filter(x=>x.iid!==o.iid).slice(0,2).forEach(x=>addPermStats(x,0,1)));}if(p.faction==='Eliteborn')p.board.slice().forEach(u=>{const fs=formationSize(p,u);if((u.id==='ELI-008'&&fs===4)||(u.id==='ELI-022'&&fs===3))distributeHeal({board:formationMembers(p,u.formation)},2);});}}
function beginMulligan(i){if(state.winner!==null)return;if(i===0&&state.preparedRound!==state.round){prepareRound();state.preparedRound=state.round;}if(i>1)return finishMulligans();const p=state.players[i];state.active=i;if(p.ai){aiMulligan(p);return beginMulligan(i+1);}showMulligan(p,()=>beginMulligan(i+1));}
function aiMulligan(p){drawToFive(p);const ret=p.hand.filter(c=>c.cost>8&&c.resource===1).slice(0,2);p.hand=p.hand.filter(c=>!ret.includes(c));ret.forEach(c=>{c.zone='deck';p.deck.push(c)});p.deck=shuffle(p.deck);drawToFive(p);}
function showMulligan(p,done){choiceEyebrow.textContent=state.round===1?'Opening hand':`Round ${state.round}`;choiceTitle.textContent=`${p.name}: keep or return`;const sel=new Set;choiceBody.innerHTML=`<p class="player-sub">Return any cards, then refill to 5. Your final five generate resources.</p><div class="mulligan-grid">${p.hand.map(c=>`<button class="mulligan-card" data-iid="${c.iid}"><strong>${esc(c.name)}</strong><div class="mini">Cost ${c.cost} • +${c.resource} RES</div></button>`).join('')}</div>`;choiceActions.innerHTML='<button class="btn primary" id="keepHandBtn">Confirm Hand</button>';choiceModal.classList.add('open');choiceBody.querySelectorAll('[data-iid]').forEach(b=>b.onclick=()=>{sel.has(b.dataset.iid)?sel.delete(b.dataset.iid):sel.add(b.dataset.iid);b.classList.toggle('return');});$('#keepHandBtn').onclick=()=>{const ret=p.hand.filter(c=>sel.has(c.iid));p.hand=p.hand.filter(c=>!sel.has(c.iid));ret.forEach(c=>{c.zone='deck';p.deck.push(c)});p.deck=shuffle(p.deck);drawToFive(p);closeChoice();done();};}
function finishMulligans(){for(const p of state.players){p.resourceStart=p.hand.slice(0,5).reduce((s,c)=>s+c.resource,0);p.resource=p.resourceStart;p.placementPassed=false;}state.phase='placement';state.active=state.initiative;state.placementPasses=0;state.log.push(`<strong>Round ${state.round}</strong> begins. Resources ${state.players[0].resource}/${state.players[1].resource}.`);render();maybeAI();}
function effectiveCost(p,c,consume=false){let n=c.cost;const next=p.effects.nextDiscount||0;if(next)n-=next;if((p.effects.tripleDiscount||0)>0)n--;const conSpell=c.type==='Spell'&&(p.sequence===4||p.sequence===5)&&p.board.some(x=>x.id==='CON-025')&&!p.statuses.spellDisc;if(conSpell)n-=2;const eliteEquip=c.type==='Equip'&&p.board.some(x=>x.id==='ELI-024'&&formationSize(p,x)===4)&&!p.statuses.engDisc;if(eliteEquip)n--;if(consume){if(next)p.effects.nextDiscount=0;if((p.effects.tripleDiscount||0)>0)p.effects.tripleDiscount--;if(conSpell)p.statuses.spellDisc=true;if(eliteEquip)p.statuses.engDisc=true;}return Math.max(1,n);}
function selectedFriendly(p){return state.selected?p.board.find(x=>x.iid===state.selected.iid)||null:null;}
function selectedEnemy(p){return state.selected?state.players[1-p.index].board.find(x=>x.iid===state.selected.iid)||null:null;}
function spellTargetPlan(c,p){
 const single=new Set(['GEO-014','GEO-015','GEO-017','HAR-008','HAR-009','MON-013','MON-017']);
 if(single.has(c.id))return {kind:'single'};
 if(c.id==='GEO-013')return {kind:'multi',count:2,optionalSecond:true};
 if(c.id==='HAR-019')return {kind:'multi',count:2,optionalSecond:false};
 if(c.id==='ELI-016')return {kind:'formation'};
 if(c.id==='MON-015')return {kind:'heal3'};
 if(c.id==='ELI-017')return {kind:'reinforce'};
 return null;
}
function spellCandidates(c,p){
 if(c.id.startsWith('GEO-'))return p.board.filter(x=>x.faction==='Living Geodes');
 if(c.id.startsWith('MON-'))return p.board.filter(x=>x.faction==='Moondemons');
 return p.board.slice();
}
function requestSpellTargets(p,c,done){
 const plan=spellTargetPlan(c,p);if(!plan)return done([]);
 if(plan.kind==='single'){
  const a=spellCandidates(c,p);if(!a.length){toast('No legal target for '+c.name+'.');return false;}
  showOptions('Choose Target',c.name,a.map(x=>({label:`${x.name} — STR ${getStr(x)} • HP ${x.currentHp}/${getMaxHp(x)}`,value:x.iid})),id=>done([id]));return true;
 }
 if(plan.kind==='multi'){
  const a=spellCandidates(c,p),need=plan.optionalSecond?1:2;
  if(a.length<need){toast(c.name+(need===2?' needs two friendly creatures.':' has no legal target.'));return false;}
  showOptions('Choose First Target',c.name,a.map(x=>({label:`${x.name} — STR ${getStr(x)} • HP ${x.currentHp}/${getMaxHp(x)}`,value:x.iid})),first=>{
   const left=a.filter(x=>x.iid!==first);
   if(!left.length)return done([first]);
   const opts=left.map(x=>({label:`${x.name} — STR ${getStr(x)} • HP ${x.currentHp}/${getMaxHp(x)}`,value:x.iid}));
   if(plan.optionalSecond)opts.push({label:'Cast with one target',value:'__done__'});
   showOptions('Choose Second Target',c.name,opts,second=>done(second==='__done__'?[first]:[first,second]));
  });return true;
 }
 if(plan.kind==='formation'){
  const ids=[...new Set(p.board.map(x=>x.formation).filter(x=>x!=null))];
  if(!ids.length){toast('No Formation to target.');return false;}
  showOptions('Choose Formation',c.name,ids.map(fid=>({label:`Formation ${fid} — size ${formationSize(p,fid)}`,value:'F:'+fid})),id=>done([id]));return true;
 }
 if(plan.kind==='heal3'){
  const a=p.board.filter(x=>x.faction==='Moondemons');if(!a.length){toast('No friendly Moondemon to target.');return false;}
  const picks=[];
  const choosePoint=step=>{
   const opts=[];
   for(const x of a){
    opts.push({label:`Heal 1 → ${x.name} — HP ${x.currentHp}/${getMaxHp(x)}`,value:'H:'+x.iid});
    if(isBloodied(x))opts.push({label:`+1 MAX HP → ${x.name} — no healing`,value:'M:'+x.iid});
   }
   showOptions('Feed the Pack',`Assign point ${step} of 3`,opts,v=>{picks.push(v);if(step<3)choosePoint(step+1);else done(picks);});
  };
  choosePoint(1);return true;
 }
 if(plan.kind==='reinforce'){
  const slots=Math.min(2,maxSlots(p)-p.board.length);if(slots<=0){toast('No open creature slot for Reinforce.');return false;}
  const ids=[...new Set(p.board.map(x=>x.formation).filter(x=>x!=null))],picks=[];
  const chooseRecruit=step=>{
   const opts=ids.map(fid=>({label:`Join Formation ${fid} — size ${formationSize(p,fid)}`,value:'R:'+fid}));
   if(step===2&&picks[0]==='NEW')opts.push({label:'Join Recruit 1\'s new Formation',value:'FIRST'});
   opts.push({label:'Stand alone — new Formation (1)',value:'NEW'});
   showOptions('Reinforce',`Place Recruit ${step} of ${slots}`,opts,v=>{picks.push(v);if(step<slots)chooseRecruit(step+1);else done(picks);});
  };
  chooseRecruit(1);return true;
 }
 return done([]);
}
function playCard(i,iid,{ai=false,formationChoice=undefined,equipTargetId=null,spellTargetsReady=false}={}){if(state.phase!=='placement'||state.active!==i||state.winner!==null)return false;const p=state.players[i],c=p.hand.find(x=>x.iid===iid);if(!c)return false;const cost=effectiveCost(p,c,false);if(p.resource<cost){if(!ai)toast(`Need ${cost} resources.`);return false;}if(c.type.includes('Creature')&&p.board.length>=maxSlots(p)){if(!ai)toast('No creature slot.');return false;}
 if(c.type==='Spell'&&!ai&&!spellTargetsReady&&spellTargetPlan(c,p)){const opened=requestSpellTargets(p,c,ids=>{c.statuses.castTargets=ids;playCard(i,iid,{spellTargetsReady:true});});return opened!==false;}
 if(p.faction==='Eliteborn'&&c.type.includes('Creature')&&!ai&&formationChoice===undefined){const ids=[...new Set(p.board.map(x=>x.formation).filter(x=>x!=null))],opts=ids.map(fid=>({label:`Join Formation ${fid} — size ${formationSize(p,fid)}`,value:String(fid)}));opts.push({label:'Stand alone — start Formation (1)',value:'new'});showOptions('Eliteborn Formation',`Where does ${c.name} connect?`,opts,v=>playCard(i,iid,{formationChoice:v}));return true;}
 if(c.type==='Equip'&&!ai&&!equipTargetId){const opts=p.board.filter(x=>!x.equip).map(x=>({label:`${x.name} — Formation ${formationSize(p,x)} — ${getStr(x)}/${x.currentHp}`,value:x.iid}));if(!opts.length){toast('Every creature already has an Equip.');return false;}showOptions('Eliteborn Equip',`Attach ${c.name} to which creature?`,opts,v=>playCard(i,iid,{equipTargetId:v}));return true;}
 let target=null;if(c.type==='Equip'){target=ai?p.board.filter(x=>!x.equip).sort((a,b)=>formationSize(p,b)-formationSize(p,a)||getStr(b)-getStr(a))[0]:p.board.find(x=>x.iid===equipTargetId);if(!target||target.equip){if(!ai)toast('Each creature may have only one Equip.');return false;}}
 p.resource-=effectiveCost(p,c,true);p.hand=p.hand.filter(x=>x.iid!==iid);state.placementPasses=0;if(c.type.includes('Creature')){c.zone='board';c.baseStr=c.str??0;c.baseHp=c.hp??1;c.currentHp=c.baseHp;c.nourished=true;if(p.faction==='Eliteborn'){let join=null;if(ai)join=p.board.filter(x=>x.formation!=null).sort((a,b)=>formationSize(p,b)-formationSize(p,a))[0]||null;else if(formationChoice!=='new')join=p.board.find(x=>String(x.formation)===String(formationChoice))||null;ensureFormation(p,c,join);}p.board.push(c);state.log.push(`${p.name} plays <strong>${c.name}</strong>${c.formation!=null?` in Formation ${c.formation}`:''}.`);onPlay(c,p);if(c.formation!=null)formationJoined(p,c.formation);}else if(c.type==='Equip'){attachEquip(p,c,target);}else if(c.type==='Trap'){c.zone='trap';p.traps.push(c);state.log.push(`${p.name} sets ${c.name}.`);}else{c.zone='discard';resolveSpell(c,p);p.discard.push(c);state.log.push(`${p.name} casts <strong>${c.name}</strong>.`);}state.selected=null;checkWinner();if(state.winner===null)advancePlacement(i);return true;}
function onPlay(c,p){if(c.id==='GEO-001')applyDamage(c,1,null,{reason:'self'});if(c.id==='GEO-022'){applyDamage(c,1,null,{reason:'self'});const o=p.board.filter(x=>x.iid!==c.iid&&x.faction==='Living Geodes');if(o.length)applyDamage(sample(o),1,c);}if(c.id==='GEO-026')p.board.filter(x=>x.faction==='Living Geodes').slice().forEach(x=>applyDamage(x,1,c));if(c.id==='CON-012')shiftSequence(p,1);if(c.id==='CON-021')shiftSequence(p,1,{causer:c.id});}
function resolveSpell(c,p){
 const targetIds=c.statuses.castTargets||[];
 const chosen=targetIds.map(id=>p.board.find(x=>x.iid===id)).filter(Boolean);
 const f=chosen[0]||(p.ai?chooseFriendly(p):selectedFriendly(p));
 const e=selectedEnemy(p)||(p.ai?chooseEnemy(p.index):null);
 switch(c.id){
  case'GEO-013':{const list=chosen.length?chosen:shuffle(p.board.filter(x=>x.faction==='Living Geodes')).slice(0,2);for(const x of list){if(!p.board.includes(x))continue;const was=x.cracked;applyDamage(x,1,null,{reason:'self'});if(p.board.includes(x)&&!was&&x.cracked)addPermStats(x,1,1);}break;}
  case'GEO-014':if(f){const d=!f.cracked;applyDamage(f,1,null,{reason:'self'});if(p.board.includes(f))healUnit(f,d&&f.cracked?6:4,'Tempering');}break;
  case'GEO-015':if(f){applyDamage(f,1,null,{reason:'self'});if(p.board.includes(f))f.tempStr+=f.cracked?5:3;}break;
  case'GEO-017':if(f)p.shatterproof=f.iid;break;
  case'GEO-027':p.board.slice().forEach(x=>applyDamage(x,1,null,{reason:'self'}));break;
  case'GEO-029':p.cascadeRemaining=3;break;
  case'HAR-008':if(f){addTempStats(f,3,0);f.statuses.forcedBloom=true;}break;
  case'HAR-009':if(f){addPermStats(f,0,4);f.acted=true;}break;
  case'HAR-019':{const list=chosen.length>=2?chosen.slice(0,2):p.board.slice(0,2);list.forEach(x=>addPermStats(x,1,1));break;}
  case'CON-013':shiftSequence(p,1,{causer:c.id});if(p.sequence>=4)drawOne(p);break;
  case'CON-015':shiftSequence(p,1,{causer:c.id});break;
  case'CON-016':shiftSequence(p,1,{towardZero:true});break;
  case'CON-027':shiftSequence(p,1,{causer:c.id});break;
  case'MON-013':if(f){applyDamage(f,1,null,{reason:'self'});if(p.board.includes(f)&&isBloodied(f))f.tempStr+=3;}break;
  case'MON-015':{if(targetIds.length){for(const v of targetIds){const mode=v.slice(0,1),id=v.slice(2),u=p.board.find(x=>x.iid===id);if(!u)continue;if(mode==='H')healUnit(u,1,'Feed the Pack');else if(mode==='M'&&isBloodied(u))u.permHp+=1;}}else distributeHeal(p,3);break;}
  case'MON-017':if(f&&isBloodied(f))f.tempStr+=Math.min(4,Math.floor((getMaxHp(f)-f.currentHp)/2));break;
  case'MON-027':p.health-=2;p.resource+=3;checkWinner();break;
  case'MON-029':p.board.filter(isBloodied).forEach(x=>{x.tempStr+=2;x.statuses.moonrage=true;});break;
  case'ELI-016':{let fid=null;if(targetIds[0]?.startsWith('F:'))fid=+targetIds[0].slice(2);if(fid==null&&p.ai){const ids=[...new Set(p.board.map(x=>x.formation).filter(x=>x!=null))];fid=ids.sort((a,b)=>formationSize(p,b)-formationSize(p,a))[0];}if(fid!=null){const n=formationSize(p,fid)>=4?2:1;formationMembers(p,fid).forEach(x=>x.tempStr+=n);}break;}
  case'ELI-017':{if(targetIds.length){let firstRecruit=null;for(let j=0;j<targetIds.length&&p.board.length<maxSlots(p);j++){const pick=targetIds[j],u=makeToken(p.index,'Recruit',1,1,{faction:'Eliteborn'});let join=null;if(pick.startsWith('R:')){const fid=+pick.slice(2);join=p.board.find(x=>x.formation===fid)||null;}else if(pick==='FIRST')join=firstRecruit;ensureFormation(p,u,join);p.board.push(u);if(j===0)firstRecruit=u;formationJoined(p,u.formation);}}else for(let j=0;j<2&&p.board.length<maxSlots(p);j++){const u=makeToken(p.index,'Recruit',1,1,{faction:'Eliteborn'});ensureFormation(p,u,p.board[0]);p.board.push(u);formationJoined(p,u.formation);}break;}
  default:break;
 }
 delete c.statuses.castTargets;
}
function useSkipAhead(p,ai=false){const max=p.board.some(x=>x.id==='CON-026')?2:1;if(p.faction!=='Continuum'||p.passive!=='Skip Ahead'||p.skipUsed>=max||!p.hand.length||p.sequence===5)return false;const go=c=>{p.hand=p.hand.filter(x=>x.iid!==c.iid);c.zone='discard';p.discard.push(c);p.skipUsed++;shiftSequence(p,1);state.log.push(`${p.name} uses Skip Ahead, discarding ${c.name}.`);};if(ai){go([...p.hand].sort((a,b)=>a.cost-b.cost)[0]);return true;}showOptions('Skip Ahead','Discard one card to Shift Sequence +1.',p.hand.map(c=>({label:`${c.name} — Cost ${c.cost}`,value:c.iid})),id=>{const c=p.hand.find(x=>x.iid===id);if(c){go(c);render();}});return true;}
function useConsume(p,ai=false){if(p.faction!=='Harvest'||p.passive!=='Consume'||p.consumeUsed||p.board.length<2)return false;const finish=(s,t,stat)=>{let n=s.cost+(p.board.some(x=>x.id==='HAR-026')?2:0);n=Math.min(9,n);destroyUnit(s,null,{reason:'consume'});if(p.board.includes(t))addPermStats(t,stat==='str'?n:0,stat==='hp'?n:0);p.consumeUsed=true;state.log.push(`${p.name} Consumes ${s.name}; ${t.name} gains +${n} ${stat.toUpperCase()}.`);};if(ai){const s=chooseFriendly(p,'weak'),t=p.board.find(x=>x.iid!==s.iid);if(t)finish(s,t,'hp');return !!t;}showOptions('Consume','Choose ally to consume.',p.board.map(x=>({label:`${x.name} — Cost ${x.cost}`,value:x.iid})),sid=>{const s=p.board.find(x=>x.iid===sid);if(!s)return;showOptions('Consume','Choose survivor.',p.board.filter(x=>x.iid!==sid).map(x=>({label:x.name,value:x.iid})),tid=>{const t=p.board.find(x=>x.iid===tid);if(!t)return;showOptions('Consume','Choose stat.',[{label:'STR',value:'str'},{label:'HP',value:'hp'}],stat=>{finish(s,t,stat);render();});});});return true;}
function passPlacement(i){if(state.phase!=='placement'||state.active!==i)return;state.placementPasses++;state.log.push(`${state.players[i].name} passes Placement.`);if(state.placementPasses>=2)beginCombat();else{state.active=1-i;render();maybeAI();}}
function advancePlacement(i){state.active=1-i;render();maybeAI();}
function beginCombat(){
 state.phase='combat';
 state.players.forEach(p=>p.board.forEach(u=>u.acted=false));
 state.bloodOpeningPlayer=state.initiative;
 const opener=state.players[state.initiative],other=state.players[1-state.initiative];
 const openerReady=readyUnits(opener).length>0;
 state.bloodOpeningLeft=state.flags.has('bloodMinor')&&openerReady?2:0;
 state.active=openerReady?state.initiative:(readyUnits(other).length?1-state.initiative:state.initiative);
 state.log.push('<strong>Combat begins.</strong>');
 if(state.bloodOpeningLeft)state.log.push(`<strong>Blood Moon:</strong> ${opener.name} receives the first two Action activations while legal activations remain.`);
 render();maybeAI();
}
function readyUnits(p){return p.board.filter(x=>!x.acted||x.extraActions>0);}
function combatAttack(a,t=null){if(state.phase!=='combat'||state.active!==a.owner||!state.players[a.owner].board.includes(a)||(a.acted&&a.extraActions<=0))return false;const p=state.players[a.owner],e=state.players[1-a.owner];if(!t&&hasTaunt(e)){toast('Taunt must be attacked.');return false;}if(t&&hasTaunt(e)&&!unitHasTaunt(t)){toast('Taunt must be attacked.');return false;}if(a.acted&&a.extraActions>0)a.extraActions--;else a.acted=true;a.statuses.attacking=true;a.statuses.attackTarget=t;let atk=getStr(a)+(a.statuses.nextDamageBonus||0);a.statuses.nextDamageBonus=0;if(!t){dealPlayerDamage(e.index,atk,a,true);moondemonDealtDamage(a,atk,false);state.log.push(`${a.name} attacks ${e.name} for ${atk}.`);}else{const ret=getStr(t),tb=t.currentHp,ab=a.currentHp,noRet=a.id==='MON-024'&&isBloodied(a)&&t.currentHp<getMaxHp(t);applyDamage(t,atk,a,{combat:true});if(p.board.includes(a)&&!noRet)applyDamage(a,ret,t,{combat:true});if(p.board.includes(a))moondemonDealtDamage(a,Math.min(atk,Math.max(0,tb)),true);if(!noRet&&e.board.includes(t))moondemonDealtDamage(t,Math.min(ret,Math.max(0,ab)),true);state.log.push(`${a.name} attacks ${t.name}: ${atk}${noRet?' / no retaliation':` / ${ret} retaliation`}.`);if(a.statuses.moonrage&&p.board.includes(a))applyDamage(a,1,null,{reason:'self'});}delete a.statuses.attacking;delete a.statuses.attackTarget;advanceCombat(a.owner);return true;}
function passCombat(i){const p=state.players[i],u=readyUnits(p)[0];if(u){if(u.acted&&u.extraActions>0)u.extraActions--;else u.acted=true;}advanceCombat(i);}
function advanceCombat(i){
 if(state.winner!==null)return;
 const p=state.players[i],o=state.players[1-i];
 if(!readyUnits(p).length&&!readyUnits(o).length)return endRound();
 if(state.bloodOpeningPlayer===i&&state.bloodOpeningLeft>0){
  state.bloodOpeningLeft--;
  if(state.bloodOpeningLeft>0&&readyUnits(p).length){
   state.active=i;
  }else{
   // The Blood Moon opening privilege cannot be banked for later. If the
   // Initiative player has no legal second activation, the opening ends now.
   state.bloodOpeningLeft=0;
   state.active=readyUnits(o).length?1-i:i;
  }
 }else state.active=readyUnits(o).length?1-i:i;
 render();maybeAI();
}
function endRound(){state.log.push(`<strong>Round ${state.round} ends.</strong>`);for(const p of state.players){p.board.slice().forEach(u=>{if(u.statuses.forcedBloom&&p.board.includes(u))applyDamage(u,1,null,{reason:'self'});});if(p.faction==='Harvest')p.board.slice().forEach(u=>{if(p.board.includes(u)&&!u.nourished)applyDamage(u,1,null,{reason:'wither'});});if(p.faction==='Moondemons'&&p.passive==='Bloodthirst')p.board.slice().forEach(u=>{if(p.board.includes(u)&&isBloodied(u)){u.currentHp--;if(u.currentHp<=0){const n=p.board.some(x=>x.id==='MON-026')&&!p.statuses.vesperaBT?3:2;if(n===3)p.statuses.vesperaBT=true;destroyUnit(u,null,{reason:'bloodthirst'});p.board.slice().forEach(x=>addPermStats(x,n,n));}}});}
if(state.flags.has('crystalMajor')&&state.round%2===0)polarity();if(state.winner!==null)return render();if(state.flags.has('upperMajor'))resolveUpperStrataOvercharge();checkWinner();if(state.winner!==null)return render();state.round++;state.initiative=1-state.initiative;state.phase='mulligan';state.selected=null;beginMulligan(0);}
function checkPolarityLoss(){
 if(!state?.flags?.has('crystalMinor')||state.winner!==null)return false;
 const a=(state.polarityDeaths?.[0]||0)>=5,b=(state.polarityDeaths?.[1]||0)>=5;
 if(a&&b){endGame('draw','Both players reached 5 Polarity deaths during the same Crystal Isle resolution.');return true;}
 if(a){endGame(1,'Player 1 reached 5 Polarity deaths.');return true;}
 if(b){endGame(0,'Player 2 reached 5 Polarity deaths.');return true;}
 return false;
}
function polarity(){
 if(!state?.flags?.has('crystalMajor')||state.winner!==null)return false;
 const snaps=[];
 for(const p of state.players)for(const u of p.board.slice()){
  const oldStr=getStr(u),oldHp=u.currentHp;
  snaps.push({u,owner:u.owner,oldStr,oldHp,newStr:oldHp,newHp:oldStr});
 }
 state.log.push('<strong>Crystal Isle: Polarity Shift.</strong>');
 if(!snaps.length){
  state.log.push('Polarity finds no creatures to invert.');
  return false;
 }

 // Swap visible current STR and current HP while preserving the underlying
 // permanent, temporary, Equip, Prism and static modifier layers.
 for(const s of snaps){
  const u=s.u;
  u.currentHp=s.newHp;
  u.baseStr=s.newStr;
  u.baseHp=Math.max(1,s.newHp);
 }
 // Static bonuses can depend on other creatures. Solve the whole board
 // together before any Polarity deaths leave play.
 for(let pass=0;pass<6;pass++){
  for(const s of snaps){
   const u=s.u;
   if(!state.players[u.owner].board.includes(u))continue;
   u.baseStr+=s.newStr-getStr(u);
   if(s.newHp>0)u.baseHp+=s.newHp-getMaxHp(u);
   u.currentHp=s.newHp;
  }
 }
 const dead=[];
 for(const s of snaps){
  const u=s.u;
  if(!state.players[u.owner].board.includes(u))continue;
  u.currentHp=s.newHp;
  if(s.newHp<=0)dead.push(u);
 }
 // Deaths are resolved only after every creature has been inverted, making
 // Polarity one simultaneous Realm event rather than a sequential stat cascade.
 for(const u of dead){
  if(!state.players[u.owner].board.includes(u))continue;
  state.polarityDeaths[u.owner]=(state.polarityDeaths[u.owner]||0)+1;
  destroyUnit(u,null,{reason:'polarity'});
 }
 state.log.push(`Polarity deaths — P1 ${state.polarityDeaths[0]||0}/5 • P2 ${state.polarityDeaths[1]||0}/5.`);
 pushUIEvent?.('realm','POLARITY SHIFT',`P1 ${state.polarityDeaths[0]||0}/5 • P2 ${state.polarityDeaths[1]||0}/5`);
 queueBeat?.('POLARITY SHIFT',`Deaths: P1 ${state.polarityDeaths[0]||0}/5 • P2 ${state.polarityDeaths[1]||0}/5`,'realm');
 checkPolarityLoss();
 return true;
}
function checkWinner(){if(!state)return;const a=state.players[0].health<=0,b=state.players[1].health<=0;if(a&&b)endGame('draw','Both players reached 0.');else if(a)endGame(1,'Player 1 reached 0.');else if(b)endGame(0,'Player 2 reached 0.');}
function endGame(w,why){if(state.winner!==null)return;state.winner=w;state.phase='gameover';state.log.push(`<strong>${w==='draw'?'DRAW':state.players[w].name+' WINS'}.</strong> ${why}`);render();}
function offerDeadlandsEcho(i){
 const p=state.players[i];
 if(!p||!state.flags.has('deadMajor')||!state.graveState.length)return false;
 p.deadlandsEchoReady=true;
 state.log.push(`<strong>Deadlands:</strong> ${p.name} may raise a Grave Echo from the shared Grave State.`);
 return true;
}
function canUseDeadlandsEcho(p){
 return !!(p&&state.phase==='placement'&&state.active===p.index&&state.flags.has('deadMajor')&&p.deadlandsEchoReady&&state.graveState.length&&p.board.length<maxSlots(p));
}
function summonEcho(p,c){
 if(!p||!c||!canUseDeadlandsEcho(p)||!state.graveState.includes(c))return null;
 state.graveState=state.graveState.filter(x=>x!==c);
 const e=makeToken(p.index,`Echo: ${c.name}`,1,1,{id:c.id,echo:true,rules:c.rules,faction:c.faction});
 e.echoSourceOwner=c.owner;
 e.echoSourceIid=c.iid;
 e.echoPrintedName=c.name;
 e.echoPrintedCost=c.cost;
 if(p.faction==='Eliteborn')ensureFormation(p,e,null);
 p.board.push(e);
 if(e.formation!=null)formationJoined(p,e.formation);
 p.deadlandsEchoReady=false;
 state.log.push(`<strong>Deadlands:</strong> ${p.name} raises ${c.name} as a 1/1 Grave Echo.`);
 pushUIEvent?.('realm',p.name+' raises a Grave Echo',c.name);
 queueBeat?.('GRAVE ECHO',c.name,'realm');
 return e;
}
function useDeadlandsEcho(p,ai=false){
 if(!canUseDeadlandsEcho(p))return false;
 const finish=c=>{const e=summonEcho(p,c);if(!e)return false;state.selected=null;advancePlacement(p.index);return true;};
 if(ai){
  const c=[...state.graveState].sort((a,b)=>(b.cost||0)-(a.cost||0))[0];
  return !!c&&finish(c);
 }
 showOptions('DEADLANDS — SHARED GRAVE STATE','Raise which creature as a 1/1 Grave Echo?',state.graveState.map(c=>({label:`${c.name} • ${c.faction} • Cost ${c.cost} • original P${c.owner+1}`,value:c.iid})),iid=>{const c=state.graveState.find(x=>x.iid===iid);if(c)finish(c);});
 return true;
}
function canUseDeadlandsAbsorption(p){
 if(!p||state.phase!=='placement'||state.active!==p.index||!state.flags.has('deadMinor')||p.deadlandsAbsorbUsed)return false;
 if(!p.board.some(x=>x.echo))return false;
 return p.hand.some(c=>c.type.includes('Creature')&&c.cost<=p.resource);
}
function removeEchoForAbsorption(p,e){
 if(!p||!e||!e.echo||!p.board.includes(e))return false;
 if(e.equip){e.equip.zone='discard';p.discard.push(e.equip);e.equip=null;}
 if(Array.isArray(e.prisms))for(const a of e.prisms){const c=a.card||a;if(c){c.zone='discard';p.discard.push(c);}}
 if(e.sigil){e.sigil.zone='discard';p.discard.push(e.sigil);e.sigil=null;}
 if(e.growth?.card){e.growth.card.zone='discard';p.discard.push(e.growth.card);e.growth=null;}
 p.board=p.board.filter(x=>x.iid!==e.iid);
 e.zone='banished';p.banished.push(e);
 return true;
}
function absorbDeadlandsEcho(p,e,c){
 if(!p||!e||!c||!canUseDeadlandsAbsorption(p)||!e.echo||!p.board.includes(e)||!p.hand.includes(c)||!c.type.includes('Creature')||c.cost>p.resource)return false;
 const echoStr=getStr(e),echoHp=Math.max(0,e.currentHp),fid=e.formation;
 p.resource-=c.cost;
 p.hand=p.hand.filter(x=>x.iid!==c.iid);
 removeEchoForAbsorption(p,e);
 c.zone='board';
 c.baseStr=c.str??0;c.baseHp=c.hp??1;c.permStr=(c.permStr||0)+echoStr;c.permHp=(c.permHp||0)+echoHp;
 c.tempStr=0;c.tempHp=0;c.currentHp=c.baseHp+c.permHp;c.acted=false;c.extraActions=0;c.nourished=true;
 if(p.faction==='Eliteborn'){
  c.formation=fid??p.nextFormation++;
 }
 p.board.push(c);
 onPlay(c,p);
 if(c.formation!=null)formationJoined(p,c.formation);
 p.deadlandsAbsorbUsed=true;
 state.log.push(`<strong>Deadlands — Absorption:</strong> ${p.name} plays ${c.name} over ${e.name}; it absorbs +${echoStr} STR / +${echoHp} HP.`);
 pushUIEvent?.('realm',p.name+' uses Absorption',c.name+` gains +${echoStr}/+${echoHp}`);
 queueBeat?.('ABSORPTION',c.name,'realm');
 syncDynamicHp(p);
 return true;
}
function useDeadlandsAbsorption(p,ai=false){
 if(!canUseDeadlandsAbsorption(p))return false;
 const echoes=p.board.filter(x=>x.echo),creatures=p.hand.filter(c=>c.type.includes('Creature')&&c.cost<=p.resource);
 const finish=(e,c)=>{if(!absorbDeadlandsEcho(p,e,c))return false;state.selected=null;advancePlacement(p.index);return true;};
 if(ai){
  const e=[...echoes].sort((a,b)=>(getStr(b)+b.currentHp)-(getStr(a)+a.currentHp))[0];
  const c=[...creatures].sort((a,b)=>(b.cost-a.cost)||((b.str||0)+(b.hp||0)-(a.str||0)-(a.hp||0)))[0];
  return !!(e&&c)&&finish(e,c);
 }
 showOptions('DEADLANDS — ABSORPTION','Choose the Grave Echo to absorb.',echoes.map(e=>({label:`${e.name} • current ${getStr(e)}/${e.currentHp}`,value:e.iid})),eid=>{
  const e=p.board.find(x=>x.iid===eid&&x.echo);if(!e)return;
  showOptions('DEADLANDS — ABSORPTION','Play which creature over it at normal cost?',creatures.map(c=>({label:`${c.name} • Cost ${c.cost} • ${c.str||0}/${c.hp||0}`,value:c.iid})),cid=>{const c=p.hand.find(x=>x.iid===cid);if(c)finish(e,c);});
 });
 return true;
}
function deadlandsGraveHTML(){
 if(!state?.flags?.has('deadMajor'))return '';
 const cards=state.graveState||[];
 return `<section class="signature-zone grave-zone"><div class="zone-label"><span>SHARED GRAVE STATE</span><span>${cards.length}</span></div><div class="grave-row">${cards.length?cards.map(c=>`<div class="grave-chip"><strong>${esc(c.name)}</strong><span>${esc(c.faction)} • original P${c.owner+1}</span></div>`).join(''):'<span class="player-sub">The grave is empty.</span>'}</div></section>`;
}
function maybeAI(){if(!state||state.winner!==null)return;const p=state.players[state.active];if(!p?.ai)return;setTimeout(()=>{if(!state||state.winner!==null||state.active!==p.index)return;if(state.phase==='placement')aiPlacement(p);else if(state.phase==='combat')aiCombat(p);},120);}
function aiPlacement(p){if(p.faction==='Harvest'&&p.passive==='Consume'&&!p.consumeUsed&&p.board.length>=2&&Math.random()<.12){if(useConsume(p,true)){state.active=1-p.index;render();maybeAI();return;}}if(p.faction==='Continuum'&&p.passive==='Skip Ahead'&&p.sequence>=3&&Math.random()<.35){if(useSkipAhead(p,true)){state.active=1-p.index;render();maybeAI();return;}}const a=p.hand.filter(c=>effectiveCost(p,c)<=p.resource&&(!c.type.includes('Creature')||p.board.length<maxSlots(p))&&(c.type!=='Equip'||p.board.some(x=>!x.equip)));if(!a.length)return passPlacement(p.index);a.sort((x,y)=>(y.type.includes('Creature')?10:5)+(y.str||0)+(y.hp||0)*.5-y.cost*.2-((x.type.includes('Creature')?10:5)+(x.str||0)+(x.hp||0)*.5-x.cost*.2));playCard(p.index,a[0].iid,{ai:true});}
function aiCombat(p){const r=readyUnits(p).sort((a,b)=>getStr(b)-getStr(a));if(!r.length)return passCombat(p.index);const a=r[0],e=state.players[1-p.index],taunt=e.board.filter(unitHasTaunt);let t=taunt[0]||e.board.filter(x=>x.currentHp<=getStr(a)).sort((x,y)=>x.currentHp-y.currentHp)[0]||null;if(!t&&e.board.length&&Math.random()<.45)t=chooseEnemy(p.index);combatAttack(a,t);}
function realmDescription(){if(state.realm==='Crystal Isle')return `Every 2 rounds, Polarity swaps each creature's current STR and HP. Five Polarity deaths loses. P1 ${state.polarityDeaths?.[0]||0}/5 • P2 ${state.polarityDeaths?.[1]||0}/5.`;if(state.realm==='Blood Moon')return 'Round 5+: destroyed creatures are banished. Initiative gets first two combat actions.';if(state.realm==='Upper Strata')return 'End round: 1 Health per 2 unspent RES. 3+ creatures redirect half direct combat damage.';if(state.realm==='Deadlands')return 'Deaths enter the shared Grave State. A death grants its owner a Grave-Echo raise; Absorption may replace one Echo with a normally-paid creature once per round.';return `Borrows exactly two Realm effects: ${state.borrowed.map(realmEffectName).join(' + ')}.`;}
function cardHTML(c,zone,hidden=false){if(hidden)return `<div class="card-back">CARD</div>`;const cr=c.type.includes('Creature'),p=state.players[c.owner],sel=state.selected?.iid===c.iid?' selected':'',acted=c.acted&&c.extraActions<=0?' acted':'',legend=c.legendary?' legendary':'';const badges=cr?`<span class="badge str">STR ${getStr(c)}</span><span class="badge hp">HP ${c.currentHp}/${getMaxHp(c)}</span>${c.faction==='Living Geodes'?`<span class="badge pressure">P ${c.pressure}/${c.cracked?c.fold:c.crack}</span>${c.cracked?'<span class="badge cracked">CRACKED</span>':''}`:''}${isBloodied(c)?'<span class="badge danger">BLOODIED</span>':''}${c.formation!=null?`<span class="badge">F${formationSize(p,c)}</span>`:''}${c.equip?`<span class="badge">EQ ${esc(c.equip.name)}</span>`:''}`:'';return `<article class="card ${CLASSES[c.faction]}${sel}${acted}${legend}" data-card="1" data-iid="${c.iid}" data-owner="${c.owner}" data-zone="${zone}"><div class="card-head"><div class="card-name">${esc(c.name)}</div><div class="card-meta"><span>${esc(c.type)}</span><span>${esc(c.id)}</span></div></div><span class="card-cost">${c.cost}</span><div class="card-body"><div class="card-rules">${esc(c.rules)}</div><div class="card-stats">${badges}</div></div>${zone==='hand'?`<span class="card-resource">+${c.resource} RES</span>`:''}</article>`;}
function playerHTML(p){const visible=state.mode==='hotseat'?state.active===p.index:p.index===0,slots=[];for(let i=0;i<7;i++){const u=p.board[i],locked=i>=maxSlots(p);slots.push(`<div class="slot ${u?'':'empty'}" ${locked?'style="opacity:.25"':''}>${u?cardHTML(u,'board'):''}</div>`);}return `<section class="player-zone${state.active===p.index?' active':''}"><header class="player-header"><div class="player-id"><span class="faction-dot" style="background:${COLORS[p.faction]}"></span><div><div class="player-name">${esc(p.name)} — ${esc(p.faction)}</div><div class="player-sub">${esc(p.passive)}</div></div></div><div class="statbar"><span class="stat">♥ <b>${p.health}</b></span><span class="stat">RES <b>${p.resource}</b>/${p.resourceStart}</span>${p.faction==='Continuum'?`<span class="stat">SEQ <b>${p.sequence}</b> ${p.passive==='Loop Back'?(p.sequenceDir>0?'→':'←'):''}</span>`:''}<span class="stat">Deck <b>${p.deck.length}</b></span></div></header><div class="board-wrap"><div class="zone-label"><span>Battlefield</span><span>${p.board.length}/${maxSlots(p)}</span></div><div class="board-grid">${slots.join('')}</div><div class="zone-label"><span>Traps</span><span>${p.traps.length}</span></div><div class="trap-row">${p.traps.map(t=>`<button class="trap-chip">${visible?esc(t.name):'FACE-DOWN TRAP'}</button>`).join('')||'<span class="player-sub">No traps</span>'}</div></div><div class="hand-wrap"><div class="zone-label"><span>${visible?'Hand':'Hidden Hand'}</span><span>${p.hand.length}</span></div><div class="hand">${visible?p.hand.map(c=>cardHTML(c,'hand')).join(''):`<div class="card-back">${p.hand.length} CARDS</div>`}</div></div></section>`;}
function getSelected(){if(!state?.selected)return null;for(const p of state.players){const c=[...p.board,...p.hand].find(x=>x.iid===state.selected.iid);if(c)return c;}return null;}
function controlsHTML(){if(state.winner!==null)return `<section class="controls"><div class="action-panel"><strong>${state.winner==='draw'?'DRAW':state.players[state.winner].name+' WINS'}</strong><button class="btn primary" data-action="new">New Match</button></div></section>`;const p=state.players[state.active];let a='';if(!p.ai&&state.phase==='placement'){a+='<button class="btn" data-action="pass-placement">Pass Placement</button>';if(p.faction==='Continuum'&&p.passive==='Skip Ahead'&&p.hand.length)a+='<button class="btn good" data-action="skip">Skip Ahead</button>';if(p.faction==='Harvest'&&p.passive==='Consume'&&!p.consumeUsed&&p.board.length>=2)a+='<button class="btn good" data-action="consume">Consume</button>';if(canUseDeadlandsEcho(p))a+='<button class="btn good" data-action="grave-echo">Raise Grave Echo</button>';if(canUseDeadlandsAbsorption(p))a+='<button class="btn good" data-action="dead-absorb">Absorb Echo</button>';}if(!p.ai&&state.phase==='combat'){a+='<button class="btn" data-action="pass-combat">Burn / Pass</button>';if(state.selected?.owner===p.index)a+='<button class="btn danger" data-action="attack-player">Attack Player</button>';}const c=getSelected();return `<section class="controls"><div class="action-panel">${a||'<span class="player-sub">Choose a card or action.</span>'}</div><div class="inspector"><h3>${c?esc(c.name):'v0.8 test controls'}</h3><p>${c?esc(c.rules):'Eliteborn: tap a battlefield creature first, then play a Creature to join its Formation or an Equip to attach it. No selected creature = new Formation.'}</p>${c?.type.includes('Creature')?'<div class="referee-grid"><button class="btn small" data-ref="damage">Damage 1</button><button class="btn small" data-ref="heal">Heal 1</button><button class="btn small" data-ref="pressure">+1 Shield</button><button class="btn small danger" data-ref="destroy">Destroy</button></div>':''}</div></section>`;}
function render(){if(!state){gameRoot.innerHTML='<div class="prototype-note">Start a match to enter REALMS.</div>';return;}gameRoot.innerHTML=`<section class="realm-banner"><div><div class="eyebrow">Round ${state.round} • ${state.players[state.initiative].name} Initiative</div><strong>${esc(state.realm)}</strong></div><div class="realm-effects">${esc(realmDescription())}</div></section>${deadlandsGraveHTML()}${playerHTML(state.players[1])}${playerHTML(state.players[0])}${controlsHTML()}<section class="log-panel"><div class="zone-label"><span>Match Log</span><span>${state.log.length}</span></div><div class="log">${[...state.log].reverse().map(x=>`<div class="log-line">${x}</div>`).join('')}</div></section>`;wire();}
function wire(){document.querySelectorAll('[data-card="1"]').forEach(el=>el.onclick=()=>{const p=state.players[+el.dataset.owner],c=[...p.hand,...p.board].find(x=>x.iid===el.dataset.iid);if(!c)return;if(el.dataset.zone==='hand'&&state.phase==='placement'&&state.active===p.index&&!p.ai){playCard(p.index,c.iid);return;}if(el.dataset.zone==='board'&&state.phase==='combat'&&c.owner!==state.active&&state.selected?.owner===state.active){const a=getSelected();if(a)combatAttack(a,c);return;}state.selected={iid:c.iid,owner:c.owner,zone:el.dataset.zone};render();});document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>handleAction(b.dataset.action));document.querySelectorAll('[data-ref]').forEach(b=>b.onclick=()=>handleRef(b.dataset.ref));}
function handleAction(x){const p=state.players[state.active];if(x==='new')setupModal.classList.add('open');if(x==='pass-placement')passPlacement(p.index);if(x==='pass-combat')passCombat(p.index);if(x==='attack-player'){const a=getSelected();if(a)combatAttack(a,null);}if(x==='skip')useSkipAhead(p);if(x==='consume')useConsume(p);if(x==='grave-echo')useDeadlandsEcho(p);if(x==='dead-absorb')useDeadlandsAbsorption(p);}
function handleRef(x){const c=getSelected();if(!c||!c.type.includes('Creature'))return;if(x==='damage')applyDamage(c,1);if(x==='heal')healUnit(c,1,'Ref');if(x==='pressure')gainPressure(c,1,'Ref');if(x==='destroy')destroyUnit(c);render();}
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


/* ========================================================================
   REALMS v0.9 — SIGNATURE CARD SYSTEMS
   Clean rules/data fork over the proven v0.8 alpha runtime.
   Economy is intentionally unchanged. Pressure/Fold is retired for Geodes.
   ======================================================================== */

const V09_SIG_TYPES=new Set(['Prism','FLUX','Sigil','Growth']);

const _v09MakeInstance=makeInstance;
makeInstance=function(def,owner){
  const u=_v09MakeInstance(def,owner);
  u.shield=0; u.prisms=[]; u.sigil=null; u.growth=null;
  return u;
};
const _v09MakeToken=makeToken;
makeToken=function(owner,name,str,hp,extra={}){
  const u=_v09MakeToken(owner,name,str,hp,extra);
  u.shield=0; u.prisms=[]; u.sigil=null; u.growth=null;
  if(extra.crackRecipe)u.crackRecipe=[...extra.crackRecipe];
  return u;
};
const _v09BuildPlayer=buildPlayer;
buildPlayer=function(index,faction,passive,ai=false){
  const p=_v09BuildPlayer(index,faction,passive,ai);
  p.flux=[]; p.sequenceHistory=[]; p.sequenceCompleteRound=-1;
  p.freezeUntilRound=0; p.lingerHighUntilRound=0;
  p.prismDiscount=0;
  p.deadlandsEchoReady=false;
  p.deadlandsAbsorbUsed=false;
  return p;
};
const _v09StartGame=startGame;
startGame=function(c){
  const out=_v09StartGame(c);
  if(state)state.version='0.9-signature-systems-alpha';
  return out;
};

function addShield(u,n,source=''){
  if(!u||n<=0||!state.players[u.owner].board.includes(u))return 0;
  u.shield=(u.shield||0)+n;
  if(source)state.log.push(`${u.name} gains <strong>Shield ${n}</strong> (${source}).`);
  return n;
}
function prismMode(att){return att?.card?.prismModes?.[att.chosenColor]||null;}
function geodePrismAttachments(u){return Array.isArray(u?.prisms)?u.prisms:[];}
function recipeMissing(u){
  const req=[...(u?.crackRecipe||[])];
  if(!req.length)return 99;
  const atts=geodePrismAttachments(u);
  if(req.length===1&&req[0]==='Any')return atts.length?0:1;
  const pool=[],wild=[];
  for(const a of atts){
    const mode=prismMode(a);
    if(mode?.kind==='wildRecipe')wild.push(a);
    else (a.countsColors||[a.chosenColor]).forEach(x=>pool.push(x));
  }
  let miss=0;
  for(const color of req){
    const i=pool.indexOf(color);
    if(i>=0)pool.splice(i,1);
    else if(wild.length)wild.pop();
    else miss++;
  }
  return miss;
}
function recipeSatisfied(u){return recipeMissing(u)===0;}
function geodeRecipeText(u){
  if(u.cracked)return 'CRACKED';
  return (u.crackRecipe||[]).join(' + ')||'—';
}
function triggerPrismFollowers(p){
  for(const u of p.board){
    if(u.faction!=='Living Geodes')continue;
    for(const a of geodePrismAttachments(u)){
      const m=prismMode(a);
      if(m?.kind==='onPrismTempStats'&&!a.followUsedRound){
        a.followUsedRound=state.round;
        addTempStats(u,m.str||0,m.hp||0);
        break;
      }
    }
  }
}
function v09OnGeodeCrack(u){
  const p=state.players[u.owner];
  if(u.id==='GEO-001'){const e=chooseEnemy(u.owner);if(e)applyDamage(e,2,u);}
  if(u.id==='GEO-004')distributeHeal(p,3);
  if(u.id==='GEO-006'){const e=state.players[1-u.owner].board;if(e.length)u.tempStr+=Math.min(4,Math.max(...e.map(x=>x.baseStr)));}
  if(u.id==='GEO-007')healUnit(u,2,'Deepcore');
  if(u.id==='GEO-008')u.extraActions++;
  if(u.id==='GEO-009')drawOne(p);
  if(u.id==='GEO-011'){drawOne(p);drawOne(p);bottomWorst(p);}
  if(u.id==='GEO-022')addShield(u,2,'Faultborn Crack');
  if(u.id==='GEO-025'&&p.board.length<maxSlots(p)){
    const t=makeToken(p.index,'Shardling',0,3,{id:'GEO-T01',faction:'Living Geodes',crackRecipe:['Any'],crackedStr:3,crackedHp:3});
    p.board.push(t);
  }
  for(const a of geodePrismAttachments(u)){
    const m=prismMode(a);
    if(m?.kind==='crackHeal')healUnit(u,m.amount||0,'Prism');
    if(m?.kind==='crackCycle'){drawOne(p);bottomWorst(p);}
  }
  p.board.filter(x=>x.id==='GEO-026'&&x.iid!==u.iid).forEach(x=>healUnit(x,1,'Aurex'));
  if(p.passive==='Kimberlite'){
    const aurex=p.board.some(x=>x.id==='GEO-026'&&x.cracked);
    p.prismDiscount=Math.max(p.prismDiscount,aurex&&!p.statuses.aurexKimberlite?2:1);
    if(aurex&&!p.statuses.aurexKimberlite)p.statuses.aurexKimberlite=true;
    p.passiveTriggers++;
  }
}
crackUnit=function(u,source='Prism'){
  if(!u||u.cracked||!state.players[u.owner].board.includes(u))return false;
  const marked=getMaxHp(u)-u.currentHp;
  u.cracked=true;
  u.pressure=0;
  u.baseStr=u.crackedStr??u.baseStr;
  u.baseHp=u.crackedHp??u.baseHp;
  u.currentHp=getMaxHp(u)-marked;
  state.log.push(`<strong>${u.name} CRACKS.</strong> ${source}`);
  pushUIEvent?.('crack',u.name+' CRACKS','Prism recipe completed.');
  queueBeat?.('CRACK!',u.name,'crack');
  v09OnGeodeCrack(u);
  if(u.currentHp<=0&&state.players[u.owner].board.includes(u))destroyUnit(u,null,{reason:'post-crack-lethal'});
  return true;
};
gainPressure=function(){return 0;};
foldUnit=function(){return false;};
forceCrack=function(u){if(u&&!u.cracked)return crackUnit(u,'Forced');return false;};

function attachPrism(p,c,u,color){
  if(!u||u.faction!=='Living Geodes'||u.prisms.length>=4)return false;
  const fracture=(p.passive==='Fracture'&&!p.statuses.fractureUsed)||u.statuses.doubleNextPrism;
  const a={card:c,chosenColor:color,countsColors:fracture?[...c.colors]:[color],attachedRound:state.round};
  if(p.passive==='Fracture'&&!p.statuses.fractureUsed){
    p.statuses.fractureUsed=true;p.passiveTriggers++;
    if(p.board.some(x=>x.id==='GEO-026'&&x.cracked)&&!p.statuses.aurexFracture){
      p.statuses.aurexFracture=true;drawOne(p);bottomWorst(p);
    }
  }
  if(u.statuses.doubleNextPrism)delete u.statuses.doubleNextPrism;
  u.prisms.push(a);c.zone='prism';
  state.log.push(`${p.name} attaches <strong>${c.name}</strong> to ${u.name} as <strong>${color}</strong>.`);
  triggerPrismFollowers(p);
  const cracked=!u.cracked&&recipeSatisfied(u)?crackUnit(u,'Prism recipe'):false;
  if(fracture)a.countsColors=[a.chosenColor];
  if(!cracked&&p.traps.some(t=>t.id==='GEO-030')&&recipeMissing(u)===1){
    consumeTrap(p,'GEO-030');drawOne(p);p.prismDiscount=Math.max(p.prismDiscount,1);
    state.log.push('Perfect Alignment triggers.');
  }
  return cracked;
}
function revealSigil(u,label=''){
  if(!u?.sigil)return null;
  const c=u.sigil;u.sigil=null;
  const p=state.players[u.owner];c.zone='discard';p.discard.push(c);
  state.log.push(`<strong>${c.name}</strong> Sigil reveals${label?' — '+label:''}.`);
  queueBeat?.('SIGIL!',c.name,'effect');
  return c;
}
function activateGrowth(u){
  if(!u?.growth||u.growth.active)return false;
  u.growth.active=true;u.growth.turns=2;u.growth.activatedRound=state.round;
  state.log.push(`<strong>${u.growth.card.name}</strong> BLOOMS on ${u.name}.`);
  queueBeat?.('BLOOM!',u.growth.card.name,'effect');
  return true;
}
function discardGrowth(u){
  if(!u?.growth)return;
  const c=u.growth.card,p=state.players[u.owner];c.zone='discard';p.discard.push(c);u.growth=null;
}

const _v09DynamicBonus=dynamicBonus;
dynamicBonus=function(u){
  const p=state.players[u.owner];
  const fakeHigh=p.faction==='Continuum'&&p.lingerHighUntilRound>=state.round&&p.sequence!==4&&p.sequence!==5;
  const old=fakeHigh?p.sequence:null;if(fakeHigh)p.sequence=4;
  const r=_v09DynamicBonus(u);
  if(fakeHigh)p.sequence=old;
  if(u.faction==='Living Geodes'){
    for(const a of geodePrismAttachments(u)){
      const m=prismMode(a);if(m?.kind==='staticStr')r.str+=(m.amount||0);
    }
  }
  return r;
};
const _v09GetStr=getStr;
getStr=function(u){
  let s=_v09GetStr(u);
  if(u?.faction==='Living Geodes'&&u.statuses?.attacking){
    for(const a of geodePrismAttachments(u)){
      const m=prismMode(a);
      if(m?.kind==='firstCombatStr'&&!u.statuses.prismFirstCombatUsed)s+=m.amount||0;
      if(m?.kind==='directDamage'&&!u.statuses.attackTarget)s+=m.amount||0;
    }
  }
  if(u?.statuses?.sigilFangActive)s+=u.statuses.sigilFangActive;
  return s;
};
const _v09UnitHasTaunt=unitHasTaunt;
unitHasTaunt=function(u){
  const p=state.players[u.owner];
  const fakeHigh=p.faction==='Continuum'&&p.lingerHighUntilRound>=state.round&&p.sequence!==4&&p.sequence!==5;
  const old=fakeHigh?p.sequence:null;if(fakeHigh)p.sequence=4;
  const out=_v09UnitHasTaunt(u);
  if(fakeHigh)p.sequence=old;
  return out;
};
const _v09EffectiveCost=effectiveCost;
effectiveCost=function(p,c,consume=false){
  const fakeHigh=p.faction==='Continuum'&&p.lingerHighUntilRound>=state.round&&p.sequence!==4&&p.sequence!==5;
  const old=fakeHigh?p.sequence:null;if(fakeHigh)p.sequence=4;
  const out=_v09EffectiveCost(p,c,consume);
  if(fakeHigh)p.sequence=old;
  return out;
};

const _v09HealUnit=healUnit;
healUnit=function(u,n,source='effect'){
  if(u?.sigil?.sigilEffect==='redline'&&u.everBloodied&&u.currentHp<getMaxHp(u)&&u.currentHp+n>=getMaxHp(u)){
    revealSigil(u,'full-heal intercepted');
    const cap=Math.max(0,getMaxHp(u)-1-u.currentHp);
    const got=_v09HealUnit(u,cap,source);
    u.permStr+=1;u.permHp+=1;
    return got;
  }
  return _v09HealUnit(u,n,source);
};

const _v09ApplyDamage=applyDamage;
applyDamage=function(u,amount,source=null,opts={}){
  if(!u||amount<=0||!state.players[u.owner].board.includes(u))return 0;
  const p=state.players[u.owner],beforeBloodied=isBloodied(u);

  if(u.sigil?.sigilEffect==='ward'){
    const n=Math.max(0,Math.floor(amount));
    revealSigil(u,'damage converted to Shield');
    addShield(u,n,'Ward Sigil');
    return 0;
  }

  if(opts.combat&&u.faction==='Living Geodes'){
    for(const a of geodePrismAttachments(u)){
      const m=prismMode(a);if(m?.kind==='combatShield')addShield(u,m.amount||1,'Blue Prism');
    }
  }

  if(u.faction==='Living Geodes'&&!u.statuses.prismDamageReduced){
    let reduce=0;
    if(u.id==='GEO-022'&&u.cracked)reduce=Math.max(reduce,1);
    if(geodePrismAttachments(u).some(a=>prismMode(a)?.kind==='firstDamageReduce'))reduce=Math.max(reduce,1);
    if(reduce){amount=Math.max(0,amount-reduce);u.statuses.prismDamageReduced=true;}
  }

  if((u.shield||0)>0&&amount>0){
    const block=Math.min(u.shield,amount);u.shield-=block;amount-=block;
    if(block)state.log.push(`${u.name}'s Shield prevents ${block} damage.`);
    if(amount<=0)return 0;
  }

  const dealt=_v09ApplyDamage(u,amount,source,opts);
  const survives=state.players[u.owner].board.includes(u);

  if(survives&&u.sigil?.sigilEffect==='bloodwake'&&!beforeBloodied&&isBloodied(u)){
    revealSigil(u,'became Bloodied');u.tempStr+=3;addShield(u,2,'Bloodwake Sigil');
  }
  if(survives&&u.sigil?.sigilEffect==='reprisal'&&opts.combat&&source&&source.owner!==u.owner&&state.players[source.owner].board.includes(source)){
    revealSigil(u,'survived combat damage');applyDamage(source,2,u,{reason:'Reprisal Sigil'});
  }
  if(survives&&u.growth&&!u.growth.active&&u.growth.card.growthEffect==='thornbloom'&&opts.combat&&dealt>0)activateGrowth(u);
  if(survives&&u.growth&&!u.growth.active&&u.growth.card.growthEffect==='ironbark'&&dealt>=3)activateGrowth(u);

  if(dealt>0&&source?.growth?.active&&source.growth.card.growthEffect==='predator'&&!source.statuses.predatorGrowthUsed&&state.players[source.owner].board.includes(source)){
    source.statuses.predatorGrowthUsed=true;addPermStats(source,1,1);
  }
  return dealt;
};

const _v09DestroyUnit=destroyUnit;
destroyUnit=function(u,source=null,opts={}){
  if(!u||!state.players[u.owner].board.includes(u))return;
  const nonDamage=new Set(['consume','formation-wipe','frenzy-full','bloodthirst','polarity','static-loss','post-crack-lethal']);
  if(u.growth&&!u.growth.active&&u.growth.card.growthEffect==='rejuvenation'&&!nonDamage.has(opts.reason)){
    u.currentHp=1;activateGrowth(u);state.log.push(`${u.name} survives at 1 HP through Rejuvenation.`);return;
  }
  const p=state.players[u.owner],was=p.board.includes(u);
  _v09DestroyUnit(u,source,opts);
  if(was&&!p.board.includes(u)){
    for(const x of p.board){
      if(x.growth&&!x.growth.active&&x.growth.card.growthEffect==='carrion')activateGrowth(x);
    }
  }
};

const _v09MarkNourished=markNourished;
markNourished=function(u){
  const was=!!u?.nourished;_v09MarkNourished(u);
  if(u&&!was&&u.nourished&&u.growth&&!u.growth.active&&u.growth.card.growthEffect==='mycelium')activateGrowth(u);
};

const _v09OnPlay=onPlay;
onPlay=function(c,p){
  if(c.faction==='Living Geodes')return;
  return _v09OnPlay(c,p);
};

function fluxPatternMatched(p,c){
  const h=p.sequenceHistory||[],start=Math.max(0,c.fluxArmedAt||0),w=h.slice(start),pat=c.fluxPattern||[];
  if(w.length<pat.length)return false;
  for(let i=0;i<=w.length-pat.length;i++){
    let ok=true;for(let j=0;j<pat.length;j++)if(w[i+j]!==pat[j]){ok=false;break;}
    if(ok)return true;
  }
  return false;
}
function activateFlux(p,c){
  p.flux=p.flux.filter(x=>x.iid!==c.iid);c.zone='discard';p.discard.push(c);
  state.log.push(`<strong>FLUX — ${c.name}</strong> activates.`);
  queueBeat?.('FLUX!',c.name,'sequence');
  switch(c.fluxEffect){
    case'freezeAt4':p.freezeUntilRound=Math.max(p.freezeUntilRound,state.round+3);break;
    case'drawCycle':drawOne(p);drawOne(p);bottomWorst(p);break;
    case'battleSurge':p.board.forEach(x=>addTempStats(x,2,0));break;
    case'rewindMend':p.board.forEach(x=>healUnit(x,2,'FLUX'));break;
    case'deepCycle':drawOne(p);drawOne(p);bottomWorst(p);bottomWorst(p);break;
    case'lingerHigh':p.lingerHighUntilRound=Math.max(p.lingerHighUntilRound,state.round+1);drawOne(p);break;
  }
}
function checkFlux(p){
  for(const c of [...p.flux])if(fluxPatternMatched(p,c))activateFlux(p,c);
}
const _v09SequenceComplete=sequenceComplete;
sequenceComplete=function(p,causer=null){
  if(p.sequenceCompleteRound===state.round)return;
  p.sequenceCompleteRound=state.round;
  return _v09SequenceComplete(p,causer);
};
shiftSequence=function(p,steps=1,{towardZero=false,causer=null}={}){
  if(p.faction!=='Continuum')return;
  if(!Array.isArray(p.sequenceHistory))p.sequenceHistory=[p.sequence];
  for(let i=0;i<steps;i++){
    const old=p.sequence;
    let next=old;
    if(towardZero)next=Math.max(0,old-1);
    else if(p.passive==='Loop Back'){
      next=old+p.sequenceDir;
      if(next>=5){next=5;p.sequenceDir=-1;}
      else if(next<=0){next=0;p.sequenceDir=1;}
    }else next=(old+1)%6;

    if(p.freezeUntilRound>=state.round&&old===4&&next===5){
      state.log.push(`${p.name} Sequence is <strong>Frozen in Balance at 4</strong>.`);
      p.sequenceHistory.push(4);checkFlux(p);continue;
    }

    p.sequence=next;
    state.log.push(`${p.name} Sequence ${old} → ${p.sequence}.`);
    p.sequenceHistory.push(p.sequence);
    syncDynamicHp(p);
    if(p.sequence===5&&old!==5)sequenceComplete(p,causer);
    if(old===5&&p.sequence===4)p.board.filter(x=>x.id==='CON-024').forEach(x=>x.extraActions++);
    if(old>=4&&p.sequence>=4){
      p.board.filter(x=>x.id==='CON-002'&&!x.statuses.bell).forEach(x=>{x.statuses.bell=true;x.tempStr+=2;});
      if(p.passive==='Loop Back'&&p.sequenceDir===-1&&p.board.some(x=>x.id==='CON-026')&&!p.statuses.closedCircuit){
        p.statuses.closedCircuit=true;p.board.filter(x=>/High Sequence/.test(x.rules||'')).forEach(x=>addTempStats(x,1,1));
      }
    }
    checkFlux(p);
  }
};

prepareRound=function(){
  if(state.flags.has('bloodMajor')&&state.round>=5&&!state.bloodMoonActivated){
    state.bloodMoonActivated=true;
    state.log.push('<strong>Blood Moon rises:</strong> destroyed creatures are banished from Round 5 onward.');
    pushUIEvent?.('realm','BLOOD MOON RISES','Destroyed creatures are banished from Round 5 onward.');
    queueBeat?.('BLOOD MOON RISES','Round 5+ banishment is active.','realm');
  }
  for(const p of state.players){
    p.statuses={};p.effects={};p.skipUsed=0;p.consumeUsed=false;p.deadlandsAbsorbUsed=false;p.preventNextDamage=0;p.shatterproof=false;p.cascadeRemaining=0;
    p.board.slice().forEach(u=>{u.acted=false;u.extraActions=0;u.tempStr=0;u.tempHp=0;u.damageTakenThisRound=0;u.statuses={};if(u.faction==='Harvest')u.nourished=false;});
    syncDynamicHp(p);
    if(p.faction==='Continuum'){p.sequenceHistory=[p.sequence];p.flux.forEach(x=>x.fluxArmedAt=0);shiftSequence(p,1);}
    if(p.faction==='Harvest')p.board.filter(x=>x.id==='HAR-006').forEach(o=>p.board.filter(x=>x.iid!==o.iid).slice(0,2).forEach(x=>addPermStats(x,0,1)));
    if(p.faction==='Eliteborn')p.board.slice().forEach(u=>{const fs=formationSize(p,u);if((u.id==='ELI-008'&&fs===4)||(u.id==='ELI-022'&&fs===3))distributeHeal({board:formationMembers(p,u.formation)},2);});

    for(const u of p.board){
      if(u.faction==='Living Geodes'){
        for(const a of geodePrismAttachments(u)){const m=prismMode(a);if(m?.kind==='startHeal')healUnit(u,m.amount||0,'Prism');}
      }
      if(u.growth?.active&&state.round>u.growth.activatedRound){
        const e=u.growth.card.growthEffect;
        if(e==='rejuvenation')healUnit(u,2,'Rejuvenation');
        if(e==='thornbloom')addTempStats(u,2,0);
        if(e==='carrion')addPermStats(u,1,1);
        if(e==='mycelium')healUnit(u,1,'Mycelium');
        if(e==='ironbark')addShield(u,2,'Ironbark');
      }
    }
  }
};

const _v09BeginCombat=beginCombat;
beginCombat=function(){
  const out=_v09BeginCombat();
  for(const p of state.players)for(const u of p.board){
    if(u.faction==='Living Geodes')for(const a of geodePrismAttachments(u)){const m=prismMode(a);if(m?.kind==='actionShield')addShield(u,m.amount||1,'Blue Prism');}
  }
  render();return out;
};

const _v09EndRound=endRound;
endRound=function(){
  for(const p of state.players){
    for(const u of [...p.board]){
      if(u.faction==='Living Geodes')for(const a of geodePrismAttachments(u)){const m=prismMode(a);if(m?.kind==='endHeal')healUnit(u,m.amount||0,'Prism');}
      if(u.growth?.active){
        const e=u.growth.card.growthEffect;
        if(e==='mycelium')u.nourished=true;
        if(state.round>u.growth.activatedRound){
          if(e==='rejuvenation')healUnit(u,2,'Rejuvenation');
          if(e==='carrion')addPermStats(u,1,1);
          if(e==='mycelium')healUnit(u,1,'Mycelium');
          if(e==='ironbark')addShield(u,2,'Ironbark');
          u.growth.turns--;
          if(u.growth&&u.growth.turns<=0)discardGrowth(u);
        }
      }
    }
  }
  return _v09EndRound();
};

formationJoined=function(p,fid){
  if(p.faction!=='Eliteborn'||fid==null)return;
  const m=formationMembers(p,fid),fs=formationSize(p,fid);
  if(p.passive==='Rise as One. Die as One.'&&fs>=2){
    let n=1;if(p.board.some(x=>x.id==='ELI-026')&&!p.statuses.caedrynRise){p.statuses.caedrynRise=true;n=2;}
    m.forEach(x=>addPermStats(x,n,n));p.passiveTriggers++;state.log.push(`Rise: Formation ${fid} reaches ${fs}; members gain +${n}/+${n}.`);
  }
  if(fs===3){const a=m.find(x=>x.id==='ELI-006'&&!x.statuses.formed3);if(a){a.statuses.formed3=true;drawOne(p);bottomWorst(p);}}
  syncDynamicHp(p);
};

const _v09SpellTargetPlan=spellTargetPlan;
spellTargetPlan=function(c,p){
  if(c.id==='GEO-028'||c.id==='GEO-029')return {kind:'single'};
  return _v09SpellTargetPlan(c,p);
};
const _v09SpellCandidates=spellCandidates;
spellCandidates=function(c,p){
  if(c.id==='GEO-028')return p.board.filter(x=>x.faction==='Living Geodes'&&!x.cracked&&Array.isArray(x.prisms)&&x.prisms.length>0);
  if(c.id==='GEO-029')return p.board.filter(x=>x.faction==='Living Geodes'&&!x.cracked);
  return _v09SpellCandidates(c,p);
};
const _v09ResolveSpell=resolveSpell;
resolveSpell=function(c,p){
  if(c.id==='GEO-027'){
    const seen=p.deck.splice(Math.max(0,p.deck.length-4),4),hit=seen.find(x=>x.type==='Prism');
    if(hit){seen.splice(seen.indexOf(hit),1);hit.zone='hand';p.hand.push(hit);}
    seen.forEach(x=>{x.zone='deck';p.deck.unshift(x);});
    return;
  }
  if(c.id==='GEO-028'){
    const legal=spellCandidates(c,p),targetId=c.statuses?.castTargets?.[0];
    const u=p.ai?(legal[0]||null):(legal.find(x=>x.iid===targetId)||null);
    if(u){
      const a=u.prisms[u.prisms.length-1],other=a?.card?.colors?.find(x=>x!==a.chosenColor);
      if(other){
        a.chosenColor=other;a.countsColors=[other];
        state.log.push(`${a.card.name} refracts to ${other} on ${u.name}.`);
        if(recipeSatisfied(u))crackUnit(u,'Refract');
      }
    }
    delete c.statuses.castTargets;
    return;
  }
  if(c.id==='GEO-029'){
    const legal=spellCandidates(c,p),targetId=c.statuses?.castTargets?.[0];
    const u=p.ai?([...legal].sort((a,b)=>a.currentHp-b.currentHp)[0]||null):(legal.find(x=>x.iid===targetId)||null);
    if(u){healUnit(u,2,'Crystal Relay');u.statuses.doubleNextPrism=true;}
    delete c.statuses.castTargets;
    return;
  }
  return _v09ResolveSpell(c,p);
};

function signatureCost(p,c){
  if(c.type==='FLUX')return 0;
  let n=c.cost||3;
  if(c.type==='Prism'&&p.prismDiscount)n=Math.max(1,n-p.prismDiscount);
  return n;
}
function v09CanPlaySignature(p,c){
  if(c.type==='FLUX')return p.flux.length<2;
  if(p.resource<signatureCost(p,c))return false;
  if(c.type==='Prism')return p.board.some(x=>x.faction==='Living Geodes'&&x.prisms.length<4);
  if(c.type==='Sigil')return p.board.some(x=>x.faction==='Moondemons'&&!x.sigil);
  if(c.type==='Growth')return p.board.some(x=>x.faction==='Harvest'&&!x.growth);
  return true;
}
function finishSignaturePlay(p,c){
  p.hand=p.hand.filter(x=>x.iid!==c.iid);state.placementPasses=0;state.selected=null;checkWinner();
  if(state.winner===null)advancePlacement(p.index);
}
const _v09PlayCard=playCard;
playCard=function(i,iid,opts={}){
  if(state.phase!=='placement'||state.active!==i||state.winner!==null)return false;
  const p=state.players[i],c=p.hand.find(x=>x.iid===iid);
  if(!c||!V09_SIG_TYPES.has(c.type))return _v09PlayCard(i,iid,opts);
  if(!v09CanPlaySignature(p,c)){if(!opts.ai)toast('No legal target or signature slot.');return false;}

  if(c.type==='FLUX'){
    c.zone='flux';c.fluxArmedAt=Math.max(0,(p.sequenceHistory?.length||1)-1);p.flux.push(c);
    state.log.push(`${p.name} arms <strong>FLUX — ${c.name}</strong>.`);
    finishSignaturePlay(p,c);checkFlux(p);return true;
  }

  if(c.type==='Prism'){
    let u=opts.v09TargetId?p.board.find(x=>x.iid===opts.v09TargetId):null,color=opts.v09Color;
    if(opts.ai){u=u||p.board.filter(x=>x.faction==='Living Geodes'&&x.prisms.length<4).sort((a,b)=>recipeMissing(a)-recipeMissing(b))[0];color=color||c.colors.find(x=>(u.crackRecipe||[]).includes(x))||c.colors[0];}
    if(!opts.ai&&!u){
      showOptions('Choose Geode',c.name,p.board.filter(x=>x.faction==='Living Geodes'&&x.prisms.length<4).map(x=>({label:`${x.name} — needs ${geodeRecipeText(x)}`,value:x.iid})),id=>playCard(i,iid,{v09TargetId:id}));
      return true;
    }
    if(!opts.ai&&!color){
      showOptions('Choose Prism Color',c.name,c.colors.map(x=>({label:`${x} — ${c.prismText[x]}`,value:x})),x=>playCard(i,iid,{v09TargetId:u.iid,v09Color:x}));
      return true;
    }
    const cost=signatureCost(p,c);if(p.resource<cost){if(!opts.ai)toast(`Need ${cost} resources.`);return false;}
    p.resource-=cost;p.prismDiscount=0;p.hand=p.hand.filter(x=>x.iid!==c.iid);
    attachPrism(p,c,u,color);state.placementPasses=0;state.selected=null;checkWinner();if(state.winner===null)advancePlacement(i);return true;
  }

  if(c.type==='Sigil'){
    let u=opts.v09TargetId?p.board.find(x=>x.iid===opts.v09TargetId):null;
    if(opts.ai)u=u||p.board.filter(x=>x.faction==='Moondemons'&&!x.sigil).sort((a,b)=>getStr(b)-getStr(a))[0];
    if(!opts.ai&&!u){showOptions('Choose Sigil Ally',c.name,p.board.filter(x=>x.faction==='Moondemons'&&!x.sigil).map(x=>({label:`${x.name} — HP ${x.currentHp}/${getMaxHp(x)}`,value:x.iid})),id=>playCard(i,iid,{v09TargetId:id}));return true;}
    const cost=signatureCost(p,c);p.resource-=cost;p.hand=p.hand.filter(x=>x.iid!==c.iid);c.zone='sigil';u.sigil=c;
    state.log.push(`${p.name} places a face-down Sigil on ${u.name}.`);state.placementPasses=0;state.selected=null;advancePlacement(i);return true;
  }

  if(c.type==='Growth'){
    let u=opts.v09TargetId?p.board.find(x=>x.iid===opts.v09TargetId):null;
    if(opts.ai)u=u||p.board.filter(x=>x.faction==='Harvest'&&!x.growth).sort((a,b)=>getStr(b)+getMaxHp(b)-getStr(a)-getMaxHp(a))[0];
    if(!opts.ai&&!u){showOptions('Choose Growth Ally',c.name,p.board.filter(x=>x.faction==='Harvest'&&!x.growth).map(x=>({label:`${x.name} — HP ${x.currentHp}/${getMaxHp(x)}`,value:x.iid})),id=>playCard(i,iid,{v09TargetId:id}));return true;}
    const cost=signatureCost(p,c);p.resource-=cost;p.hand=p.hand.filter(x=>x.iid!==c.iid);c.zone='growth';u.growth={card:c,active:false,turns:0,activatedRound:null};
    state.log.push(`${p.name} plants <strong>${c.name}</strong> on ${u.name}.`);state.placementPasses=0;state.selected=null;advancePlacement(i);return true;
  }
  return false;
};

aiPlacement=function(p){
  if(canUseDeadlandsEcho(p)){if(useDeadlandsEcho(p,true)){render();maybeAI();return;}}
  if(canUseDeadlandsAbsorption(p)){if(useDeadlandsAbsorption(p,true)){render();maybeAI();return;}}
  if(p.faction==='Harvest'&&p.passive==='Consume'&&!p.consumeUsed&&p.board.length>=2&&Math.random()<.12){if(useConsume(p,true)){state.active=1-p.index;render();maybeAI();return;}}
  if(p.faction==='Continuum'&&p.passive==='Skip Ahead'&&p.sequence>=3&&Math.random()<.35){if(useSkipAhead(p,true)){state.active=1-p.index;render();maybeAI();return;}}
  const a=p.hand.filter(c=>{
    if(V09_SIG_TYPES.has(c.type))return v09CanPlaySignature(p,c);
    return effectiveCost(p,c)<=p.resource&&(!c.type.includes('Creature')||p.board.length<maxSlots(p))&&(c.type!=='Equip'||p.board.some(x=>!x.equip));
  });
  if(!a.length)return passPlacement(p.index);
  a.sort((x,y)=>{
    const score=z=>(z.type.includes('Creature')?10:V09_SIG_TYPES.has(z.type)?8:5)+(z.str||0)+(z.hp||0)*.5-z.cost*.2;
    return score(y)-score(x);
  });
  playCard(p.index,a[0].iid,{ai:true});
};

const _v09CombatAttack=combatAttack;
combatAttack=function(a,t=null){
  if(!a)return false;
  const defender=t,stateBeforeTarget=t?state.players[t.owner].board.includes(t):false;
  if(t&&t.faction==='Living Geodes'&&!t.cracked&&t.prisms?.length&&state.players[t.owner].traps.some(x=>x.id==='GEO-019')){
    consumeTrap(state.players[t.owner],'GEO-019');addShield(t,2,'Refraction Screen');
  }
  if(a.sigil?.sigilEffect==='fang'&&isBloodied(a)){revealSigil(a,'attacks while Bloodied');a.statuses.sigilFangActive=3;}
  const out=_v09CombatAttack(a,t);
  delete a.statuses.sigilFangActive;
  if(a.faction==='Living Geodes')a.statuses.prismFirstCombatUsed=true;

  if(out&&t&&defender&&!state.players[t.owner].board.includes(t)){
    if(a.sigil?.sigilEffect==='feast'){revealSigil(a,'destroyed an enemy');healUnit(a,3,'Feast Sigil');drawOne(state.players[a.owner]);bottomWorst(state.players[a.owner]);}
    if(a.growth&&!a.growth.active&&a.growth.card.growthEffect==='predator')activateGrowth(a);
  }
  if(out&&!t&&a.growth?.active&&a.growth.card.growthEffect==='predator'&&!a.statuses.predatorGrowthUsed){
    a.statuses.predatorGrowthUsed=true;addPermStats(a,1,1);
  }
  if(out&&a.id==='GEO-003'&&a.cracked&&t&&state.players[t.owner].board.includes(t))applyDamage(t,1,a,{reason:'Lava Geode'});
  return out;
};

const _v09CardHTML=cardHTML;
cardHTML=function(c,zone,hidden=false){
  let html=_v09CardHTML(c,zone,hidden);
  if(hidden)return html;
  html=html.replace(/<div class="pressure-meter [^"]*"><div class="pressure-copy">[\s\S]*?<\/div><div class="pressure-pips">[\s\S]*?<\/div><\/div>/g,'');
  if(zone==='board'&&c.type.includes('Creature')){
    let extra='';
    if((c.shield||0)>0)extra+=`<span class="badge shield">SHIELD ${c.shield}</span>`;
    if(c.faction==='Living Geodes'){
      const cols=(c.prisms||[]).map(a=>a.chosenColor[0]).join(' • ')||'none';
      extra+=`<div class="prism-recipe ${c.cracked?'done':''}"><b>${c.cracked?'CRACKED':'CRACK '+esc(geodeRecipeText(c))}</b><span>Prisms: ${esc(cols)} • ${c.prisms.length}/4</span></div>`;
    }
    if(c.sigil)extra+='<span class="badge sigil-set">SIGIL SET</span>';
    if(c.growth)extra+=`<span class="badge growth-set">${c.growth.active?'BLOOMING':'GROWTH'} • ${esc(c.growth.card.name)}</span>`;
    html=html.replace('</article>',extra+'</article>');
  }
  return html;
};

const _v09PlayerHTML=playerHTML;
playerHTML=function(p){
  let html=_v09PlayerHTML(p);
  if(p.faction==='Continuum'){
    const row=`<div class="signature-zone"><div class="zone-label"><span>FLUX ZONE</span><span>${p.flux.length}/2</span></div><div class="flux-row">${p.flux.map(c=>`<div class="flux-chip"><strong>${esc(c.name)}</strong><span>${esc((c.fluxPattern||[]).join(' → '))}</span></div>`).join('')||'<span class="player-sub">No FLUX armed</span>'}</div></div>`;
    html=html.replace('<div class="hand-wrap">',row+'<div class="hand-wrap">');
  }
  return html;
};

const _v09HandleRef=handleRef;
handleRef=function(x){
  if(x==='pressure'){
    const c=getSelected();if(c&&c.type.includes('Creature')){addShield(c,1,'Referee');render();}return;
  }
  return _v09HandleRef(x);
};


window.REALMS_DEBUG={getState:()=>state,startGame,playCard,combatAttack,gainPressure,shiftSequence,addShield,recipeMissing,checkFlux,polarity,checkPolarityLoss,resolveUpperStrataOvercharge,resolveUpperStrataChainLink,bloodMoonBanishmentActive,endlessBorrowPairValid,endlessBorrowPairs,realmFlags,deadlands:{canRaise:canUseDeadlandsEcho,raise:summonEcho,useRaise:useDeadlandsEcho,canAbsorb:canUseDeadlandsAbsorption,absorb:absorbDeadlandsEcho,useAbsorb:useDeadlandsAbsorption,grave:()=>state?.graveState||[]}};populateSetup();render();
})();
