/**
 * REALMS deck construction rules shared by the workshop and match boundary.
 * Deck size is intentionally supplied by a published format, never guessed here.
 */
export const COPY_LIMITS = Object.freeze({ unit: 4, special: 1, legendary: 1 });

export function isLegendary(card) {
  return card?.legendary === true || String(card?.rarity || "").toUpperCase() === "LEGENDARY";
}
export function isSpecial(card) {
  if (!card) return false;
  const type = String(card.type || "").toUpperCase();
  return type !== "UNIT" && (card.special === true || type === "SPECIAL" ||
    type === "FORMATION" || type === "APEX" || Boolean(card.specialFamily));
}
export function copyLimitFor(card) {
  if (isLegendary(card)) return COPY_LIMITS.legendary;
  return isSpecial(card) ? COPY_LIMITS.special : COPY_LIMITS.unit;
}

/**
 * @param {{cards:string[], realm:{id:string,faction:string}|null, catalogue:object[],
 *   deckSize?:number|null, expectedFaction?:string|null}} input
 * @returns {{valid:boolean, complete:boolean, count:number, errors:string[], warnings:string[]}}
 */
export function validateDeck({ cards = [], realm = null, catalogue = [], deckSize = null, expectedFaction = null } = {}) {
  const errors = [], warnings = [], count = Array.isArray(cards) ? cards.length : 0;
  if (!Array.isArray(cards)) errors.push("Deck card list must be an array.");
  if (!realm?.id || !realm?.faction) errors.push("Choose a Realm before validating this deck.");
  if (expectedFaction && realm?.faction !== expectedFaction) errors.push(`This catalogue belongs to ${expectedFaction}, not ${realm?.faction || "an unselected faction"}.`);
  const byId = new Map(catalogue.map(card => [card.id, card]));
  const counts = new Map();
  for (const id of cards) {
    const card = byId.get(id);
    if (!card) { errors.push(`Unknown card ID: ${id}.`); continue; }
    const faction = card.faction || card.factionName;
    if (faction && realm?.faction && faction !== realm.faction) errors.push(`${card.name} does not belong to ${realm.faction}.`);
    counts.set(id, (counts.get(id) || 0) + 1);
  }
  for (const [id, copies] of counts) {
    const card = byId.get(id);
    const limit = copyLimitFor(card);
    if (copies > limit) errors.push(`${card.name}: ${copies} copies exceeds the limit of ${limit}.`);
  }
  if (deckSize == null) warnings.push("Deck size is not certified until a published format supplies its required size.");
  else {
    if (!Number.isInteger(deckSize) || deckSize < 1) errors.push("Published format deck size must be a positive integer.");
    else if (count !== deckSize) errors.push(`Deck must contain exactly ${deckSize} cards; it currently contains ${count}.`);
  }
  const complete = deckSize != null && Boolean(realm?.id && realm?.faction) && errors.length === 0;
  return { valid: errors.length === 0, complete, count, errors, warnings };
}
