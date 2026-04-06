import Image from 'next/image'
import Link from 'next/link'

const overlayAvatars = [1, 2, 3] as const

const team = [
  {
    name: 'Selasi Doku',
    role: 'Executive Director & CEO',
    avatar: 4,
    pills: ['Counselling', 'Life Transitions'],
  },
  {
    name: 'Rev. Angela Appiah',
    role: 'Board Chairperson',
    avatar: 5,
    pills: ['Governance', 'Leadership'],
  },
  {
    name: 'Seyram Mankra',
    role: 'Board Advisory Specialist',
    avatar: 6,
    pills: ['Corporate', 'Strategy'],
  },
] as const

export default function MeetExperts() {
  return (
    <section className="bg-warm-white py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div className="relative">
          <Image
            src="/images/SelasiDoku2.jpeg"
            alt="Selasi Doku, Executive Director"
            width={800}
            height={1000}
            className="h-[500px] w-full rounded-2xl object-cover object-top"
          />
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
            <div className="flex items-center pl-1">
              {overlayAvatars.map((n, i) => (
                <div
                  key={n}
                  className={`relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-charcoal-light ${
                    i > 0 ? '-ml-2' : ''
                  }`}
                >
                  <Image
                    src={`/images/members/person${n}.webp`}
                    alt=""
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div>
              <p className="font-dm text-sm font-medium text-charcoal">300+</p>
              <p className="font-dm text-xs text-charcoal-muted">Clients Served</p>
            </div>
          </div>
        </div>

        <div>
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Experts</p>
          <h2 className="mt-3 font-lora text-3xl font-normal text-charcoal lg:text-4xl">
            Meet Our Mental Health Experts
          </h2>
          <p className="mt-4 font-dm text-sm font-light leading-relaxed text-charcoal-muted">
            Our team of psychologists and therapists bring compassion and science together to help you achieve emotional
            balance.
          </p>

          <ul className="mt-8 flex list-none flex-col gap-4 p-0">
            {team.map((member) => (
              <li key={member.name} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Image
                  src={`/images/members/person${member.avatar}.webp`}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-brand-pink-pale object-cover"
                />
                <div className="min-w-0 flex-1 basis-[min(100%,12rem)]">
                  <p className="font-dm text-sm font-medium text-charcoal">{member.name}</p>
                  <p className="font-dm text-xs text-charcoal-muted">{member.role}</p>
                </div>
                <div className="flex w-full flex-shrink-0 flex-wrap gap-1 sm:ml-auto sm:w-auto sm:justify-end">
                  {member.pills.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full bg-charcoal-light px-2 py-1 font-dm text-xs text-charcoal-muted"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/team"
            className="mt-8 inline-block rounded-full border border-charcoal/25 px-6 py-3 font-dm text-sm font-normal text-charcoal transition-colors hover:border-brand-pink/40"
          >
            View Our Explore →
          </Link>
        </div>
      </div>
    </section>
  )
}
