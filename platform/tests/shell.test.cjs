const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const js = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "app.css"), "utf8");

test("all six platform destinations are declared", () => {
  for (const route of ["home", "collection", "decks", "play", "store", "profile"]) {
    assert.match(js, new RegExp(route + ":"));
    assert.match(html, new RegExp('data-route="' + route + '"'));
  }
});

test("unconnected services are presented honestly", () => {
  assert.match(js, /NOT CONNECTED YET/);
  assert.match(js, /does not create demo cards, fake ownership, sample currency/);
  assert.match(js, /retired v0\.9/);
});

test("platform entry point is mobile responsive and accessible", () => {
  assert.match(html, /name="viewport"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-label="Mobile navigation"/);
  assert.match(css, /@media\(max-width:640px\)/);
});

test("platform shell contains no legacy game engine imports", () => {
  assert.doesNotMatch(html, /src-v09\/(cards|game)\.js/);
  assert.doesNotMatch(html, /REALMS_DATA/);
});
