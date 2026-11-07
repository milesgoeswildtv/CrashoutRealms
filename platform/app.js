import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { REALMS_CONFIG } from "./config.js";
import { createCrashoutIdentity } from "./services/crashout-identity.mjs";

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
const accountButton = document.querySelector("#account-state");
const accountDialog = document.querySelector("#account-dialog");
const authMessage = document.querySelector("#auth-message");
const loginForm = document.querySelector("#login-form");
const passwordInput = document.querySelector("#auth-password");
const emailInput = document.querySelector("#auth-email");
const authSubmit = document.querySelector("#auth-submit");
const createToggle = document.querySelector("#create-account");
const discordButton = document.querySelector("#discord-login");
const signOutButton = document.querySelector("#sign-out");
const linkExisting = document.querySelector("#link-existing");
const linkCreate = document.querySelector("#link-create");
let identity = null;
let snapshot = { connected: false, authenticated: false, user: null, profile: null, destination: null, integration: null };
let accountMode = "signin";

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
  return `<section class="hero"><div class="hero-copy"><div class="eyebrow">A CRASHOUT WORLD · TRADING CARD GAME</div>
    <h1>ENTER<br>THE REALMS.</h1><p>A living card universe built around distinct worlds, strange civilizations, and strategic systems. Your journey starts here.</p>
  </div><span class="hero-tag">NO SAFE ROUTES</span></section>
  <div class="section-head"><div><div class="eyebrow">YOUR WORLD</div><h2>THE PLAYER HUB</h2></div><p>Platform foundation · connected services pending</p></div>
  <section class="grid" aria-label="REALMS destinations">
    ${tile("▤","COLLECTION","Browse owned cards and discover the full catalogue.","SERVICE PENDING",true)}
    ${tile("▱","DECK WORKSHOP","Create and validate decks against the live ruleset.","RULES PENDING",true)}
    ${tile("⚔","THE ARENA","Play against bots, friends, or the wider field.","NOT CONNECTED",true)}
  </section>
  <div class="section-head"><div><div class="eyebrow">COMING ONLINE</div><h2>THE REST OF THE WORLD</h2></div></div>
  <section class="grid" aria-label="More platform services">
    ${tile("◇","MARKET","Card acquisition and Crashout-backed purchases.","ECONOMY PENDING",true)}
    ${tile("◎","PLAYER RECORD","Profile, progression, match history, and social identity.","IDENTITY SERVICE",true)}
    ${tile("⌘","REALM ATLAS","Explore the five worlds and their current inhabitants.","CANON IN PROGRESS",true)}
  </section>
  <div class="notice"><strong>Build integrity:</strong> this platform uses the shared Crashout identity. The retired v0.9 playtest is isolated; no old card definitions or rules are presented as current canon.</div>`;
}
function routeView(route) {
  if (route === "home") return homeView();
  const item = ROUTES[route];
  if (route === "profile" && snapshot.authenticated) {
    const name = snapshot.profile?.display_name || snapshot.profile?.username || "Crashout player";
    const playerId = snapshot.profile?.player_id || "Player ID provisioning pending";
    const linked = snapshot.destination?.linked;
    const integration = snapshot.integration;
    return `<div class="eyebrow">REALMS / PROFILE</div><h1 class="page-title">${escapeHtml(name)}</h1>
      <p class="page-lead">Your REALMS destination profile is backed by your existing Crashout identity. The account is not duplicated.</p>
      <section class="profile-grid">
        <article class="profile-card"><span class="eyebrow">CRASHOUT PLAYER ID</span><strong>${escapeHtml(playerId)}</strong><small>${escapeHtml(snapshot.user?.email || "Email not shared")}</small></article>
        <article class="profile-card"><span class="eyebrow">REALMS ACCOUNT LINK</span><strong>${linked ? "LINKED" : "NOT LINKED"}</strong><small>${linked ? "Destination account verified by Crashout." : "The REALMS adapter is not enabled yet."}</small></article>
      </section>
      <div class="notice"><strong>Identity boundary:</strong> Crashout owns your login. REALMS will own its game data and stable destination player ID after the trusted link handshake is complete.</div>`;
  }
  return `<div class="eyebrow">REALMS / ${item.label}</div><h1 class="page-title">${item.title}</h1>
    <p class="page-lead">${item.description}</p>
    <section class="empty-panel" aria-label="Service status"><h2>NOT CONNECTED YET</h2>
      <p>This section becomes active when its real service, data contract, and QA are in place. This screen does not create demo cards, fake ownership, sample currency, or pretend match results.</p>
      <span class="state">${item.state}</span></section>`;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" })[character]);
}
function render() {
  const route = currentRoute(), item = ROUTES[route];
  sectionLabel.textContent = item.label;
  view.innerHTML = routeView(route);
  navLinks.forEach(link => {
    if (link.dataset.route === route) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.title = `REALMS — ${item.label === "HOME" ? "Crashout" : item.label}`;
}
function setMessage(message, kind = "info") {
  authMessage.textContent = message;
  authMessage.dataset.kind = kind;
}
function updateAccountUI() {
  const integrationState = snapshot.integration?.integration_state || "unavailable";
  const stateLabels = { ready: "READY", adapter_required: "ADAPTER REQUIRED", disabled: "DISABLED", maintenance: "MAINTENANCE" };
  document.querySelector("#identity-status").textContent = snapshot.integration?.enabled ? "REALMS ADAPTER READY" : `REALMS ${stateLabels[integrationState] || "REGISTRY UNAVAILABLE"}`;
  const linkStatus = document.querySelector("#link-status");
  if (linkStatus) linkStatus.textContent = snapshot.integration?.enabled ? "The central registry is ready; link activation still requires the verified browser handoff." : "Crashout currently lists REALMS as unavailable. Linking remains disabled until the adapter is verified.";
  document.querySelector("#identity-status").dataset.state = snapshot.integration?.enabled ? "ready" : "pending";
  if (!snapshot.authenticated) {
    accountButton.innerHTML = '<span class="avatar">?</span><span><b>Crashout account</b><small>Sign in to continue</small></span><i>↗</i>';
    signOutButton.hidden = true;
    loginForm.hidden = false;
    discordButton.hidden = false;
    createToggle.hidden = false;
    linkExisting.disabled = true;
    linkCreate.disabled = true;
    return;
  }
  const name = snapshot.profile?.display_name || snapshot.profile?.username || "Crashout player";
  accountButton.innerHTML = `<span class="avatar">${escapeHtml(name.slice(0,1).toUpperCase())}</span><span><b>${escapeHtml(name)}</b><small>Crashout identity connected</small></span><i>↗</i>`;
  signOutButton.hidden = false;
  loginForm.hidden = true;
  discordButton.hidden = true;
  createToggle.hidden = true;
  const canLink = snapshot.authenticated && snapshot.integration?.enabled === true && snapshot.integration?.integration_state === "ready" && !snapshot.destination?.linked;
  linkExisting.disabled = !canLink;
  linkCreate.disabled = !canLink;
  linkExisting.textContent = snapshot.destination?.linked ? "REALMS ACCOUNT LINKED" : "LINK EXISTING REALMS ACCOUNT";
  linkCreate.textContent = snapshot.destination?.linked ? "REALMS ACCOUNT LINKED" : "CREATE + LINK REALMS ACCOUNT";
}
function setBusy(busy) {
  [authSubmit, discordButton, createToggle, signOutButton].forEach(button => { if (button) button.disabled = busy; });
}
async function refreshIdentity() {
  snapshot = await identity.getSnapshot();
  updateAccountUI();
  render();
}
function openAccount() {
  if (typeof accountDialog.showModal === "function") accountDialog.showModal();
  else accountDialog.setAttribute("open", "");
}
accountButton.addEventListener("click", openAccount);
loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  setBusy(true);
  try {
    if (accountMode === "signup") {
      const result = await identity.createCrashoutAccount(emailInput.value, passwordInput.value);
      setMessage(result.user?.identities?.length === 0 ? "Check your email to confirm your Crashout account." : "Crashout account created.", "success");
    } else {
      await identity.signInWithPassword(emailInput.value, passwordInput.value);
      setMessage("Crashout identity connected.", "success");
    }
    passwordInput.value = "";
    await refreshIdentity();
    if (snapshot.authenticated) loginForm.hidden = true;
  } catch (error) {
    setMessage(error.message || "Could not connect to Crashout.", "error");
  } finally { setBusy(false); }
});
discordButton.addEventListener("click", async () => {
  setBusy(true);
  try { await identity.signInWithDiscord(); }
  catch (error) { setMessage(error.message || "Discord sign-in could not start.", "error"); setBusy(false); }
});
createToggle.addEventListener("click", () => {
  accountMode = accountMode === "signin" ? "signup" : "signin";
  authSubmit.textContent = accountMode === "signup" ? "CREATE CRASHOUT ACCOUNT" : "SIGN IN";
  createToggle.textContent = accountMode === "signup" ? "I ALREADY HAVE AN ACCOUNT" : "CREATE A CRASHOUT ACCOUNT";
  setMessage(accountMode === "signup" ? "This creates a central Crashout account—not a separate REALMS login." : "Use the same account you use across Crashout.");
});
signOutButton.addEventListener("click", async () => {
  setBusy(true);
  try { await identity.signOut(); await refreshIdentity(); setMessage("Signed out of Crashout."); }
  catch (error) { setMessage(error.message || "Sign-out failed.", "error"); }
  finally { setBusy(false); }
});
for (const button of [linkExisting, linkCreate]) button.addEventListener("click", () => {
  setMessage("REALMS account linking is safely disabled until its server adapter and launch handoff pass verification.", "info");
});
document.querySelector("#close-account").addEventListener("click", () => accountDialog.close());
window.addEventListener("hashchange", render);

if (!location.hash) history.replaceState(null, "", "#home");
render();

try {
  const supabase = createClient(REALMS_CONFIG.crashoutUrl, REALMS_CONFIG.crashoutPublishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  identity = createCrashoutIdentity(supabase, { destinationKey: REALMS_CONFIG.destinationKey, redirectTo: REALMS_CONFIG.authRedirectTo });
  await refreshIdentity();
  identity.subscribe(next => { snapshot = next; updateAccountUI(); render(); });
  updateAccountUI();
} catch (error) {
  document.querySelector("#identity-status").textContent = "CRASHOUT AUTH SERVICE UNAVAILABLE";
  document.querySelector("#identity-status").dataset.state = "error";
  setMessage(error.message || "Could not initialize the shared Crashout identity service.", "error");
}

export { ROUTES, currentRoute, routeView, tile };
