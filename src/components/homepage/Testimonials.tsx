import Image from 'next/image'

export default function Testimonials() {
  return (
    <section className="bg-surface-dark py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="font-dm text-xs font-medium uppercase tracking-widest text-white/40">Success Stories</p>
            <div className="mt-6 flex flex-col gap-4">
              <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="font-lora text-base font-normal italic leading-relaxed text-white/80">
                  &ldquo;360 Living Institute changed my life. I came in confused and overwhelmed, and left with clarity,
                  tools, and a renewed sense of purpose. The counselling sessions were deeply personal and
                  transformative.&rdquo;
                </p>
                <div className="mt-4">
                  <p className="font-dm text-xs text-white/50">Individual Counselling Client</p>
                </div>
              </article>

              <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="font-lora text-base font-normal italic leading-relaxed text-white/80">
                  &ldquo;As an entrepreneur, I was burning out fast. The wellness program helped me realign my priorities. I
                  now lead my team with more clarity, empathy, and resilience than ever before.&rdquo;
                </p>
                <div className="mt-4">
                  <p className="font-dm text-xs text-white/50">Entrepreneur Wellness Client</p>
                </div>
              </article>
            </div>
          </div>

          <div>
            <div className="relative">
              <Image
                src="/anxietydisorder.jpeg"
                alt="Wellness professional"
                width={800}
                height={640}
                className="h-80 w-full rounded-2xl object-cover object-center"
              />
            </div>
            <article className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-dm text-xs text-white/50">Behavioural Therapist</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="font-dm text-sm text-amber-400" aria-hidden>
                  ★★★★★
                </span>
                <span className="font-dm text-xs text-white/60">5.0</span>
              </div>
              <p className="mt-3 font-lora text-sm font-normal italic leading-relaxed text-white/80">
                &ldquo;The sessions helped me rediscover hope, build emotional strength, and find a sense of peace and
                clarity I never thought possible before.&rdquo;
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
