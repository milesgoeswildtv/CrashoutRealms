import { FACTIONS, CARDS } from './data.js';

export const KEY='realms-visual-studio-v1';
const DB='realms-visual-studio-art';

export function defaultState(){
  const cardState={};
  CARDS.forEach(c=>cardState[c.id]={status:'NOT STARTED',artStatus:'MISSING',qaStatus:'NOT_RUN',notes:'',locked:false,artTransform:{x:50,y:50,zoom:1},manualQA:{}});
  const families={};
  Object.keys(FACTIONS).forEach(f=>families[f]={status:'DRAFT',notes:'',checks:{silhouette:'NOT_RUN',repetition:'NOT_RUN',scalability:'NOT_RUN'}});
  return {cardState,families,settings:{factionFilter:'ALL',selectedCard:'GEO-001',reviewFaction:'GEO',reviewMode:'FULL'},references:{}};
}
function readState(){try{const raw=localStorage.getItem(KEY);if(raw)return mergeState(defaultState(),JSON.parse(raw))}catch{}return defaultState()}
function mergeState(base,saved){
  return {...base,...saved,cardState:{...base.cardState,...(saved.cardState||{})},families:{...base.families,...(saved.families||{})},settings:{...base.settings,...(saved.settings||{})}};
}
export const state=readState();
export const ctx={
  route:location.hash.replace('#/','')||'overview',
  faction:state.settings.factionFilter||'ALL',
  selectedCard:state.settings.selectedCard||'GEO-001',
  reviewFaction:state.settings.reviewFaction||'GEO',
  reviewMode:state.settings.reviewMode||'FULL',
  safeZones:false,
  presentation:false
};
export function saveState(){
  state.settings.factionFilter=ctx.faction;state.settings.selectedCard=ctx.selectedCard;state.settings.reviewFaction=ctx.reviewFaction;state.settings.reviewMode=ctx.reviewMode;
  localStorage.setItem(KEY,JSON.stringify(state));
  document.dispatchEvent(new CustomEvent('realms-state-changed'));
}
export function resetState(){localStorage.removeItem(KEY);location.reload()}
export function go(route){location.hash=`#/${route}`}
export function byId(id){return CARDS.find(c=>c.id===id)}
export function cs(id){return state.cardState[id]}
export function faction(code){return FACTIONS[code]}
export function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
export function styleForFaction(code){const f=faction(code);return `--accent:${f.accent};--accent2:${f.accent2};--deep:${f.deep};--metal:${f.metal};--faction-soft:color-mix(in srgb,${f.accent} 8%,#111319)`}
export function badge(v){let cls='';if(['PASS','APPROVED','APPROVED ART'].includes(v))cls='good';if(['FAIL','REWORK','REJECTED','REDIRECT'].includes(v))cls='bad';if(['WARN','ART REVIEW'].includes(v))cls='warn';if(v==='LOCKED')cls='locked';return `<span class="badge ${cls}">${escapeHtml(v)}</span>`}
export function pageHead(eyebrow,title,description,actions=''){return `<header class="page-head"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${description}</p></div><div class="page-actions">${actions}</div></header>`}

async function openArtDb(){return new Promise((res,rej)=>{const q=indexedDB.open(DB,1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains('assets'))q.result.createObjectStore('assets')};q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}
export async function putArt(key,file){const db=await openArtDb();return new Promise((res,rej)=>{const tx=db.transaction('assets','readwrite');tx.objectStore('assets').put(file,key);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)})}
export async function getArt(key){const db=await openArtDb();return new Promise((res,rej)=>{const tx=db.transaction('assets','readonly');const q=tx.objectStore('assets').get(key);q.onsuccess=()=>res(q.result||null);q.onerror=()=>rej(q.error)})}
export async function delArt(key){const db=await openArtDb();return new Promise((res,rej)=>{const tx=db.transaction('assets','readwrite');tx.objectStore('assets').delete(key);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)})}

export function autoQA(card){
  const st=cs(card.id),out=[];
  out.push(['Required data',!!(card.id&&card.name&&card.faction&&card.type&&Number.isFinite(card.cost)&&Number.isFinite(card.resource))]);
  out.push(['Creature stats',card.type!=='Creature'||(Number.isFinite(card.str)&&Number.isFinite(card.hp))]);
  out.push(['Artwork assigned',st.artStatus!=='MISSING']);
  out.push(['Rules length',card.rules.length<260]);out.push(['Title length',card.name.length<34]);
  if(card.faction==='GEO')out.push(['Prism recipe present',Array.isArray(card.recipe)&&card.recipe.length>0]);
  return out;
}
export function manualChecks(card){
  const base={GEO:['Prism biology matches recipe','No unlisted Prism color','Geology-first anatomy'],MON:['Glowing sigils visible','Not vampire-coded','Distinct individual vs adjacent cards'],ELI:['Nonhuman','Nonhumanoid','Formation anatomy communicated'],HAR:['Biology performs harvesting function','Not humanoid troop/cultist default','Ecological strategy distinct'],CON:['Information/process identity','Not robot/android','Not chronomancer mage default']};
  return base[card.faction];
}
