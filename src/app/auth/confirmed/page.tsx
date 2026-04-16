import Link from 'next/link'

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = (await searchParams) ?? {}
  const next = typeof sp.next === 'string' && sp.next.startsWith('/') ? sp.next : '/admin'

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <p className="font-dm text-xs font-medium uppercase tracking-widest text-brand-pink">Email verified</p>
      <h1 className="mt-3 font-lora text-3xl font-normal text-charcoal">Your email has been confirmed.</h1>
      <p className="mt-4 font-dm text-sm font-light leading-relaxed text-charcoal-muted">
        You can now sign in to your account. If you were already signed in, you’ll be redirected automatically.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={`/login?redirect=${encodeURIComponent(next)}&verified=1`}
          className="inline-flex items-center justify-center rounded-full bg-brand-pink px-6 py-2.5 text-sm font-medium text-white font-dm hover:opacity-90"
        >
          Continue to sign in
        </Link>
        <Link
          href={next}
          className="inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-2.5 text-sm font-dm text-charcoal-muted hover:bg-gray-50"
        >
          Go to admin
        </Link>
      </div>

      <script
        // If the callback created a session, this will “just work”.
        dangerouslySetInnerHTML={{
          __html: `setTimeout(() => { try { window.location.href = ${JSON.stringify(next)} } catch {} }, 1200);`,
        }}
      />
    </main>
  )
}

