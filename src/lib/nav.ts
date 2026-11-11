/** The page's sections, in order — the header, the phone menu and the footer all list these. */
export const NAV: readonly { href: string; label: string; header?: false }[] = [
  { href: '#treatments', label: 'Treatments & prices' },
  { href: '#care', label: 'Patch test & aftercare' },
  { href: '#studio', label: 'The studio' },
  { href: '#good-to-know', label: 'Good to know', header: false },
  { href: '#visit', label: 'Visit' },
];
