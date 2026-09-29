# REALMS — iPhone Playable Alpha

This repository contains the mobile-first playable REALMS alpha.

## Play on iPhone

Once GitHub Pages is enabled for the repository, open the Pages URL in Safari, then use **Share → Add to Home Screen**. REALMS launches in standalone mode like an app.

No TestFlight, App Store account, npm, build process, server, database, or native iOS project is required for this alpha.

## Current gameplay

- Player vs AI
- Local two-player / hotseat
- AI vs AI Watch
- Five 30-card faction decks
- Both faction passives for every faction
- All five Realms
- v0.7 five-card hand / +1 +2 resource economy
- Alternating Placement and Combat
- Living Geodes Pressure / Crack / Kimberlite / Fracture
- Continuum Sequence / Skip Ahead / Loop Back
- Harvest growth / sacrifice systems
- Moondemons Bloodthirst / Frenzied
- Eliteborn linking / formation systems
- Deadlands shared Grave State, Grave Echo stealing and absorption
- Referee controls for unresolved or not-yet-scripted interactions

## Mobile

The UI is portrait-first, safe-area aware, touch-first, and does not depend on hover. The hand, battlefield, traps and action controls are swipeable on narrow screens. A service worker caches the static game after the first successful hosted load.

See `TESTING.md` for the alpha playtest checklist.
