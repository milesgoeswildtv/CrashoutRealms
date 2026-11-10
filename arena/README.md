# REALMS — Standalone Realm Table

This is a clean, isolated game entry point at `/arena/`. It does not modify the retired root v0.9 runtime, the existing platform/Formation Lab, or production.

## Implemented in this build increment
- Standalone mobile-first Realm Table shell and navigation.
- Five current faction/Realm pairings: Prismites / Crystal Isle; Moon Demons / The Lost Star; Eliteborn / Upper Strata; Displacers / The Endless; Harvesters / Deadlands.
- Separate Unit and faction Special families: Prism, Sigil, Force, Synchrony, Yield.
- Local playable match loop: 20 Health, 6 Unit slots per player, 5-card opening hand, +1/+2 printed resource values, alternating placement passes, alternating combat activations, simultaneous creature retaliation, direct attacks, discard and deck exhaustion.
- Faction-specific prototype action handlers and a basic AI opponent.
- Three-stage Realm progression framework (Awakening, Convergence, Ascendance).
- Local deck editing, catalogue browsing, collection storage, pack opening, match rewards/history.
- Local persistence only; no fabricated shared account, online multiplayer, or server-side economy.

## Important data boundary
The included 30-card-per-faction catalogue is generated prototype test data to make the shell and engine executable. It is **not** the approved final 150-card canon. Likewise the stage labels and stage modifiers are a playable scaffolding, not a claim that the newest Realm stage laws have been fully reconciled. The authoritative latest stage names, thresholds, and effects still need to replace the scaffolding before canon certification. The Lost Star mapping is current.

## Open integration work
Crashout identity and Telegram/Discord linking require the trusted destination adapter and server-side token handoff. Live multiplayer, tournaments, authoritative collection/economy, and cross-device sync require server services; this build does not pretend browser-local storage is those services.
