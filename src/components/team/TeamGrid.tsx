import Image from 'next/image'

const selasiCredentials = [
  'MA in Guidance and Counselling',
  'Postgraduate Certificate in Psychology',
  'Training in Trauma-Informed Care',
  'Executive Certificate in Counselling',
  'Certificate — WELA Program, CEIBS (Most Promising Alumnus 2025)',
  'Executive Certificate in Management',
  'Member, Institute of Directors-Ghana (MIoD-GH)',
  'Member, Ghana National Association of Certificated Counsellors (GNACC)',
  'Chairperson, CPD Committee — GNACC',
  'Member, Ghana Psychological Association (GPA)',
]

const selasiBio = [
  'Selasi Doku is a counselling psychologist, life strategist, and systems builder dedicated to one core mission: helping people gain insight into their lives so they can transition intentionally and thrive.',
  'Her journey began in communication design and marketing, where she learned to strategically position ideas and influence perceptions. Over time, she discovered a deeper need — not just for better communication, but for a more profound understanding of human behaviour and life patterns.',
  'This realisation led her to counselling psychology, where she identified a significant gap: many individuals struggle not because of a lack of capability, but because they lack clarity about their current life stage — igniting her interest in life transition psychology.',
  'As Executive Director of the 360 Living Institute and CEO of Medfocus International, she has dedicated herself to transforming lives through mental well-being, personal development, and increased access to care.',
]

const gridMembers = [
  {
    id: 'angela-appiah',
    name: 'Rev. (Mrs.) Angela Carmen Appiah',
    role: 'Board Chairperson',
    image: '/images/Rev.Angela.jpeg',
    tags: ['CEO, African Corporate Governance Network', 'Fellow, IoD-Gh'],
    bioFirst:
      'Rev. (Mrs.) Angela Carmen Appiah is a transformative leader and a pioneering force in African governance, serving as the first female Chief Executive Officer of the African Corporate Governance Network (ACGN).',
    credentials: [
      'MSc in Advanced Practice — Cardiff University, UK',
      'Doctorate in Business Leadership (in progress) — IPAG Business School, France',
      'Fellow, Institute of Directors-Ghana (IoD-Gh)',
      '2025 Ghana Women of Excellence Gold Award',
    ],
    photoSoon: false,
  },
  {
    id: 'seyram-mankra',
    name: 'Seyram Kodzo Mankra',
    role: 'Board Member',
    image: '/images/SelasiDoku.jpeg',
    tags: ['Corporate Governance Specialist', 'Board Advisory', 'Leadership Development'],
    bioFirst:
      'Seyram Kodzo Mankra is a corporate governance professional and board advisory specialist with over two decades of experience supporting boards and executive leadership teams.',
    credentials: [
      'MA in Organisational Leadership and Governance — University of Ghana',
      'Certificate in Corporate Governance — Institute of Directors-Ghana',
      'BA in Political Science & Religion — University of Ghana',
      'Member, Institute of Directors-Ghana',
    ],
    photoSoon: false,
  },
  {
    id: 'eyram',
    name: 'Eyram',
    role: 'Team Member',
    image: '/images/SelasiDoku.jpeg',
    tags: ['360 Living Institute'],
    bioFirst:
      'A dedicated member of the 360 Living Institute team, committed to supporting individuals and organisations in their journey toward psychological well-being and life development.',
    credentials: [] as string[],
    photoSoon: true,
  },
]

export default function TeamGrid() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">The Team</p>
        <h2 className="mt-2 font-lora text-3xl font-normal text-charcoal">Practitioners, Leaders & Visionaries</h2>
        <p className="mb-16 mt-2 max-w-xl font-dm text-sm font-light text-charcoal-muted">
          Every member of our team is committed to one goal: helping you understand your life so you can transform it.
        </p>

        <article
          id="selasi-doku"
          className="mb-8 grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-100 lg:grid-cols-2"
        >
          <div className="relative h-[500px] w-full lg:h-auto lg:min-h-[640px]">
            <Image
              src="/images/SelasiDoku.jpeg"
              alt="Selasi Doku (Mrs.)"
              fill
              className="object-cover object-top"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-between bg-brand-pink-pale p-10">
            <div>
              <span className="mb-4 inline-block rounded-full bg-brand-pink px-3 py-1 font-dm text-xs font-medium text-white">
                Executive Director / CEO
              </span>
              <h3 className="font-lora text-3xl font-normal text-charcoal">Selasi Doku (Mrs.)</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {['MIoD-GH', 'Counselling Psychologist', 'Life Strategist', 'Speaker'].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 font-dm text-xs text-charcoal-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 font-dm text-sm font-light leading-relaxed text-charcoal-muted">
                {selasiBio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="mt-6 border-t border-brand-pink-light pt-6">
              <p className="mb-3 font-dm text-xs font-medium uppercase tracking-wider text-charcoal">
                Credentials & Memberships
              </p>
              <ul className="grid grid-cols-1 gap-1.5">
                {selasiCredentials.map((c) => (
                  <li key={c} className="flex items-start gap-2 font-dm text-xs font-light text-charcoal-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-green" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {gridMembers.map((member) => (
            <article
              id={member.id}
              key={member.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
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
                {member.credentials.length > 0 ? (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="mb-2 font-dm text-xs font-medium uppercase tracking-wider text-charcoal">Credentials</p>
                    <ul className="flex flex-col gap-1">
                      {member.credentials.map((c) => (
                        <li key={c} className="flex items-start gap-2 font-dm text-xs text-charcoal-muted">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-pink" aria-hidden />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
