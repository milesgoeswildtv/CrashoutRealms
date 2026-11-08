export function createBlankDeck(makeId,name="New Deck"){
  return {id:makeId(),name,realm:"",cards:[]};
}

export function normalizeDeckStore(saved,{makeId,realms,cards}){
  const validRealmIds=new Set(realms.map(realm=>realm.id));
  const validCardIds=new Set(cards.map(card=>card.id));
  const usedIds=new Set();
  const uniqueId=value=>{
    if(typeof value==="string"&&value.trim()&&!usedIds.has(value)){
      usedIds.add(value);
      return value;
    }
    let id;
    do{id=makeId();}while(!id||usedIds.has(id));
    usedIds.add(id);
    return id;
  };
  const normalizeDeck=(value,index)=>{
    if(!value||typeof value!=="object"||Array.isArray(value))return null;
    return {
      id:uniqueId(value.id),
      name:typeof value.name==="string"&&value.name.trim()?value.name.trim().slice(0,48):`Deck ${index+1}`,
      realm:validRealmIds.has(value.realm)?value.realm:"",
      cards:Array.isArray(value.cards)?value.cards.filter(id=>typeof id==="string"&&validCardIds.has(id)):[]
    };
  };

  if(saved&&Array.isArray(saved.decks)){
    const decks=saved.decks.map(normalizeDeck).filter(Boolean);
    if(decks.length){
      const activeId=decks.some(deck=>deck.id===saved.activeId)?saved.activeId:decks[0].id;
      return {activeId,decks};
    }
  }

  const legacy=normalizeDeck(saved,0);
  const first=legacy||createBlankDeck(makeId,"My First Deck");
  return {activeId:first.id,decks:[first]};
}
