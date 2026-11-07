import { ELITEBORN_CARDS } from "./eliteborn-catalogue.mjs";

export const REALM_CATALOGUE = Object.freeze([
  {id:"crystal-isle",name:"Crystal Isle",faction:"Prismites",status:"catalogue-pending"},
  {id:"lost-star",name:"The Lost Star",faction:"Moon Demons",status:"catalogue-pending"},
  {id:"upper-strata",name:"Upper Strata",faction:"Eliteborn",status:"available"},
  {id:"the-endless",name:"The Endless",faction:"Continuum Displacers",status:"catalogue-pending"},
  {id:"deadlands",name:"Deadlands",faction:"Harvesters",status:"catalogue-pending"}
]);
const STORAGE_KEY="crashout.realms.deck-workshop.v1";
const safeRead=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");}catch{return null;}};
const safeWrite=value=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value));return true;}catch{return false;}};
let draft=safeRead();
if(!draft||typeof draft!=="object"||!Array.isArray(draft.cards))draft={name:"My First Deck",realm:"",cards:[]};
let statusMessage="Drafts are saved locally on this device. Server-backed deck storage is not connected.";
const root=document.querySelector("#view");
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const selectedRealm=()=>REALM_CATALOGUE.find(r=>r.id===draft.realm)||null;
const counts=()=>draft.cards.reduce((acc,id)=>(acc[id]=(acc[id]||0)+1,acc),{});
const cardById=id=>ELITEBORN_CARDS.find(c=>c.id===id);
const persist=()=>{const ok=safeWrite(draft);if(!ok)statusMessage="Could not save locally. Check this browser storage settings.";return ok;};
function cardTile(card,count=0){
 return `<article class="workshop-card"><div class="workshop-card-top"><span>${escapeHtml(card.force||card.type)}</span><small>${card.id}</small></div><h3>${escapeHtml(card.name)}</h3><p>${escapeHtml(card.rules)}</p><div class="workshop-card-foot"><span>COST ${card.cost} · RESOURCE +${card.resource}</span><span>${card.str??"—"} STR / ${card.hp??"—"} HP</span></div><div class="workshop-card-actions"><span>IN DECK: ${count}</span><button type="button" data-add-card="${card.id}">ADD COPY +</button></div></article>`;
}
function render(){
 const realm=selectedRealm(),cardCounts=counts(),available=realm?.id==="upper-strata";
 root.innerHTML=`<div class="lab-head"><div><div class="eyebrow">REALMS / DECK WORKSHOP</div><h1 class="page-title">CRAFT YOUR DECK</h1><p class="page-lead">Choose the Realm your deck belongs to, then build its card list. The Realm is deck configuration—not a card and not a battlefield slot.</p></div><button id="deck-new" class="secondary-button" type="button">NEW DRAFT</button></div>
 <section class="deck-identity-panel"><div class="deck-field"><label for="deck-name">DECK NAME</label><input id="deck-name" maxlength="48" value="${escapeHtml(draft.name)}" placeholder="Name this deck"></div><div class="deck-field"><label for="deck-realm">CHOOSE YOUR REALM</label><select id="deck-realm"><option value="">Select a Realm…</option>${REALM_CATALOGUE.map(r=>`<option value="${r.id}" ${draft.realm===r.id?"selected":""}>${r.name} · ${r.faction}</option>`).join("")}</select></div><div class="deck-realm-summary">${realm?`<span class="eyebrow">DECK REALM</span><strong>${realm.name}</strong><small>FACTION · ${realm.faction}</small>`:'<span class="eyebrow">DECK REALM</span><strong>NOT SELECTED</strong><small>Choose one of the five canonical Realms.</small>'}</div></section>
 <div class="deck-workshop-grid"><section class="deck-library"><div class="section-head"><div><div class="eyebrow">CARD LIBRARY</div><h2>${realm?escapeHtml(realm.faction.toUpperCase()):"SELECT A REALM FIRST"}</h2></div><span class="state">${available?"ELITEBORN SOURCE CONNECTED":"CATALOGUE PENDING"}</span></div>${!realm?'<div class="empty-panel"><h2>CHOOSE YOUR REALM</h2><p>The card library will load the matching faction catalogue after you select your deck’s Realm.</p></div>':available?`<div class="workshop-card-list">${ELITEBORN_CARDS.map(c=>cardTile(c,cardCounts[c.id]||0)).join("")}</div>`:`<div class="empty-panel"><h2>${escapeHtml(realm.faction.toUpperCase())} CATALOGUE NOT CONNECTED</h2><p>Your Realm choice is saved to this draft. This branch currently contains the Eliteborn card catalogue only; it will not substitute another faction's cards or fabricate missing card definitions.</p></div>`}</section>
 <aside class="deck-list-panel"><div class="eyebrow">CURRENT DECK LIST</div><h2>${escapeHtml(draft.name||"UNTITLED DECK")}</h2><div class="deck-list-realm">${realm?escapeHtml(realm.name):"NO REALM SELECTED"}</div><div class="deck-card-total"><strong>${draft.cards.length}</strong><span>CARDS ADDED</span></div><div class="deck-list-items">${draft.cards.length?draft.cards.map((id,index)=>{const c=cardById(id);return c?`<div class="deck-list-item"><span>${escapeHtml(c.name)}</span><small>${escapeHtml(c.id)}</small><button type="button" data-remove-index="${index}" aria-label="Remove ${escapeHtml(c.name)}">−</button></div>`:"";}).join(""):'<p class="deck-list-empty">Your deck list is empty. Add cards from the library.</p>'}</div><button class="primary-button deck-save" id="deck-save" type="button">SAVE LOCAL DRAFT</button><p class="deck-save-status" role="status">${escapeHtml(statusMessage)}</p><p class="deck-rules-note">Deck size, copy limits, faction legality, and final validation are not yet applied. No assumed limits are being used. Local draft only—not synced to Crashout.</p></aside></div>`;
 root.querySelector("#deck-name").addEventListener("input",e=>{draft.name=e.target.value;persist();root.querySelector(".deck-list-panel h2").textContent=draft.name||"UNTITLED DECK";});
 root.querySelector("#deck-realm").addEventListener("change",e=>{draft.realm=e.target.value;persist();render();});
 root.querySelector("#deck-new").addEventListener("click",()=>{draft={name:"New Deck",realm:"",cards:[]};statusMessage="New local draft created.";persist();render();});
 root.querySelector("#deck-save").addEventListener("click",()=>{const ok=persist();statusMessage=ok?"Draft saved on this device.":"Local save failed.";render();});
 root.querySelectorAll("[data-add-card]").forEach(button=>button.addEventListener("click",()=>{draft.cards.push(button.dataset.addCard);statusMessage="Card added to the local deck list.";persist();render();}));
 root.querySelectorAll("[data-remove-index]").forEach(button=>button.addEventListener("click",()=>{draft.cards.splice(Number(button.dataset.removeIndex),1);statusMessage="Card removed from the local deck list.";persist();render();}));
}
export function getActiveDeck(){const realm=selectedRealm();return realm?{name:draft.name||"Untitled Deck",realm:{id:realm.id,name:realm.name,faction:realm.faction},cards:[...draft.cards]}:null;}
export function renderDeckWorkshop(){render();}
