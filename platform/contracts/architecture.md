# REALMS production platform — service boundaries

This document defines implementation boundaries, not game rules. It deliberately leaves every card-, faction-, format-, economy-, and combat-specific value to the newest owner-approved REALMS source documents.

## 1. Identity and destination account

**Authority:** Crashout Auth and the central Crashout database.

- Crashout Auth owns login, sessions, account recovery, and social-provider identity.
- The stable Crashout user key is the authenticated Supabase user UUID.
- REALMS owns a separate stable destination player ID and all game-specific state.
- `game_links` is the only authority for the Crashout-user ↔ REALMS-player association.
- Never link by email, display name, username, or a client-supplied user ID.
- Existing-account linking requires proof of control of that exact REALMS account.
- New-account linking requires successful destination provisioning before the central link is completed.
- The browser never receives a destination adapter key or service-role key.

The current central database already has the destination registry, one-time link sessions, and the authenticated start RPC. The central completion gateway is deployed. REALMS remains disabled until its own adapter, ownership proof, provisioning, and launch-token handoff are verified.

## 2. Canonical card catalogue

**Authority:** owner-approved REALMS card source documents and the versioned published catalogue.

A card definition is immutable within a published catalogue version. A card definition must have a stable ID and provenance back to its approved source. The catalogue must distinguish:
- printable/card-face identity,
- rules text and structured effect metadata,
- Realm/faction affiliation as approved,
- card type and resource/cost data as approved,
- art asset reference and art approval state,
- catalogue version and publication status.

Do not generate a playable card record from an image filename, old v0.9 JSON, old roster CSV, or unapproved draft. A published card definition must be validated against the source document before it enters the runtime.

## 3. Collection and ownership

**Authority:** REALMS server-side collection service.

Collection is not the same thing as Crashout's generic shop inventory. The existing Crashout `player_inventory` table records quantities of purchased products; it does not, by itself, define TCG card ownership, card-instance identity, variants, trade locks, or pack-opening results.

The REALMS collection model must eventually represent:
- player ownership of a canonical card definition,
- copy count and, if approved, unique instance/variant identity,
- acquisition provenance (starter grant, pack, event, trade, reward),
- restrictions/locks needed by trading or competitive play,
- catalogue version compatibility.

No card copies are granted from the browser. Every grant is a server-authoritative, idempotent event. Duplicate event delivery must not duplicate ownership.

## 4. Deck workshop

**Authority:** REALMS ruleset validator and saved-deck service.

A saved deck is tied to a specific approved format/ruleset version. The service must validate card membership, copy limits, deck size, faction/Realm restrictions, and any other construction rules from the current approved rules documents.

Do not hardcode the retired alpha's deck size, resource split, faction names, starting health, or any other legacy rule into the new platform. The UI may support editing a decklist before rules are locked, but it must not mark a deck legal until the authoritative validator returns a result for a published format.

## 5. Match service

**Authority:** server-authoritative REALMS match runtime.

- The server owns turn order, resources, legal actions, hidden information, random outcomes, bot decisions, and match completion.
- The browser submits player intent, not authoritative state mutations.
- The server validates every command against the current state and ruleset.
- Human choices must be explicit and constrained to legal targets/options.
- Match events are append-only and ordered; commands carry idempotency keys.
- Reconnect restores the authoritative match snapshot and event cursor.
- Bot matches use the same engine and legal-action boundary as human matches.
- Match results are emitted to Crashout progression only after server verification.

Do not expose the legacy alpha runtime as a production multiplayer authority without a separate engine certification pass.

## 6. Store, packs, and economy

**Authority:** Crashout's per-game wallet/shop for purchases; REALMS server for pack redemption and card grants.

Crashout already has per-game shop catalogs, wallet ledger, purchase receipts, and an atomic purchase function. A purchase debits only the matching game's wallet and grants a generic product inventory record in the same transaction.

That does not yet define:
- REALMS pack contents or odds,
- pack-opening animation/results,
- card grants,
- pity/duplicate protection,
- trading or market rules,
- starter grants,
- currencies or prices.

REALMS must not mint balances, write wallet ledgers, or invent pack odds. If packs are sold as Crashout products, REALMS still needs an idempotent server-side redemption path that turns the purchased product into approved card ownership. No store item should be activated until purchase and redemption are both tested end-to-end.

## 7. Progression and social

**Authority:** Crashout for network identity/social; trusted REALMS service for game events.

Crashout has server-trusted achievement event ingestion. The browser cannot submit verified play activity or grant awards. REALMS must send match outcomes and progression events from its trusted server only, using the documented event contract and idempotency keys.

Friends and social identity remain Crashout-owned. REALMS can add game-specific match invitations or rivalry data, but should reference central Crashout identities through the approved link rather than copying a second friend graph.

## 8. Release gates

A service becomes visible as ready only when all are true:
1. Its contract is documented and reviewed.
2. Its source-of-truth data is owner-approved.
3. Its authorization and ownership boundaries are tested.
4. Its failure/retry/idempotency behavior is tested.
5. It has a production deployment target and observability.
6. Browser QA passes on iPhone-sized and desktop layouts.
7. The central destination registry is updated only after adapter verification.

Until then, the platform must show an honest pending/disabled state. No demo records or simulated balances should be mistaken for production data.
