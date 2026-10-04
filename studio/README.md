# REALMS Visual Production Studio

A zero-build, local-first production workspace for REALMS card art, template consistency, prototype review, QA and export.

## Why this implementation is deliberately static

This app uses plain HTML/CSS/JavaScript so the production studio itself has no package-manager, bundler or framework credit dependency. It can be hosted for free on Cloudflare Pages, GitHub Pages, Netlify or any static host.

## Authority

- Gameplay/card data: current `REALMS_150_Cards_v0.9_Signature_Systems.json` in the repository.
- Runtime rules: repository `AGENTS.md` and current `src-v09/` implementation.
- Art direction: the project Google Drive visual-development briefs and Miles-approved review decisions.
- Template: one REALMS master chassis. Faction skins may change material/color/motif, but never information geometry.

## Current scope

- 25 authoritative prototype cards (001–005 for each faction)
- universal shared card renderer
- 5 faction skins
- Overview
- Card Library
- Prototype Review
- Card Studio with local image assignment/crop/zoom
- Template Lab
- Faction Bibles
- automatic + manual QA center
- Batches
- JSON state export/import
- localStorage state + IndexedDB artwork
- client-side PNG export via html2canvas CDN

## Run locally

Any static server works:

```bash
python3 -m http.server 8080 -d studio
```

Then open `http://localhost:8080`.

## Cloudflare Pages

Because this app has no build step, configure a Pages project with:

- Repository: `milesgoeswildtv/CrashoutRealms`
- Production branch: merge this PR, then use `main`
- Build command: leave blank
- Build output directory: `studio`

No paid backend is required.

## Persistence warning

Production state is local to the current browser/device in this free prototype. Export JSON frequently. Artwork is stored in IndexedDB and is not embedded into the JSON export.
