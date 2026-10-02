# AUTONOMOUS PROGRESS
## Runtime
- Authoritative playable runtime: v0.9 under `src-v09/`.
- Main inspected: `6a0cce501632c32047194bcf49ba936701448128`.
- Current certification target: **Deadlands**.
- Working branch: `automation/realms/deadlands-executable-r7b`.

## Realm certification status
| Realm | Status |
| --- | --- |
| Deadlands | PARTIAL |
| Crystal Isle | UNVERIFIED |
| Upper Strata | UNVERIFIED |
| Blood Moon | UNVERIFIED |
| The Endless | UNVERIFIED |

## Work completed this run
- Found and corrected a real defect in the prior Deadlands test harness: it referenced `REALMS_DEBUG.testDocument`, which production does not export. The corrected harness retains its own mock-document handle instead of adding test-only production state.
- Added P1/P2 initiative-owner coverage.
- Executed an equivalent deterministic harness against current production `src-v09/cards.js` + `src-v09/game.js`: 33 assertions passed for shared Grave State, cross-owner raise, Echo 1/1 + printed rules, Echo bypass, Absorption cost/stat/rules semantics, once-per-round reset, explicit human choice, full-board gating, deterministic AI selection, and lethal-damage prevention.
- Production runtime/card/boot/service-worker source was not changed.

## Files / branch / commits / PRs
- Branch: `automation/realms/deadlands-executable-r7b`
- Test commit parented directly to current main: `d24f152c322c0220483cc414832e6360d32d4844`
- Changed: `tests/deadlands-v09.test.js`
- PR: not created yet.

## Tests actually run
- Production-runtime deterministic V8 harness: **PASS, 33 assertions**.
- Exact Node test file has not run in GitHub CI because no workflow runner is exposed here.

## Debug harness
- Verified production `window.REALMS_DEBUG` exposes the same production Deadlands functions used by certification.
- No duplicate gameplay engine or test-only production export added.

## Known regressions
- None introduced.

## Blockers requiring Miles
- Serial-death opportunity semantics need a decision only if certification confirms ambiguity: runtime stores boolean `deadlandsEchoReady`, while current rules copy says “A death grants its owner a Grave-Echo raise.” Multiple qualifying deaths before Placement therefore currently collapse to one pending raise.

## Single best next task
Certify serial/simultaneous Deadlands deaths and intended raise-opportunity count, then close remaining applicable matrix rows. Do not advance to Crystal Isle before Deadlands is PASS.
