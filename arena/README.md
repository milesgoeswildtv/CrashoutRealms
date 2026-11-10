# REALMS — Standalone Realm Table

This is a clean, isolated game entry point at `/arena/`. It does not modify the retired root v0.9 runtime, the existing platform/Formation Lab, or production.

## Implemented in this build increment
- Standalone mobile-first Realm Table shell and navigation, with full card inspection before playing.
- Five current faction/Realm pairings: Prismites / Crystal Isle; Moon Demons / The Lost Star; Eliteborn / Upper Strata; Displacers / The Endless; Harvesters / Deadlands.
- Separate faction Special families: Prism, Sigil, Force, Synchrony and Yield.
- Local match loop: 20 Health, 6 Unit positions per player, 5-card opening hand, alternating placement, combat activations, simultaneous retaliation, direct attacks, discard and deck exhaustion.
- Basic AI opponent, local deck editing and deck legality checks, collection browser, pack opening, match rewards/history.
- Approved Eliteborn v1 source roster wired as 20 Force Units + 6 dual-Force Formations + 4 mono-Force Apex Formations. The source IDs, names, costs, Resource values, stats, rules text, Force labels and template routing are preserved in `arena/canon/eliteborn-v1.json`.
- Eliteborn Formation assembly combines selected Units' current STR and current HP into one battlefield position. A broken Formation sends its component Units and attached Formation Card to discard.
- Automated engine tests and CI syntax checks.

## Canon boundary and unfinished mechanics
The Eliteborn source is marked **CREATIVE/MECHANICAL REBUILD — NOT BALANCE LOCKED**. The Formation core is implemented, but card-specific Formation start/end-of-turn and On Break effects are not all resolved yet. The Eliteborn component-text behavior while formed is explicitly undecided in its source and is not invented here.

The other four factions still use generated prototype test data, not their approved final card rosters. Realm stage names, thresholds and effects remain scaffolding—not canon-certified Realm laws. Do not treat the current three-stage labels as approved design.

## Open integration work
Crashout identity and Telegram/Discord linking require the trusted destination adapter and server-side token handoff. Live multiplayer, friends, tournaments, authoritative collection/economy, and cross-device sync require server services. Browser-local storage is not a shared account or server-authoritative service.

No production deployment or merge is performed.
