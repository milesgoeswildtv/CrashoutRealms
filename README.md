# REALMS — iPhone Playable Alpha v0.2

This is a zero-build, mobile-first playable REALMS alpha. It is designed to run on iPhone Safari and can be installed to the iPhone Home Screen as a PWA after hosting.

## Fastest deployment: GitHub Pages

1. Create a GitHub repository.
2. Upload **the contents of this folder** to the repository root.
3. In GitHub: **Settings → Pages → Deploy from a branch → main / root**.
4. Open the published URL in Safari on iPhone.
5. Tap **Share → Add to Home Screen**.
6. Launch REALMS from the new Home Screen icon.

No TestFlight, App Store account, npm, build process, server, database, or native iOS project is required for this alpha.

## iPhone-specific work in v0.2

- Portrait-first responsive layout.
- iPhone safe-area support for Dynamic Island/notch and Home indicator.
- 44px+ tap targets and touch-first card selection.
- Swipeable hand, battlefield, trap rows, and action controls.
- Sticky mobile action/referee dock.
- Bottom-sheet style setup, choices, mulligan, grave-state and rules modals.
- No gameplay action depends on hover.
- PWA manifest and Home Screen icons.
- Service worker caches the static game for repeat/offline launches after the first successful hosted load.

## Current gameplay modes

- Player vs AI
- Local two-player / hotseat
- AI vs AI Watch

The alpha includes the five 30-card faction decks, faction passives, v0.7 resource/round rules, Realms, Geode Pressure/Crack chains, Continuum Sequence, Deadlands shared Grave State/Echoes, and a referee panel for effects that are not yet fully automated.

## Why browser/PWA instead of TestFlight right now?

The entire current game is HTML/CSS/JavaScript, so a PWA gives the fastest real-device iteration loop. Every balance/UI change can go live from GitHub without creating an Xcode project, signing certificates, provisioning, or waiting for TestFlight processing. If REALMS later needs native iOS features, the web build can be wrapped or ported after the game rules and UX stabilize.
