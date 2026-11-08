import { ELITEBORN_CARDS } from "./eliteborn-catalogue.mjs";

export const REALM_CATALOGUE = Object.freeze([
  {id:"crystal-isle",name:"Crystal Isle",faction:"Prismites",status:"catalogue-pending"},
  {id:"lost-star",name:"The Lost Star",faction:"Moon Demons",status:"catalogue-pending"},
  {id:"upper-strata",name:"Upper Strata",faction:"Eliteborn",status:"available"},
  {id:"the-endless",name:"The Endless",faction:"Continuum Displacers",status:"catalogue-pending"},
  {id:"deadlands",name:"Deadlands",faction:"Harvesters",status:"catalogue-pending"}
]);

const STORAGE_KEY="crashout.realms.deck-workshop.v1";
const makeId=()=>globalThis.crypto?.randomUUID?.()||`deck-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
const blankDeck=(name="New Deck")=>({id:makeId(),name,realm:"",cards:[]});
const safeRead=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");}catch{return null;}};
const safeWrite=value=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value));return true;}catch{return false;}};

function normalizeDeck(value,index=0){
  if(!value||typeof value!=="object")return null;
  return {
    id:typeof value.id==="string"&&value.id?value.id:makeId(),
    name:typeof value.name==="string"&&value.name.trim()?value.name.trim().slice(0,48):`Deck ${index+1}`,
    realm:REALM_CATALOGUE.some(r=>r.id===value.realm)?value.realm:"",
    cards:Array.isArray(value.cards)?value.cards.filter(id=>typeof id==="string"&&ELITEBORN_CARDS.some(card=>card.id===id)):[]
  };
}
function loadStore(){
  const saved=safeRead();
  if(saved&&Array.isArray(saved.decks)){
    const decks=saved.decks.map(normalizeDeck).filter(Boolean);
    if(decks.length){
      const activeId=decks.some(deck=>deck.id===saved.activeId)?saved.activeId:decks[0].id;
      return {activeId,decks};
    }
  }
  const legacy=normalizeDeck(saved,0);
  return {activeId:legacy?.id||"",decks:[legacy||blankDeck("My First Deck")]};
}
let store=loadStore();
let statusMessage="Decks are saved locally on this device. Server-backed storage is not connected.";
let searchQuery="",forceFilter="ALL",typeFilter="ALL";
const root=document.querySelector("#view");
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const activeDeck=()=>store.decks.find(deck=>deck.id===store.activeId)||store.decks[0];
const selectedRealm=()=>REALM_CATALOGUE.find(realm=>realm.id===activeDeck()?.realm)||null;
const counts=()=>activeDeck().cards.reduce((acc,id)=>(acc[id]=(acc[id]||0)+1,acc),{});
const cardById=id=>ELITEBORN_CARDS.find(card=>card.id===id);
const persist=()=>{const ok=safeWrite(store);if(!ok)statusMessage="Could not save locally. Check this browser's storage settings.";return ok;};

function cardTile(card,count=0){
 return `<article class="workshop-card"><div class="workshop-card-top"><span>${escapeHtml(card.force||card.type)}</span><small>${card.id}</small></div><h3>${escapeHtml(card.name)}</h3><p>${escapeHtml(card.rules)}</p><div class="workshop-card-foot"><span>COST ${card.cost} · RESOURCE +${card.resource}</span><span>${card.str??"—"} STR / ${card.hp??"—"} HP</span></div><div class="workshop-card-actions"><span>IN DECK: ${count}</span><button type="button" data-add-card="${card.id}">ADD COPY +</button></div></article>`;
}
function renderCardList(){
 const cardCounts=counts();
 const filtered=ELITEBORN_CARDS.filter(card=>{
  const textMatch=!searchQuery||[card.name,card.id,card.force,card.rules].join(" ").toLowerCase().includes(searchQuery.toLowerCase());
  return textMatch&&(forceFilter==="ALL"||card.force===forceFilter)&&(typeFilter==="ALL"||card.type===typeFilter);
 });
 return filtered.length?filtered.map(card=>cardTile(card,cardCounts[card.id]||0)).join(""):`<div class="empty-panel"><h2>NO MATCHING CARDS</h2><p>Try another search or filter.</p></div>`;
}
function render(){
 const draft=activeDeck(),realm=selectedRealm(),available=realm?.id==="upper-strata";
 root.innerHTML=`<div class="lab-head"><div><div class="eyebrow">REALMS / DECK WORKSHOP</div><h1 class="page-title">CRAFT YOUR DECKS</h1><p class="page-lead">Keep multiple deck drafts on this device. Each deck stores its own Realm and card list. A Realm is deck configuration—not a card or battlefield slot.</p></div><button id="deck-new" class="secondary-button" type="button">NEW DECK +</button></div>
 <section class="deck-identity-panel deck-manager-panel"><div class="deck-field"><label for="deck-select">SAVED DECKS · ${store.decks.length}</label><select id="deck-select">${store.decks.map(deck=>`<option value="${escapeHtml(deck.id)}" ${deck.id===draft.id?"selected":""}>${escapeHtml(deck.name)}</option>`).join("")}</select></div><div class="deck-field"><label for="deck-name">DECK NAME</label><input id="deck-name" maxlength="48" value="${escapeHtml(draft.name)}" placeholder="Name this deck"></div><div class="deck-manager-actions"><button id="deck-delete" class="secondary-button" type="button" ${store.decks.length===1?"disabled":""}>DELETE THIS DECK</button><span class="deck-manager-count">${store.decks.length} LOCAL ${store.decks.length===1?"DECK":"DECKS"}</span></div></section>
 <section class="deck-identity-panel"><div class="deck-field"><label for="deck-realm">CHOOSE YOUR REALM</label><select id="deck-realm"><option value="">Select a Realm…</option>${REALM_CATALOGUE.map(r=>`<option value="${r.id}" ${draft.realm===r.id?"selected":""}>${r.name} · ${r.faction}</option>`).join("")}</select></div><div class="deck-realm-summary">${realm?`<span class="eyebrow">DECK REALM</span><strong>${realm.name}</strong><small>FACTION · ${realm.faction}</small>`:'<span class="eyebrow">DECK REALM</span><strong>NOT SELECTED</strong><small>Choose one of the five canonical Realms.</small>'}</div><div class="deck-realm-summary"><span class="eyebrow">ACTIVE DECK</span><strong>${escapeHtml(draft.name)}</strong><small>${draft.cards.length} CARDS IN THIS DRAFT</small></div></section>
 <div class="deck-workshop-grid"><section class="deck-library"><div class="section-head"><div><div class="eyebrow">CARD LIBRARY</div><h2>${realm?escapeHtml(realm.faction.toUpperCase()):"SELECT A REALM FIRST"}</h2></div><span class="state">${available?"ELITEBORN SOURCE CONNECTED":"CATALOGUE PENDING"}</span></div>${!realm?'<div class="empty-panel"><h2>CHOOSE YOUR REALM</h2><p>The card library loads the matching faction catalogue after you select the deck’s Realm.</p></div>':available?`<div class="card-library-filters"><input id="card-search" type="search" placeholder="Search name, text, or card ID" value="${escapeHtml(searchQuery)}" aria-label="Search cards"><select id="force-filter" aria-label="Filter by Force"><option value="ALL">ALL FORCES</option>${["ORDER","CHAOS","LIFE","DEATH"].map(force=>`<option value="${force}" ${forceFilter===force?"selected":""}>${force}</option>`).join("")}</select><select id="type-filter" aria-label="Filter by card type"><option value="ALL">ALL TYPES</option>${["UNIT","FORMATION","APEX"].map(type=>`<option value="${type}" ${typeFilter===type?"selected":""}>${type}</option>`).join("")}</select></div><div class="workshop-card-list">${renderCardList()}</div>`:`<div class="empty-panel"><h2>${escapeHtml(realm.faction.toUpperCase())} CATALOGUE NOT CONNECTED</h2><p>Your Realm choice is saved to this deck. Only the checked-in Eliteborn catalogue is available; missing faction card definitions are not fabricated.</p></div>`}</section>
 <aside class="deck-list-panel"><div class="eyebrow">CURRENT DECK LIST</div><h2>${escapeHtml(draft.name||"UNTITLED DECK")}</h2><div class="deck-list-realm">${realm?escapeHtml(realm.name):"NO REALM SELECTED"}</div><div class="deck-card-total"><strong>${draft.cards.length}</strong><span>CARDS ADDED</span></div><div class="deck-list-items">${draft.cards.length?draft.cards.map((id,index)=>{const card=cardById(id);return card?`<div class="deck-list-item"><span>${escapeHtml(card.name)}</span><small>${escapeHtml(card.id)}</small><button type="button" data-remove-index="${index}" aria-label="Remove ${escapeHtml(card.name)}">−</button></div>`:"";}).join(""):'<p class="deck-list-empty">Your deck list is empty. Add cards from the library.</p>'}</div><button class="primary-button deck-save" id="deck-save" type="button">SAVE LOCAL DECK</button><p class="deck-save-status" role="status">${escapeHtml(statusMessage)}</p><p class="deck-rules-note">Deck size, copy limits, faction legality, and final validation are not yet applied. No assumed limits are being used. Drafts remain local—not synced to Crashout.</p></aside></div>`;

 root.querySelector("#deck-select").addEventListener("change",event=>{store.activeId=event.target.value;statusMessage="Switched to saved deck.";persist();render();});
 root.querySelector("#deck-name").addEventListener("input",event=>{draft.name=event.target.value;persist();root.querySelector(".deck-list-panel h2").textContent=draft.name||"UNTITLED DECK";});
 root.querySelector("#deck-realm").addEventListener("change",event=>{draft.realm=event.target.value;persist();render();});
 const cardGrid=root.querySelector(".workshop-card-list");
 const refreshCardGrid=()=>{if(cardGrid)cardGrid.innerHTML=renderCardList();};
 root.querySelector("#card-search")?.addEventListener("input",event=>{searchQuery=event.target.value;refreshCardGrid();});
 root.querySelector("#force-filter")?.addEventListener("change",event=>{forceFilter=event.target.value;refreshCardGrid();});
 root.querySelector("#type-filter")?.addEventListener("change",event=>{typeFilter=event.target.value;refreshCardGrid();});
 cardGrid?.addEventListener("click",event=>{const button=event.target.closest("[data-add-card]");if(!button)return;draft.cards.push(button.dataset.addCard);statusMessage="Card added to this local deck.";persist();render();});
 root.querySelector("#deck-new").addEventListener("click",()=>{const deck=blankDeck(store.decks.length?"New Deck":"My First Deck");store.decks.push(deck);store.activeId=deck.id;statusMessage="New local deck created.";persist();render();});
 root.querySelector("#deck-delete").addEventListener("click",()=>{if(store.decks.length<2)return;const name=draft.name; if(!window.confirm(`Delete “${name}” from this device? This cannot be undone.`))return;store.decks=store.decks.filter(deck=>deck.id!==draft.id);store.activeId=store.decks[0].id;statusMessage="Deck deleted from this device.";persist();render();});
 root.querySelector("#deck-save").addEventListener("click",()=>{const ok=persist();statusMessage=ok?"Deck saved on this device.":"Local save failed.";render();});
 root.querySelectorAll("[data-remove-index]").forEach(button=>button.addEventListener("click",()=>{draft.cards.splice(Number(button.dataset.removeIndex),1);statusMessage="Card removed from this local deck.";persist();render();}));
}
export function getActiveDeck(){const draft=activeDeck(),realm=REALM_CATALOGUE.find(item=>item.id===draft.realm);return realm?{name:draft.name||"Untitled Deck",realm:{id:realm.id,name:realm.name,faction:realm.faction},cards:[...draft.cards]}:null;}
export function renderDeckWorkshop(){render();persist();}
