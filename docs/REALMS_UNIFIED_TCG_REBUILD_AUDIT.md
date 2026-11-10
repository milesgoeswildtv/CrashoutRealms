# REALMS Unified TCG Rebuild — Repository Audit

Audit date: 2026-11-09
Base: `main` at `7e9e9a4045e30d15a14190b3cc03ea7b82a6c7bf`
Working branch: `rebuild/unified-tcg-foundation`

## Executive finding — correction after authority review

The repository contains two separate REALMS implementations, but the current platform documentation explicitly establishes the newer `platform/` application as the active product direction and the root v0.9 runtime as a legacy playtest artifact. The initial inspection incorrectly treated v0.9 as the behavioral authority. That conclusion is superseded by this correction: **do not extract or transplant v0.9 rules into the platform without a fresh owner-approved rules audit.**

1. **Root v0.9 runtime** (`index.html`, `src-v09/cards.js`, `src-v09/game.js`, `src-v09/styles.css`). The repository working contract (`AGENTS.md`) identifies this as the current playable runtime and says to preserve its rules. It contains five 30-card faction catalogues, the five-card recurring selective hand cycle, 20 starting Health, alternating Placement and Action, simultaneous creature combat, AI behavior, Realm effects, and faction signature systems. The game logic is substantial, but concentrated in a large browser runtime file.
2. **New platform** (`platform/`). This is the active product direction according to `platform/README.md` and `platform/contracts/architecture.md`. It has navigation, identity boundaries and a Realm-aware local Deck Workshop. Its Play destination uses `formation-engine.mjs` and `formation-lab.js`, which explicitly describe themselves as a local Eliteborn Formation test harness, not the complete shared ruleset. Only the Eliteborn catalogue is connected.

The current product gap is that the active platform has a partial local test game, while the complete shared rules and approved cross-faction catalogue are not connected. The legacy runtime can be studied as historical reference only; it must not silently supply current rules.

## Verified current state

### Root v0.9 runtime
- `src-v09/cards.js` is an 80 KB source file containing the runtime card data.
- `src-v09/game.js` is a 117 KB monolithic game runtime.
- `src-v09/styles.css` contains the current match styling.
- `REALMS_150_Cards_v0.9_Signature_Systems.json` is marked alpha / not balance-locked / human playtest required.
- `AGENTS.md` conflicts with the newer platform README: it calls root v0.9 authoritative, while `platform/README.md` explicitly says root v0.9 is historical and must not seed current card data. This is a governance conflict that must be resolved by the owner; the active platform's own explicit guardrails prohibit importing v0.9 gameplay as current authority.
- The v0.9 faction labels in the checked-in source are Living Geodes, Continuum, Harvest, Moondemons, and Eliteborn.
- The v0.9 source still uses the Realm label **Blood Moon** in runtime setup. The newer approved canon is **The Lost Star — Moon Demons**. This is a canon mismatch to reconcile; do not silently propagate Blood Moon.
- The current root runtime has an existing UI-only PR #26 that builds a conventional TCG table (opponent top, player bottom, hidden opponent hand, flexible battlefield rows, card inspector, deck/graveyard/banished zones). Its checks and Cloudflare preview deployment succeeded, but browser/device QA was explicitly not performed.

### New platform
- `platform/README.md` explicitly says the Formation Lab is a local test harness, not a complete match ruleset.
- `platform/game/formation-engine.mjs` currently has simplified 20-Health setup, a test resource calculation from the hand, fixed six-unit capacity, basic play/attack, and simplified scripted rival logic.
- `platform/game/formation-lab.js` renders six fixed visual slots and labels the match a local Formation test.
- `platform/game/deck-workshop.js` has all five Realm selections but only Eliteborn card definitions are connected.
- `platform/contracts/architecture.md` correctly specifies a future server-authoritative match boundary, but that service does not yet exist.
- PR #27 is open/draft and adds platform match setup plus deck copy validation. It remains unmerged. Its 30-card cap is not independently established as the new platform's final ruleset merely because the PR implements it.

### Open work that must not be blindly combined
- PR #25 is open/draft and stacked on PR #23's branch.
- PR #26 is open/draft and targets main; its preview deployment and static checks succeeded.
- PR #27 is open/draft and targets main; it adds setup and local deck limits to the platform.
- These represent different implementation paths. They should not be merged as a pile. The unified rebuild branch starts from main and will selectively carry forward validated work after integration review.

## Canon and known constraints

The platform's own README and architecture contract prohibit importing old v0.9 gameplay or card data as current authority. The 150-card v0.9 JSON is explicitly alpha/not balance-locked, and the card art rosters are art-production references, not automatically playable rules catalogues. The only catalogue presently connected to the active platform is Eliteborn, and its 30 card definitions are a test source whose full card effects are not executed by the current match engine.

The platform documentation explicitly leaves shared match rules, approved card catalogue, deck size, deck legality, Realm stages and server-authoritative services unresolved. This audit cannot honestly mark those as complete or invent values for them.



The approved Realm/faction identity for the unified game is:
- Crystal Isle — Prismites
- The Lost Star — Moon Demons
- Upper Strata — Eliteborn
- The Endless — Continuum Displacers
- Deadlands — Harvesters

Existing v0.9 mechanics must be audited and mapped to those identities before reuse. The alpha rules source establishes these shared foundations: 30-card faction decks, a five-card recurring selective hand cycle, printed +1/+2 Resource values, 20 starting Health, alternating Placement, alternating Action activations, simultaneous creature-vs-creature damage unless card text changes timing, and direct player attacks subject to Taunt/other explicit effects.

Previously confirmed deck copy constraints:
- Standard Units: up to 4 copies of each individual card.
- Legendary cards: up to 1 copy of each individual Legendary.
- Special cards: up to 1 copy of each individual Special.

Do not assume that all v0.9 signature types map one-to-one to the newer Standard Unit / Legendary / Special categories. Validate each card type and the latest approved card source before publishing deck legality. Do not invent Realm stage thresholds/effects.

## Recommended technical direction

**Do not build another isolated engine in `platform/game` and do not throw away the v0.9 rules.**

Use the existing v0.9 runtime as the behavioral reference and extract its rules into a testable engine boundary, then make the new platform's Play destination render that engine. The existing v0.9 table UI work can inform the presentation, but the platform should ultimately have one match implementation and one source of card/rules truth.

Target separation:
- `engine/state`: canonical match state and immutable snapshots
- `engine/turns`: Placement / Action / round transitions and initiative
- `engine/resources`: five-card selective cycle and resource calculation/spending
- `engine/zones`: deck, hand, battlefield, traps/attachments, discard, banished/shared Grave State
- `engine/cards`: card play, costs, type-specific entry behavior
- `engine/combat`: legal activation, target validation, simultaneous damage, retaliation, Taunt, direct attacks
- `engine/effects`: typed effect commands, triggers, explicit human choices, resolution
- `engine/realms`: the five Realm rule modules
- `engine/factions`: signature-system modules for Prism, FLUX, Sigil, Growth, and Equip/Formation
- `engine/ai`: legal-action-driven opponent
- `engine/match`: victory, defeat, draw, replay, event log
- `platform/game`: UI only; it renders snapshots and dispatches player intent

The first playable milestone should be a complete end-to-end match for one fully supported faction/Realm matchup using the real rules and catalogue. Then expand coverage across all five faction systems and Realm combinations. The final gate is complete cross-faction play, not a demo that merely renders cards.

## Blocking audit items before broad engine extraction

1. Reconcile the current approved Realm/faction names with v0.9's older labels, especially Blood Moon vs The Lost Star.
2. Identify the latest owner-approved card/rules source for each faction; the checked-in 150-card JSON is explicitly alpha and not balance-locked.
3. Inventory every card effect in the 150-card source against actual handlers in `src-v09/game.js`; classify implemented, partial, missing, and requiring explicit human choice.
4. Inventory every Realm effect and faction passive against runtime handlers and regression coverage.
5. Inspect PR #26's full implementation and test output before carrying its UI into the platform.
6. Reconcile PR #27 deck rules with actual approved card types; do not assume its local catalogue is sufficient.
7. Decide whether Realm Stage is a future mechanic or only a display element; no stage effects or thresholds are currently established in the platform documentation.

## QA and release policy

- Keep this work on `rebuild/unified-tcg-foundation`; do not merge to main or change production.
- Add deterministic engine tests for legal and illegal actions, state transitions, hidden information, combat, triggers, AI actions, and win/loss.
- Run all existing v0.9 and platform regression checks after each extraction milestone.
- Test human and AI paths separately, especially for target/choice effects.
- Run Cloudflare preview checks for deployment status. A green CI run is not browser QA.
- Perform actual iPhone and desktop browser match QA before calling the game playable.
- Report only tests and deployments that were actually observed.

## First implementation sequence

1. Create a parity inventory mapping existing v0.9 state/actions/effects to the proposed engine boundaries.
2. Add deterministic tests around the existing runtime's shared core rules before moving code.
3. Extract the shared match state, turn/round flow, zones, resource cycle, and combat into pure modules without changing behavior.
4. Connect a standard TCG table UI to those modules.
5. Add the real Deck Workshop/catalogue boundary and enforce approved deck legality.
6. Complete all faction and Realm effects, AI decision coverage, replay, and full-match QA.
