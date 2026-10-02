# AUTONOMOUS PROGRESS

## Runtime
- Authoritative playable runtime: v0.9 under `src-v09/`.
- Main inspected: `6a0cce501632c32047194bcf49ba936701448128`.
- Current certification target: **Deadlands**.
- Working branch: `realm-cert-deadlands-v3` (certification tests only).

## Realm certification status

| Realm | Status |
| --- | --- |
| Deadlands | PARTIAL |
| Crystal Isle | UNVERIFIED |
| Upper Strata | UNVERIFIED |
| Blood Moon | UNVERIFIED |
| The Endless | UNVERIFIED |

## Work completed
- Audited the existing Deadlands production path in `src-v09/game.js`.
- Verified existing implementation has a shared `graveState`, explicit human Grave Echo selection, AI Grave Echo selection, 1/1 Echo construction retaining printed `rules`, Echo bypass of Grave State on exit, explicit human Absorption Echo/creature selection, normal printed-cost payment, current STR/HP transfer only, and once-per-round Absorption reset.
- Added `tests/deadlands-v09.test.js` with deterministic assertions for shared Grave State, cross-owner reanimation, 1/1 + printed-text retention, Echo exit bypass, current-stat-only Absorption, normal cost, once-per-round gate, and round reset.

## Tests
- Existing `tests/geode-v09.test.js` was inspected as the runtime-test harness model.
- New Deadlands test file is committed, but **not yet executed in this environment** because the connected repository surface does not provide a shell/runner and there is no package/workflow runner exposed here.
- Deadlands remains PARTIAL until executable certification is green and the full matrix is covered.

## Debug harness
Existing `window.REALMS_DEBUG.deadlands` exposes:
- `canRaise`
- `raise`
- `useRaise`
- `canAbsorb`
- `absorb`
- `useAbsorb`
- shared grave accessor

The general debug surface also exposes state, game start, combat, Realm helpers, and Geode production rule functions.

## Known regressions / risks
- No new runtime regression identified in the Deadlands slice.
- The full v0.9 file still contains legacy pre-v0.9 implementation text earlier in the file that is superseded by the later v0.9 layer; do not delete or refactor it during Realm certification without a separate, evidenced cleanup pass.
- Deadlands has not yet passed the complete required certification matrix (initiative permutations, full board, Taunt/direct attack relevance, replacement/prevention interactions, signature interactions, and Endless borrowing).

## Miles blockers
- None currently. No Realm-rule ambiguity was required for this test slice.

## Next task
Execute the deterministic Deadlands test, repair any failures, then extend the same suite through the remaining applicable Deadlands certification matrix. Do not advance to Crystal Isle until Deadlands is PASS.
