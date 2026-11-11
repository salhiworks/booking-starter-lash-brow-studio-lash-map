import type { SiteValues } from '../lib/content';
import { Photo } from './Photo';

/**
 * Patch test & aftercare — the brand moment, on the kohl band.
 * One still life beside the four things that happen around every appointment. Factual, not promotional:
 * a patch test lowers the risk of a reaction and never rules one out; nothing here is medical advice.
 */
export function Care({ values, ownerFields }: { values: SiteValues; ownerFields: string[] }) {
  const photo = values['care.photo'];
  const steps = values['care.steps'];
  return (
    <section className={`prep${photo ? '' : ' prep--no-photo'}`} id="care" aria-labelledby="care-title">
      {photo && (
        <figure className="prep__photo">
          <Photo image={photo} sizes="(min-width: 900px) 42vw, 100vw" />
          {!ownerFields.includes('care.photo') && <figcaption className="photo-label">Sample photo</figcaption>}
        </figure>
      )}
      <div className="prep__body">
        <p className="section-top__mark section-top__mark--light">
          <span className="section-top__n">02</span> Patch test &amp; aftercare
        </p>
        <h2 id="care-title" className="prep__title">
          {values['care.title']}
        </h2>
        {steps.length > 0 && (
          <ol className="prep__steps">
            {steps.map((step, i) => (
              <li key={`${i}-${step.title}`}>
                <span className="prep__n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{step.title}</h3>
                {step.text && <p>{step.text}</p>}
              </li>
            ))}
          </ol>
        )}
        {values['care.note'] && <p className="prep__note">{values['care.note']}</p>}
      </div>
    </section>
  );
}
