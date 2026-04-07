import Image from 'next/image'

const boardMembers = [
  {
    id: 'angela-appiah',
    name: 'Rev. (Mrs.) Angela Carmen Appiah',
    role: 'Board Chairperson',
    image: '/images/Rev.Angela.jpeg',
    tags: ['CEO, African Corporate Governance Network', 'Fellow, IoD-Gh'],
    bioFirst:
      'Rev. (Mrs.) Angela Carmen Appiah is a transformative leader and a pioneering force in African governance, serving as the first female Chief Executive Officer of the African Corporate Governance Network (ACGN).',
    photoSoon: false,
  },
  {
    id: 'selasi-doku',
    name: 'Selasi Doku (Mrs.)',
    role: 'Executive Director / CEO',
    image: '/images/selasi.jpeg',
    tags: ['MIoD-GH', 'Counselling Psychologist', 'Life Strategist', 'Speaker'],
    bioFirst:
      'Selasi Doku is a counselling psychologist, life strategist, and systems builder dedicated to helping people gain insight into their lives so they can transition intentionally and thrive.',
    photoSoon: false,
  },
  {
    id: 'seyram-mankra',
    name: 'Seyram Kodzo Mankra',
    role: 'Board Member',
    image: '/images/members/person7.webp',
    tags: ['Corporate Governance Specialist', 'Board Advisory', 'Leadership Development'],
    bioFirst:
      'Seyram Kodzo Mankra is a corporate governance professional and board advisory specialist with over two decades of experience supporting boards and executive leadership teams.',
    photoSoon: false,
  },
]

export default function TeamGrid() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Board</p>
        <h2 className="mt-2 font-lora text-3xl font-normal text-charcoal">Meet Our Board Members</h2>
        <p className="mb-16 mt-2 max-w-xl font-dm text-sm font-light text-charcoal-muted">
          A dedicated leadership team guiding the Institute’s mission, governance, and growth.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {boardMembers.map((member) => (
            <article
              id={member.id}
              key={member.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative h-72 w-full overflow-hidden">
                {member.id === 'seyram-mankra' ? (
                  <div className="h-full w-full bg-charcoal-light" aria-hidden />
                ) : (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" aria-hidden />
                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 font-dm text-xs font-medium text-charcoal">
                  {member.role}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-lora text-xl font-normal text-charcoal">{member.name}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {member.tags.map((t) => (
                    <span key={t} className="rounded-full bg-charcoal-light px-2 py-0.5 font-dm text-xs text-charcoal-muted">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-3 font-dm text-xs font-light leading-relaxed text-charcoal-muted">{member.bioFirst}</p>
                {member.photoSoon ? (
                  <span className="mt-3 inline-block rounded-full bg-charcoal-light px-2 py-1 font-dm text-xs text-charcoal-muted">
                    Photo coming soon
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
