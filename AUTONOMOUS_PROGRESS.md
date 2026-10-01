# REALMS Autonomous Progress

## Runtime
- Authoritative runtime: v0.9 under src-v09/.
- Main SHA at run start: 02eed36343c92e58bf20e093b24c940ae1aa3984.
- Worker branch: automation/deadlands-shared-access-cert-v2.

## Current Realm certification target
Deadlands.

| Realm | Status |
|---|---|
| Deadlands | PARTIAL |
| Crystal Isle | UNVERIFIED |
| Upper Strata | UNVERIFIED |
| Blood Moon | UNVERIFIED |
| The Endless | UNVERIFIED |

## Exact work completed this run
- Re-read current main and the newest repository working contract.
- Confirmed the Deadlands shared-access defect still existed on current main.
- Fixed qualifying non-Echo deaths entering shared Grave State so the raise opportunity is offered to both players, not only the original owner.
- Preserved the existing active-Placement-player, board-capacity, Realm-active, readiness, and non-empty-Grave legality gates.
- Preserved explicit human Grave choice and AI automatic choice.
- Did not touch later Realms, card balance, deck composition, boot/service-worker code, or faction mechanics.

## Files / branches / commits / PRs
- Branch: automation/deadlands-shared-access-cert-v2
- src-v09/game.js changed.
- Gameplay commit: 8161e393be4d1e1011335797e211d0047a2dad5d.
- PR not yet opened when this handoff was written.

## Tests actually run
- Fresh source verification after commit: PASS; destroyUnit now offers Deadlands Echo readiness to both players for qualifying shared-Grave deaths.
- Executable browser/runtime certification matrix: NOT RUN in this environment.
- Deadlands remains PARTIAL; no executable PASS claim.

## Debug harness capabilities verified
window.REALMS_DEBUG exposes getState and the production Deadlands functions canRaise, raise, useRaise, canAbsorb, absorb, useAbsorb, and grave. Full deterministic state construction required for certification is still missing.

## Known gameplay/runtime regressions
- No new regression identified from the scoped shared-access correction.
- Deadlands still lacks executable matrix coverage for both initiative owners, board-capacity cases, serial deaths, human multiple-choice, AI choice, replacement/prevention interactions, and applicable signature interactions.
- Current main still contains legacy Pressure/Fold-era Geode code despite the v0.9 Prism directive. It was observed but intentionally not changed during this Deadlands-only run.

## Blockers requiring Miles
None for shared-Grave access; the approved rule is explicit.

## Single best next task
Add deterministic Deadlands certification coverage/harness setup using production functions, exercise the required human and AI matrix, and only promote Deadlands to PASS after those assertions execute successfully.
