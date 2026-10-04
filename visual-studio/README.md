# REALMS Visual Production Studio

A zero-build, local-first internal production tool for the REALMS TCG.

## Why zero-build?
This first implementation intentionally uses plain HTML/CSS/ES modules so it can be hosted free on Cloudflare Pages with no framework build step, no package manager, no backend, and no AI-builder credits.

## Data authority
The initial 25-card prototype records are synchronized to `REALMS_150_Cards_v0.9_Signature_Systems.json` in the parent repository. Visual art-direction notes are supporting metadata only.

## Local persistence
- status / notes / review state: `localStorage`
- artwork / faction references: `IndexedDB`
- nothing is uploaded to a server in this version

## Cloudflare Pages
Recommended configuration:
- Production branch: `realms-visual-studio` (until merged)
- Build command: leave blank
- Build output directory: `visual-studio`

Once merged to `main`, change the production branch to `main` if desired.

## Universal card chassis
Resource top-left / Cost top-right / Name + Faction top-center / Art / Type / Mechanic / Rules / STR bottom-left / ID bottom-center / HP bottom-right.

Faction skins may change material, palette, motif and ornament, but not card geometry.
