# REALMS — New Arena Experience Direction

Status: visual/product direction for the unified platform rebuild
Date: 2026-11-09

This is a new experience direction, not a claim that the match engine is complete. The Arena must ultimately be the live client for the authoritative REALMS rules engine.

## Experience concept: THE REALM TABLE

The match should feel like entering a physical card table built inside the world of REALMS—not a generic admin dashboard and not a formation-slot puzzle.

### Visual language
- A dark, tactile tabletop with mineral, weathered-paper, etched-metal and ink textures.
- Strong readable card frames and clear typography before any final illustration exists.
- Realm identity appears as environmental atmosphere and a restrained stage marker, never as an extra card zone.
- Distinct visual treatment for the two player sides; opponent information is intentionally less exposed.
- No casino motifs, no purple/gold luxury styling, no excessive neon, no generic sci-fi HUD.

### Match composition
1. **Opponent rail (top):** avatar/name, Health, public resource state, deck/graveyard counts, concealed hand count.
2. **Opponent battlefield:** flexible horizontal card row(s), no empty fixed-slot grid.
3. **Realm spine (center):** selected Realm identity, only approved stage data, active turn/phase and a compact match event ticker.
4. **Player battlefield:** flexible horizontal card row(s), attachments shown as part of their host card, readable combat-ready/exhausted state.
5. **Player rail (bottom):** Health, resource pool and legal phase controls.
6. **Hand dock:** horizontal card fan/scroll region with large enough touch targets; inspect and zoom without losing table context.
7. **Side drawers:** deck, graveyard, banished/shared Grave State, match log and card detail. These are overlays/drawers, not permanent dashboard columns.

### Interaction principles
- Selecting a card opens an action context derived from engine-provided legal actions.
- The interface never decides legality itself.
- Valid targets are highlighted only when the engine offers those target choices.
- Invalid actions are disabled with a short, specific reason supplied by the engine.
- Card inspection is available from every visible zone; hidden cards remain hidden.
- Every engine transition has a readable event/log entry and clear visual feedback.
- Touch-first layout: opponent at top, player at bottom, battlefield cards remain naturally horizontal and scroll/wrap without fixed numbered slots.

### Match lifecycle screens
- Match intro: opponent, selected deck/Realm and mulligan/starting-hand choices as approved by rules.
- Live table: complete match.
- Choice state: explicit target/option selection, with legal options only.
- Match result: victory/defeat/draw, match summary, replay.
- Reconnect/recovery: restore authoritative match snapshot when online sessions exist.

## Implementation constraints
- Do not hardcode the 20 HP / six-unit / hand-derived-resource assumptions from the current Formation Lab.
- Do not invent stage names, thresholds or effects.
- Do not render an action as available unless the engine provides it.
- Do not represent a card as playable unless its card definition and rules coverage are approved.
- Do not replace missing cross-faction cards with Eliteborn cards.
- Do not make the UI look complete while gameplay is still a placeholder.

## New engine/UI contract

The UI consumes a player-safe projection containing:
- match identifier and revision,
- active player and phase,
- player-visible player state,
- visible battlefield cards and attachments,
- concealed opponent hand count only,
- legal action offers with stable action IDs and human-readable labels,
- pending choice schema with legal options,
- recent public events,
- coverage/unsupported-effect warnings where applicable.

The client submits an action ID and any bounded choice payload. The engine revalidates the action against the current revision and ruleset. The client never submits authoritative state mutations.

## Acceptance criteria for calling the experience playable
- Every displayed action is engine-authorized.
- Every legal action has a visible interaction path.
- Every illegal action is rejected by the engine, not just hidden by the UI.
- Both human and opponent use the same legal-action interface.
- Complete matches reach an approved terminal result.
- No unsupported card or Realm effect is silently skipped.
- Match can be restarted and deterministic seeds reproduce the same state/event sequence.
- iPhone-sized and desktop browser QA are recorded separately from CI.
