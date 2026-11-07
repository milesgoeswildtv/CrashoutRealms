# REALMS Platform Foundation

This is a separate, mobile-first platform entry point. It does not replace the legacy alpha at the repository root and does not modify the game engine.

## Current scope

- Responsive platform shell with desktop rail and mobile bottom navigation.
- Home hub and explicit destinations for Collection, Decks, Play, Store, and Profile.
- Honest unavailable states until each real service is connected.
- No fabricated cards, inventory, wallet balances, prices, matches, or player identity.
- No dependency on the retired v0.9 faction names or gameplay data.

## Run locally

Open `index.html` in a browser, or serve this directory with any static file server.

## Hosting

For a separate Cloudflare Pages project, set the build output directory to `platform` and leave the build command empty. Do not change the existing production deployment until the new entry point has passed owner-reviewed browser QA.

## Integration gates

1. Confirm the current five Realm/faction canon and approved shared rules.
2. Connect the existing Crashout identity using the trusted destination-link adapter; do not create a second account system.
3. Define and migrate only against the existing approved Supabase schema.
4. Add authoritative collection, deck, wallet, and match APIs.
5. Add a server-authoritative match session service before enabling live play.
6. Replace unavailable states only when the underlying service is implemented and tested.

## Guardrails

- The root `index.html` and `src-v09/` are legacy playtest artifacts, not current platform authority.
- `studio/` and historical visual-studio work must not seed current card data without a fresh canon check.
- This foundation intentionally contains no card rules or card catalogue.
