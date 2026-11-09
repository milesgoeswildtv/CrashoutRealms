import { getCard } from "./eliteborn-catalogue.mjs";

export function buildLocalMatchConfig(deck, mode="ai") {
  if (mode !== "ai") throw new Error("That match mode is not available in this build.");
  if (!deck || !deck.realm || !deck.realm.id || !deck.realm.name || !deck.realm.faction) throw new Error("Choose a Realm in Deck Workshop before starting a match.");
  if (!Array.isArray(deck.cards) || deck.cards.length < 5) throw new Error("Add at least 5 cards so the opening hand can be drawn.");
  if (deck.cards.some(id => typeof id !== "string" || !id.trim() || !getCard(id))) throw new Error("This deck contains an invalid or unavailable card. Review it in Deck Workshop.");
  return { deckA: [...deck.cards], realm: { id: deck.realm.id, name: deck.realm.name, faction: deck.realm.faction } };
}
