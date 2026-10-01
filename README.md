# REALMS — iPhone Playable Alpha

This repository contains the mobile-first playable REALMS alpha.

## Play on iPhone

Once GitHub Pages is enabled for the repository, open the Pages URL in Safari, then use **Share → Add to Home Screen**. REALMS launches in standalone mode like an app.

No TestFlight, App Store account, npm, build process, server, database, or native iOS project is required for this alpha.

## Current runtime

The default page currently boots **REALMS v0.9 — Signature Systems Alpha** from `src-v09/`. The v0.9 runtime is an alpha rewrite of faction signature systems; it is **not balance-locked**. The existing five-card round-resource economy and simultaneous-retaliation combat remain in place while the signature systems are tested.

Current modes:
- Player vs AI
- Local two-player / hotseat
- AI vs AI Watch

Core match coverage:
- Five 30-card faction decks
- Both faction passives for every faction
- All five Realms
- Recurring selective hand cycle to 5 each round
- Five-card round-resource pool using the existing +1 / +2 card values
- Alternating Placement followed by alternating **Action Phase** creature activations
- Creature-vs-creature damage resolves simultaneously using snapshotted STR
- Direct player targeting, Taunt restrictions, deck-out damage, and HP victory
- Gameplay Readability R1 presentation: phase/turn communication, attack motion, retaliation callouts, recent-action feed, ACTED state, and legal-target highlighting
- Referee controls remain available for edge-case card text while full automation is hardened

## v0.9 faction signature systems

- **Living Geodes — Prism:** Pressure/Fold is retired. Cost-3 Prisms attach to friendly Geodes; choose one of the Prism's two printed colors. Completing the Geode's printed color recipe Cracks it permanently, with fused Prisms remaining attached and active.
- **Continuum — FLUX:** Sequence remains a visible 0–5 clock. Cost-0 FLUX cards arm in a visible Flux Zone and trigger when their exact ordered Sequence pattern occurs during the same round. Up to two may be armed.
- **Harvest — Growth:** Cost-3 Growths attach dormant to an ally and Bloom into ongoing effects when their prerequisite is fulfilled. Lifeblood/Nourished remains.
- **Moondemons — Sigil:** Cost-3 Sigils attach face-down to a friendly Moondemon and reveal when their prerequisite occurs. Bloodied and the universal 2-HP restore remain.
- **Eliteborn — Equip / Formation:** Equips remain the signature type and count toward Formation size. Formation thresholds drive card and Major effects.

## Mobile / PWA

The UI is portrait-first, safe-area aware, touch-first, and does not depend on hover. Hands, battlefield rows, signature zones, and action controls remain usable on narrow screens. The service worker caches the v0.9 static shell after the first successful hosted load.

The v0.9 boot loader uses versioned assets and clears stale REALMS service-worker/cache state when the boot version changes, preventing an older cached runtime from silently replacing the current alpha.

See `TESTING.md` for the current v0.9 playtest checklist.
