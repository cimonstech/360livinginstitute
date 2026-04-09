import Image from 'next/image'
import Link from 'next/link'

const members = [
  {
    slug: 'angela-appiah',
    name: 'Rev. (Mrs.) Angela Carmen Appiah',
    role: 'Board Chairperson',
    org: 'African Corporate Governance Network',
    bio: 'A transformative leader and pioneering force in African governance with nearly three decades of experience.',
    image: '/images/Rev.Angela.jpeg',
  },
  {
    slug: 'selasi-doku',
    name: 'Selasi Doku (Mrs.)',
    role: 'Executive Director / CEO',
    org: 'MIoD-GH | Counselling Psychologist',
    bio: 'Dedicated to helping people gain insight into their lives so they can transition intentionally and thrive.',
    image: '/images/selasi.jpeg',
  },
  {
    slug: 'seyram-mankra',
    name: 'Seyram Kodzo Mankra',
    role: 'Board Member',
    org: 'Corporate Governance & Board Advisory Specialist',
    bio: 'Over two decades supporting boards and executive leadership teams to strengthen governance effectiveness.',
    image: '/images/Seyram-1.jpeg',
  },
]

export default function TeamPreview() {
  return (
    <section className="bg-brand-pink-pale py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Board</p>
        <h2 className="mt-3 font-lora text-3xl font-normal text-charcoal lg:text-4xl">
          Meet Our Board Members
        </h2>
        <p className="mb-12 mt-3 max-w-xl font-dm text-sm font-light text-charcoal-muted">
          A dedicated leadership team guiding the Institute’s mission, governance, and growth.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {members.map((member) => (
            <article
              key={member.slug}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="font-lora text-lg font-medium text-charcoal">{member.name}</h3>
                <p className="mt-1 font-dm text-xs font-medium text-brand-pink">{member.role}</p>
                <p className="mt-0.5 font-dm text-xs text-charcoal-muted">{member.org}</p>
                <p className="mb-4 mt-3 font-dm text-xs font-light leading-relaxed text-charcoal-muted">{member.bio}</p>
                <Link
                  href={`/team#${member.slug}`}
                  className="font-dm text-xs font-medium text-brand-pink transition-colors hover:underline"
                >
                  View Profile →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
