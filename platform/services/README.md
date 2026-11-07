# REALMS platform service boundaries

## Shared identity

`crashout-identity.js` is the only browser-facing identity adapter. It uses the existing Crashout Supabase project and its publishable key. Supabase Auth owns the session; REALMS does not create a second credential store or copy tokens into custom local storage.

The adapter reads the signed-in player's own Crashout profile and the RLS-protected `game_links` row for `game_key = realms`. It can request the central `start_destination_link` handshake, but it does not claim a link is complete until the central registry and server-side adapter have actually completed it.

## Trusted linking sequence

1. User authenticates with the existing Crashout identity.
2. Browser calls `start_destination_link('realms', 'existing' | 'create')`.
3. Crashout returns a single-use token, launch URL, and ten-minute expiry only when REALMS is enabled and ready.
4. REALMS server proves control of the existing destination account or provisions a new destination account.
5. REALMS server calls the central `complete-destination-link` Edge Function over HTTPS with its destination-specific adapter credential.
6. The gateway verifies the adapter credential and the database atomically consumes the token and creates `game_links`.

The browser must never call the completion RPC, hold an adapter credential, or trust a client-supplied Crashout user ID. The central gateway alone holds the Supabase service-role key.

## Current hard gate

The hosted registry currently reports REALMS as `adapter_required`, disabled, with no launch URL. The hosted project has migrations 0001–0014 and the central completion gateway, but REALMS' own server adapter and ownership/provisioning proof are not yet verified. Therefore the identity adapter is implemented, but link activation remains intentionally unavailable.

The central integration contract does not yet specify how the one-time token is delivered to the destination launch URL. Do not invent a query parameter or silently place the token in a URL until that handoff is agreed and documented.

## Browser configuration

`config.js` contains only the shared project URL and publishable key. These are browser-safe values. Service-role keys, destination adapter secrets, session-signing keys, and any other server credentials must stay in server-side secret stores.
