import type { SiteValues } from '../lib/content';

/**
 * The practical questions before a first visit, as native disclosure rows (keyboard and screen-reader
 * ready). Until the owner edits them, they are labelled as sample policies.
 */
export function GoodToKnow({ values, ownerFields }: { values: SiteValues; ownerFields: string[] }) {
  const items = values['faq.items'];
  if (items.length === 0) return null;
  return (
    <section className="faq" id="good-to-know" aria-labelledby="faq-title">
      <header className="faq__head">
        <p className="section-top__mark">
          <span className="section-top__n">04</span> Good to know
        </p>
        <h2 id="faq-title" className="faq__title">
          {values['faq.title']}
        </h2>
        {!ownerFields.includes('faq.items') && (
          <p className="sample-note">
            <span className="tag">Sample policies</span> Example answers the studio edits in its dashboard — please check the details with the studio
            before you rely on them.
          </p>
        )}
      </header>
      <div className="faq__list">
        {items.map((item, i) => (
          <details className="qa" key={`${i}-${item.question}`} open={i === 0}>
            <summary>
              <span className="qa__q">{item.question}</span>
              <span className="qa__icon" aria-hidden="true" />
            </summary>
            {item.answer && <p className="qa__a prewrap">{item.answer}</p>}
          </details>
        ))}
      </div>
    </section>
  );
}
