/**
 * This website's identity — the ONE place for its name, time zone and the
 * placeholder contact details shown in preview mode (`npm run dev` without
 * Supabase). Everything the owner manages (treatments, prices, hours, real
 * contact details, text and photos) lives in the dashboard at /admin/.
 */
export const SITE = {
  /** The business name. The dashboard's Business page overrides it once connected. */
  name: 'Taper Lash & Brow',
  /** IANA time zone of the business. */
  timezone: 'America/Chicago',
  /** Fictional contact details for preview mode only. */
  previewContact: {
    email: 'hello@taperlashandbrow.example',
    phone: '+1 615-555-0147',
    address: '2416 12th Ave S, Suite 3, Nashville, TN 37204',
  },
};
