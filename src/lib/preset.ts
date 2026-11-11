import type { Preset } from '@profitstudio/booking-engine';

/**
 * Taper Lash & Brow's own preset (INTEGRATION.md §5): the sample treatments,
 * hours and policies preview mode shows, and the starter set the dashboard
 * offers an owner who has no services yet (<BookingAdmin presets>).
 * Prices are in US dollars, in cents.
 *
 * WHAT A BOOKING IS HERE. One booking = ONE appointment: a reserved block of
 * the artist's time with ONE client, on the studio's one calendar (one artist,
 * one treatment bed). Its length is the real time in the chair. The artist
 * reviews and confirms every request (`autoConfirm: false`).
 *
 * THE PATCH TEST is its own short, free appointment, booked at least 48 hours
 * before a first set, lift, lamination or tint. The engine cannot link two
 * bookings or check that a patch test happened: the website says so plainly and
 * the artist checks when confirming. The booking form never asks health or
 * allergy questions — the site never implies the booking system screens anyone.
 *
 * WHAT A PRICE IS HERE. The engine has one price per service: the price of that
 * appointment, paid at the studio — never online. Zero reads as free.
 *
 * A description may end with "Lasts: …" — how long the result usually lasts,
 * always approximate. The website shows it as its own line (src/lib/services.ts).
 */
export const sitePreset = {
  id: 'lash-brow-studio',
  label: 'Lash & Brow Studio',
  terminology: { customer: 'client', customers: 'clients', booking: 'appointment', bookings: 'appointments' },
  previewBusiness: {
    name: 'Sample Lash & Brow Studio',
    currency: 'USD',
    locale: 'en-US',
    contact: {
      email: 'hello@example.com',
      phone: '+1 615-555-0100',
      address: '100 Example Street, Nashville, TN',
    },
  },
  policies: {
    slotIntervalMinutes: 15,
    minNoticeMinutes: 720,
    maxAdvanceDays: 60,
    autoConfirm: false,
    requirePhone: true,
    pendingHoldMinutes: 1440,
    verificationWindowMinutes: 15,
  },
  // Tuesday to Saturday, a later Thursday for after work; closed Sunday and Monday.
  workingHours: [
    { weekday: 2, start: '10:00', end: '18:00' },
    { weekday: 3, start: '10:00', end: '18:00' },
    { weekday: 4, start: '11:00', end: '19:30' },
    { weekday: 5, start: '10:00', end: '18:00' },
    { weekday: 6, start: '09:00', end: '15:00' },
  ],
  services: [
    {
      name: 'Classic Full Set',
      description:
        'One extension on each healthy natural lash, with lengths and curl mapped across the eye before we begin. Soft and defined — never a strip-lash look. Lasts: infill every 2–3 weeks',
      durationMinutes: 120,
      bufferAfterMinutes: 15,
      priceCents: 16500,
      priceFrom: false,
    },
    {
      name: 'Classic Infill',
      description:
        'Replaces the extensions that have shed with your natural lashes. Within 3 weeks of your last set, with about 40% still in place. Lasts: every 2–3 weeks',
      durationMinutes: 60,
      bufferAfterMinutes: 15,
      priceCents: 7500,
      priceFrom: false,
    },
    {
      name: 'Lash Lift & Tint',
      description:
        'Your own lashes, lifted from the root and tinted darker. Nothing is added, so there is nothing to maintain between visits. Lasts: usually 6–8 weeks',
      durationMinutes: 75,
      bufferAfterMinutes: 15,
      priceCents: 9500,
      priceFrom: false,
    },
    {
      name: 'Lash Tint',
      description: 'Darker lashes from root to tip, for a defined look without mascara. Lasts: usually 4–6 weeks',
      durationMinutes: 20,
      bufferAfterMinutes: 10,
      priceCents: 3000,
      priceFrom: false,
    },
    {
      name: 'Brow Map & Shape',
      description:
        'The start, arch and tail measured from your own features, then shaped with wax and tweezers. Lasts: usually 3–5 weeks',
      durationMinutes: 30,
      bufferAfterMinutes: 10,
      priceCents: 4500,
      priceFrom: false,
    },
    {
      name: 'Brow Shape & Tint',
      description: 'Mapped and shaped, then tinted to fill sparse areas and match your colouring. Lasts: tint usually 3–6 weeks',
      durationMinutes: 45,
      bufferAfterMinutes: 10,
      priceCents: 6500,
      priceFrom: false,
    },
    {
      name: 'Brow Lamination',
      description:
        'Brow hairs set brushed up and in place for a fuller, groomed shape. Includes mapping, shaping and tint. Lasts: usually 6–8 weeks',
      durationMinutes: 60,
      bufferAfterMinutes: 15,
      priceCents: 9500,
      priceFrom: false,
    },
    {
      name: 'Lift & Lamination',
      description: 'Lash Lift & Tint with Brow Lamination in one appointment. Lasts: usually 6–8 weeks',
      durationMinutes: 105,
      bufferAfterMinutes: 15,
      priceCents: 17500,
      priceFrom: false,
    },
    {
      name: 'Patch Test',
      description:
        'A small amount of adhesive and tint placed behind the ear, at least 48 hours before your first lash extensions, lift, lamination or tint, so you can see how your skin responds. It lowers the risk of a reaction — it can’t rule one out.',
      durationMinutes: 10,
      bufferAfterMinutes: 5,
      priceCents: 0,
      priceFrom: false,
    },
  ],
} satisfies Preset;
