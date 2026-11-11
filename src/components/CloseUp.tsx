import type { SiteValues } from '../lib/content';
import { Photo } from './Photo';

const FRAMES = [
  { image: 'closeup.photo1', caption: 'closeup.caption1' },
  { image: 'closeup.photo2', caption: 'closeup.caption2' },
  { image: 'closeup.photo3', caption: 'closeup.caption3' },
] as const;

/**
 * Close up — the one editorial image moment: three daylight close-ups of natural lashes and brows.
 * Not results and never before/after: each photo is labelled "Sample photo" until the owner replaces it.
 * Phones: a short horizontal row that snaps frame by frame.
 */
export function CloseUp({ values, ownerFields }: { values: SiteValues; ownerFields: string[] }) {
  const frames = FRAMES.flatMap((f) => {
    const image = values[f.image];
    return image ? [{ ...f, src: image, caption: values[f.caption], sample: !ownerFields.includes(f.image) }] : [];
  });
  if (frames.length === 0) return null;
  return (
    <section className="closeup" aria-labelledby="closeup-title" data-count={frames.length}>
      <div className="closeup__head">
        <p className="section-top__mark">Close up</p>
        {values['closeup.title'] && (
          <h2 id="closeup-title" className="closeup__title">
            {values['closeup.title']}
          </h2>
        )}
        {values['closeup.text'] && <p className="closeup__text">{values['closeup.text']}</p>}
      </div>
      <ul className="closeup__frames" role="list">
        {frames.map((f) => (
          <li key={f.image} className="closeup__frame">
            <figure>
              <Photo image={f.src} sizes="(min-width: 900px) 22vw, 70vw" />
              {f.sample && <span className="photo-label">Sample photo</span>}
              {f.caption && <figcaption>{f.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
