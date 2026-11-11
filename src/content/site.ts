import { defineSiteContent } from '@profitstudio/booking-engine';

/**
 * What the owner may change in the dashboard (Website). The defaults are the
 * website's own copy and photos: until the owner publishes, the page shows
 * exactly these. Treatments, prices, lengths, hours, the address, phone and
 * email are NOT here — they come from the engine.
 *
 * Never rename or reuse a field id once the site is live: the owner's text is
 * stored under it. Add a new id instead.
 *
 * This file is also imported by vite.config.ts (Node), so it imports nothing
 * local. Default photo `src` values are keys of src/content/photoVariants.ts.
 *
 * Copy rules (CLAUDE.md): no promised results, no medical or safety claims, no
 * invented credentials, reviews or awards; the patch test lowers the risk of a
 * reaction and never rules one out.
 */
const SAMPLE_HELP =
  'A “Sample photo” label stays on it until you replace it with your own photo — use only photos of your own work (with your client’s permission) or photos you have the right to use. Never show another studio’s work as yours.';

type Img = { src: string; alt: string; width: number; height: number };
const P = (name: string, alt: string): Img => ({ src: `/photos/${name}-800.webp`, alt, width: 800, height: 1000 });

export const siteContent = defineSiteContent({
  sections: [
    {
      id: 'brand',
      label: 'Brand',
      description: 'Your name mark or logo and the colour of the main buttons.',
      fields: [
        {
          type: 'text',
          id: 'brand.wordmark',
          label: 'Name mark',
          help: 'The short name in the header and footer. One word reads best.',
          default: 'Taper',
          maxLength: 22,
          required: true,
        },
        {
          type: 'text',
          id: 'brand.descriptor',
          label: 'Line beside the name mark',
          help: 'What you are, in two or three words. Shown small beside the name.',
          default: 'Lash & Brow',
          maxLength: 28,
        },
        {
          type: 'image',
          id: 'brand.logo',
          label: 'Logo',
          help: 'Optional. A wide, dark logo on a transparent background — the header is a warm white. It replaces the name mark in the header.',
          default: null,
          aspectRatio: 4,
        },
        {
          type: 'color',
          id: 'brand.accent',
          label: 'Button colour',
          help: 'The main buttons and selected choices. They carry white text, so pick a deep colour — kohl black (the original), espresso, deep plum, ink blue. Light colours are refused because white text would not read on them.',
          default: '#17130f',
          contrastWith: '#ffffff',
          minContrast: 4.5,
        },
      ],
    },
    {
      id: 'hero',
      label: 'First screen',
      description: 'The headline, the introduction and the wide photograph at eye level.',
      fields: [
        { type: 'text', id: 'hero.kicker', label: 'What you are', default: 'Lash & brow studio', maxLength: 40 },
        { type: 'text', id: 'hero.place', label: 'Where you are', help: 'A neighbourhood and city.', default: '12South, Nashville', maxLength: 40 },
        {
          type: 'text',
          id: 'hero.title',
          label: 'Headline',
          help: 'Short and plain. Say what you do — not a promise about results.',
          default: 'Lashes and brows, mapped to your face.',
          maxLength: 64,
          required: true,
        },
        {
          type: 'longText',
          id: 'hero.lede',
          label: 'Introduction',
          default:
            'Classic extensions, lash lifts, tints and brow shaping by one artist, in a quiet room off 12th Avenue. Every set and every brow is measured and planned around your eyes first — so the result still looks like you.',
          maxLength: 280,
          rows: 4,
        },
        { type: 'text', id: 'hero.cta', label: 'Main button', default: 'Book an appointment', maxLength: 28, required: true },
        {
          type: 'image',
          id: 'hero.photo',
          label: 'Photo (very wide)',
          help: `A wide close-up at eye level — a brow and lashes, or the work in progress. It is cropped to the height left on the first screen, so keep the subject in the upper middle. ${SAMPLE_HELP}`,
          default: {
            src: '/photos/hero-eyeline-1440.webp',
            alt: 'Close-up of one closed eye and its brow while a gloved hand brushes the lashes through with a spoolie.',
            width: 1440,
            height: 655,
          },
          aspectRatio: 2.2,
        },
      ],
    },
    {
      id: 'treatments',
      label: 'Treatments & prices',
      description:
        'The words around your treatment list. The treatments themselves — names, descriptions, lengths and prices — are edited in Services. A description can end with “Lasts: usually 6–8 weeks”, shown as its own line.',
      fields: [
        { type: 'text', id: 'treatments.title', label: 'Heading', default: 'What each treatment actually does.', maxLength: 64, required: true },
        {
          type: 'longText',
          id: 'treatments.intro',
          label: 'Introduction',
          default:
            'Extensions add length. A lift curls the lashes you have. A tint makes them darker. If you’re not sure which suits you, book the shorter option — we’ll talk it through in the chair before anything is applied.',
          maxLength: 320,
          rows: 3,
        },
        {
          type: 'list',
          id: 'treatments.compare',
          label: 'Which one? (four drawings)',
          help: 'Shown beside four line drawings, in this order: natural lashes · extensions · a lift · a tint.',
          itemLabel: 'Drawing',
          maxItems: 4,
          fields: [
            { type: 'text', id: 'title', label: 'Title', default: '', maxLength: 32, required: true },
            { type: 'longText', id: 'text', label: 'Text', default: '', maxLength: 140, rows: 2 },
          ],
          default: [
            { title: 'Your natural lashes', text: 'Where every treatment starts. We look at their length, curl and strength first.' },
            { title: 'Extensions add', text: 'Longer, fuller lashes, one extension per natural lash. Kept up with infills.' },
            { title: 'A lift curls', text: 'Your own lashes, lifted from the root. Nothing added, nothing to maintain.' },
            { title: 'A tint darkens', text: 'Fair or light tips made visible, on lashes or brows. Often added to a lift.' },
          ],
        },
        {
          type: 'longText',
          id: 'treatments.lashesSummary',
          label: 'Lashes — one line',
          default: 'Extensions add length and fullness. A lift curls your own lashes. A tint makes them darker.',
          maxLength: 160,
          rows: 2,
        },
        {
          type: 'image',
          id: 'treatments.lashesPhoto',
          label: 'Lashes — photo (upright)',
          help: `Upright (4:5). Remove it to show the text only. ${SAMPLE_HELP}`,
          default: P(
            'lashes-extensions',
            'A lash artist in black gloves holding one natural lash apart with fine tweezers while placing an extension; a white pad covers the lower lashes.',
          ),
          aspectRatio: 4 / 5,
        },
        { type: 'text', id: 'treatments.lashesCaption', label: 'Lashes — caption', default: 'Isolating one natural lash before an extension goes on', maxLength: 80 },
        {
          type: 'longText',
          id: 'treatments.browsSummary',
          label: 'Brows — one line',
          default: 'Every brow starts with a map: measured from your features, then shaped, tinted or laminated to fit.',
          maxLength: 160,
          rows: 2,
        },
        {
          type: 'image',
          id: 'treatments.browsPhoto',
          label: 'Brows — photo (upright)',
          help: `Upright (4:5). Remove it to show the text only. ${SAMPLE_HELP}`,
          default: P(
            'brows-shaping',
            'A client resting with her eyes closed while a lash and brow artist in black gloves tidies her brow with tweezers and holds a spoolie.',
          ),
          aspectRatio: 4 / 5,
        },
        { type: 'text', id: 'treatments.browsCaption', label: 'Brows — caption', default: 'Tidying the brow to its mapped shape', maxLength: 80 },
        {
          type: 'longText',
          id: 'treatments.togetherSummary',
          label: 'Together — one line',
          default: 'Lashes and brows in one visit.',
          maxLength: 160,
          rows: 2,
        },
        { type: 'text', id: 'treatments.patchTitle', label: 'Patch test — heading', default: 'New here? Start with a patch test.', maxLength: 60 },
        {
          type: 'longText',
          id: 'treatments.patchText',
          label: 'Patch test — text',
          help: 'Shown with the patch test’s length and price from Services. Keep it honest: a patch test lowers the risk of a reaction, it can’t rule one out.',
          default:
            'Required at least 48 hours before your first lash extensions, lift, lamination or tint. A small amount of adhesive and tint is placed behind the ear so you can see how your skin responds.',
          maxLength: 280,
          rows: 3,
        },
        {
          type: 'text',
          id: 'treatments.patchService',
          label: 'Patch test service (exact name in Services)',
          help: 'Leave empty to find it by name (“Patch Test”). If you rename it, write the new name here.',
          default: '',
          maxLength: 120,
        },
        {
          type: 'text',
          id: 'treatments.footnote',
          label: 'Small print under the list',
          default: 'How long a result lasts depends on your own lashes and brows, your skin and aftercare.',
          maxLength: 160,
        },
      ],
    },
    {
      id: 'closeup',
      label: 'Close up',
      description:
        'Three close-up photographs of lashes and brows. Until you replace them they are labelled “Sample photo” — they show natural lashes and brows, not your results. Use photos of your own work only with your client’s permission, and never as before/after claims.',
      fields: [
        { type: 'text', id: 'closeup.title', label: 'Heading', default: 'Your own lashes and brows, up close.', maxLength: 64 },
        {
          type: 'longText',
          id: 'closeup.text',
          label: 'Text',
          default: 'Every face starts somewhere different: the length and curl of your lashes, the way your brows grow. That is what we map first.',
          maxLength: 220,
          rows: 3,
        },
        {
          type: 'image',
          id: 'closeup.photo1',
          label: 'Photo 1 (upright)',
          help: `Upright (4:5). Remove a photo and the others close up. ${SAMPLE_HELP}`,
          default: P('closeup-brow-warm', 'Close-up of a brown eye, natural lashes and a soft brow on warm, glowing skin in daylight.'),
          aspectRatio: 4 / 5,
        },
        { type: 'text', id: 'closeup.caption1', label: 'Photo 1 — caption', default: 'Natural lashes, soft brow', maxLength: 48 },
        {
          type: 'image',
          id: 'closeup.photo2',
          label: 'Photo 2 (upright)',
          help: `Upright (4:5). ${SAMPLE_HELP}`,
          default: P('closeup-eye-open', 'Close-up of an open grey-green eye with dark upper lashes and a full brow, natural skin texture.'),
          aspectRatio: 4 / 5,
        },
        { type: 'text', id: 'closeup.caption2', label: 'Photo 2 — caption', default: 'Length and curl, as they grow', maxLength: 48 },
        {
          type: 'image',
          id: 'closeup.photo3',
          label: 'Photo 3 (upright)',
          help: `Upright (4:5). ${SAMPLE_HELP}`,
          default: P('closeup-lashes-profile', 'Lashes seen in profile curving upward under a light brow, freckled skin in daylight.'),
          aspectRatio: 4 / 5,
        },
        { type: 'text', id: 'closeup.caption3', label: 'Photo 3 — caption', default: 'A lash line in profile', maxLength: 48 },
      ],
    },
    {
      id: 'care',
      label: 'Patch test & aftercare',
      description: 'The dark band: what happens around every appointment.',
      fields: [
        { type: 'text', id: 'care.title', label: 'Heading', default: 'Fine work needs a careful hand — and a little preparation.', maxLength: 72, required: true },
        {
          type: 'list',
          id: 'care.steps',
          label: 'Points',
          itemLabel: 'Point',
          maxItems: 4,
          fields: [
            { type: 'text', id: 'title', label: 'Title', default: '', maxLength: 48, required: true },
            { type: 'longText', id: 'text', label: 'Text', default: '', maxLength: 240, rows: 3 },
          ],
          default: [
            {
              title: 'A consultation, then a map',
              text: 'We look at your eye shape, your natural lashes and how you wear makeup, then plan the lengths, curl or brow shape before anything is applied.',
            },
            {
              title: 'A patch test for first visits',
              text: 'Adhesive, tint and lifting solutions can irritate sensitive skin. A free patch test 48 hours ahead lowers the risk — it can’t rule out a reaction.',
            },
            {
              title: 'Clean, single-use, every time',
              text: 'Fresh pads, tape, spoolies and applicators for every client. Tweezers are cleaned and sterilised between appointments.',
            },
            {
              title: 'Aftercare in writing',
              text: 'Keep lifted or extended lashes dry for 24 hours, cleanse them gently, and skip oil-based products near the eyes. You leave with the full list.',
            },
          ],
        },
        {
          type: 'longText',
          id: 'care.note',
          label: 'Small print',
          default:
            'If you have an eye condition, allergies or sensitive skin, or you’re pregnant, please check with your doctor first and tell us before your appointment.',
          maxLength: 260,
          rows: 3,
        },
        {
          type: 'image',
          id: 'care.photo',
          label: 'Photo (upright)',
          help: `Upright (4:5); a still life of your tools works well. ${SAMPLE_HELP}`,
          default: P('tools-marble', 'Two pairs of lash tweezers, one straight and one curved, lying on white marble in a band of hard daylight.'),
          aspectRatio: 4 / 5,
        },
      ],
    },
    {
      id: 'studio',
      label: 'The studio',
      description: 'The room and the person who works in it. Write only what is true — no invented qualifications, years or awards.',
      fields: [
        { type: 'text', id: 'studio.title', label: 'Heading', default: 'One room, one artist, one client at a time.', maxLength: 72, required: true },
        {
          type: 'longText',
          id: 'studio.text',
          label: 'Text',
          default:
            'Taper is a small treatment room on the second floor of a brick building on 12th Avenue South. There is one bed, good daylight and a door that stays closed — so you can rest with your eyes shut for two hours without anyone walking through.\n\nEvery appointment is with the same artist, from the first patch test to your infills, so your lash map and brow measurements are kept and built on from visit to visit.',
          maxLength: 900,
          rows: 7,
        },
        {
          type: 'list',
          id: 'studio.facts',
          label: 'Facts',
          itemLabel: 'Fact',
          maxItems: 4,
          fields: [
            { type: 'text', id: 'label', label: 'Label', default: '', maxLength: 24, required: true },
            { type: 'text', id: 'value', label: 'Value', default: '', maxLength: 48, required: true },
          ],
          default: [
            { label: 'Appointments', value: 'One client at a time' },
            { label: 'Your artist', value: 'The same one, every visit' },
            { label: 'Tools', value: 'Single-use or sterilised' },
          ],
        },
        {
          type: 'image',
          id: 'studio.photo',
          label: 'Photo (upright)',
          help: `Upright (4:5). ${SAMPLE_HELP}`,
          default: P('prep-pads', 'A client lying on a treatment bed with her eyes closed while two gloved hands place soft pads under her eyes.'),
          aspectRatio: 4 / 5,
        },
        { type: 'text', id: 'studio.caption', label: 'Photo caption', default: 'Under-eye pads on before a lift or a set', maxLength: 80 },
      ],
    },
    {
      id: 'faq',
      label: 'Good to know',
      description: 'Practical answers before a first visit. Until you edit them they are labelled “Sample policies”.',
      fields: [
        { type: 'text', id: 'faq.title', label: 'Heading', default: 'Good to know before you come.', maxLength: 64, required: true },
        {
          type: 'list',
          id: 'faq.items',
          label: 'Questions',
          itemLabel: 'Question',
          maxItems: 10,
          fields: [
            { type: 'text', id: 'question', label: 'Question', default: '', maxLength: 90, required: true },
            { type: 'longText', id: 'answer', label: 'Answer', default: '', maxLength: 600, rows: 4 },
          ],
          default: [
            {
              question: 'Do I need a patch test?',
              answer:
                'Yes, before your first lash extensions, lift, lamination or tint — and again if it has been more than six months, or if you’ve had a reaction to anything since. Book the free Patch Test at least 48 hours before your treatment. It lowers the risk of a reaction; it can’t rule one out.',
            },
            {
              question: 'How should I arrive?',
              answer:
                'With clean lashes and brows: no mascara, eyeliner or brow products, and no oil-based cleanser on the day. Bring your glasses if you wear contact lenses — they come out for lash treatments.',
            },
            {
              question: 'Can I have a treatment if I’m pregnant or have an eye condition?',
              answer:
                'Please check with your doctor first, and tell us before your appointment. We may suggest waiting or choosing a different treatment. We can’t give medical advice.',
            },
            {
              question: 'When should I book an infill?',
              answer:
                'Every 2–3 weeks, while about 40% of your extensions are still in place. After that, a new full set is usually needed.',
            },
            {
              question: 'What if I need to cancel?',
              answer:
                'Please let us know at least 24 hours before so someone else can have the time. Arriving more than 15 minutes late may mean a shorter treatment or a new time.',
            },
            {
              question: 'How do I pay?',
              answer: 'At the studio, after your appointment, by card or cash. Nothing is paid online.',
            },
          ],
        },
      ],
    },
    {
      id: 'book',
      label: 'Booking',
      description: 'The words above the booking button and at the top of the booking sheet.',
      fields: [
        { type: 'text', id: 'book.title', label: 'Heading', default: 'Book an appointment', maxLength: 60, required: true },
        {
          type: 'longText',
          id: 'book.intro',
          label: 'Introduction',
          default:
            'Choose a treatment and a time that suits you. Every request is read and confirmed by the artist — first visits start with the free patch test.',
          maxLength: 260,
          rows: 3,
        },
      ],
    },
    {
      id: 'visit',
      label: 'Visit',
      description: 'Hours, address, phone and email come from your Business settings. Add how to find you.',
      fields: [
        { type: 'text', id: 'visit.title', label: 'Heading', default: 'Find the studio', maxLength: 60, required: true },
        {
          type: 'longText',
          id: 'visit.note',
          label: 'Finding us',
          default:
            'Up the stairs beside the bookshop, second door on the left. Street parking on 12th Avenue and Sevier Street; the studio is a short walk from the 12South shops.',
          maxLength: 400,
          rows: 3,
        },
      ],
    },
    {
      id: 'footer',
      label: 'Footer',
      fields: [{ type: 'text', id: 'footer.tagline', label: 'Line under the name', default: 'Lash & brow studio · 12South, Nashville', maxLength: 80 }],
    },
    {
      id: 'seo',
      label: 'Search & sharing',
      description: 'Search engines and link previews show new text after the website is next deployed.',
      fields: [
        {
          type: 'text',
          id: 'seo.title',
          label: 'Page title',
          help: 'Search engines and link previews show new text after the website is next deployed.',
          default: 'Taper Lash & Brow — lash extensions, lifts and brows in 12South, Nashville',
          maxLength: 80,
          required: true,
        },
        {
          type: 'longText',
          id: 'seo.description',
          label: 'Page description',
          help: 'One or two sentences for search results. Updated after the next deploy.',
          default:
            'An independent lash and brow studio in 12South, Nashville: classic lash extensions, lash lifts, tints, brow mapping, shaping and lamination by one artist. Book online.',
          maxLength: 180,
          rows: 3,
          required: true,
        },
      ],
    },
  ],
});
