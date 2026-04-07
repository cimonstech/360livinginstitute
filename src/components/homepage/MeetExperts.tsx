import Image from 'next/image'
import Link from 'next/link'

type TeamMember =
  | {
      name: string
      role: string
      imageSrc: string
      pills: readonly string[]
    }
  | {
      name: string
      role: string
      avatar: number
      pills: readonly string[]
    }

const team: TeamMember[] = [
  {
    name: 'Rev. Angela Appiah',
    role: 'Board Chairperson',
    imageSrc: '/images/Rev.Angela2.jpeg',
    pills: ['Governance', 'Leadership'],
  },
  {
    name: 'Selasi Doku',
    role: 'Executive Director & CEO',
    imageSrc: '/images/selasi.jpeg',
    pills: ['Counselling', 'Life Transitions'],
  },
  {
    name: 'Seyram Mankra',
    role: 'Board Advisory Specialist',
    avatar: 6,
    pills: ['Corporate', 'Strategy'],
  },
]

export default function MeetExperts() {
  return (
    <section className="bg-warm-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Board</p>
          <h2 className="mt-3 font-lora text-3xl font-normal text-charcoal lg:text-4xl">Meet Our Board Members</h2>
          <p className="mt-4 font-dm text-sm font-light leading-relaxed text-charcoal-muted">
            A dedicated leadership team guiding the Institute’s mission, governance, and growth.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-brand-pink hover:shadow-sm"
            >
              <div className="relative aspect-square w-full">
                {member.name === 'Seyram Mankra' ? (
                  <div className="h-full w-full bg-charcoal-light" aria-hidden />
                ) : (
                  <Image
                    src={'imageSrc' in member ? member.imageSrc : `/images/members/person${member.avatar}.webp`}
                    alt=""
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>
              <div className="p-6 text-center">
                <p className="font-dm text-base font-medium text-charcoal">{member.name}</p>
                <p className="mt-1 font-dm text-sm text-charcoal-muted">{member.role}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {member.pills.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full bg-charcoal-light px-3 py-1 font-dm text-xs text-charcoal-muted"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/team"
            className="inline-block rounded-full border border-charcoal/25 px-6 py-3 font-dm text-sm font-normal text-charcoal transition-colors hover:border-brand-pink/40"
          >
            View Our Team →
          </Link>
        </div>
      </div>
    </section>
  )
}
