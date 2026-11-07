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
- No fabricated cards, inventory, wallet balances, prices, matches, or player identity.
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
- This foundation intentionally contains no card rules or card catalogue.
- Never expose the Supabase service-role key or any destination adapter secret to browser code.
- Never enable the REALMS destination registry entry until its adapter passes the full release gate.
