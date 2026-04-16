import { Briefcase, HandHelping, Gift, Heart } from 'lucide-react'
import { company } from '@/data/content'

export default function ContactInfo() {
  return (
    <section className="bg-warm-cream py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <article id="partner" className="scroll-mt-28 rounded-2xl border border-gray-100 bg-white p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-pale">
            <Briefcase className="text-brand-green" size={20} strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="mb-3 font-lora text-xl font-normal text-charcoal">Partner With Us</h2>
          <p className="font-dm text-sm font-light leading-relaxed text-charcoal-muted">
            We collaborate with corporates, NGOs, faith-based organisations, and educational institutions to deliver
            mental health education, training, and community programmes.
          </p>
          <p className="mt-6 font-dm text-sm font-medium text-brand-green">{company.email}</p>
        </article>

        <article id="volunteer" className="scroll-mt-28 rounded-2xl border border-gray-100 bg-white p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink-pale">
            <HandHelping className="text-brand-pink" size={20} strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="mb-3 font-lora text-xl font-normal text-charcoal">Volunteer</h2>
          <p className="font-dm text-sm font-light leading-relaxed text-charcoal-muted">
            Be part of a movement changing lives. Reach out to explore volunteer opportunities with the Foundation.
          </p>
          <p className="mt-6 font-dm text-sm font-medium text-brand-pink">{company.email}</p>
        </article>

        <article id="sponsor" className="scroll-mt-28 rounded-2xl border border-gray-100 bg-white p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-pale">
            <Gift className="text-brand-green" size={20} strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="mb-3 font-lora text-xl font-normal text-charcoal">Sponsor a Program</h2>
          <p className="font-dm text-sm font-light leading-relaxed text-charcoal-muted">
            Support individuals who need access to transformation opportunities. Your sponsorship expands our reach.
          </p>
          <p className="mt-6 font-dm text-sm font-medium text-brand-green">{company.email}</p>
        </article>

        <article id="donate" className="scroll-mt-28 rounded-2xl border border-gray-100 bg-white p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink-pale">
            <Heart className="text-brand-pink" size={20} strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="mb-3 font-lora text-xl font-normal text-charcoal">Donate</h2>
          <p className="font-dm text-sm font-light leading-relaxed text-charcoal-muted">
            Support the transformation of lives and communities. Contact us to discuss how you would like to give.
          </p>
          <p className="mt-6 font-dm text-sm font-medium text-brand-pink">{company.email}</p>
        </article>
      </div>
    </section>
  )
}
