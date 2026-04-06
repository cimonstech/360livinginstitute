import { Briefcase, Mic, Gift } from 'lucide-react'

export default function ContactInfo() {
  return (
    <section className="bg-warm-cream py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3 lg:px-10">
        <article id="partner" className="rounded-2xl border border-gray-100 bg-white p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-pale">
            <Briefcase className="text-brand-green" size={20} strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="mb-3 font-lora text-xl font-normal text-charcoal">Organisational Partnerships</h2>
          <p className="font-dm text-sm font-light leading-relaxed text-charcoal-muted">
            We partner with companies, NGOs, schools, and institutions to deliver workplace wellness programs, mental
            health training, and psychological support at scale.
          </p>
          <p className="mt-6 font-dm text-sm font-medium text-brand-green">partnerships@360livinginstitute.com</p>
        </article>

        <article id="speak" className="rounded-2xl border border-gray-100 bg-white p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink-pale">
            <Mic className="text-brand-pink" size={20} strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="mb-3 font-lora text-xl font-normal text-charcoal">Speaking & Events</h2>
          <p className="font-dm text-sm font-light leading-relaxed text-charcoal-muted">
            Invite Selasi Doku or a member of our team to speak at your conference, church, school, or corporate event.
            We deliver engaging, evidence-based talks on mental health, life transitions, and well-being.
          </p>
          <p className="mt-6 font-dm text-sm font-medium text-brand-pink">events@360livinginstitute.com</p>
        </article>

        <article id="sponsor" className="rounded-2xl border border-gray-100 bg-white p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-pale">
            <Gift className="text-brand-green" size={20} strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="mb-3 font-lora text-xl font-normal text-charcoal">Sponsor a Program</h2>
          <p className="font-dm text-sm font-light leading-relaxed text-charcoal-muted">
            Your support helps us bring mental health programs to communities, schools, and underserved populations across
            Ghana. Partner with us to make psychological support more accessible.
          </p>
          <p className="mt-6 font-dm text-sm font-medium text-brand-green">sponsor@360livinginstitute.com</p>
        </article>
      </div>
    </section>
  )
}
