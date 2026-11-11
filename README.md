# Lash & Brow Studio Booking Website — "Lash Map" Starter

A finished, premium booking website for an independent lash and brow artist, ready to make your own
with Claude Code and publish on Hostinger. It ships as **Taper Lash & Brow**, a fictional one-artist
studio in 12South, Nashville:

- a one-page studio website — a first screen with the headline set across the page and one
  photograph cut at eye level (brow and lashes in one strip), **Book an appointment**;
  **treatments & prices**: *Which one?* — natural lashes, extensions, a lift and a tint drawn side by
  side as lash maps — then **Lashes**, **Brows** and **Together**, every treatment with what it does,
  roughly how long the result lasts, its real length and price from the booking system and its own
  Book link; the free **patch test** as its own short appointment; **patch test & aftercare** on a
  dark band; **the studio**; *Good to know* (sample policies, labelled); directions — from 320 px
  phones up, with booking in a sheet over the page;
- online booking — **one treatment per booking**, a day and time, contact details and an optional
  note, and an emailed 6-digit code; the artist confirms each request;
- the owner dashboard at `/admin/` — requests to confirm, treatments and prices, hours and
  closures, email health, and the website's own text, photos and button colour.

The look — *Lash Map*: a lash artist's working sheet. Porcelain pages, kohl-black ink and buttons,
warm stone panels; Funnel Display over Funnel Sans with Geist Mono labels; the one ornament is the
**lash map** — hairline drawings that explain each treatment.

Booking runs on [`@profitstudio/booking-engine`](https://www.npmjs.com/package/@profitstudio/booking-engine)
**2.0.0-beta.3** (pinned) with your own Supabase project and Resend for email.

## 1. Try it (no accounts needed)

```bash
npm install
npm run dev:demo   # the full Live Demo: book, then manage it at /admin/
npm run dev        # preview mode: the website with sample times, nothing saved
```

In the Live Demo everything stays in your browser — nothing is sent anywhere.

## 2. Make it yours with Claude Code

Open this folder in a Claude Code session and paste the prompt in
[`CUSTOMIZE.md`](CUSTOMIZE.md), filled in with your studio. Claude edits a short list of files
(name, city, words, colours) — the booking system, the dashboard and the layout stay as they are.

Treatments, prices, hours and contact details are **not** code: you set them in the dashboard once
the booking backend is connected. **Your own photographs** go in the dashboard → Website. Each sample
photo stays labelled "Sample photo" until you replace it; use only your own work (with your client's
permission) or photos you have the right to use. Your name, training and experience are yours to
add: the starter invents none.

**A booking is one appointment.** The booking engine books single appointments on one calendar — one
artist's time. It does not link a patch test to a treatment, collect health information, take
deposits or payments, or run several artists' calendars (see *What the engine does not do* in
`CLAUDE.md`). Prices are paid at the studio.

## 3. Connect real bookings

You need a free Supabase project and a Resend account for booking emails.

```bash
cp .env.example .env.local    # your Supabase Project URL + Publishable key
npx supabase@2 login          # once, in your own terminal
npx booking-engine connect --admin you@example.com
```

`connect` links the project, sets up the database and the booking-email function, and tells you
exactly what is left for you to do (your dashboard login and the two email secrets). Full steps:
the Profit Studio guide *Build a Premium Booking Website with Claude Code*, Step 3, or
`node_modules/@profitstudio/booking-engine/docs/INTEGRATION.md` §11.

Never put a Supabase **Secret** key or your Resend API key in `.env.local`, in a prompt or in
Hostinger — the Resend key lives only in Supabase's Edge Function secrets.

## 4. Publish on Hostinger

Push this project to a private GitHub repository, then in Hostinger create a **Web App** from it
(Websites → Create site → Web App → Import Git Repository):

| Setting | Value |
|---|---|
| Framework | Vite |
| Build command | `npm run build` (never `build:demo`) |
| Output directory | `dist` |
| Node.js | 22 or newer |
| Environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (public values only) |

`dist/` contains the website and `dist/admin/` the dashboard. Every push to `main` redeploys.

## What is in this folder

| | |
|---|---|
| `src/site.config.ts` | The business name, time zone and preview contact details |
| `src/content/site.ts` | Everything the owner can edit in the dashboard → Website, with its default text and photos |
| `src/styles/tokens.css` | The design's colours, type and spacing (one file); `DESIGN.md` explains the system |
| `src/components/` | The website (`Hero`, `Treatments`, `Care`, `Studio`, `GoodToKnow`, `Visit`…, `LashMapDiagram`) and its booking flow (`src/components/booking/`) |
| `src/lib/preset.ts` | The sample treatments and hours used by preview mode and offered in a new dashboard |
| `src/lib/services.ts` | How treatments find their group and drawing (by the words in their names), the patch test, "Lasts:", lengths and prices |
| `admin/` + `src/admin-main.tsx` | The packaged dashboard, mounted at `/admin/` |
| `src/demo/` | The Live Demo's in-browser engine and sample data — used only by `dev:demo` / `build:demo`; a normal build contains none of it |
| `supabase/` | The engine's database migrations and email function (managed by `npx booking-engine`; do not edit) |
| `CLAUDE.md`, `BOOKING_ENGINE.md` | Rules Claude Code follows in this project |
| `PHOTOS.md` | The Pexels photos (Pexels License), credited file by file |

## Commands

```bash
npm run dev          # preview mode (sample data) until .env.local exists — http://localhost:5197
npm run dev:demo     # the Live Demo (in-browser data, dashboard included)
npm run build        # production build → dist/
npm run build:demo   # the public Live Demo build → dist/ (never deploy this as your site)
npx booking-engine doctor             # checks versions, engine files and keys
npx booking-engine doctor --dist dist # after a build: also scans the output for secrets
```

## Licence

The code is MIT-licensed — see [`LICENSE`](LICENSE) (Copyright (c) 2026 Youssef Es-salhi).
Photographs and other third-party assets keep their own terms, listed file by file in
[`PHOTOS.md`](PHOTOS.md).
