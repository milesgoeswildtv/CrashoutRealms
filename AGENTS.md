# REALMS — Codex Working Contract

This repository is the playable REALMS card game. Treat the current v0.9 runtime and the newest explicit Miles-approved decisions as authoritative. Legacy v0.7/v0.8 files are historical reference only and must not be used to restore retired behavior.

## Repository / runtime
- Repo: `milesgoeswildtv/CrashoutRealms`
- Current playable runtime: `src-v09/`
- Entry point: `index.html`
- Service worker: `sw.js`
- Preserve the current boot architecture: no eval-based booting; cards load before game runtime; stale REALMS caches are version-busted; failed JS/CSS requests must never fall back to `index.html`.

## Core rules to preserve
- 30 unique cards per faction.
- Round hand cycle: keep any cards, return unwanted cards to deck, shuffle, draw until 5.
- Printed Resource values are +1/+2. The final 5-card hand generates that round's resource pool. Unspent resource expires unless a card says otherwise.
- Players start at 20 Health.
- Placement alternates one play/pass at a time; two consecutive passes advance to Action.
- Action alternates one creature activation at a time.
- No separate defend/block phase.
- Creature-v-creature damage and retaliation are simultaneous unless card text explicitly changes timing/retaliation.
- Direct player attacks must remain available when not blocked by Taunt or another explicit effect.
- Human effects that say choose/select/target must present an explicit legal choice. Do not use AI fallback targeting for humans.

## Faction signature systems
### Living Geodes — PRISM
- Pressure and Fold are retired. Do not reintroduce them.
- Dormant Geodes Crack by satisfying printed Prism color recipes.
- Prism cards attach to friendly Geodes, have exactly two printed colors/modes, and the chosen color both activates the mode and counts toward the Crack recipe.
- Prisms remain attached/fused after Crack unless card text says otherwise.

### Continuum — FLUX
- Persistent Sequence 0–5.
- FLUX cards cost 0 and arm until their printed ordered Sequence pattern occurs in the required turn/round window.

### Moondemons — SIGIL
- Sigils are hidden ally attachments that reveal on printed prerequisites.
- Bloodied remains a core state.

### Harvest — GROWTH
- Growths attach to friendly Harvest creatures and Bloom when prerequisites are met.
- Lifeblood/Nourished/Wither remain part of the faction identity.

### Eliteborn — EQUIP / FORMATION
- Equips remain persistent attachments and count toward Formation size as current v0.9 rules define.

Traditional Traps may still exist alongside signature card types. Do not normalize deck composition by assumption.

## Realm runtime
The manual Realm correctness pass has been merged through v0.9 Realm-certified alpha7:
- Deadlands: shared Grave State, explicit Grave Echo choice, 1/1 Echo retaining printed rules, Echo exit bypass, and once-per-round Absorption.
- Crystal Isle: simultaneous Polarity swap, persistent modifier layers preserved, and 5 Polarity-caused deaths loses; simultaneous five/five is a draw.
- Upper Strata: deterministic Overcharge and damage-conserving Chain Link.
- Blood Moon: Round 5+ banishment, two opening legal Action activations for Initiative player with no banking of an unavailable second action.
- The Endless: explicit legal matrix of two borrowed Realm effects; dependent Crystal/Deadlands Minors require their Major; retired prototype `Endless Shift` is removed.

Do not redesign Realm rules unless Miles explicitly asks.

## Current engineering priorities
1. Runtime/boot failures.
2. Human-choice correctness: every printed choose/select/target effect must actually let the human choose a legal target.
3. Card-effect coverage: printed effects must have real runtime handlers.
4. Combat/retaliation correctness.
5. Signature-system correctness.
6. Deterministic regression tests / debug hooks.
7. Readability/mobile polish that does not alter rules.

Do not autonomously rebalance economy, card costs, stats, faction passives, Realm rules, or deck composition unless fixing an obvious implementation mismatch with already-approved card text.

## Coding discipline
- Inspect current `main` and the requested working branch before editing.
- Do not overwrite newer work with a legacy implementation.
- Prefer one source of truth; avoid patch-on-patch wrappers when consolidation is safer.
- Remove retired/dead behavior when replacing it.
- Use a dedicated branch / PR. Do not merge speculative changes directly.
- Preserve existing functionality unrelated to the task.
- Never claim a test, deployment, browser proof, or merge that was not actually performed.

## QA expectations
When touching gameplay:
- Parse-check `src-v09/game.js` and `src-v09/cards.js`.
- If loader/cache files change, parse-check `index.html` inline scripts and `sw.js`.
- Preserve 30 cards/faction, exactly one Legendary/faction, and the current +1/+2 resource split unless the task explicitly changes them.
- Exercise changed gameplay with deterministic tests or debug scenarios when practical.
- Test human and AI paths separately for target/choice effects.
- Check for stale Pressure/Fold references whenever touching Geode code.

## Handoff style
At the end of a task, report:
- exact files changed,
- behavior implemented/fixed,
- tests actually run and results,
- remaining known gaps,
- branch/commit/PR information,
- anything requiring Miles' design decision.
