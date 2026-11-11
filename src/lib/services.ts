import { formatMoney } from '@profitstudio/booking-engine';
import type { Service } from '@profitstudio/booking-engine';

/**
 * The studio's treatment menu: its groups (Lashes · Brows · Together · the patch test), the lash-map
 * drawing each row shows, how long a result usually lasts, and honest length and price terms.
 *
 * The engine (2.0.0-beta.3) has no service categories and no per-service metadata, and a service's id
 * is a database UUID this site cannot know when it is built — so everything is read from the
 * service's own engine data:
 *
 *   1. its GROUP, from its NAME (strongest signal first), else its DESCRIPTION, else "More treatments":
 *        - patch     the patch test     (patch test, skin test, allergy test) — or the owner's chosen name
 *        - together  lashes AND brows   (a lash word and a brow word in one name, combo, package)
 *        - brows     brow, lamination, wax, thread
 *        - lashes    lash, extension, full set, infill, refill, lift, classic, volume, hybrid, tint
 *   2. its DRAWING (lash map), from the same words: extensions · infill · lift · tint · brow shape ·
 *      brow tint · lamination · combination; a patch test shows natural lashes;
 *   3. how long it LASTS: the part after "Lasts:" in the description, always approximate;
 *   4. its LENGTH: the real time in the chair; its PRICE: paid at the studio, never online; zero is free.
 *
 * Stable categories or a "needs a patch test first" flag need an engine version — see
 * docs/ENGINE-PROPOSAL-lash-brow.md in the Niche Pack workspace.
 */
export type GroupId = 'lashes' | 'brows' | 'together' | 'patch' | 'more';
export type DiagramKind =
  | 'natural'
  | 'extensions'
  | 'infill'
  | 'lift'
  | 'tint'
  | 'brow-shape'
  | 'brow-tint'
  | 'brow-lamination'
  | 'combination';

/** Content fields that belong to a group (src/content/site.ts). */
export type GroupNote = 'treatments.lashesSummary' | 'treatments.browsSummary' | 'treatments.togetherSummary';

const PATCH = /\b(patch[- ]?tests?|skin[- ]?tests?|allergy[- ]?tests?|sensitivity[- ]?tests?)\b/i;
const LASH = /\b(lash(?:es)?|eyelash(?:es)?|extensions?|full[- ]?set|infills?|fills?|refills?|lifts?|classic|volume|hybrid|wispy)\b/i;
const BROW = /\b(brows?|eyebrows?|lamination|laminat\w*|wax(?:ing)?|thread(?:ing)?|henna)\b/i;
const COMBO = /\b(combo|combination|package|together|duo)\b/i;

const norm = (s: string | null | undefined) => (s ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

/**
 * The owner's own name for the patch test (Website → Treatments → "Patch test service"), set once per
 * render by App from the published content. Empty = automatic (by name). The engine gives services no
 * build-time-stable key, so this explicit name is how a renamed patch test stays the patch test.
 */
let chosenPatch = '';
export function setPatchName(name: string | null | undefined): void {
  chosenPatch = norm(name);
}

function groupFromText(text: string): GroupId | null {
  if (PATCH.test(text)) return 'patch';
  const lash = LASH.test(text);
  const brow = BROW.test(text);
  if ((lash && brow) || (COMBO.test(text) && (lash || brow))) return 'together';
  if (brow) return 'brows';
  if (lash) return 'lashes';
  return null;
}

export function groupOf(service: Pick<Service, 'name' | 'description'>): GroupId {
  if (chosenPatch && norm(service.name) === chosenPatch) return 'patch';
  // "Tint" alone names neither lashes nor brows: read the description before guessing.
  return groupFromText(service.name) ?? groupFromText(lead(service.description)) ?? 'more';
}

const GROUPS: Record<GroupId, { label: string; note: GroupNote | null }> = {
  lashes: { label: 'Lashes', note: 'treatments.lashesSummary' },
  brows: { label: 'Brows', note: 'treatments.browsSummary' },
  together: { label: 'Together', note: 'treatments.togetherSummary' },
  patch: { label: 'Before a first visit', note: null },
  more: { label: 'More treatments', note: null },
};

/** The order groups are shown in on the page and in the booking sheet. */
const ORDER: GroupId[] = ['lashes', 'brows', 'together', 'more', 'patch'];

export interface Kind {
  id: GroupId;
  label: string;
  note: GroupNote | null;
  services: Service[];
}

/** Services in their groups, keeping the owner's display order inside each; empty groups are left out. */
export function kinds(services: readonly Service[]): Kind[] {
  const map = new Map<GroupId, Kind>();
  for (const service of services) {
    const id = groupOf(service);
    let k = map.get(id);
    if (!k) {
      k = { id, ...GROUPS[id], services: [] };
      map.set(id, k);
    }
    k.services.push(service);
  }
  return ORDER.flatMap((id) => (map.has(id) ? [map.get(id)!] : []));
}

/** The patch test among the engine's CURRENT services (owner's chosen name first, then by name), or none. */
export function patchTestService(services: readonly Service[]): Service | null {
  return services.find((s) => groupOf(s) === 'patch') ?? null;
}

/** Which lash-map drawing a row shows. */
export function diagramOf(service: Pick<Service, 'name' | 'description'>): DiagramKind {
  const group = groupOf(service);
  const n = service.name;
  if (group === 'patch') return 'natural';
  if (group === 'together') return 'combination';
  if (group === 'brows') {
    if (/laminat/i.test(n)) return 'brow-lamination';
    if (/\btint|henna|colou?r/i.test(n)) return 'brow-tint';
    return 'brow-shape';
  }
  if (/\b(in|re)?fills?\b/i.test(n)) return 'infill';
  if (/\blifts?\b/i.test(n)) return 'lift';
  if (/\b(extensions?|full[- ]?set|classic|volume|hybrid|wispy)\b/i.test(n)) return 'extensions';
  if (/\btint/i.test(n)) return 'tint';
  return 'natural';
}

export interface Described {
  lead: string;
  /** "Usually 6–8 weeks" — the part after "Lasts:", or null. */
  lasts: string | null;
  /** Kept for the shared booking flow (this niche has no "Format:" / "Best for:" parts). */
  format: string | null;
  bestFor: string[];
  receive: string[];
}

const LASTS = /(?:^|[\s.])(?:lasts|lasting|results? last)\s*:\s*/i;

function lead(description: string | null | undefined): string {
  return splitDescription(description).lead;
}

/** "Lifted from the root… Lasts: usually 6–8 weeks" → { lead, lasts: "Usually 6–8 weeks" }. */
export function splitDescription(description: string | null | undefined): Described {
  const text = (description ?? '').trim();
  const m = LASTS.exec(text);
  if (!m) return { lead: text, lasts: null, format: null, bestFor: [], receive: [] };
  const raw = text.slice(m.index + m[0].length).trim().replace(/\.$/, '');
  return {
    lead: text.slice(0, m.index + (m[0].startsWith('.') ? 1 : 0)).trim(),
    lasts: raw ? raw[0].toUpperCase() + raw.slice(1) : null,
    format: null,
    bestFor: [],
    receive: [],
  };
}

/** Kept for the shared booking flow: every appointment is at the studio, so there is no format to show. */
export function formatOf(_service: Pick<Service, 'description'>): { kind: 'studio'; label: string } | null {
  return null;
}

/** Kept for the shared booking flow: treatment names carry no size. */
export function splitName(name: string): { base: string; size: string | null } {
  return { base: name, size: null };
}

export type Role = 'patch' | 'treatment';
export function roleOf(service: Pick<Service, 'name' | 'description'>): Role {
  return groupOf(service) === 'patch' ? 'patch' : 'treatment';
}

/** "45 min", "1 h 30 min", "2 h" — the appointment's length, straight from the engine. */
export function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** The same, for screen readers. */
export function durationSpoken(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${minutes} minutes`;
  const hours = `${h} hour${h > 1 ? 's' : ''}`;
  return m ? `${hours} ${m} minutes` : hours;
}

/** What the booking's LENGTH means: the time in the chair. */
export interface TimeTerms {
  role: Role;
  label: string;
  note: string | null;
}

export function timeTerms(service: Pick<Service, 'name' | 'description'>): TimeTerms {
  const role = roleOf(service);
  if (role === 'patch') return { role, label: 'Time', note: 'At least 48 hours before your treatment' };
  return { role, label: 'Time', note: null };
}

type PriceInput = Pick<Service, 'priceCents' | 'priceFrom' | 'currency' | 'name'>;

/** Whole dollars print without ".00" — "$95", not "$95.00". */
const money = (cents: number, currency: string, locale: string) => formatMoney(cents, currency, locale).replace(/([.,])00(?!\d)/, '');

/**
 * What the engine's price MEANS on this site:
 *   free    → no charge (the patch test)
 *   from    → a starting price; the artist confirms it before the appointment
 *   fixed   → the price of this appointment, paid at the studio — not online
 *   request → no price shown: ask the studio
 */
export interface PriceTerms {
  kind: 'free' | 'from' | 'fixed' | 'request';
  label: string;
  amount: string;
  note: string | null;
}

export function priceTerms(service: PriceInput, locale: string): PriceTerms {
  if (service.priceCents === null) return { kind: 'request', label: 'Price', amount: 'Ask the studio', note: null };
  if (service.priceCents === 0) return { kind: 'free', label: 'Price', amount: 'Free', note: 'No charge' };
  const amount = money(service.priceCents, service.currency, locale);
  if (service.priceFrom) return { kind: 'from', label: 'From', amount, note: 'Confirmed with you before the appointment' };
  return { kind: 'fixed', label: 'Price', amount, note: null };
}

/** One line: "$95", "from $95", "Free", "Ask the studio". */
export function priceLabel(service: PriceInput, locale: string): string {
  const t = priceTerms(service, locale);
  if (t.kind === 'from') return `from ${t.amount}`;
  return t.amount;
}
