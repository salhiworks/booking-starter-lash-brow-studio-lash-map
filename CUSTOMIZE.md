# Make this starter yours — the Claude Code prompt

Fill in the four lines at the top, then paste the whole prompt into a Claude Code session opened in
this folder. It changes identity and words only, so it finishes in one short session.

```text
Customize this lash & brow studio starter for my business.

Studio name: <YOUR STUDIO NAME>
City and area: <CITY, AREA>
Time zone (IANA): <e.g. America/Chicago>
What I specialise in, how I work and my personality in a few words: <e.g. natural classic sets and brow lamination, calm and precise>

Follow CLAUDE.md (already loaded in this session — no need to open it again).
Open and change only these files; don't explore the rest of the project:
1. src/site.config.ts — name, timezone, and fictional previewContact details in my city.
2. index.html and admin/index.html — the studio name, city and description in <title>,
   the meta description and the og tags.
3. src/content/site.ts — rewrite every DEFAULT text for my studio: the name mark and the line
   beside it, what I am and where, the headline, introduction and main button, the treatments
   heading and introduction, the four "Which one?" texts (keep their order: natural lashes ·
   extensions · a lift · a tint), the Lashes / Brows / Together lines and photo captions, the patch
   test heading and text, the small print, the patch test & aftercare points and note, the studio
   text and facts, Good to know (my real policies), the booking heading and introduction, the
   finding-us note, the footer line and the search title and description. Keep field ids, types,
   limits and photos. Keep the sample photos (they stay labelled "Sample photo" until I upload my own).
   Keep the honesty rules: no promised results or medical claims; a patch test lowers the risk of a
   reaction and never rules one out; the booking form never asks about health or allergies and the
   site never suggests the booking system checks anyone's suitability; nothing is paid online; no
   treatment lengths or prices written into the copy; no invented clients, results, before/after
   photos, qualifications, years of experience, awards, press, reviews or testimonials.
4. Only if kohl black clearly doesn't fit my brand (otherwise skip this step): change the default
   of brand.accent in src/content/site.ts (a deep colour that keeps white text at 4.5:1 — espresso,
   deep plum, ink blue), the colours in src/admin-theme.css and the colour in public/favicon.svg.

Do not change the layout, the booking flow, src/lib/engine.ts, src/lib/preset.ts,
src/lib/services.ts, src/demo/, supabase/, booking-engine.lock.json or package.json.
Do not invent treatments, prices, opening hours or credentials I haven't told you about —
treatments, prices and hours are set in the dashboard. When done, run npm run build and fix any
error, then show me the result with npm run dev.
```

## After the prompt

- **Your treatments:** dashboard → Services. One booking is one appointment with you.
  - **Groups.** The page sorts services by the words in their names: a lash word *and* a brow word
    (e.g. *Lift & Lamination*), or *combo / package / together*, → **Together**; *brow, lamination,
    wax, thread, henna* → **Brows**; *lash, extension, full set, infill, refill, lift, classic,
    volume, hybrid* → **Lashes**; *patch test / skin test* → **the patch test**. Otherwise the
    description decides, then "More treatments".
  - **The drawings** follow the same words: extensions, infill, lift, tint, brow shape, brow tint,
    lamination, combination.
  - **How long it lasts.** End a description with `Lasts:` — `Lasts: usually 6–8 weeks`. Keep it
    approximate.
  - **The patch test** is its own free, short service. Renamed it? Write the new name in Website →
    Treatments & prices → *Patch test service*.
- **Photos:** Website → each section. Use only your own work (with your client's permission) or
  photos you have the right to use. The "Sample photo" label disappears from each one you replace.
- **Online booking:** dashboard → Settings, once email sending works (see BOOKING_ENGINE.md).
