// ─────────────────────────────────────────────────────────────
// 360 Living Foundation — Site Content
// Single source of truth for public marketing copy.
// ─────────────────────────────────────────────────────────────

export const institute = {
  name: '360 Living Institute',
  url: 'https://360livinginstitute.com',
} as const

export const company = {
  name: '360 Living Foundation',
  tagline: 'Heal, Grow and Rise!',
  email: 'info@360livingfoundation.org',
  phone: '0264589293',
  phoneDisplay: '0264589293',
  address: 'Accra, Ghana',
  socials: {
    instagram: '',
    linkedin: '',
    facebook: '',
  },
} as const

// ── HOMEPAGE ─────────────────────────────────────────────────
export const homepage = {
  hero: {
    headlineLines: [
      'Transforming Minds.',
      'Empowering Lives.',
      'Building a Thriving Society.',
    ],
    supporting:
      'We equip individuals, especially youth and women, with the tools to navigate life, build resilience, and live purposefully through counselling, mentorship, and personal development.',
    ctas: [
      { label: 'Apply for a Program', href: '/get-involved#apply' },
      { label: 'Partner With Us', href: '/get-involved#partner' },
    ],
    joinMovement: 'Join the Movement',
  },

  trustBar: [
    'Counselling & mentorship',
    'Training programmes',
    'Community engagement',
    'Grounded in the RNCC model',
  ],

  purpose: {
    eyebrow: 'Our Purpose',
    body:
      'The Foundation exists to bridge the gap between potential and reality through counselling, mentorship, and life development programmes.',
    ctas: [
      { label: 'Apply for a Program', href: '/get-involved#apply' },
      { label: 'Partner With Us', href: '/get-involved#partner' },
    ],
  },

  whoWeAre: {
    eyebrow: 'Who We Are',
    titleLine1: 'When individuals are empowered,',
    titleEmphasis: 'communities thrive.',
    paragraphs: [
      'The 360 Living Foundation is a transformative organisation committed to improving mental well-being and personal development through accessible, culturally relevant counselling and mentorship programmes.',
      'We believe that when individuals are mentally and emotionally empowered, they become catalysts for stronger families, healthier workplaces, and a thriving nation.',
    ],
  },

  aboutSnippet: {
    eyebrow: 'About Us',
    paragraphs: [
      '360 Living Foundation was born out of a deep need to make mental health support more accessible, relatable, and transformative. Recognising the growing challenges faced by youth, women and families, the Foundation was established to bridge the gap between psychological knowledge and everyday living.',
      'The Foundation operates as the social impact arm of the 360 Living Institute, translating psychological knowledge into practical, community-based interventions that foster wholeness, clarity, and sustainable growth.',
    ],
  },

  /** Homepage “Who we are” visual — single image + overlay card */
  aboutVisual: {
    imageSrc: '/images/togetherness.jpg',
    imageAlt: 'Community and togetherness',
    cardTitle: 'Training & growth',
    cardBody: 'Practical tools for individuals, families, and communities.',
  },

  healGrowRise: {
    eyebrow: 'Heal · Grow · Rise',
    title: 'Building a Thriving Society.',
    pillars: [
      {
        title: 'Heal',
        body:
          'Restoring emotional and mental well-being involves letting go of past hurts and limiting beliefs. Healing lays the groundwork for progress with strength, clarity, peace, and insight, fostering lasting change.',
      },
      {
        title: 'Grow',
        body:
          'Enhancing your skills, mindset, and personal capacity. Learning, adapting, and building resilience. Growth equips you to step confidently into your purpose.',
      },
      {
        title: 'Rise',
        body:
          'Taking action and fully embracing your potential. Applying learned lessons while pursuing meaningful goals. Through legacy, leadership, and contribution, you transform growth into lasting success and fulfilment.',
      },
    ],
  },

  programsPreview: {
    eyebrow: 'Our Programs',
    title: 'Meet people where they are',
    intro:
      'Structured programmes designed for different stages of life and growth — from inspiration to transformation to acceleration.',
    ctas: [
      { label: 'Apply Now', href: '/get-involved#apply' },
      { label: 'Explore all programmes', href: '/programs' },
    ],
    items: [
      {
        slug: 'thrive360-experience',
        title: 'Thrive360 Experience',
        summary: 'A powerful mental well-being event for inspiration, reflection, and collective empowerment.',
      },
      {
        slug: 'transformation-lab',
        title: '360 Transformation Lab',
        summary: 'Foundational work on identity, mindset, and life skills for sustainable change.',
      },
      {
        slug: 'thrive360-accelerator',
        title: 'Thrive360 Accelerator',
        summary: 'Growth for clarity, leadership, and advancement in career and life.',
      },
      {
        slug: 'community-outreach',
        title: 'Community Outreach',
        summary: 'Partnering with organisations to deliver education, training, and support at scale.',
      },
      {
        slug: 'mentorship',
        title: 'Mentorship Programmes',
        summary: 'Structured mentorship for life guidance, career direction, and transitions.',
      },
      {
        slug: 'mental-health-awareness',
        title: 'Mental Health Awareness',
        summary: 'Breaking stigma and increasing understanding, access, and conversation.',
      },
    ],
  },

  approach: {
    eyebrow: 'Our Approach',
    title: 'Counselling, mentorship, and community — with a proven model',
    intro:
      'We use a unique blend of counselling, mentorship, training programmes, and community engagement — all grounded in our proprietary RNCC (Resilient Narrative-Centered Counselling) Model, which helps individuals reshape their stories and build resilience.',
    bullets: ['Counselling', 'Mentorship', 'Training programmes', 'Community engagement'],
  },

  impactGoals: {
    eyebrow: 'Impact Goals',
    title: 'What we are working toward',
    items: [
      'Increase access to mental health education and counselling.',
      'Empower youth and women with life skills and resilience tools.',
      'Reduce stigma around mental health in Ghana and beyond.',
      'Position counselling as a national developmental tool.',
      'Influence policy and advocacy in mental health and development.',
      'Improve life decision-making.',
      'Strengthen families and communities.',
    ],
  },

  focusAreas: {
    eyebrow: 'Our Focus Areas',
    title: 'Where we concentrate our work',
    areas: [
      {
        title: 'Youth Development',
        subtitle: 'Helping young people:',
        bullets: ['Understand themselves', 'Build confidence', 'Make informed life decisions'],
      },
      {
        title: 'Women Empowerment',
        subtitle: 'Supporting women to:',
        bullets: ['Grow personally and professionally', 'Navigate relationships', 'Build emotional strength'],
      },
      {
        title: 'Mental Health Awareness',
        subtitle: 'Breaking stigma and increasing:',
        bullets: ['Understanding', 'Access', 'Conversations around mental health'],
      },
      {
        title: 'Mentorship Programmes',
        subtitle: 'Structured mentorship for:',
        bullets: [
          'Life guidance / personal growth',
          'Career direction',
          'Mental health awareness',
          'Life transitions support',
          'Community well-being',
        ],
      },
    ],
  },

  testimonials: {
    eyebrow: 'Success Stories',
    items: [
      {
        quote: '360 Living helped me rediscover my confidence and direction in life.',
        attribution: 'Program Participant',
      },
    ],
    sidebarQuote: {
      quote:
        'Transformation becomes possible when people gain clarity, support, and practical tools for the season they are in.',
      attribution: 'Foundation participant',
    },
  },

  journeyBanner: {
    title: 'Your journey to clarity, resilience, and purpose starts here.',
    ctas: [
      { label: 'Apply Now', href: '/get-involved#apply' },
      { label: 'Partner With Us', href: '/get-involved#partner' },
    ],
  },

  ctaSection: {
    eyebrow: 'Contact',
    title: 'Ready to take the next step?',
    intro: 'Reach out — we would love to hear from you and help you find the right programme or partnership.',
    primaryCta: { label: 'Go to contact form', href: '/contact' },
    phoneNotePrefix: 'Or call us directly:',
  },
} as const

// ── ABOUT PAGE ───────────────────────────────────────────────
export const about = {
  hero: {
    eyebrow: 'About Us',
    titleLines: ['Bridging potential', 'and reality through', 'impact & care'],
    lead:
      'The 360 Living Foundation exists to bridge the gap between potential and reality through counselling, mentorship, and life development programmes — especially for youth and women.',
    heroImageSrc: '/images/stressed-black-woman.jpg',
    heroImageAlt: 'Seeking support for mental well-being',
    floatingCard: {
      title: 'Programmes & outreach',
      subtitle: 'Counselling, mentorship, and community impact',
    },
  },

  story: {
    heading: 'Our Story',
    subheading: 'Accessible mental health support that meets people in real life.',
    paragraphs: [
      '360 Living Foundation was born out of a deep need to make mental health support more accessible, relatable, and transformative.',
      'Recognising the growing challenges faced by youth, women and families, the Foundation was established to bridge the gap between psychological knowledge and everyday living.',
      'The Foundation operates as the social impact arm of the 360 Living Institute, translating psychological knowledge into practical, community-based interventions that foster wholeness, clarity, and sustainable growth.',
    ],
    quote: 'Heal, Grow and Rise!',
  },

  vision:
    'To build a society where individuals are mentally empowered, emotionally intelligent, and purpose-driven, contributing meaningfully to personal, family, and national development.',

  mission:
    'To use counselling, mentorship, and structured development programmes to transform mindsets, strengthen resilience, and support individuals in navigating life transitions with clarity and confidence. To equip individuals, families, and communities with the tools to thrive in life.',

  beliefs: [
    {
      title: 'Mental health is essential',
      desc: 'Mental health is essential, not optional.',
    },
    {
      title: 'Access for everyone',
      desc: 'Everyone deserves access to support and growth tools.',
    },
    {
      title: 'Sustainable transformation',
      desc: 'Transformation should be practical, structured, and sustainable.',
    },
  ],

  beliefsSection: {
    eyebrow: 'What We Believe',
    title: 'Principles that shape our programmes',
    intro: 'Our beliefs keep our work grounded, practical, and inclusive.',
  },

  model: {
    eyebrow: 'Our Approach',
    title: 'The RNCC model — Resilient Narrative-Centered Counselling',
    paragraphs: [
      'We combine counselling, mentorship, training programmes, and community engagement — grounded in our proprietary RNCC (Resilient Narrative-Centered Counselling) Model — to help individuals reshape their stories and build resilience.',
      'As the social impact arm of the 360 Living Institute, we translate psychological insight into practical interventions for wholeness and sustainable growth.',
    ],
  },

  institutePartnership: {
    eyebrow: 'Our Roots',
    title: 'Part of the 360 Living Institute family',
    body:
      'The Foundation extends the Institute’s mission into communities — making mental well-being support more accessible through programmes, partnerships, and outreach.',
    cta: { label: `Visit ${institute.name}`, href: institute.url },
  },

  cta: {
    eyebrow: 'Get Involved',
    title: 'Your journey starts with one intentional step.',
    intro: 'Apply for a programme, partner with us, or explore ways to volunteer and sponsor impact.',
    actions: [
      { label: 'Apply Now', href: '/get-involved#apply' },
      { label: 'Partner With Us', href: '/get-involved#partner' },
      { label: 'Volunteer', href: '/get-involved#volunteer' },
      { label: 'Sponsor or Donate', href: '/get-involved#sponsor' },
    ],
  },
} as const

// Accordion items (same shape as ServicesAccordion)
export type ProgramAccordionItem = {
  num: string
  slug: string
  title: string
  tag: string
  tagColor: 'pink' | 'green'
  image: string
  body: string
  bullets: string[]
  cta: { label: string; href: string }
}

export const programsAccordion: ProgramAccordionItem[] = [
  {
    num: '01',
    slug: 'thrive360-experience',
    title: 'Thrive360 Experience',
    tag: 'Experience',
    tagColor: 'pink',
    image: '/images/services/individual-counseling.jpeg',
    body:
      'The Thrive360 Experience is a powerful mental well-being event designed to inspire personal transformation and connect individuals with meaningful growth opportunities. The event brings together participants for a journey of learning, deep reflection, and lasting change. Through a supportive environment, attendees can engage in activities and discussions that foster both self-discovery and collective empowerment, making the Thrive360 Experience a catalyst for holistic development.',
    bullets: [
      'Learning and deep reflection in a supportive environment',
      'Self-discovery and collective empowerment',
      'A catalyst for holistic development',
    ],
    cta: { label: 'Apply Now', href: '/get-involved#apply' },
  },
  {
    num: '02',
    slug: 'transformation-lab',
    title: '360 Transformation Lab',
    tag: 'Foundation',
    tagColor: 'green',
    image: '/images/accessible-mental-health-support.jpg',
    body:
      'A foundational programme for individuals focusing on identity, mindset, and life skills. It explores the participants’ stage of life to facilitate the transformation needed to rise.',
    bullets: ['Identity and purpose discovery', 'Build emotional intelligence', 'Developing life skills'],
    cta: { label: 'Apply Now', href: '/get-involved#apply' },
  },
  {
    num: '03',
    slug: 'thrive360-accelerator',
    title: 'Thrive360 Accelerator',
    tag: 'Growth',
    tagColor: 'pink',
    image: '/images/african-psychologist.webp',
    body:
      'A programme focused on growth for individuals seeking clarity, leadership, and advancement. This programme is designed to help participants rise with confidence.',
    bullets: [
      'Gain clarity in career and life direction',
      'Strengthen leadership capacity',
      'Achieve personal and professional goals',
    ],
    cta: { label: 'Apply Now', href: '/get-involved#apply' },
  },
  {
    num: '04',
    slug: 'community-outreach',
    title: 'Community Outreach',
    tag: 'Partnerships',
    tagColor: 'green',
    image: '/images/community-outreach.jpg',
    body: 'We partner with organisations to deliver practical mental health education and skills training in communities.',
    bullets: [
      'Mental health education',
      'Life skills training',
      'Transition awareness programmes',
      'Leadership and emotional intelligence training',
      'Family and community support workshops',
    ],
    cta: { label: 'Partner With Us', href: '/get-involved#partner' },
  },
]

export const programsPage = {
  hero: {
    eyebrow: 'Our Programs',
    titleLines: ['Structured programmes', 'for every stage', 'of growth'],
    intro:
      'We offer structured programmes designed to meet individuals at different stages of life and growth — grounded in counselling, mentorship, and practical development.',
  },

  cta: {
    eyebrow: 'Next Step',
    title: 'Not sure which programme fits you?',
    intro:
      'Tell us a little about your goals — we will guide you to the right opportunity or partnership pathway.',
    primary: { label: 'Apply Now', href: '/get-involved#apply' },
    secondary: { label: 'Contact Us', href: '/contact' },
    cards: [
      {
        title: 'Apply with ease',
        desc: 'Share your interest online — we will follow up with next steps.',
      },
      {
        title: 'Partnerships welcome',
        desc: 'Corporates, NGOs, schools, and faith communities — let us collaborate.',
      },
      {
        title: 'Designed for impact',
        desc: 'Practical tools you can use long after the programme ends.',
      },
    ],
  },
} as const

// ── GET INVOLVED ─────────────────────────────────────────────
export const getInvolved = {
  hero: {
    eyebrow: 'Get Involved',
    title: 'Join the movement for mental empowerment',
    intro:
      'Take the first step toward your transformation journey — as a participant, partner, volunteer, or sponsor.',
  },

  joinPrograms: {
    title: 'Join Our Programs',
    body: 'Take the first step toward your transformation journey.',
    cta: { label: 'Apply Now', href: '/get-involved#apply' },
  },

  partner: {
    title: 'Partner With Us',
    intro: 'We collaborate with:',
    bullets: ['Corporates', 'NGOs', 'Faith-based organisations', 'Educational institutions'],
    closing: 'Let’s work together to transform our community.',
    cta: { label: 'Become a Partner', href: '/contact#partner' },
  },

  volunteer: {
    title: 'Volunteer',
    body: 'Be part of a movement changing lives.',
    cta: { label: 'Sign Up to Volunteer', href: '/contact#volunteer' },
  },

  sponsor: {
    title: 'Sponsor a Program',
    body: 'Support individuals who need access to transformation opportunities.',
    cta: { label: 'Sponsor Now', href: '/contact#sponsor' },
  },

  donate: {
    title: 'Donate',
    body: 'Support the transformation of lives and communities.',
    cta: { label: 'Donate', href: '/contact#donate' },
  },

  apply: {
    id: 'apply',
    title: 'Apply for a Program',
    body: 'Ready to join? Send us a message with your name, email, and the programme you are interested in — or use the general contact form.',
    primaryCta: { label: 'Go to contact form', href: '/contact' },
  },
} as const

// ── RESOURCES ────────────────────────────────────────────────
export const resourcesPage = {
  eyebrow: 'Resources',
  title: 'Insights for Everyday Living',
  intro: 'Explore articles, tools, and resources on:',
  topics: [
    'Mental health',
    'Personal development',
    'Relationships',
    'Life transitions',
    'Understanding Life Transitions',
    'Mental Health in the Workplace',
    'Parenting in Today’s World',
    'Emotional Intelligence',
  ],
  placeholderNote:
    'Resource articles are coming soon. In the meantime, follow our updates or reach out for programme information.',
} as const

// ── SUCCESS STORIES ───────────────────────────────────────────
export const successStoriesPage = {
  title: 'Success Stories',
  intro: 'Stories from participants will appear here as we collect and publish them with consent.',
  placeholder: homepage.testimonials.items[0],
} as const

// ── CONTACT PAGE ─────────────────────────────────────────────
export const contactPage = {
  hero: {
    titleLines: ['We’d love to', 'hear from', 'you'],
    intro:
      'Whether you want to apply, partner, volunteer, sponsor, donate, or ask a question — send us a message and we will respond.',
    email: company.email,
    phone: company.phone,
    address: company.address,
  },

  intents: [
    {
      href: '/get-involved#apply',
      title: 'Apply for a Program',
      desc: 'Start your transformation journey with us',
    },
    {
      href: '/contact#partner',
      title: 'Partner With Us',
      desc: 'Organisations, NGOs, schools, and faith communities',
    },
    {
      href: '/contact#volunteer',
      title: 'Volunteer',
      desc: 'Serve with us in the community',
    },
    {
      href: '/contact#sponsor',
      title: 'Sponsor a Program',
      desc: 'Fund access for those who need it most',
    },
    {
      href: '/contact#donate',
      title: 'Donate',
      desc: 'Support transformation in communities',
    },
  ] as const,
} as const
