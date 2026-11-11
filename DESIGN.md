# Lash Map — the visual system

A lash artist's working sheet. Porcelain pages like the white treatment room, kohl-black ink like
the gloves and tweezers, warm stone for quiet panels and one kohl band for the moment of care. The
photographs carry the colour (skin, daylight, one cobalt spoolie). The one ornament is the **lash
map**: hairline drawings of a lid line and its lashes, or a brow and its three measured points, that
explain what each treatment does.

## Tokens (src/styles/tokens.css — the only file with raw values)

| | |
|---|---|
| Porcelain `--paper` #f6f3ef | the page |
| Kohl `--ink` / `--accent` #17130f | type and the one action colour (owner-editable accent, white text) |
| Stone `--oat` #ece6de | the patch test panel, the booking band |
| Kohl band `--forest` #191512 | patch test & aftercare, the booking sheet header, the footer |
| Brow taupe `--taupe` #6f5b4c | mono labels (5.8:1 on porcelain, 5.2:1 on stone) |

Type: **Funnel Display** Light/Regular (headings, names, figures; tight negative tracking),
**Funnel Sans** (text), **Geist Mono** (labels: TIME, PRICE, how long a result lasts, section numbers).
No italic highlight trick, no gold, no gradients, no rounded cards.

## Layout

- **First screen:** type across the page (kicker, two-line headline; introduction and Book beside it),
  then one photograph cut at eye level filling the rest of the screen edge to edge — the CSS crops
  it to the height left (`object-position: 66% 14%` keeps the brow). Phones: headline, Book, then a
  square crop (`hero-eyeline-phone`).
- **A 12-column grid with a four-column rail:** section numbers, group names and photographs sit in
  the rail; content reads in the eight columns beside it. Hairline rules instead of cards.
- **The price list:** each group opens on a 2 px kohl rule with its name set large, a mono summary
  ("4 treatments · 20 min – 2 h · $30 – $165", from the engine) and a photograph. Rows: the name in
  Funnel Display and what it does on the left; the length (mono) and the price (display figures) on
  the right; one small outlined Book button. No per-row drawings — the lash map explains the
  treatments once, in *Which one?*. Brows mirror the rail to the right for rhythm; Together is one row.
- **Close up:** the one editorial image moment after the menu — three daylight close-ups of natural
  lashes and brows (a snapping row on phones), labelled Sample photo, never results.
- **Sections:** 01 Treatments & prices (Which one? drawings · Lashes / Brows / Together · patch test)
  → Close up → 02 Patch test & aftercare (kohl band) → 03 The studio → 04 Good to know → booking band (stone)
  → 05 Visit → footer (kohl).
- **The lash map** (`LashMapDiagram.tsx`): `currentColor`, non-scaling hairline strokes; natural
  lashes at 60 % opacity, added or tinted strokes at full strength; a brow map's dotted start · arch ·
  tail guides. Never decorative — each drawing labels a treatment.

## Rules

44 px tap targets, visible focus (2 px kohl ring), `prefers-reduced-motion` respected, every
text/background pair ≥ 4.5:1 (checked with `concepts/lash-brow-studio-lash-map/contrast.mjs`).
Photographs square-cornered; controls crisp (1–2 px radius).
