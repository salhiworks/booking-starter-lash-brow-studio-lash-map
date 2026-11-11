import type { DemoConfig } from './engine';
import { sitePreset } from '../lib/preset';

/**
 * The public Live Demo's sample studio (`npm run dev:demo` / `npm run build:demo`).
 * Only demo builds read this file. Customizing the real website? Leave src/demo/ alone.
 */
export const demoConfig: DemoConfig = {
  id: 'lash-brow-studio-lash-map',
  preset: sitePreset,
  business: {
    name: 'Taper Lash & Brow',
    timezone: 'America/Chicago',
    email: 'hello@taperlashandbrow.example',
    phone: '+1 615-555-0147',
    address: '2416 12th Ave S, Suite 3, Nashville, TN 37204',
  },
  ownerEmail: 'owner@taperlashandbrow.example',
  referencePrefix: 'TL',
  sampleNotes: [
    'First time with extensions — I’d like something natural for work. Patch test booked for Tuesday.',
    'Infill please. Last set was 17 days ago, most of them are still in.',
    'Hoping for fuller-looking brows; I over-plucked for years. Happy to be told what suits me.',
  ],
  // The site caches published content under this key (createSiteContentStore's default).
  resetKeys: ['pbe-site-content'],
  customers: [
    { name: 'Maya Robinson', email: 'maya.robinson@example.com', phone: '+1 615 555 0112' },
    { name: 'Priya Natarajan', email: 'priya.n@example.com', phone: '+1 615 555 0126' },
    { name: 'Erin Walsh', email: 'erin.walsh@example.com', phone: '+1 615 555 0133' },
    { name: 'Danielle Price', email: 'danielle.price@example.com', phone: '+1 615 555 0148' },
    { name: 'Sofia Alvarez', email: 'sofia.alvarez@example.com', phone: '+1 615 555 0150' },
    { name: 'Hannah Kim', email: 'hannah.kim@example.com', phone: '+1 615 555 0161' },
    { name: 'Jasmine Carter', email: 'jasmine.carter@example.com', phone: '+1 615 555 0174' },
    { name: 'Laura Bennett', email: 'laura.bennett@example.com', phone: '+1 615 555 0187' },
    { name: 'Olivia Grant', email: 'olivia.grant@example.com', phone: '+1 615 555 0195' },
    { name: 'Noor Haddad', email: 'noor.haddad@example.com', phone: '+1 615 555 0109' },
  ],
};
