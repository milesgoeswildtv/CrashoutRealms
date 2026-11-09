export function buildLocalMatchConfig(deck, mode="ai") {
  if (mode !== "ai") throw new Error("That match mode is not available in this build.");
  if (!deck || !deck.realm || !deck.realm.id || !deck.realm.name || !deck.realm.faction) throw new Error("Choose a Realm in Deck Workshop before starting a match.");
  if (!Array.isArray(deck.cards) || deck.cards.length === 0) throw new Error("Add at least one card to your deck in Deck Workshop before starting a match.");
  if (deck.cards.some(id => typeof id !== "string" || !id.trim())) throw new Error("This deck contains an invalid card entry. Review it in Deck Workshop.");
  return { deckA: [...deck.cards], realm: { id: deck.realm.id, name: deck.realm.name, faction: deck.realm.faction } };
}
