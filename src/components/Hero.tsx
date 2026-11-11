import type { StartBooking } from '../App';
import { bookLink } from '../lib/bookLink';
import type { SiteValues } from '../lib/content';
import { Photo } from './Photo';

/** imagesizes must match the preloads in index.html. */
const HERO_SIZES = '100vw';
const SMALL = { key: '/photos/hero-eyeline-phone-800.webp', media: '(max-width: 699px)', sizes: '100vw' };

interface HeroProps {
  values: SiteValues;
  ownerFields: string[];
  onBook: StartBooking;
}

/**
 * The first screen: type first, then the eye line.
 * Desktop — the headline across the page, the introduction and booking beside it, and one wide
 * photograph cut at eye level (brow and lashes in one strip) filling the rest of the screen edge to
 * edge. Phones — headline, booking, then a square crop of the same moment (the site's own photo only).
 */
export function Hero({ values, ownerFields, onBook }: HeroProps) {
  const photo = values['hero.photo'];
  const own = ownerFields.includes('hero.photo');
  const kicker = values['hero.kicker'].trim();
  const place = values['hero.place'].trim();
  return (
    <section className={`hero${photo ? '' : ' hero--no-photo'}`} id="top" aria-labelledby="hero-title">
      <div className="hero__text">
        {(kicker || place) && (
          <p className="hero__kicker">
            {kicker && <span className="hero__kicker-what">{kicker}</span>}
            {kicker && place && (
              <span className="hero__kicker-what" aria-hidden="true">
                ·
              </span>
            )}
            {place && <span>{place}</span>}
          </p>
        )}
        <h1 id="hero-title" className="hero__title">
          {values['hero.title']}
        </h1>
        <div className="hero__aside">
          {values['hero.lede'] && <p className="hero__lede">{values['hero.lede']}</p>}
          <div className="hero__actions">
            <a className="btn btn--ink btn--large" href="#book" onClick={bookLink(onBook)}>
              {values['hero.cta']}
            </a>
            <a className="text-link" href="#treatments">
              Treatments &amp; prices
            </a>
          </div>
        </div>
      </div>
      {photo && (
        <figure className="hero__photo">
          <Photo image={photo} sizes={HERO_SIZES} priority small={own ? undefined : SMALL} className="frame--hero" />
          {!own && <figcaption className="photo-label">Sample photo</figcaption>}
        </figure>
      )}
    </section>
  );
}
