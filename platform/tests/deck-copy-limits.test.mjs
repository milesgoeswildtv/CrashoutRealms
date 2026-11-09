import test from "node:test";
import assert from "node:assert/strict";
import { MAX_DECK_CARDS, getCardCopyLimit, validateDeckCopies, canAddCard } from "../game/deck-copy-limits.mjs";

const cards = new Map([
  ["UNIT", {id:"UNIT",name:"Standard Unit",type:"UNIT"}],
  ["LEGEND", {id:"LEGEND",name:"Legendary Unit",type:"UNIT",legendary:true}],
  ["SPECIAL", {id:"SPECIAL",name:"Special Card",type:"FORMATION"}]
]);
const lookup = id => cards.get(id) || null;

test("standard Units allow up to four copies", () => {
  assert.equal(getCardCopyLimit(lookup("UNIT")), 4);
  assert.deepEqual(validateDeckCopies(Array(4).fill("UNIT"), lookup), []);
  assert.match(validateDeckCopies(Array(5).fill("UNIT"), lookup)[0], /maximum 4 copies/);
});

test("Legendary cards allow one copy", () => {
  assert.equal(getCardCopyLimit(lookup("LEGEND")), 1);
  assert.match(validateDeckCopies(["LEGEND","LEGEND"], lookup)[0], /maximum 1 copy/);
});

test("each special card is limited to one copy", () => {
  assert.equal(getCardCopyLimit(lookup("SPECIAL")), 1);
  assert.match(validateDeckCopies(["SPECIAL","SPECIAL"], lookup)[0], /maximum 1 copy/);
});

test("deck size is capped at thirty cards", () => {
  assert.equal(MAX_DECK_CARDS, 30);
  assert.match(validateDeckCopies(Array(31).fill("UNIT"), lookup)[0], /no more than 30 cards/);
});

test("add action refuses a card at its copy limit or a full deck", () => {
  assert.equal(canAddCard(Array(4).fill("UNIT"), "UNIT", lookup), false);
  assert.equal(canAddCard(["UNIT"], "UNIT", lookup), true);
  assert.equal(canAddCard(Array(30).fill("UNIT"), "SPECIAL", lookup), false);
});
