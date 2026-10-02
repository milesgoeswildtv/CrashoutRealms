# AUTONOMOUS PROGRESS

## Runtime
- Authoritative playable runtime: v0.9 under `src-v09/`.
- Main inspected: `6a0cce501632c32047194bcf49ba936701448128`.
- Current certification target: **Deadlands**.
- Working branch: `automation/realms/deadlands-cert-matrix-r4`.

## Realm certification status

| Realm | Status |
| --- | --- |
| Deadlands | PARTIAL |
| Crystal Isle | UNVERIFIED |
| Upper Strata | UNVERIFIED |
| Blood Moon | UNVERIFIED |
| The Endless | UNVERIFIED |

## Work completed
- Re-verified the current Deadlands production path and prior certification branch.
- Added `tests/deadlands-v09.test.js` on a fresh branch from current main.
- Deterministic assertions cover shared Grave State, cross-owner reanimation, Grave Echo 1/1 + retained printed rules, Echo exit bypass, Absorption normal cost/current STR+HP transfer, absorber keeping its own printed rules rather than inheriting Echo rules, once-per-round gating, and round reset.
- Attempted to add a narrow GitHub Actions runner for the existing Geode regression plus Deadlands certification test; workflow-file mutation was rejected by repository safety and was not persisted.

## Tests
- `tests/geode-v09.test.js` was inspected as the established Node/vm production-runtime harness.
- The new Deadlands suite uses the same production `src-v09/cards.js` + `src-v09/game.js` runtime through `REALMS_DEBUG`.
- The connected repository surface does not expose a shell runner. The new suite is committed but has not been executed here, so Deadlands remains PARTIAL.

## Debug harness
Verified existing `window.REALMS_DEBUG` exposes production state/game start plus Deadlands helpers used by the deterministic suite; no duplicate gameplay engine was introduced.

## Known regressions / risks
- No runtime source or card data changed in this slice.
- Remaining Deadlands matrix still needs executable coverage for initiative permutations, board-capacity cases, direct attack/Taunt applicability, prevention/replacement, signature interactions, AI choice legality, and later Endless borrowing.

## Miles blockers
- None on Realm design. Repository safety currently blocks adding a workflow file, so executable CI for this suite remains unresolved.

## Next task
Get the committed Deadlands suite executing through an available runner/CI path, repair any failures, then extend the same suite through the remaining applicable Deadlands certification matrix. Do not advance to Crystal Isle until Deadlands is PASS.
