import Image from 'next/image'

export default function OurStory() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Our Story</p>
            <h2 className="mt-3 font-lora text-3xl font-normal leading-snug text-charcoal lg:text-4xl">
              Every individual is on a journey — shaped by experiences and{' '}
              <em className="font-lora italic text-brand-pink">life transitions</em> deeply felt.
            </h2>
            <div className="mt-6 flex flex-col gap-4 font-dm text-sm font-light leading-relaxed text-charcoal-muted">
              <p>
                At 360 Living Institute, we believe that every individual is on a journey — a journey shaped by
                experiences, decisions, and life transitions that are often unseen but deeply felt.
              </p>
              <p>
                Many people are not stuck because they lack ability; they are stuck because they lack clarity, insight,
                and support. We exist to change that.
              </p>
              <p>
                We don&apos;t just listen to your story — we help you understand it, reframe it, and grow from it. Our
                approach is rooted in deep psychological understanding.
              </p>
              <p>
                When people gain insight into their lives, transformation becomes possible. Whether you are navigating
                personal struggles, family challenges, career transitions, or the demands of leadership — we walk with
                you.
              </p>
              <p>
                At 360 Living Institute, transformation is not an event; it is a process we walk with you, step by step.
              </p>
            </div>
            <blockquote className="mt-8 border-l-4 border-brand-pink py-2 pl-5">
              <p className="font-lora text-base italic text-brand-pink">
                &ldquo;When people gain insight into their lives, transformation becomes possible.&rdquo;
              </p>
            </blockquote>
          </div>

          <div>
            <Image
              src="/images/stressed-black-woman.jpg"
              alt="Our team and community"
              width={800}
              height={576}
              className="h-72 w-full rounded-2xl object-cover object-center"
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Image
                src="/images/SelasiDoku2.jpeg"
                alt="Selasi Doku, Executive Director"
                width={400}
                height={300}
                className="h-48 w-full rounded-2xl object-cover object-top"
              />
              <Image
                src="/images/istockphoto-1398338567-6.jpg"
                alt="Community and wellbeing"
                width={400}
                height={300}
                className="h-48 w-full rounded-2xl object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
