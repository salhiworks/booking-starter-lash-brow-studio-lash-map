import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Funnel Display (headings, names, figures), Funnel Sans (text) and Geist Mono (labels, lengths, times). Latin subsets only.
import '@fontsource/funnel-display/latin-300.css';
import '@fontsource/funnel-display/latin-400.css';
import '@fontsource/funnel-sans/latin-400.css';
import '@fontsource/funnel-sans/latin-500.css';
import '@fontsource/geist-mono/latin-400.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/site.css';
import './styles/booking.css';
import { App } from './App';
import { engine } from './lib/engine';
import type { DemoEngine } from './demo/engine';

if (__BOOKING_DEMO__) void import('./demo/engine/DemoBar').then((m) => m.mountDemoBar(engine as DemoEngine, 'site'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
