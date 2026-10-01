# REALMS Autonomous Progress

## Runtime
- Authoritative runtime: v0.9 under `src-v09/`.
- Main SHA: `d70bf13d75ace57748b9c1e6a4c1051db67306fb`.
- Worker branch: `certify-deadlands-shared-access-v09`.

## Current Realm certification target
Deadlands.

| Realm | Status |
|---|---|
| Deadlands | PARTIAL |
| Crystal Isle | UNVERIFIED |
| Upper Strata | UNVERIFIED |
| Blood Moon | UNVERIFIED |
| The Endless | UNVERIFIED |

## Current certification finding
Deadlands shared Grave State is implemented, but a qualifying death currently calls `offerDeadlandsEcho` only for the dead creature's original owner. This violates the approved rule that either player may use a creature from the shared Grave State. The legal-use gate already checks the active Placement player, board capacity, active Major, readiness, and non-empty Grave State, so the scoped correction is to make a qualifying Grave-State entry offer the shared raise opportunity to both players while preserving turn authority.

## Verified existing Deadlands capabilities
- Shared `state.graveState`.
- Explicit human Grave-State choice UI with multiple legal options.
- AI legal automatic Grave-State selection.
- Grave Echo creation at 1 STR / 1 HP while retaining source card id/rules.
- Grave Echo exit bypasses Grave State.
- Explicit human Absorption selection flow.
- Absorption pays the new creature's normal cost and transfers Echo current STR/HP, not Echo printed text.
- Debug surface exposes Deadlands raise/absorb/grave production functions.

## Work this run
- Re-read current main and Deadlands certification branch.
- Confirmed no open PR currently carries the certification fix.
- Reproduced the owner-gating defect in current production source.
- Prepared the minimal source correction; GitHub contents mutation was blocked by the repository safety layer after fresh branch/file verification.
- Added this handoff so certification state is not lost between runs.

## Tests actually run
- Repository/source inspection only this run. No executable runtime test pass is claimed.
- Deadlands remains PARTIAL.

## Debug harness
Current `window.REALMS_DEBUG.deadlands` exposes: `canRaise`, `raise`, `useRaise`, `canAbsorb`, `absorb`, `useAbsorb`, and `grave`. It does not yet provide the full deterministic state-construction matrix required for PASS.

## Known regressions / blockers
- Deadlands shared access is owner-gated on qualifying death.
- No executable Deadlands certification matrix exists yet.
- Source write for the scoped fix was rejected by the GitHub safety layer; branch creation/read access are available.

## Miles decisions required
None for the shared-access defect; the approved rule is explicit.

## Single best next task
Land the shared-access correction, then add deterministic Deadlands certification coverage for both initiative owners, shared ownership selection, Echo exit, Absorption transfer, human/AI choice, board capacity, and applicable replacement/death interactions before promoting Deadlands to PASS.
