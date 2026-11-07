# REALMS — Digital TCG Product Benchmark v1
**Purpose:** Extract proven product-design patterns from established TCGs without copying their rules, visual identity, terminology or proprietary presentation.  
**Scope:** Product and UX benchmark, not a claim to have surveyed every TCG on the market.  
**Research date:** 2026-11-07

## Executive takeaways

A complete digital TCG is not just a match screen. The strongest recurring product patterns across the reviewed games are:

1. **A guided first session:** teach rules, give a playable starter deck and get the player into a match before exposing every system.
2. **Collection-to-deck continuity:** cards shown in deckbuilding clearly communicate owned, missing and usable status; collection filters and deck legality work together.
3. **Practice before pressure:** a test/practice mode against AI lowers the cost of experimenting with decks.
4. **Distinct play formats:** casual, ranked, limited and special-event modes serve different player motivations; they should not be forced into one queue.
5. **Readable rules and timing:** keyword definitions, legal action windows, target choice and resolution timing must be understandable in-game.
6. **Transparent product/economy logic:** pack contents, reward sources, card acquisition and any duplicate/crafting policy must be explicit.
7. **Progression that rewards play:** quests, seasonal tracks and event rewards provide goals beyond winning individual matches.
8. **Live rules/content governance:** formats, bans, set legality and rule documents need versions and update histories.

## Product-by-product observations

### 1. Magic: The Gathering Arena
**Official sources**
- https://magic.wizards.com/en/mtgarena
- https://magic.wizards.com/en/mtgarena/getting-started
- https://magic.wizards.com/en/news/mtg-arena/mtg-arena-formats
- https://mtgarena-support.wizards.com/hc/en-us/articles/360035728651-Gameplay-FAQ

**Observed product patterns**
- Multiple formats (for example Standard, Pioneer, Historic, Brawl and Timeless) distinguish different card pools and deckbuilding goals.
- Starter decks and a guided onboarding path lower the barrier to entry.
- Players acquire boosters and wildcard-style resources, then build, upload and edit decks.
- Deck legality is tied to the selected format; a deck is not treated as universally legal.
- Ranked, tournaments and limited events coexist with ordinary play.
- Cosmetics such as sleeves, avatars, companions and emotes give collection/progression a non-gameplay expression.

**What REALMS should learn**
- Make legality contextual to a named format/ruleset.
- Keep deck editor, collection and play-format selection connected.
- Treat starter decks as a designed onboarding product, not just a random grant.
- Version format legality independently from card definitions.

**What not to copy**
- Magic's stack, mana colors, card types, keyword vocabulary or turn structure. REALMS' own alternating Placement/Action phases and five-card resource cycle remain authoritative.

### 2. Pokémon TCG Live
**Official sources**
- https://www.pokemon.com/uk/pokemon-video-games/pokemon-trading-card-game-live
- https://www.pokemon.com/se/pokemon-tcg/spela-online/
- https://support.pokemon.com/hc/en-us/articles/360001024394-What-types-of-Trading-Card-Game-products-are-available
- https://support.pokemon.com/hc/en-us/articles/360000981613-What-can-I-expect-in-a-Pok%C3%A9mon-Trading-Card-Game-booster-pack

**Observed product patterns**
- A Test Deck feature allows players to try a deck against AI before taking it into player matches.
- Casual and Ranked play are distinct; supported formats include Standard and Expanded, with private friend battles.
- The Battle Pass combines quests, progression, ready-to-play decks, cards, packs and cosmetics.
- Players can acquire cards, packs and bundles through an in-game currency/exchange system.
- The physical product system distinguishes fixed-content preconstructed decks from randomized booster packs.

**What REALMS should learn**
- Deck testing against AI is a first-class feature, not a hidden debug option.
- Private matches should be a normal play route, not postponed indefinitely behind ranked matchmaking.
- A starter deck plus guided upgrade path makes the collection immediately useful.
- Keep preconstructed starter products distinct from randomized packs.
- Publish the pack model and probabilities only after REALMS defines its own rarity structure.

**What not to copy**
- Pokémon's energy system, prize cards, turn sequencing, card taxonomy or pack composition.

### 3. Hearthstone
**Official source**
- https://hearthstone.blizzard.com/en-us/news/24244450/welcome-back-to-hearthstone-a-returning-player-s-guide

**Observed product patterns**
- The returning-player guide points players toward prebuilt decks so they can enter play without first solving deck construction.
- Casual and Ranked modes serve different levels of competitive intent.
- Deck codes support portable deck sharing.
- Unowned cards are visually distinguished in the collection/deckbuilding workflow.
- The product explains current keywords and changes as part of onboarding.

**What REALMS should learn**
- Give players ready-to-play decks and make the first match frictionless.
- Show unowned cards in a deck list rather than silently hiding them.
- Add import/export only after REALMS deck legality and a stable code format are defined.
- Make keyword definitions and current rules accessible from card inspection.

**What not to copy**
- Hearthstone's class system, mana curve, board rules, turn ownership or presentation style.

### 4. Legends of Runeterra
**Official source**
- https://support.riotgames.com/en-us/legends-of-runeterra/gameplay/keywords-and-game-vocab-legends-of-runeterra/

**Observed gameplay/UI patterns**
- The official glossary distinguishes attack triggers from strike triggers.
- Attachments and equipment have explicit rules for what happens when a target already has one.
- Spell speeds (Burst, Fast, Focus and Slow) explain when a card may be played and whether an opponent gets a response opportunity.
- Timing vocabulary makes card text more precise and gives the interface a consistent way to communicate response windows.

**What REALMS should learn**
- Define a REALMS rules glossary with precise trigger words and timing semantics.
- Make attachment limits, replacement/removal behavior and zone changes explicit.
- Use clear UI states for legal actions, pending choices, resolving effects and opponent response windows if the ruleset ever introduces them.
- Test event ordering, not only final stats.

**What not to copy**
- Spell-speed classes, attack token, mana banking, Attach/Equipment rules or other Runeterra mechanics unless REALMS independently designs and approves an equivalent.

### 5. Disney Lorcana
**Official sources**
- https://disneylorcana.com/en/resources/
- https://disneylorcana.com/en/play/
- https://disneylorcana.com/en/play/ways-to-play/

**Observed product patterns**
- The official resource hub separates quick-start rules, comprehensive rules, FAQs and set notes.
- Rules and set documentation are versioned/updated, rather than treated as static one-time PDFs.
- Organized play has dedicated support for event creation and store/player workflows.
- Multiple formats include Core Constructed, Infinity Constructed, Pack Rush, Booster Draft and Sealed Deck.
- Limited formats provide distinct experiences built from newly opened packs rather than only from a player's permanent collection.

**What REALMS should learn**
- Maintain a player-facing quick start plus a detailed authoritative rules reference.
- Give each set and format a clear rules/legality version.
- Plan for limited formats as a later expansion once pack and set data are mature.
- Treat events and tournament operations as a product surface with organizer workflows, not only a leaderboard.

**What not to copy**
- Lorcana's ink, lore, turn structure, card categories, deck limits or branded layout.

## Cross-game patterns translated into REALMS requirements

| Pattern | REALMS implementation requirement | Timing |
|---|---|---|
| Guided onboarding | Tutorial path, starter deck, first bot match, glossary | First playable platform release |
| AI test deck | Bot practice using saved or temporary deck | First playable platform release |
| Collection/deck continuity | Owned/missing markers, filters, legality and missing-card counts | Collection/deck phase |
| Multiple formats | Format registry with ruleset ID and card legality | After core rules certification |
| Deck sharing | Stable export/import code with server-side validation | After deck schema stabilizes |
| Transparent packs | Server-side odds, pack receipts and public probability table | After rarity approval |
| Duplicate policy | Explicit duplicate display and approved handling policy | Before packs go live |
| Progression | Quests, season track, match rewards and achievement events | After match records are reliable |
| Event operations | Event templates, registration, ruleset lock and audit trail | Later live-ops phase |
| Rules glossary | Searchable keywords, timing terms and contextual card help | Core platform |
| Rules/version history | Versioned card data, rulesets, formats and match logs | Core architecture |
| Cosmetics | Sleeves, avatars, card backs and board themes that do not affect gameplay | Later polish |

## REALMS-specific design conclusions

1. **Do not add conventional mana just because other TCGs use it.** REALMS' five-card selective hand cycle and printed +1/+2 resources are foundational and explicitly preserved in the current alpha.
2. **Do not infer a rarity system from the single Legendary marker.** The canonical card JSON currently has no rarity field. Rarity and booster odds remain a design decision.
3. **Keep the existing 30-card faction construction rule.** Do not silently import 40/60-card conventions from other games.
4. **The five factions and five Realms are not generic classes/colors.** Their current signature mechanics and Realm certifications must remain intact.
5. **Bots are an onboarding and deck-testing feature.** Improve them through legal actions and faction strategy, not by letting them bypass the same rules as humans.
6. **The collection is the core product spine.** Card definitions, owned inventory, deck lists, packs and match logs must share canonical IDs but remain separate data concepts.
7. **A match must be explainable.** Show action history, choice prompts, trigger ordering and why an action is illegal.
8. **Limited modes come later.** Draft/sealed/pack-rush-like modes are valuable inspiration but require stable packs, set definitions and economy first.

## Open research items

- A deeper hands-on UX review of current live client interfaces, including mobile navigation, card zoom, collection filters and pack reveal pacing.
- Competitive format and tournament policy patterns across additional games.
- Accessibility review of card text scaling, color-independent faction identification, motion controls and screen-reader semantics.
- Economy and duplicate-policy comparison. Do not copy any one game's monetization model.
- Legal review of naming, iconography, tradeable assets and any user-to-user marketplace before launch.

## Sources and limitations

This is a focused benchmark of five representative digital/physical TCG ecosystems, not an exhaustive survey of every trading card game. Official publisher/support sources were prioritized. Interface observations should be revalidated against current clients during hands-on design review. The benchmark informs product UX and platform architecture only; it does not change REALMS card text, rules, balance or economy.
