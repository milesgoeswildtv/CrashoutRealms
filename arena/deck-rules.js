export function validateDeck(cards,{size=30}={}) {
 const errors=[];
 if(cards.length!==size) errors.push(`Deck must contain exactly ${size} cards (currently ${cards.length}).`);
 const counts=new Map();
 for(const card of cards) counts.set(card.id,(counts.get(card.id)||0)+1);
 for(const [id,count] of counts){
  const card=cards.find(c=>c.id===id);
  const limit=card.rarity==="Legendary"||card.type!=="Unit"?1:4;
  if(count>limit) errors.push(`${card.name}: maximum ${limit} cop${limit===1?"y":"ies"} allowed.`);
 }
 return {valid:errors.length===0,errors};
}
