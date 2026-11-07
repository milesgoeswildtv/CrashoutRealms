# REALMS Platform Foundation

This is a separate, mobile-first platform entry point. It does not replace the legacy alpha at the repository root and does not modify the gameplay engine.

## Current scope

- Responsive platform shell with desktop rail and mobile bottom navigation.
- Home hub and explicit destinations for Collection, Decks, Play, Store, and Profile.
- Shared Crashout identity adapter using the existing Supabase Auth project.
- Discord OAuth and email/password sign-in to the same Crashout account; no second credential store.
- RLS-scoped reads of the signed-in player's Crashout profile and REALMS account link.
- A guarded destination-link request boundary that only accepts the central trusted handshake.
- Honest unavailable states until each real service is connected.
- No fabricated collection ownership, wallet balances, prices, multiplayer results, or player identity. The Formation Lab is an explicitly labeled local test harness, not an account-backed ranked match.
- Realm-aware Deck Workshop with all five canonical Realm/faction pairings, local card-list drafts, and an honest catalogue-availability boundary.
- No dependency on the retired v0.9 faction names or gameplay data.

## Run locally

Serve the `platform/` directory over HTTP(S); opening the HTML file directly is not supported because the app uses native ES modules. The browser loads the pinned Supabase JS 2.119.0 client from esm.sh. The public project URL and publishable key are in `config.js`; these are public browser configuration, never server credentials.

## Crashout Auth redirect setup

Before testing OAuth on a new preview or production hostname, add that exact HTTPS callback origin/path to the existing Crashout Supabase Auth URL Configuration allowlist. The Discord provider remains owned by Crashout. Do not create another OAuth application or copy provider secrets into REALMS.

## Hosting

For a separate Cloudflare Pages project, set the build output directory to `platform` and leave the build command empty. Do not change the existing production deployment until the new entry point has passed owner-reviewed browser QA.

## Identity and destination linking

The identity adapter reads the authenticated player's own `profiles` and `game_links` rows under the existing RLS policies. It never accepts a user ID from the browser as proof of identity.

The hosted Crashout project currently has migrations 0001–0014, including the trusted destination-link gateway. REALMS is still registered as `adapter_required`, disabled, and has no launch URL. The destination server adapter, stable player-ID provisioning, existing-account ownership proof, and launch-token handoff are not yet verified. The UI therefore leaves account-link actions disabled.

See [services/README.md](services/README.md) for the full trusted-link sequence and security boundaries.

## Playable vertical slice

Open Play → Formation Lab. The lab uses the 20 approved Eliteborn Unit definitions and 10 Formation definitions from the latest Eliteborn FRESH(2) source. It implements the locked Formation rules: exact Force requirements, sum of current STR and current HP, one Formation position, one damage recipient, and simultaneous component death when Formation HP reaches zero. The Formation card remains attached until the Formation breaks.

The lab intentionally does not claim to be the final match ruleset. Its 20 starting HP, six Unit positions, resource-from-hand test economy, simplified attack loop, and scripted opponent are test harness parameters. The complete secondary card text, Formation on-play/start/end/break effects, the open component-text ruling, and the shared cross-faction match rules are not implemented here. The battle mat now presents six Unit positions per player, Deck counts, expandable Graveyards, resource totals, and a deck-bound Realm / Stage panel. The Deck Workshop lets a player select one of the five canonical Realm/faction pairings and save a local deck draft in browser storage. The checked-in card catalogue currently contains Eliteborn definitions only, so card browsing is enabled for Upper Strata and other faction catalogues are explicitly marked pending rather than substituted. Deck size, copy limits, and legality remain unvalidated until the current shared rules are locked. The selected deck Realm is carried into the local match state and displayed on the battle mat. Stage names, effects, and advancement thresholds remain unconfigured pending approved rules. Realm cards are not part of the deck or card zones.

## Integration gates

1. Confirm the current five Realm/faction canon and approved shared rules.
2. Complete the REALMS server adapter and token handoff with the Crashout gateway.
3. Verify new-account provisioning and existing-account ownership proof.
4. Confirm the destination launch URL and enable REALMS only after end-to-end QA.
5. Define and migrate only against the existing approved Supabase schema.
6. Add authoritative collection, deck, pack, and match APIs.
7. Add a server-authoritative match session service before enabling live play.
8. Replace unavailable states only when the underlying service is implemented and tested.

## Guardrails

- The root `index.html` and `src-v09/` are legacy playtest artifacts, not current platform authority.
- `studio/` and historical visual-studio work must not seed current card data without a fresh canon check.
- The platform currently includes the Eliteborn test catalogue only; it is not the complete 150-card cross-faction catalogue.
- Never expose the Supabase service-role key or any destination adapter secret to browser code.
- Never enable the REALMS destination registry entry until its adapter passes the full release gate.
