# 360 Living Foundation — Project documentation

This document describes the **360living-foundation** Next.js application: marketing site, programme content, contact flows, and the admin/client portal that shares the Institute stack (Supabase, bookings, blog, events).

---

## Tech stack

- **Framework:** Next.js **16** (App Router), React **19**
- **Styling:** Tailwind CSS, `@tailwindcss/typography`
- **Data / auth:** Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- **Forms & validation:** React Hook Form, Zod
- **Email:** Resend (contact and transactional patterns in `src/lib/email.ts`)
- **Media uploads:** S3-compatible storage (`src/lib/r2.ts`) for admin media
- **Rich text (admin blog):** Tiptap

---

## Information architecture (public routes)

| Route | Purpose |
|-------|---------|
| `/` | Homepage (hero, purpose, who we are, programmes preview, approach, impact, testimonials, CTA) |
| `/about` | About hero, story, mission/vision, beliefs, model, institute link, Get Involved CTA |
| `/programs` | Programmes hero + accordion (`programsAccordion` in content) + CTA |
| `/services` | Redirect / alias to programmes (as configured) |
| `/get-involved` | Ways to apply, partner, volunteer, sponsor |
| `/resources` | Resources / links |
| `/contact` | Contact hero, form (`/api/contact`), info |
| `/team` | Team grid and values |
| `/success-stories` | Success stories placeholder / content |
| `/blog`, `/blog/[slug]` | Blog listing and posts |
| `/events` | Events listing and registration |
| `/book` | Booking wizard |
| `/dashboard` | Client dashboard (bookings) |
| `/login`, `/signup`, `/forgot-password` | Auth |
| `/privacy`, `/terms` | Legal placeholders |
| `/admin/*` | Admin area (appointments, clients, blog, events, media, settings) |

Auth helpers: `/auth/callback`, `/auth/confirmed`, `/auth/reset-password`.

---

## Content model

**Primary copy and programme definitions** live in:

- `src/data/content.ts` — homepage sections, about page, `programsPage`, `programsAccordion`, `getInvolved`, `contactPage`, company details, institute link, etc.
- `src/data/board-members.ts` — team/board data where used

**Design tokens** (colours, fonts): `tailwind.config.ts` — brand pink/green, charcoal, warm surfaces; `font-lora`, `font-dm`.

---

## Notable UI building blocks

- **Layout:** `Navbar` (includes gradient `TopContactBar` with phone / email / location), `Footer`
- **Homepage:** `Hero`, `TrustBar`, `PurposeSection`, `AboutSection`, `HealGrowRise`, `Services`, `OurApproach` (photo + scrim + white type), `ImpactGoals`, `FocusAreasHome`, `Testimonials`, `JourneyBanner`, `CTASection` (link to `/contact`, no inline form)
- **Images:** `PublicImageJpgFallback` tries `.jpg` then `.jpeg` for selected public paths
- **Programmes page:** `ServicesHero`, `ServicesAccordion`, `ServicesCTA`
- **About:** `AboutHero`, `OurStory`, `MissionVision`, `OurValues`, `OurModel`, `TeamPreview`, `AboutCTA`

---

## API routes (`src/app/api`)

- **Contact:** `contact` — public form submissions (rate-limited via `src/proxy.ts` patterns)
- **Appointments:** `appointments/create`, `appointments/[id]`, `appointments/notify`
- **Blog:** `blog/save`, `blog/[id]`
- **Events:** `events/save`, `events/register`, `events/[id]`
- **Media:** `media/upload`, `media/list`, `media/[id]`
- **Settings:** `settings/pricing`, `settings/services-pricing`
- **Auth helper:** `auth/post-login-target`

---

## Database & ops

- **SQL migrations / notes:** `supabase/*.sql` (schema, RLS fixes, events, blog, etc.)
- **Env:** `.env.local` (not committed) — Supabase, Resend, R2, etc.; validated in `src/lib/env.ts`

---

## Static assets

- **`public/`** — favicons, `sw.js`, and marketing imagery
- **`public/images/`** — logos, programme and about photos, `services/` subfolder, `members/` for team assets  
  (Exact filenames are referenced from `content.ts` and components; add or rename files to match those paths.)

---

## Project tree (foundation only)

Excludes `node_modules/`, `.next/`, and `.git/`. Listed paths are under `360living-foundation/`.

```
360living-foundation/
├── DOCUMENTATION.md          ← this file
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── public/
│   ├── favicon/              # icons + site.webmanifest
│   ├── images/               # marketing images, logos, team, services subfolder
│   ├── sw.js
│   └── *.svg                 # default Next assets + any root-level images
├── supabase/
│   ├── schema.sql
│   ├── security-hardening.sql
│   ├── event-registrations.sql
│   ├── part-4-blog-media-events-pricing.sql
│   ├── fix-*.sql
│   ├── promote-admin.sql
│   ├── reset-users-and-admins.sql
│   └── auth-email-templates.md
└── src/
    ├── proxy.ts              # middleware-adjacent rate limits / guards
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx          # homepage
    │   ├── globals.css
    │   ├── favicon.ico
    │   ├── (site)/           # public marketing + portal shell
    │   │   ├── about/page.tsx
    │   │   ├── blog/page.tsx
    │   │   ├── blog/[slug]/page.tsx
    │   │   ├── book/page.tsx
    │   │   ├── contact/page.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── events/page.tsx
    │   │   ├── get-involved/page.tsx
    │   │   ├── privacy/page.tsx
    │   │   ├── programs/page.tsx
    │   │   ├── resources/page.tsx
    │   │   ├── services/page.tsx
    │   │   ├── success-stories/page.tsx
    │   │   ├── team/page.tsx
    │   │   └── terms/page.tsx
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   ├── signup/page.tsx
    │   │   └── forgot-password/page.tsx
    │   ├── (admin)/
    │   │   ├── layout.tsx
    │   │   └── admin/
    │   │       ├── page.tsx
    │   │       ├── appointments/...
    │   │       ├── blog/...
    │   │       ├── calendar/page.tsx
    │   │       ├── clients/...
    │   │       ├── emails/page.tsx
    │   │       ├── events/...
    │   │       ├── media/page.tsx
    │   │       └── settings/page.tsx
    │   ├── api/              # route handlers (contact, blog, events, media, appointments, settings)
    │   └── auth/
    │       ├── callback/route.ts
    │       ├── confirmed/page.tsx
    │       └── reset-password/page.tsx
    ├── components/
    │   ├── about/            # AboutHero, OurStory, MissionVision, OurValues, OurModel, TeamPreview, AboutCTA
    │   ├── admin/            # dashboard UI, blog editor, tables, calendar, media, settings
    │   ├── auth/             # login, signup, forgot/reset password forms
    │   ├── blog/
    │   ├── booking/          # BookingWizard + steps
    │   ├── contact/
    │   ├── dashboard/
    │   ├── events/
    │   ├── homepage/         # all homepage sections
    │   ├── layout/           # Navbar, Footer, TopContactBar
    │   ├── services/         # ServicesHero, ServicesAccordion, ServicesCTA, FeaturedPrograms
    │   ├── team/
    │   └── ui/               # PublicImageJpgFallback, etc.
    ├── data/
    │   ├── content.ts        # main marketing copy + programme accordion data
    │   └── board-members.ts
    ├── lib/                  # env, seo, email, supabase clients, sanitize, utils, R2, etc.
    └── types/
        └── index.ts
```

---

## Local development

```bash
cd 360living-foundation
npm install
npm run dev
```

Use `npm run build` for a production check. Ensure `.env.local` is populated per `src/lib/env.ts`.

---

*Last updated to reflect the foundation app layout and the features described in this document.*
