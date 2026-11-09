import { getCard } from "./eliteborn-catalogue.mjs";

export const MAX_DECK_CARDS = 30;
export const UNIT_COPY_LIMIT = 4;
export const LEGENDARY_COPY_LIMIT = 1;
export const SPECIAL_COPY_LIMIT = 1;

export function getCardCopyLimit(card) {
  if (!card) return 0;
  const type = String(card.type || "").toUpperCase();
  const rarity = String(card.rarity || "").toUpperCase();
  if (card.legendary === true || rarity === "LEGENDARY" || type.includes("LEGENDARY")) {
    return LEGENDARY_COPY_LIMIT;
  }
  return type === "UNIT" ? UNIT_COPY_LIMIT : SPECIAL_COPY_LIMIT;
}

export function validateDeckCopies(cardIds, lookup = getCard) {
  const errors = [];
  if (!Array.isArray(cardIds)) return ["Deck cards must be a list."];
  if (cardIds.length > MAX_DECK_CARDS) {
    errors.push(`A deck can contain no more than ${MAX_DECK_CARDS} cards.`);
  }

  const counts = new Map();
  for (const id of cardIds) {
    if (typeof id !== "string" || !id.trim()) {
      errors.push("Deck contains an invalid card entry.");
      continue;
    }
    const card = lookup(id);
    if (!card) {
      errors.push(`Card ${id} is not available in the selected catalogue.`);
      continue;
    }
    const count = (counts.get(id) || 0) + 1;
    counts.set(id, count);
    const limit = getCardCopyLimit(card);
    if (count > limit) {
      const category = getCardCopyLimit(card) === LEGENDARY_COPY_LIMIT &&
        (card.legendary === true || String(card.rarity || "").toUpperCase() === "LEGENDARY" ||
          String(card.type || "").toUpperCase().includes("LEGENDARY"))
        ? "Legendary"
        : String(card.type || "").toUpperCase() === "UNIT" ? "Unit" : "Special";
      errors.push(`${card.name || id}: maximum ${limit} copy/copies per deck (${category}).`);
    }
  }
  return [...new Set(errors)];
}

export function canAddCard(cardIds, cardId, lookup = getCard) {
  if (!Array.isArray(cardIds) || cardIds.length >= MAX_DECK_CARDS) return false;
  const card = lookup(cardId);
  if (!card) return false;
  const count = cardIds.filter(id => id === cardId).length;
  return count < getCardCopyLimit(card);
}
