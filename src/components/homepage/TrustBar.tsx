import { Fragment } from 'react'

const items = [
  'Licensed & Accredited Practitioners',
  'Confidential & Safe Environment',
  'In-person & Online Sessions',
  'Individuals, Families & Organisations',
]

function StripItems() {
  return (
    <>
      {items.map((text, i) => (
        <Fragment key={`${text}-${i}`}>
          {i > 0 ? (
            <span className="mx-3 shrink-0 font-dm text-xs text-brand-pink" aria-hidden>
              ✦
            </span>
          ) : null}
          <span className="shrink-0 whitespace-nowrap font-dm text-xs font-light text-charcoal-muted">{text}</span>
        </Fragment>
      ))}
    </>
  )
}

export default function TrustBar() {
  return (
    <section className="bg-warm-cream py-4" aria-label="Trust highlights">
      <p className="sr-only lg:hidden">{items.join('. ')}</p>
      {/* Desktop / large tablet: centered, wrapping row */}
      <div className="mx-auto hidden max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 lg:flex">
        {items.map((text, i) => (
          <Fragment key={text}>
            {i > 0 ? (
              <span className="font-dm text-xs text-brand-pink" aria-hidden>
                ✦
              </span>
            ) : null}
            <span className="font-dm text-xs font-light text-charcoal-muted">{text}</span>
          </Fragment>
        ))}
      </div>

      {/* Mobile: single-line marquee (scrolls right → left); decorative duplicate — summary is sr-only above */}
      <div className="overflow-hidden lg:hidden" aria-hidden="true">
        <div className="trust-marquee-track flex w-max">
          <div className="flex items-center pr-8">
            <StripItems />
          </div>
          <div className="flex items-center pr-8">
            <StripItems />
          </div>
        </div>
      </div>
    </section>
  )
}
