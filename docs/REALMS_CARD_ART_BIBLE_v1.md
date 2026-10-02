# REALMS — CARD ART PRODUCTION BIBLE v1

## Authority
Gameplay data comes from `src-v09/cards.js` on current `main`. Card IDs, names, types, Cost, Resource, STR/HP, Crack stats/recipes, signature colors, and rules text are canonical. Art production may improve presentation only. It may not rebalance, rename, rewrite, simplify, or reinterpret mechanics.

## Production order
1. Living Geodes — GEO-001 through GEO-030
2. Continuum — CON-001 through CON-030
3. Moondemons — MON-001 through MON-030
4. Harvest — HAR-001 through HAR-030
5. Eliteborn — ELI-001 through ELI-030

## Card-face information hierarchy
Every finished card must make these elements immediately legible:
- Faction identity
- Card name
- Card type
- Cost
- printed Resource (+1 or +2)
- rules text
- Creature STR / HP when applicable
- Geode Dormant and Cracked stats + Crack recipe when applicable
- Prism two-color choice when applicable
- FLUX ordered Sequence pattern when applicable
- Signature type marker: PRISM / FLUX / SIGIL / GROWTH / EQUIP
- Legendary treatment when applicable
- Card ID in a quiet production/footer position

Never invent stats for non-creature cards merely to fill space.

## Shared template system
Use one REALMS card geometry across all factions. Factions change materials, emblems, palette, ornament, and signature widgets—not basic information placement. The player should learn one layout and recognize all five factions instantly.

Recommended hierarchy:
- Top-left: Cost
- Top-center: Name
- Top-right: Resource (+1/+2)
- Beneath name: Type / signature subtype
- Center: artwork
- Lower rules panel: exact canonical rules text
- Bottom corners for Creatures: STR left / HP right
- Geode Creatures: Dormant stats plus clear Cracked stat treatment and exact recipe pips
- Footer: faction mark + card ID

## Type readability
CREATURE — strongest character/organism silhouette; STR/HP always visible.
LEGENDARY CREATURE — same Creature grammar plus restrained unique legendary crest/border escalation.
SPELL — event/process composition; no creature stat boxes.
TRAP — reactive/ambush composition and a distinct warning/trigger frame cue.
PRISM — artifact-centric, exactly two printed colors visibly paired.
FLUX — temporal pattern card with exact ordered Sequence prominently represented.
SIGIL — concealed talisman/mark language; should feel attachable and hidden before reveal.
GROWTH — dormant biological attachment with Bloom potential; not presented as a standalone fighter.
EQUIP — physical gear/object; visually attachable to a Creature.

## Faction visual bibles
### Living Geodes
- Theme: Living mineral organisms, subterranean ecosystems, metamorphosis through colored Prisms.
- Palette/materials: Basalt/graphite stone with luminous Red, Blue, Green, and Violet mineral light. Use neutral stone to keep the four Prism colors readable.
- Variety requirement: Use eggs, larvae, beasts, colonies, cocoons, sentinels, colossal organisms, crystal artifacts, cavern phenomena, and geological spell scenes. Do not make every creature a humanoid crystal golem.
- Signature treatment: PRISM cards are artifact-centric and visibly two-color. Geode creatures should visually support Dormant→Cracked transformation; Crack recipes must use exact printed color pips.

### Continuum
- Theme: Temporal civilization built around sequence, rhythm, intervals, loops, and impossible motion.
- Palette/materials: Ivory/charcoal, aged brass, cold cyan-white time light, restrained amber accents.
- Variety requirement: Mix humanoid adepts, temporal beasts, engines, architectural entities, abstract time phenomena, traps, and diagrammatic Flux scenes. Avoid generic neon sci-fi.
- Signature treatment: FLUX cards must look like zero-cost armed temporal patterns and visibly feature their exact ordered Sequence pattern.

### Moondemons
- Theme: Moonlit predatory pack culture fueled by controlled wounds, hunting, scars, and recovery.
- Palette/materials: Midnight indigo, moon-silver, bone, deep crimson. Blood cues should be stylized and readable, not gore-heavy.
- Variety requirement: Mix cubs, hounds, duelists, raiders, ritualists, large predators, sigil artifacts, pack scenes, and lunar traps.
- Signature treatment: SIGIL cards are face-down attachment talismans until revealed; art should read as a concealed mark/object with a clear reveal identity.

### Harvest
- Theme: Living agriculture, grafting, permanent growth, pruning, mycelium, orchards, and deliberate biological sacrifice.
- Palette/materials: Loam brown, moss/leaf green, straw gold, bark black, bruised plum/rot accents.
- Variety requirement: Mix plant-beasts, agrarian caretakers, orchard colossi, grafted animals, fungal networks, roots, field rituals, and attachment growths. Keep body-horror restrained rather than gross.
- Signature treatment: GROWTH cards should read as dormant attachments that visibly Bloom later; they are not independent creature portraits.

### Eliteborn
- Theme: Disciplined martial nobility, heraldry, formation geometry, mutual protection, ranks, and equipment.
- Palette/materials: Tempered steel, parchment, deep royal blue, muted crimson heraldry, warm brass. Avoid glossy casino gold.
- Variety requirement: Mix pages, soldiers, medics, engineers, champions, banners, weapons, shields, tactical formations, and command scenes.
- Signature treatment: EQUIP cards are physical gear, not character portraits. Formation size should be visually legible through staging without clutter.

## Variety contract — hard requirement
A faction deck must feel like one world, not one repeated prompt.
Across each 30-card deck:
- vary silhouette, scale, species/object class, camera distance, pose, background, lighting, and composition;
- do not repeat the same central pose more than twice in a 10-card batch;
- do not repeat the same background architecture/cavern/field/moon/formation setup more than twice in a 10-card batch;
- adjacent cards should not look like palette swaps;
- signature artifacts must still vary in construction and scene while preserving type readability;
- large/expensive cards should generally feel more imposing than low-cost cards without making cost itself a literal size scale;
- Legendary art must be unmistakably singular.

## Cohesion contract
Variety cannot break faction identity. Every card should still be recognizable as its faction before reading the title. Reuse faction material language, emblem system, typography, frame construction, and lighting logic while varying the actual subject and composition.

## Naming / text contract
Use the exact canonical names and capitalization from the roster. Do not paraphrase rules. Do not abbreviate card names. Do not change punctuation in Legendary names. Do not add flavor text unless a later approved template explicitly creates a flavor-text field.

## Text rendering contract
Card text must be typeset/rendered from canonical data, not hallucinated inside illustration art. Illustration prompts should request art WITHOUT embedded card text. Assemble text and stats in the card template afterward so spelling/numbers stay deterministic.

## Batch QA
Every set of 10 must be checked before continuing:
1. IDs/names match roster.
2. Correct faction and card type.
3. Cost and Resource match.
4. Creature stats match; non-creatures have no invented STR/HP.
5. Rules text matches exactly.
6. Signature widgets match exact mechanics/colors/pattern.
7. No accidental text baked into illustration.
8. No duplicate/reused artwork.
9. No major silhouette/composition repetition.
10. Faction cohesion remains obvious.
11. Card-face readability at mobile size is acceptable.
12. Transparent/edge/crop artifacts are absent.
13. Any failed card is regenerated/fixed before the next 10 begins.

## Hourly builder contract
One hourly run = one complete 30-card faction deck.
- Batch A: cards 001–010 → render → assemble → QA → fix all failures.
- Batch B: cards 011–020 → render → assemble → QA → fix all failures.
- Batch C: cards 021–030 → render → assemble → QA → fix all failures.
- Perform final 30-card cross-deck QA for variety, cohesion, naming, type clarity, and exact data.
- Export 30 individual finished card images plus a manifest/contact sheet if useful.
- ZIP the complete faction deck.
- Deliver the ZIP to Miles in that run.
- Do not move to the next faction until the current deck is complete and packaged.
- Maintain progress so the next run advances to the next faction in the production order.
