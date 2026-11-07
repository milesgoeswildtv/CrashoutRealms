# REALMS Digital TCG — Platform Foundation & Architecture
**Document:** Master platform specification v1.0  
**Status:** Foundation / audit baseline — not a rules rewrite and not a production release  
**Repository:** `milesgoeswildtv/CrashoutRealms`  
**Baseline:** `main` at the time this document was prepared  
**Working branch:** `tcg/platform-foundation-audit`

---

## 1. Product goal

Evolve the existing REALMS v0.9 playable alpha into a complete, mobile-first digital trading card game. The finished product must support the complete player journey:

**Crashout sign-in → enter REALMS → receive a starter deck → collect cards → open packs → build decks → play bots or friends → progress → compete → expand a collection.**

Artwork is deliberately not a dependency for the first complete playable release. All card data, card frames, collection tiles, pack reveals, deck previews and battlefield cards must work with designed faction/type/rareness placeholders. Final art can be attached later through stable asset references without changing card identity or gameplay logic.

REALMS remains its own game and destination. Crashout supplies central identity and destination access; REALMS owns its rules, card catalogue, match state, progression and separate game economy.

## 2. Repository audit — observed baseline

The current default branch is `main`. The repository is a public GitHub repository and currently contains a static, mobile-first browser alpha.

### Existing assets and runtime
- `index.html` is the current app entry point and contains match setup, prototype rules, and the boot loader.
- `src-v09/cards.js` loads `window.REALMS_DATA`.
- `src-v09/game.js` contains the current game runtime and AI/local match paths.
- `src-v09/styles.css` contains the current game styling.
- `sw.js` and `manifest.webmanifest` support installable/PWA-style use.
- `REALMS_150_Cards_v0.9_Signature_Systems.json` is a structured card/rules source.
- `AGENTS.md` is the repository's governing implementation contract.
- `tests/geode-v09.test.js` is present; the current visible test directory contains this focused test file.
- Existing visual/card-art production documents and rosters are present under `docs/` and `production/card-art/`.

### Existing gameplay modes
The current entry screen exposes:
- Player vs AI
- Local two-player / hotseat
- AI vs AI watch

The current runtime is not yet a full online account-based TCG platform. The inspected repository root and runtime do not show a production account, collection inventory, pack/shop transaction, deck persistence, online matchmaking, or authoritative online multiplayer service. Those are platform capabilities to build, not capabilities to claim as already working.

### Canonical card inventory
The v0.9 signature-systems JSON declares:
- Five factions, 30 cards per faction, 150 cards total.
- One Legendary per faction.
- A 30-card deck size.
- A 15-card +1 / 15-card +2 printed-resource split per faction.
- The existing five-card recurring selective hand cycle and 20 starting Health.

Card type counts read from the canonical JSON:

| Faction | Cards | Card types |
|---|---:|---|
| Living Geodes | 30 | 17 Creature, 6 Prism, 3 Trap, 3 Spell, 1 Legendary Creature |
| Harvest | 30 | 13 Creature, 6 Growth, 3 Trap, 7 Spell, 1 Legendary Creature |
| Continuum | 30 | 17 Creature, 6 FLUX, 3 Trap, 3 Spell, 1 Legendary Creature |
| Moondemons | 30 | 17 Creature, 6 Sigil, 3 Trap, 3 Spell, 1 Legendary Creature |
| Eliteborn | 30 | 17 Creature, 6 Equip, 6 Spell, 1 Legendary Creature |

The source marks this rules/card set as a signature-systems alpha that is **not balance-locked and still requires human playtesting**. Do not present the 150-card set as fully balance-certified.

### Important rules and working-contract constraints
The repository's `AGENTS.md` and canonical v0.9 data are authoritative. Preserve, among other things:
- 30 unique cards per faction and the current 15/+1, 15/+2 resource distribution.
- The recurring five-card selective hand cycle and 20 starting Health.
- Alternating one play/pass at a time during Placement; two consecutive passes advance to Action.
- Alternating creature activations and simultaneous creature-v-creature damage/retaliation unless card text changes timing.
- Human-facing choose/select/target effects must present an explicit legal choice; do not silently use AI fallback targeting for a human.
- Current faction signature systems: Living Geodes / PRISM, Continuum / FLUX, Moondemons / SIGIL, Harvest / GROWTH, Eliteborn / EQUIP + FORMATION.
- Current certified Realm behavior and its edge cases as specified in `AGENTS.md`.
- No reintroduction of retired Geode Pressure/Fold mechanics.
- No autonomous balance changes, card-cost changes, stat changes, faction-passive changes, Realm-rule changes or deck-composition changes.
- Preserve the current boot architecture and cache/version protections unless a deliberate, separately tested migration is approved.

**Do not replace the existing runtime with a generic TCG engine.** The platform must wrap and progressively harden REALMS' own rules.

## 3. Identity and account boundary

Crashout is the central identity provider for the ecosystem. REALMS should be reached through Crashout's authenticated destination flow and receive the stable Crashout user identity through a verified server-side integration.

Rules:
- Do not create a second REALMS password system.
- Do not auto-merge accounts by matching usernames or email addresses.
- Use the stable Crashout user ID as the external identity key.
- Keep REALMS player profile/preferences and all REALMS gameplay data in REALMS-owned tables/namespaces.
- Keep REALMS currency, rewards and transactions separate from Poker, SHYST, Degen, Rituals or any other destination.
- Never trust a user ID, balance, card ownership, pack result, deck legality or match result supplied by the browser.
- Use server-verified identity and authorization for every write operation.

The exact existing Supabase project/schema and current Crashout destination-link implementation must be inspected before migrations are written. Reuse the established Crashout authentication authority; do not create duplicate Supabase projects or invent new credentials.

## 4. Proposed production architecture

This is the proposed target architecture, subject to an implementation-level inspection of the live Crashout schema and Cloudflare deployment configuration.

### Web client
- React + TypeScript for the expanded application UI.
- Mobile-first responsive layout; desktop layouts are an enhancement, not a separate game.
- Reusable accessible card component with a fixed information hierarchy.
- UI modules for Home, Collection, Card Catalogue, Packs, Shop, Deck Builder, Play, Match, Profile, Quests, Events and Settings.
- The existing alpha remains available and is not deleted while the new platform is developed.

### Hosting and API
- Cloudflare Pages for the REALMS web application.
- Cloudflare Workers for authenticated game/platform APIs.
- Cloudflare Durable Objects for authoritative live match sessions and ordered action processing.
- Supabase for persistent player/game data, using the existing Crashout identity authority.
- GitHub Actions for linting, unit/integration tests, build verification and deployment checks.

### Authority split
- **Browser:** presentation, user input, local interaction feedback. Never authoritative.
- **Worker/API:** authentication verification, permissions, deck legality, collection mutations, pack purchase/opening, currency ledger, rewards and match lifecycle.
- **Durable Object match session:** authoritative in-progress match state, turn/priority, legal-action validation, hidden information, action sequencing, reconnect handling and final result.
- **Supabase:** durable player profile, inventory, card ownership, deck lists, set catalogue, wallet ledger, progression, match records and audit records.

### Design principles
- Server-authoritative economy and multiplayer.
- Stable canonical card IDs; owned copies are inventory quantities/instances, not new card definitions.
- Versioned card definitions and ruleset identifiers on every match.
- Idempotency keys for purchases, pack openings and reward claims.
- Append-only transaction/audit records for currency and inventory mutations.
- Database constraints and server checks for deck legality and copy limits.
- Explicit migration strategy; never make destructive schema changes in a feature branch without backup/rollback instructions.
- No secrets in client bundles or committed files.

## 5. Platform modules and acceptance requirements

### 5.1 Home / player hub
Must display the player's REALMS identity, progression, current quests, collection summary, recent matches, featured sets and entry points to Collection, Decks, Shop and Play. Empty states must be designed rather than showing broken or blank panels.

### 5.2 Card catalogue and collection
Must support:
- Search by card name and canonical ID.
- Filters for faction, card type, cost, rarity, set, owned/unowned and other canonical attributes.
- Sort by name, cost, rarity, faction and recently acquired.
- Card detail inspection with complete rules text and placeholder art.
- Owned quantity, duplicate quantity and collection completion.
- Favourites and deck-use indicators.
- Stable card IDs and versioned definitions.

A card definition is not an owned card. Inventory ownership is stored separately and cannot be edited by the client.

### 5.3 Placeholder card presentation
Build a reusable card frame that supports:
- Faction-specific visual identity.
- Type badge and resource cost.
- Name and rarity treatment.
- Art placeholder panel keyed by faction/card type.
- Creature STR/HP or type-specific data.
- Full rules text and keyword treatment.
- Accessible contrast, readable minimum text sizes and responsive sizing.

The placeholder is a deliberate designed component, not a broken-image icon or a generated image. It must use the same card component and data contract that final art will use. Artwork is loaded by a replaceable asset key/URL; card IDs and gameplay data never depend on the artwork file name.

### 5.4 Deck builder
Must support create, rename, duplicate, delete, save, select and validate decks. Display:
- Card count against the actual REALMS deck-size rule.
- Faction and any legal composition restrictions.
- Copy limits and Legendary restrictions, if applicable in the locked ruleset.
- Curve/resource distribution.
- Card-type breakdown.
- Missing-card indicators and owned/needed quantities.
- Search/filter/add/remove controls.
- Starter-deck templates.
- Deck code import/export only after a stable format is specified.

Deck legality must be computed by shared server/domain rules, not only by front-end counters. Do not infer composition restrictions from other TCGs.

### 5.5 Packs and set catalogue
Build a configurable pack system only after the card/set catalogue and rarity model are defined. Requirements:
- Set and pack definitions stored as data.
- Server-side pack opening and random selection.
- Published odds and clear contents disclosure.
- Versioned, testable probability tables.
- Idempotent opening requests and immutable opening receipts.
- Collection grant and currency debit committed atomically.
- Duplicate policy explicitly defined before implementation.
- Test mode with seeded deterministic outcomes.
- Pack-opening presentation can be polished later; the grant/transaction logic must be correct first.

**Open design item:** the current canonical v0.9 card JSON does not declare a rarity field. Do not invent Common/Rare/Epic/Legendary assignments or booster odds. A rarity taxonomy and distribution require a deliberate REALMS design decision and approval. The existing Legendary marker is not enough to infer a complete pack rarity system.

### 5.6 Shop and economy
- REALMS-owned earnable currency and optional premium currency must be separate from other Crashout destinations.
- Server-authoritative balances.
- Append-only ledger with transaction reason, source, idempotency key and timestamp.
- Configurable offers, prices, availability windows and purchase limits.
- No real-money payment integration in the initial test build.
- Test currency and sandbox offers for QA.
- Never let the browser write a balance or directly grant cards.

**Open design item:** currency names, earning rates, pack prices, duplicate conversion and monetization model are not defined by the v0.9 card file. Use a sandbox-only economy until approved.

### 5.7 Gameplay and rules engine
The existing REALMS engine is the rules authority for the alpha. First extract its rule boundaries and card-effect coverage into tests; do not port or rewrite it wholesale as a first step.

Target capabilities:
- Deterministic match setup and shuffle with injectable seed for tests.
- Authoritative phase/turn/priority transitions.
- Server-validated legal actions.
- Hidden hand/deck information protected from opponents.
- Full event/action log.
- Explicit human target/choice prompts.
- Faction signature-system handling.
- Certified Realm behavior.
- Card effect handlers with coverage tracking.
- Ruleset version attached to every match.
- Reproducible bug reports from match seed + action log.

The current README/rules UI explicitly describes referee controls for unresolved or not-yet-scripted interactions and says full 150-card implementation is still being hardened. Therefore card-effect coverage must be audited and certified; do not claim all 150 cards are fully automated until each card's printed effects have a runtime handler and tests.

### 5.8 Bots
Build bot capability in layers:
1. Legal-action bot that never emits invalid actions.
2. Baseline strategy for card deployment, resource use and combat.
3. Faction-aware strategy for PRISM, FLUX, SIGIL, GROWTH and EQUIP/FORMATION.
4. Difficulty profiles and self-play evaluation.

Bots use the same legal-action interface as human players. Bot decisions must be logged and reproducible. Bot-versus-bot simulations are useful for regression and balance telemetry but do not replace human playtesting.

### 5.9 Private multiplayer
- Create/join private match with an invitation code/link.
- Server-authoritative match session.
- Hidden information isolation.
- Reconnection and resume.
- Disconnect/timeout policy.
- Match action log and result record.
- Friendly match does not mutate competitive ranking.

### 5.10 Competitive and live systems
Later releases may add matchmaking, ranked seasons, tournaments, quests, achievements, events, leaderboards, spectating and social features. These must be layered on top of stable identity, rules, match records and economy. They are not prerequisites for the first complete bot/friend-playable release.

### 5.11 Administration and live content
An authenticated admin surface should eventually manage card/set publication, pack tables, shop offers, events, balance/ruleset versioning and moderation. Every sensitive action must be permission-checked and audit-logged. Admin edits must publish versioned content rather than silently mutating historical match definitions.

## 6. TCG product-design benchmark workstream

The goal of benchmarking established TCGs is to learn the product patterns and usability reasons behind them, not copy another game's rules, art, terminology or proprietary presentation.

Study and document:
- Magic: The Gathering Arena — rules clarity, priority/stack communication, deck validation, formats and collection workflows.
- Pokémon TCG Live — onboarding, deck accessibility, collection navigation and play flows.
- Hearthstone — pack reveal pacing, card readability, tutorials and mobile interaction patterns.
- Legends of Runeterra — combat readability, board-state communication, action response windows and visual feedback.
- Disney Lorcana — approachable rules presentation, card information hierarchy and organized-play onboarding.

For each product, record: observed pattern, player problem solved, strengths, accessibility/mobile implications, what REALMS can adapt as a general principle, and what should not be copied. Use official rules/help/product documentation where possible and distinguish documented rules from interface observations.

This benchmark does not authorize changing REALMS' existing rules. Any proposed rules change remains a separate design decision.

## 7. Phased delivery plan

### Phase 0 — Foundation audit (current)
- Record current repository/runtime and rules authority.
- Inspect Crashout auth and Supabase destination-link integration.
- Inspect current Cloudflare Pages/Worker project and deployment ownership.
- Map existing card schema, card-effect handlers and tests.
- Produce a gap matrix and approved architecture.
- No changes to the playable alpha.

### Phase 1 — Platform shell and data contracts
- Add application shell and navigation in an isolated app path/build.
- Define card catalogue/set schema and validation.
- Define REALMS player profile, collection, decks and inventory contracts.
- Connect to Crashout identity through verified server integration.
- Add placeholder card component.
- Add test fixtures and schema validation.
- Keep existing alpha runnable.

### Phase 2 — Persistent collection and deck builder
- Starter-deck grant.
- Server-backed card inventory.
- Catalogue and collection views.
- Deck create/edit/save/validate.
- Ownership-aware deck building.
- Automated database and API tests.

### Phase 3 — Match engine hardening and bots
- Build complete effect coverage matrix.
- Add deterministic engine harness and regression tests.
- Close unresolved human-choice and referee-only paths.
- Bot legal-action and strategy layers.
- Complete match vs bot with persistent match record.

### Phase 4 — Private multiplayer
- Durable Object match sessions.
- Invite/join, hidden information, reconnect, action log.
- Two-client browser tests and server-side legality tests.

### Phase 5 — Packs, shop and progression
- Approve rarity taxonomy and set definitions.
- Approve currency/duplicate/pack policies.
- Implement atomic pack opening and purchase ledger.
- Starter rewards, quests and progression.
- Sandbox economy test suite.

### Phase 6 — Competitive/live operations and polish
- Ranked, events and tournaments.
- Admin publishing tools.
- Mobile/desktop QA, accessibility, performance and security.
- Final art and audio integration when assets are approved.

## 8. First release acceptance target

The first meaningful platform release is not a static mockup. A new player must be able to:
1. Enter REALMS using their Crashout account.
2. Receive a starter deck through a server-authorized grant.
3. Browse owned/unowned cards in a persistent collection.
4. Build and save a legal deck.
5. Start a complete match against a bot.
6. Complete a match using actual REALMS v0.9 rules and card effects covered by the certified ruleset.
7. View a match result and history record.
8. Re-enter later and find their account, collection and deck unchanged.

Private friend matches follow as the next multiplayer acceptance milestone. Packs/shop are not released until rarity, duplicate and currency policies have been approved and tested.

## 9. QA and release gates

Every feature PR must provide:
- Exact files changed.
- Tests added/changed and actual command/results.
- Database migration/rollback notes where applicable.
- Security/authorization considerations.
- Mobile and desktop browser evidence for UI changes.
- No secrets in source or logs.
- No mutation of production data during test runs.
- No unapproved change to card text, stats, costs, faction systems or Realm rules.
- Existing alpha smoke-test evidence when shared runtime files are touched.

A green build alone is not gameplay QA. Match completion, card-effect correctness, hidden-information isolation, reconnect behavior and persistent inventory must be tested at their respective milestones.

## 10. Decisions required before economy/pack implementation

These are intentionally not guessed:
1. Rarity tiers and which cards belong to each tier.
2. Booster pack size and guaranteed slot structure.
3. Duplicate handling: keep, convert, protect, or a defined combination.
4. REALMS earnable currency name and sources.
5. Pack prices and shop rotation.
6. Whether player-to-player trading will exist; if so, trade restrictions and fraud controls.
7. Starter deck composition/grant policy.
8. Competitive deck-copy rules and any format-specific restrictions not already locked.

Until these are approved, build the catalogue, collection, deckbuilder and sandbox test harness without assigning production pack odds or selling power.

## 11. Immediate next engineering actions

1. Inspect the latest Crashout repository PR/merge state and destination-link contract; confirm the stable user ID and server-side verification method.
2. Inspect Cloudflare configuration and determine whether REALMS should be a dedicated Pages project plus Worker or a routed sub-application; do not create resources or secrets until ownership and bindings are verified.
3. Inspect the complete current card data/runtime and build a card-effect coverage matrix for all 150 cards.
4. Inspect and run the existing tests in a reproducible environment; establish baseline results.
5. Propose a non-destructive app-shell boundary and database migration plan.
6. Only then begin Phase 1 implementation in separate PRs.

---

## 12. Explicit non-goals for this foundation PR

- No change to `main`.
- No merge or production deployment.
- No rewriting `src-v09/game.js`, `src-v09/cards.js` or the current boot loader.
- No invented rarity, pack odds, currency or economy balance.
- No invented card effects, faction mechanics or Realm rules.
- No production database migrations or credential changes.
- No claim that multiplayer, accounts, packs, shop or full card automation already exist.

This document establishes the safe path from the existing playable REALMS alpha to the complete digital TCG platform.
