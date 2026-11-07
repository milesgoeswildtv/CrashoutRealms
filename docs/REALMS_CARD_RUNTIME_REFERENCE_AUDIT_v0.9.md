# REALMS v0.9 — Card Runtime Reference Audit
**Status:** Static first-pass inventory; not a gameplay certification  
**Canonical data:** `REALMS_150_Cards_v0.9_Signature_Systems.json`  
**Runtime inspected:** `src-v09/game.js` on `main`

## Findings
- Canonical card definitions inspected: **150**.
- Cards with at least one exact card-ID literal in the runtime source: **91**.
- Cards without an exact card-ID literal in the runtime source: **59**.
- This is a search heuristic only. It is **not** an implementation-coverage percentage: generic handlers, data-driven effects, keyword/type handling and faction-wide rules may implement cards without naming their IDs; conversely, an ID reference may only cover one part of a card's text.
- Every card still requires a printed-text → handler → timing/targeting → test trace before it can be marked certified.

## Current confidence boundary
The current app remains a playable alpha with AI and local hotseat paths. Its own rules/help copy says some interactions still rely on referee controls and that full 150-card implementation is being hardened. This audit does not certify any card as complete, balanced or multiplayer-safe.

## Required next pass
For every card, record:
1. Printed rules text and structured fields.
2. Exact runtime handler(s) and trigger timing.
3. Legal targets and explicit human choice behavior.
4. AI decision behavior.
5. Edge cases, death/zone movement and interaction ordering.
6. Deterministic tests and result.
7. Reviewer sign-off.

The CSV beside this document is a sortable inventory of all canonical card IDs and whether the current runtime contains an exact ID literal. Treat it as a review queue, not a verdict.
