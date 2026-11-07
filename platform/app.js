const ROUTES = Object.freeze({
  home: { label: "HOME", title: "THE WORLD IS OPENING", description: "Your place in the REALMS universe. Build your collection, shape your decks, and enter the arena as the worlds come online.", state: "FOUNDATION" },
  collection: { label: "COLLECTION", title: "YOUR COLLECTION", description: "Every card you own, every variant you discover, and every Realm you explore will live here.", state: "COLLECTION SERVICE PENDING" },
  decks: { label: "DECKS", title: "DECK WORKSHOP", description: "Build, validate, save, and manage your decks here. Deck legality will be driven by the approved REALMS ruleset—not assumptions from the retired alpha.", state: "RULES + INVENTORY CONNECTION PENDING" },
  play: { label: "PLAY", title: "ENTER THE ARENA", description: "Bot matches, private challenges, and competitive queues belong here. Matchmaking will only open when the authoritative match service is ready.", state: "MATCH SERVICE NOT CONNECTED" },
  store: { label: "STORE", title: "THE MARKET", description: "Packs, card acquisition, and purchases will use the Crashout economy integration. No prices, currencies, or purchase actions are fabricated in this foundation.", state: "ECONOMY CONNECTION PENDING" },
  profile: { label: "PROFILE", title: "PLAYER PROFILE", description: "Your Crashout identity, player record, progression, match history, and social connections will be presented here.", state: "CRASHOUT IDENTITY NOT CONNECTED" }
});

const view = document.querySelector("#view");
const sectionLabel = document.querySelector("#section-label");
const navLinks = [...document.querySelectorAll("[data-route]")];

function currentRoute() {
  const route = location.hash.replace(/^#\/?/, "").split("/")[0];
  return Object.hasOwn(ROUTES, route) ? route : "home";
}

function tile(symbol, title, copy, state, locked = false) {
  return `<article class="tile${locked ? " locked" : ""}">
    <div><span class="symbol" aria-hidden="true">${symbol}</span><h3>${title}</h3><p>${copy}</p></div>
    <span class="state">${state}</span>
  </article>`;
}

function homeView() {
  return `<section class="hero">
    <div class="hero-copy"><div class="eyebrow">A CRASHOUT WORLD · TRADING CARD GAME</div>
      <h1>ENTER<br>THE REALMS.</h1>
      <p>A living card universe built around distinct worlds, strange civilizations, and strategic systems. Your journey starts here.</p>
    </div><span class="hero-tag">NO SAFE ROUTES</span>
  </section>
  <div class="section-head"><div><div class="eyebrow">YOUR WORLD</div><h2>THE PLAYER HUB</h2></div><p>Platform foundation · connected services pending</p></div>
  <section class="grid" aria-label="REALMS destinations">
    ${tile("▤","COLLECTION","Browse owned cards and discover the full catalogue.","SERVICE PENDING",true)}
    ${tile("▱","DECK WORKSHOP","Create and validate decks against the live ruleset.","RULES PENDING",true)}
    ${tile("⚔","THE ARENA","Play against bots, friends, or the wider field.","NOT CONNECTED",true)}
  </section>
  <div class="section-head"><div><div class="eyebrow">COMING ONLINE</div><h2>THE REST OF THE WORLD</h2></div></div>
  <section class="grid" aria-label="More platform services">
    ${tile("◇","MARKET","Card acquisition and Crashout-backed purchases.","ECONOMY PENDING",true)}
    ${tile("◎","PLAYER RECORD","Profile, progression, match history, and social identity.","IDENTITY PENDING",true)}
    ${tile("⌘","REALM ATLAS","Explore the five worlds and their current inhabitants.","CANON IN PROGRESS",true)}
  </section>
  <div class="notice"><strong>Build integrity:</strong> this is a new platform entry point, isolated from the legacy v0.9 playtest. No old faction names, card definitions, currencies, or rules are being presented as current canon.</div>`;
}

function routeView(route) {
  if (route === "home") return homeView();
  const item = ROUTES[route];
  return `<div class="eyebrow">REALMS / ${item.label}</div>
    <h1 class="page-title">${item.title}</h1>
    <p class="page-lead">${item.description}</p>
    <section class="empty-panel" aria-label="Service status">
      <h2>NOT CONNECTED YET</h2>
      <p>This section is reserved in the platform architecture. It will become active when its real service, data contract, and QA are in place. This screen does not create demo cards, fake ownership, sample currency, or pretend match results.</p>
      <span class="state">${item.state}</span>
    </section>`;
}

function render() {
  const route = currentRoute();
  const item = ROUTES[route];
  sectionLabel.textContent = item.label;
  view.innerHTML = routeView(route);
  navLinks.forEach(link => {
    if (link.dataset.route === route) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.title = `REALMS — ${item.label === "HOME" ? "Crashout" : item.label}`;
  view.focus({ preventScroll: true });
}

window.addEventListener("hashchange", render);
if (!location.hash) history.replaceState(null, "", "#home");
render();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ROUTES, currentRoute, routeView, tile };
}
