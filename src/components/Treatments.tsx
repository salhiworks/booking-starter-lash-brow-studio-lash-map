import type { Business, Service } from '@profitstudio/booking-engine';
import type { StartBooking } from '../App';
import { bookLink } from '../lib/bookLink';
import type { SiteValues } from '../lib/content';
import type { Resource } from '../lib/resource';
import { durationLabel, durationSpoken, kinds, patchTestService, priceLabel, splitDescription } from '../lib/services';
import type { DiagramKind, Kind } from '../lib/services';
import { LashMapDiagram } from './LashMapDiagram';
import { Notice } from './Notice';
import { Photo } from './Photo';

interface TreatmentsProps {
  values: SiteValues;
  ownerFields: string[];
  services: Resource<Service[]>;
  business: Business | null;
  onRetry: () => void;
  onBook: StartBooking;
}

/** The four "Which one?" drawings, in the order the owner's four texts are read. */
const COMPARE: DiagramKind[] = ['natural', 'extensions', 'lift', 'tint'];

/**
 * Treatments & prices — the signature section.
 * 1. "Which one?": the four things a first-time client confuses, drawn as lash maps side by side.
 * 2. The engine's treatments in their groups (Lashes · Brows · Together · More): every row says what
 *    the treatment does, roughly how long the result lasts, the appointment's length and its price.
 * 3. The patch test as its own short appointment.
 * Names, descriptions, lengths and prices always come from the engine (src/lib/services.ts).
 */
export function Treatments({ values, ownerFields, services, business, onRetry, onBook }: TreatmentsProps) {
  const compare = values['treatments.compare'];
  return (
    <section className="treatments" id="treatments" aria-labelledby="treatments-title">
      <header className="section-top">
        <p className="section-top__mark">
          <span className="section-top__n">01</span> Treatments &amp; prices
        </p>
        <h2 id="treatments-title" className="section-top__title">
          {values['treatments.title']}
        </h2>
        {values['treatments.intro'] && <p className="section-top__intro">{values['treatments.intro']}</p>}
      </header>

      {compare.length > 0 && (
        <>
          <p className="rail-label rail-label--compare" id="compare-label">
            Which one?
          </p>
          <ol className="compare" aria-labelledby="compare-label" data-count={compare.length}>
            {compare.map((c, i) => (
              <li key={`${i}-${c.title}`} className="compare__item">
                <LashMapDiagram kind={COMPARE[i] ?? 'natural'} className="compare__diagram" />
                <h3 className="compare__title">{c.title}</h3>
                {c.text && <p className="compare__text">{c.text}</p>}
              </li>
            ))}
          </ol>
        </>
      )}

      <Menu values={values} ownerFields={ownerFields} services={services} business={business} onRetry={onRetry} onBook={onBook} />
    </section>
  );
}

function Menu({ values, ownerFields, services, business, onRetry, onBook }: TreatmentsProps) {
  if (services.status === 'loading') {
    return (
      <div className="menu menu--loading" aria-busy="true">
        <p className="sr-only" role="status">
          Loading treatments…
        </p>
        {[0, 1, 2].map((i) => (
          <span className="skeleton skeleton--service" key={i} aria-hidden="true" />
        ))}
      </div>
    );
  }
  if (services.status === 'error') {
    if (services.error.code === 'NOT_CONFIGURED') {
      return <p className="menu menu--quiet quiet-state">Treatments and prices will be listed here soon.</p>;
    }
    return (
      <div className="menu menu--quiet">
        <Notice tone="error" action={{ label: 'Try again', onClick: onRetry }}>
          <p>{services.error.code === 'NETWORK' ? "We couldn't reach the booking system to load the treatments." : "We couldn't load the treatments just now."}</p>
        </Notice>
      </div>
    );
  }
  const locale = business?.locale ?? 'en-US';
  const groups = kinds(services.data);
  const listed = groups.filter((g) => g.id !== 'patch');
  const patch = patchTestService(services.data);
  if (listed.length === 0 && !patch) {
    return <p className="menu menu--quiet quiet-state">Treatments and prices will be listed here soon.</p>;
  }
  return (
    <>
      <div className="menu">
        {listed.map((group) => (
          <Group key={group.id} group={group} values={values} ownerFields={ownerFields} locale={locale} onBook={onBook} />
        ))}
      </div>
      {(patch || values['treatments.patchText']) && (
        <>
          <p className="rail-label rail-label--patch">Before a first visit</p>
          <aside className="patch" aria-labelledby="patch-title">
            <LashMapDiagram kind="natural" className="patch__diagram" />
            <div className="patch__body">
              <h3 id="patch-title" className="patch__title">
                {values['treatments.patchTitle'] || patch?.name || 'Patch test'}
              </h3>
              {values['treatments.patchText'] && <p className="patch__text">{values['treatments.patchText']}</p>}
            </div>
            {patch && (
              <>
                <dl className="patch__facts">
                  <div>
                    <dt>Time</dt>
                    <dd>
                      <span aria-hidden="true">{durationLabel(patch.durationMinutes)}</span>
                      <span className="sr-only">{durationSpoken(patch.durationMinutes)}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>Price</dt>
                    <dd>{priceLabel(patch, locale)}</dd>
                  </div>
                </dl>
                <a className="btn btn--line" href="#book" onClick={bookLink(onBook, patch.id)}>
                  Book a patch test
                </a>
              </>
            )}
          </aside>
        </>
      )}
      {values['treatments.footnote'] && <p className="treatments__footnote">{values['treatments.footnote']}</p>}
    </>
  );
}

type PhotoKeys = { image: 'treatments.lashesPhoto' | 'treatments.browsPhoto'; caption: 'treatments.lashesCaption' | 'treatments.browsCaption' };
const PHOTO: Partial<Record<Kind['id'], PhotoKeys>> = {
  lashes: { image: 'treatments.lashesPhoto', caption: 'treatments.lashesCaption' },
  brows: { image: 'treatments.browsPhoto', caption: 'treatments.browsCaption' },
};

interface GroupProps {
  group: Kind;
  values: SiteValues;
  ownerFields: string[];
  locale: string;
  onBook: StartBooking;
}

/** "4 treatments · 20 min – 2 h · $30 – $165" — the group at a glance, from the engine's own data. */
function groupMeta(services: Service[], locale: string): string {
  const n = services.length;
  const lengths = services.map((s) => s.durationMinutes);
  const min = Math.min(...lengths);
  const max = Math.max(...lengths);
  const priced = services.filter((s) => s.priceCents !== null).sort((a, b) => (a.priceCents ?? 0) - (b.priceCents ?? 0));
  const parts = [`${n} treatment${n === 1 ? '' : 's'}`, min === max ? durationLabel(min) : `${durationLabel(min)} – ${durationLabel(max)}`];
  if (priced.length) {
    const lo = priceLabel(priced[0], locale);
    const hi = priceLabel(priced[priced.length - 1], locale);
    parts.push(lo === hi ? lo : `${lo} – ${hi}`);
  }
  return parts.join(' · ');
}

function Group({ group, values, ownerFields, locale, onBook }: GroupProps) {
  const keys = PHOTO[group.id];
  const photo = keys ? values[keys.image] : null;
  const caption = keys ? values[keys.caption] : '';
  const sample = keys ? !ownerFields.includes(keys.image) : false;
  const summary = group.note ? values[group.note] : '';
  return (
    <section className={`menu-group menu-group--${group.id}${photo ? ' menu-group--photo' : ' menu-group--text'}`} aria-labelledby={`group-${group.id}`}>
      <div className="menu-group__aside">
        <h3 id={`group-${group.id}`} className="menu-group__title">
          {group.label}
        </h3>
        <p className="menu-group__meta">{groupMeta(group.services, locale)}</p>
        {summary && <p className="menu-group__summary">{summary}</p>}
        {photo && (
          <figure className="menu-group__photo">
            <Photo image={photo} sizes="(min-width: 900px) 30vw, (min-width: 600px) 45vw, 100vw" />
            {(sample || caption) && (
              <figcaption>
                {sample && <span className="photo-label photo-label--inline">Sample photo</span>} {caption}
              </figcaption>
            )}
          </figure>
        )}
      </div>
      <ul className="menu-group__list" role="list">
        {group.services.map((s) => (
          <ServiceRow key={s.id} service={s} locale={locale} onBook={onBook} />
        ))}
      </ul>
    </section>
  );
}

function ServiceRow({ service: s, locale, onBook }: { service: Service; locale: string; onBook: StartBooking }) {
  const { lead, lasts } = splitDescription(s.description);
  return (
    <li className="service">
      <div className="service__main">
        <h4 className="service__name">{s.name}</h4>
        {lead && <p className="service__desc">{lead}</p>}
        {lasts && <p className="service__lasts">{lasts}</p>}
      </div>
      <dl className="service__facts">
        <div className="service__time">
          <dt className="sr-only">Time</dt>
          <dd>
            <span aria-hidden="true">{durationLabel(s.durationMinutes)}</span>
            <span className="sr-only">{durationSpoken(s.durationMinutes)}</span>
          </dd>
        </div>
        <div className="service__price">
          <dt className="sr-only">Price</dt>
          <dd>{priceLabel(s, locale)}</dd>
        </div>
      </dl>
      <a className="service__book" href="#book" onClick={bookLink(onBook, s.id)} aria-label={`Book ${s.name}`}>
        Book
      </a>
    </li>
  );
}
