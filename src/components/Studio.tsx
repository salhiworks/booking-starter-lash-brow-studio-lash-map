import type { SiteValues } from '../lib/content';
import { Photo } from './Photo';

/** The studio: one room, one artist. Only what the owner writes — no invented credentials. */
export function Studio({ values, ownerFields }: { values: SiteValues; ownerFields: string[] }) {
  const photo = values['studio.photo'];
  const facts = values['studio.facts'];
  const sample = !ownerFields.includes('studio.photo');
  return (
    <section className="studio" id="studio" aria-labelledby="studio-title">
      <p className="section-top__mark studio__mark">
        <span className="section-top__n">03</span> The studio
      </p>
      <div className="studio__body">
        <h2 id="studio-title" className="studio__title">
          {values['studio.title']}
        </h2>
        {values['studio.text'] && <p className="studio__text prewrap">{values['studio.text']}</p>}
        {facts.length > 0 && (
          <dl className="studio__facts">
            {facts.map((f, i) => (
              <div key={`${i}-${f.label}`}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {photo && (
        <figure className="studio__photo">
          <Photo image={photo} sizes="(min-width: 900px) 30vw, 100vw" />
          {(sample || values['studio.caption']) && (
            <figcaption>
              {sample && <span className="photo-label photo-label--inline">Sample photo</span>} {values['studio.caption']}
            </figcaption>
          )}
        </figure>
      )}
    </section>
  );
}
