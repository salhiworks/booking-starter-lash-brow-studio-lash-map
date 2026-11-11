# Lash & Brow Studio "Lash Map" Starter — project rules

A one-page booking website for an independent lash and brow artist, shipped as **Taper Lash & Brow**
(a fictional one-artist, one-bed studio in 12South, Nashville: classic lash extensions and infills, a
lash lift & tint, a lash tint, brow mapping & shaping, shape & tint, brow lamination, a lift &
lamination combination and a free patch test) for the owner to make their own. Its identity lives in
`src/site.config.ts`; `CUSTOMIZE.md` is the prompt that personalizes it. Built around
**@profitstudio/booking-engine** **2.0.0-beta.3** (pinned; lock in `booking-engine.lock.json`). The
engine owns booking; this project owns the public design.

Read before changing anything:
- `BOOKING_ENGINE.md` — the engine's rules (engine-owned; `npx booking-engine sync` replaces it).
- `node_modules/@profitstudio/booking-engine/docs/INTEGRATION.md` — the full contract. It wins on technical points.
- `DESIGN.md` — the visual system. `PHOTOS.md` — photo sources and licences.

## The Live Demo layer — leave it alone

- `src/demo/` is the public Live Demo's in-browser engine and sample data. Only
  `npm run dev:demo` / `npm run build:demo` use it (`vite --mode demo` defines
  `__BOOKING_DEMO__`); in every other build it is compiled out. Never read, edit
  or "fix" it while customizing the website.
- Keep the `__BOOKING_DEMO__ ? … : …` branches as they are: the demo wording
  (no email is sent) must stay true in the demo, and the real wording in production.
- `src/demo/engine/` is vendored from the Niche Pack workspace — edit it there.
- `src/admin-main.tsx` passes `emailDelivery={__BOOKING_DEMO__ ? 'none' : undefined}`:
  only the demo's dashboard says no email is sent. Never set it on a real site.

## Engine boundaries (from BOOKING_ENGINE.md)

- All booking data goes through the ONE instance in `src/lib/engine.ts`. Never import
  `@supabase/supabase-js` for booking data, call `booking_*` RPCs or write SQL for booking tables.
- Never edit `supabase/migrations/*_booking_engine_*.sql`, `supabase/functions/booking-mailer/`,
  `booking-engine.lock.json` or `node_modules`.
- Only the publishable key may reach the website (`VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`,
  both or neither). Never a secret/`service_role` key, never an email provider key, in any file or `VITE_` variable.
- Show only the slots `getAvailability()` returns; send `slot.startsAt` back unchanged; show dates and
  times in `business.timezone`. Never compute availability in the browser — the calendar only reshapes
  engine data with the engine's helpers (`monthGrid`, `groupSlotsByPartOfDay`, `isFewLeft`, `nextAvailableDay`…).
- Label slot times with the server's business-local `slot.time` / `confirmation.time` via `formatClockTime`.
- Book in two steps: `requestBooking()` → code step → `verifyBooking()`. "Send a new code" =
  `resendVerificationCode()`; "Choose another time" = await `cancelBookingRequest()`, then reload availability.
- Handle `ok: false` on every call. Show success only after `verifyBooking()` returned `ok: true`
  (pending → "Request received — we'll review your appointment and confirm the time shortly.",
  confirmed → "Your appointment is booked."). Preview answers `PREVIEW_MODE`: say so honestly, never a success screen.
- `business.policies.onlineBookingEnabled === false` (or `BOOKING_DISABLED`) → contact details instead of the flow.
- The engine sends every booking email. Never add an email service to the website.
- Keep the packaged dashboard on `/admin/` (`admin/index.html` → `src/admin-main.tsx`). Never fork or restyle it:
  `src/admin-theme.css` sets only `--pbe-accent` / `--pbe-accent-text` per mode.

## What the engine does not do — never fake it

**One booking = one appointment: a reserved block of the artist's time with one client, on one
calendar (one artist, one treatment bed).** Its length is the real time in the chair. Prices are paid
at the studio — never online. The artist reviews and confirms every request (`autoConfirm: false`).

**Health, suitability and the patch test.** The booking system screens nobody. The **Patch Test** is
its own free, short appointment, booked at least 48 hours before a first set, lift, lamination or
tint; the engine cannot link it to the treatment or check that it happened — the artist checks when
confirming, and the site says exactly that. A patch test **lowers** the risk of a reaction; it never
rules one out. Never promise results or longevity ("usually 6–8 weeks" only, from the service's own
"Lasts:"), never make medical or safety claims, never give medical advice (eye conditions, allergies,
pregnancy → "check with your doctor first and tell us before your appointment").

A new booking feature needs a new engine version — never custom database code or browser-side logic:

- linked bookings ("patch test before treatment"), eligibility windows for infills, intake or
  consent forms, health questionnaires, allergy records, client photo histories or lash-map records;
- deposits, cancellation fees, packages, memberships, gift cards or any online payment;
- several artists or calendars, room or bed allocation.

The booking notes field is **Anything we should know? (optional)** with the helper "For example the
look you like, or whether you've had lash or brow treatments before. Please don't include medical
details here — if you have an eye condition, allergies or sensitive skin, tell us when we confirm."
Never ask for health, allergy, medication or pregnancy details in the form. Proposed engine work:
`docs/ENGINE-PROPOSAL-lash-brow.md` in the Niche Pack workspace.

## Where things live

| What | Where |
|---|---|
| Engine instance (preview: name, `America/Chicago`, placeholder contact) | `src/lib/engine.ts` |
| This site's preset (sample treatments, hours, policies; "clients"/"appointments") — also the dashboard's starter set | `src/lib/preset.ts` (`sitePreset`) |
| Groups (Lashes · Brows · Together · the patch test · More, from the name, then the description), the lash-map drawing per row (`diagramOf`), the patch test (`patchTestService`, owner's name via `setPatchName`), "Lasts:" parsing, length and price terms, duration labels | `src/lib/services.ts` |
| What the owner can edit (every text, photo and caption, the four "Which one?" texts, group lines, the patch test text and service name, the three close-ups and their captions, care points, studio facts, Good to know, booking words, finding-us note, logo, button colour) | `src/content/site.ts` (`defineSiteContent`) |
| Content store + brand → CSS variable (`--accent`) | `src/lib/content.ts` |
| Design tokens — the ONLY file with raw colours, fonts, sizes, spacing | `src/styles/tokens.css` |
| Base / page / booking styles (tokens only) | `src/styles/base.css`, `site.css`, `booking.css` |
| Sections | `src/components/*.tsx` (Header, Hero `#top`, Treatments `#treatments` (Which one? · Lashes with the rail on the left, Brows mirrored to the right, Together · patch test), CloseUp (three editorial close-ups), Care `#care`, Studio `#studio`, GoodToKnow `#good-to-know`, BookingSection `#book`, Visit `#visit`, Footer; `LashMapDiagram` the one ornament); the section list for header, phone menu and footer is `src/lib/nav.ts` |
| Booking sheet (a modal `<dialog>` at `#book`; Back/Esc/✕ close it) + the `#book` band | `src/App.tsx` (open/close + history), `src/components/booking/BookingSheet.tsx`, `BookingSection.tsx`, `src/lib/dialog.ts` |
| Booking flow | `src/components/booking/` (BookingFlow = state + engine calls, root `#book-flow`; DayPicker, TimePicker, DetailsForm, CodeStep, Summary, Done) |
| "Open now" + hours changes | `src/lib/useOpening.ts`, `src/lib/hours.ts` |
| Photo variant map | `public/photos/`, `src/content/photoVariants.ts` (generated by `concepts/lash-brow-studio-lash-map/photo-pipeline/photos.mjs`) |
| Content baked into `index.html` at build | `vite.config.ts` (`publishedSiteContent`) |

## Rules for future changes

- **Content fields:** render values as text (never `dangerouslySetInnerHTML`), images from the resolved
  `src`/`alt`. Never rename or reuse a field id on a live site — add a new id. Treatments, prices,
  lengths, hours, the address, phone and email are NOT content: they come from the engine.
- `src/content/site.ts` is also imported by `vite.config.ts` (Node): keep it free of local imports.
- **Every Book button** calls `startBooking()` (App): it opens the sheet, or — while online booking is off,
  unconfigured or failing — leads to the `#book` section and its contact details. A treatment row's Book
  passes that service's engine id; "Book a patch test" passes `patchTestService(...)`'s id (shown only
  when it exists — never a stored price or id).
- **Lengths and prices:** always from the engine (`durationLabel`, `priceLabel`, `priceTerms`). Never
  hard-code a treatment, length, price or id in copy (Good to know answers included).
- **Sample photos:** every photo carries a "Sample photo" label until the owner replaces that field
  (`ownerFields`). Never present a stock photograph as the studio's work or a client's result, never
  show before/after images, never invent a client, a name, qualifications, years of experience,
  awards, press, reviews or testimonials.
- **Default photos:** add variants to `public/photos/` via the photo pipeline, keep the default `src`
  in `site.ts` equal to a key in `photoVariants.ts`, record the source in `PHOTOS.md`. If the
  first-screen default changes, update both `<link rel="preload">` in `index.html` (`imagesizes` must
  match `HERO_SIZES` / `SMALL` in `src/components/Hero.tsx`).
- **Policies:** Good to know shows a "Sample policies" label until the owner edits `faq.items`.
- **Copy:** calm, plain, specific ("we look at your eye shape…"); no "flawless", "perfect", "luxury",
  "transform", no result promises, no pressure.
- **Style:** plain CSS with the tokens; no UI kit. 44 px tap targets, visible focus, the
  `prefers-reduced-motion` path, every text/background pair at 4.5:1 (`contrast.mjs`). The button colour
  is owner-editable and always carries white text (`--on-accent`). Photographs square-cornered;
  controls crisp (1–2 px).
- **Composition:** the 12-column grid with the three-column rail (DESIGN.md). The lash map stays the
  one ornament — no eye or lash icons, no floating beauty clip-art, no gradients, no gold, no pink.
- The public site stays one page (sections + in-page booking flow); no client-side path routes.

## Commands

```bash
npm run dev                              # http://localhost:5197 (preview mode without a backend)
npm run build                            # tsc -b && vite build (multi-page: / and /admin/)
npm run lint                             # oxlint (supabase/functions is ignored)
npm run dev:demo                         # the Live Demo: in-browser engine + dashboard, nothing sent
npm run build:demo                       # the public Live Demo build — never the production site
npx booking-engine doctor                # project check
npx booking-engine doctor --dist dist    # after a build: scans the output for secrets
```

Connecting a backend (Supabase, email) follows INTEGRATION.md §11 — only with the owner's go-ahead.
