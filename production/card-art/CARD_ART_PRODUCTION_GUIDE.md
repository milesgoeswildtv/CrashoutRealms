# REALMS — CARD ART PRODUCTION GUIDE v1.0

## Authority
This guide and `CARD_ART_ROSTER.csv` define the production contract for the 150-card REALMS v0.9 roster. Gameplay data comes from `src-v09/cards.js` and is authoritative. Art production may interpret appearance, composition, pose, environment, lighting, and storytelling, but MUST NOT change card name, ID, faction, type, cost, Resource value, STR/HP, Cracked stats, Crack Recipe, Prism colors, rules text, or signature behavior.

## Production order
1. Living Geodes — GEO-001 to GEO-030
2. Continuum — CON-001 to CON-030
3. Moondemons — MON-001 to MON-030
4. Harvest — HAR-001 to HAR-030
5. Eliteborn — ELI-001 to ELI-030

Each faction is exactly 30 unique cards. Production is done in three verified waves:
- Wave A: 001–010
- Wave B: 011–020
- Wave C: 021–030
After each wave: QA every card, correct failures, then continue. Never knowingly carry a defect into the next wave.

## Master card specification
- Finished master: 1500 × 2100 px, portrait, opaque PNG.
- Ratio: 5:7.
- Safe text zone: keep critical text/icons at least 90 px from trim edge.
- One shared REALMS frame geometry across all factions. Faction skins and signature-card treatments may change material, ornament and color, but information positions remain stable.
- Art window should dominate the upper-middle card. UI chrome must support the art, not bury it.
- The final rendered card must use composited live text/layout. Do NOT ask an image model to render final rules text, numbers, or card names into the illustration.

## Fixed information hierarchy
TOP LEFT — Resource icon: +1 or +2.
TOP RIGHT — Cost.
NAME BAR — exact canonical name.
TYPE BADGE — exact type: Creature, Legendary Creature, Prism, FLUX, Sigil, Growth, Equip, Spell, Trap.
ART WINDOW — unique card illustration.
MECHANIC STRIP — signature-specific information when required.
RULES BOX — exact canonical rules text, fully readable.
BOTTOM LEFT — STR for creatures only.
BOTTOM RIGHT — HP for creatures only.
CARD ID — small but readable production ID along lower edge.

### Living Geodes creature extension
Dormant Geode creatures display:
- Dormant STR / HP in normal stat positions.
- a clear `CRACKS TO X / Y` secondary stat treatment;
- Crack Recipe as colored recipe icons immediately below art or at the top of rules box.
Cracked art does not require a separate second card. The illustration should hint at the creature’s potential transformation while keeping the printed stats explicit.

### Signature-card readability
PRISM — unmistakable dual-color split treatment. Both printed colors visible. Chosen-mode wording remains in rules. Never make a Prism look like a Creature.
FLUX — unmistakable temporal sequence ribbon/pattern. Cost remains 0. Pattern should be quickly scannable without relying on rules text alone.
SIGIL — clearly an attachment/talisman card, with a hidden/reveal visual motif. Do not make it look like a normal Spell.
GROWTH — clearly a dormant organic attachment that Blooms. Use an attachment/graft visual language, not a free-standing creature frame.
EQUIP — clearly a physical item/object. Formation contribution should be signaled with the Eliteborn Formation motif.
SPELL — event/phenomenon/action art; not a persistent object pretending to be an attachment.
TRAP — reactive/hazard presentation; retain the faction skin but use a consistent trap warning notch/glyph.

## Faction visual languages

### Living Geodes — Crystal Isle
Materials: living quartz, basalt, obsidian, mineral moss, translucent crystal, magma inclusions, refracted internal light.
Palette family: dark slate/graphite base + controlled spectral crystal accents. Red, Blue, Green and Violet are mechanic colors and must remain recognizable.
Shape language: fracture lines, facets, geodes, nested crystal chambers, mineral growth, geological pressure.
Creature variety is mandatory: hatchlings, eggs, cocoons, larvae, sentinels, parasites, clusters, colossi, brood creatures, worldheart-scale beings. Do NOT make 30 humanoid rock golems.
Prisms are artifacts/mineral phenomena, not creatures.
Legendary: Aurex must feel ancient, four-color, world-scale and unmistakably above normal Geodes.

### Continuum — temporal order / paradox
Materials: ivory ceramic, dark metal, fine brass, glass, temporal light, impossible geometry.
Palette: ivory, cyan, indigo, restrained brass, black temporal void.
Shape language: numbered arcs, rings, intervals, repeated silhouettes, loops, horizon lines, impossible pathways.
Avoid neon cyberpunk and generic steampunk. The faction should feel precise, elegant and uncanny.
FLUX cards are temporal events/patterns, not characters.

### Moondemons — blood moon pack
Materials: scarred hide, bone, moon-silver, dark leather, stone, lunar glyphs.
Palette: midnight blue/black, blood red, moon silver, pale bone.
Shape language: claws, crescents, pack silhouettes, scars, predatory arcs.
Avoid gore-for-gore’s-sake. Violence can be intense, but silhouettes and character identity matter more than viscera.
Each creature should feel like a distinct member/species/role in the same predatory lunar ecology.
Sigils should be clearly related but individually recognizable talismans/glyphs.

### Harvest — living cultivation
Materials: bark, root, fungal tissue, thorn, fruit, sap, soil, grafted flesh/wood.
Palette: moss, dark soil, ochre, amber sap, muted fungal cream, bruised plant reds.
Shape language: branching, graft scars, root systems, fruiting bodies, cultivated asymmetry.
Avoid turning every card into the same tree monster. Use beasts, caretakers, fungal colonies, orchard entities, root-creatures, grafted animals, botanical phenomena.
Growth cards should look like attachable living organisms/grafts, distinct from full Creatures.

### Eliteborn — formation and oath
Materials: worn steel, ivory cloth, leather, heraldic brass/gold, banners, practical field gear.
Palette: gunmetal, ivory, royal blue, restrained crimson, heraldic gold.
Shape language: ranks, shield walls, paired geometry, banners, oath marks, clean military diagonals.
Avoid glossy generic fantasy-paladin sameness. Characters need role-specific gear and silhouettes: page, squire, medic, lancer, engineer, marshal, champion, etc.
Equip cards should prominently show the item itself.
Legendary Caedryn should be visibly command-scale, battle-worn and tied to Formation doctrine.

## Variety contract
Within each 30-card faction deck:
- no more than 2 consecutive cards may use the same camera angle;
- do not repeat the same creature silhouette;
- vary scale: macro/detail, single subject, paired scene, squad scene, environmental wide, colossal;
- vary posture: resting, braced, lunging, guarding, ritual/action, aftermath;
- vary environments while remaining faction-cohesive;
- avoid repeating identical circular glow behind every subject;
- avoid 30 center-framed waist-up portraits;
- reserve the most monumental framing for high-cost cards and the Legendary;
- the Legendary must be recognizable from a thumbnail.

Cohesion comes from shared materials, motif, frame, typography, palette family and rendering language — NOT from recycling the same composition.

## Naming and copy rules
- Canonical names are already authored. Never rename, shorten, pluralize, modernize or “improve” them.
- Preserve punctuation and capitalization exactly.
- Card IDs are immutable.
- Rules text is immutable for art production. If text appears contradictory or does not fit, report it; do not rewrite it.
- Game keywords remain visually emphasized consistently: Crack, Cracked, PRISM, FLUX, SIGIL, GROWTH, Formation, Bloodied, Sequence Complete, High Sequence, etc.

## Template rules
One information architecture, five faction skins, and clear type variants.
A player must identify faction + type + cost + Resource + creature stats from a thumbnail-sized card without reading the rules paragraph.
Do not make type identity color-only. Use badge shape/iconography as well, for colorblind readability.
Legendary cards use elevated ornament and a Legendary marker, but keep the same information positions.
Do not allow art to cover rule text, cost, Resource, recipe, Prism colors or creature stats.

## Art generation workflow
For each card:
1. Read the exact roster row.
2. Generate illustration only, using the faction guide + `art_target`.
3. Reject generic or duplicate-looking art before compositing.
4. Composite illustration into the canonical template.
5. Typeset exact canonical card data.
6. Export 1500×2100 PNG.
7. Visually inspect at full size and thumbnail.
8. Fix until PASS.
Do not rely on AI-generated typography.

## Wave QA — required after each set of 10
Every card must pass:
- correct ID;
- exact name;
- correct faction skin;
- correct card type badge;
- correct Cost;
- correct +1/+2 Resource;
- correct STR/HP if creature;
- correct Cracked stats + recipe if Geode creature;
- exact Prism colors/modes if Prism;
- exact rules text with no truncation;
- text readable;
- no misspellings;
- no duplicate art;
- no unintended extra limbs/objects that change identity;
- strong silhouette;
- art matches the descriptor and printed mechanic;
- template alignment is consistent;
- no crop of critical subject;
- card is 1500×2100;
- no watermark;
- no placeholder text;
- no legacy mechanics added.

If any card fails, repair it before beginning the next wave.

## Final faction QA
After all 30:
- contact-sheet review for repetition and faction cohesion;
- verify exact IDs 001–030 with no duplicates or gaps;
- verify the deck has all 30 unique canonical names;
- verify all Resource values and stats against `CARD_ART_ROSTER.csv`;
- compare Creature / signature / Spell / Trap silhouettes for readability;
- ensure Legendary is visibly premium;
- inspect 30-card spread for camera-angle and composition variety;
- repair anything that looks like template drift or art repetition.

## Export and ZIP contract
Per-card filename:
`<ID>_<Canonical-Name-Slug>.png`

Example:
`GEO-001_Pebbleheart-Hatchling.png`

Each faction package:
`REALMS_<Faction-Slug>_<PREFIX>-001-030_v1.zip`

ZIP MUST contain:
- all 30 finished PNG cards;
- `manifest.csv` for those 30 cards;
- `contact-sheet.jpg` showing all 30 fronts;
- `QA_REPORT.md` listing Wave A/B/C PASS status and any corrected cards;
- no source junk, caches, temp generations or rejected images.

## Builder behavior
The card builder is a production worker. It must create finished cards, not merely prompts or concept notes.
One hourly run targets one full 30-card faction deck:
1. cards 001–010 → create → QA → repair until PASS;
2. cards 011–020 → create → QA → repair until PASS;
3. cards 021–030 → create → QA → repair until PASS;
4. final 30-card contact-sheet QA → repair;
5. build ZIP;
6. deliver ZIP + contact sheet + concise QA summary.
Never knowingly ship a partial faction ZIP as “complete.”
If generation tooling genuinely prevents completion, preserve all completed files and report the exact blocker and exact remaining card IDs.

## Creativity requirement
Do not become mechanically repetitive just because the template is fixed.
The template is consistent; the ART is where variety lives.
Every card should have a clear visual idea, readable silhouette and reason to exist.
Use the roster art target as the starting aim, then make the scene feel authored rather than literal clip-art.
