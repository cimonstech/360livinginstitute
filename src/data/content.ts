// ─────────────────────────────────────────────────────────────
// 360 Living Institute — Site Content
// Single source of truth for all website copy and data.
// Update this file when content changes; components pull from here.
// ─────────────────────────────────────────────────────────────

// ── COMPANY INFO ─────────────────────────────────────────────
export const company = {
  name: "360 Living Institute",
  tagline: "Transforming Lives Through Psychological Insight & Life Development",
  email: "info@360livinginstitute.com",
  phone: "0538045503",
  address: "31 Awudome Roundabout, Awudome, Accra",
  socials: {
    // Add handles when available
    instagram: "",
    linkedin: "",
    facebook: "",
  },
}

// ── HOMEPAGE ─────────────────────────────────────────────────
export const homepage = {
  hero: {
    headline: "Understanding Life Transitions — The Hidden Key to Well-being.",
    subheadline:
      "Many life challenges stem from a lack of insight into transition: career shifts, marriage, parenting, identity, loss, and personal growth.",
    body: "At 360 Living Institute, we help individuals, families, and organisations understand life transitions, build resilience, and thrive mentally, emotionally, socially and economically.",
    ctas: [
      { label: "Book a Session", href: "/book" },
      { label: "Partner With Us", href: "/contact#partner" },
      { label: "Explore Programs", href: "/services" },
    ],
  },

  whoWeAre: {
    heading: "Who We Are",
    body: [
      "360 Living Institute was founded on a simple but powerful belief: People don't just need solutions — they need understanding.",
      "Through years of counselling, research, and real-life engagement, we discovered that many emotional struggles are rooted in unrecognised life transitions.",
      "360 Living Institute is a center for psychological insight, counselling, and life development. We exist to help people understand where they are in life, why they feel stuck, and how to move forward with clarity and purpose.",
    ],
  },

  whoWeServe: [
    "Individuals seeking clarity and healing",
    "Couples and families",
    "Entrepreneurs and executives",
    "Corporate organizations",
    "Youth and young adults",
  ],

  whyChooseUs:
    "Confidentiality is essential to your entire life. At 360 Living, we create personalised plans tailored specifically for you, drawing from a person-centered approach with a wealth of knowledge and advanced techniques. Our goal is to help our clients become their truest selves by examining every aspect of their lives and collaboratively developing strategies for growth, personal development, and navigating transitional periods.",

  finalCta: {
    heading: "Your next level begins with understanding your current season.",
    subheading: "Take the first step toward clarity and transformation.",
    actions: [
      { label: "Book a counselling session", href: "/book" },
      { label: "Partner as an organisation", href: "/contact#partner" },
      { label: "Invite us to speak", href: "/contact#speak" },
      { label: "Sponsor a program", href: "/contact#sponsor" },
    ],
  },
}

// ── ABOUT PAGE ───────────────────────────────────────────────
export const about = {
  intro:
    "The 360 Living Institute is a center for psychological insight, counselling, and life development. We are dedicated to helping individuals, families, and organizations achieve wholeness through structured, evidence-based transformation. Our focus is on guiding people through life transitions such as identity, survival, growth, expansion, and finding meaning while emphasizing prevention over crisis management.",

  model:
    "Utilizing our integrated RNCC model, we combine three counselling approaches to foster emotional intelligence, resilience, and purposeful living. At the Institute, we provide individuals and organisations with practical tools, insights, and systems to enhance well-being, productivity, and sustainable growth. We position mental health as a key driver for personal, organisational, and national development.",

  story: {
    heading: "Our Story",
    paragraphs: [
      "At 360 Living Institute, we believe that every individual is on a journey — a journey shaped by experiences, decisions, and life transitions that are often unseen but deeply felt.",
      "Many people are not stuck because they lack ability; they are stuck because they lack clarity, insight, and support. We exist to change that.",
      "We don't just listen to your story — we help you understand it, reframe it, and grow from it.",
      "Our approach is rooted in deep psychological understanding and guided by the belief that: When people gain insight into their lives, transformation becomes possible.",
      "Whether you are navigating personal struggles, family challenges, career transitions, or the demands of leadership and entrepreneurship, we walk with you to build resilience, restore clarity, and support lasting change.",
      "At 360 Living Institute, transformation is not an event; it is a process we walk with you, step by step.",
    ],
  },

  mission:
    "To offer accessible psychological support, insights, and tools that assist individuals, families, and organisations in effectively navigating life.",

  vision:
    "To become a leading global center for life transition psychology, counselling, and human development.",

  values: [
    { name: "Confidentiality", desc: "Your privacy is sacred. Everything shared stays protected." },
    { name: "Empathy", desc: "We meet you where you are, without judgment." },
    { name: "Insight", desc: "We go beyond symptoms to help you understand the root." },
    { name: "Innovation", desc: "We use evidence-based, forward-thinking approaches." },
    { name: "Transformation", desc: "We walk with you through lasting, meaningful change." },
  ],
}

// ── SERVICES ─────────────────────────────────────────────────
export const services = [
  {
    slug: "individual-counselling",
    title: "Individual Counselling",
    summary:
      "Support for personal clarity, healing, and growth.",
    body: "We provide support for personal clarity, healing, and growth, assisting individuals in navigating anxiety, emotional overwhelm, self-discovery, life direction, and personal challenges.",
    cta: { label: "Book a Session", href: "/book" },
  },
  {
    slug: "corporate-mental-health",
    title: "Corporate Mental Health & Wellness",
    summary: "Building mentally healthy and high-performing workplaces.",
    body: "We partner with organisations to improve employee well-being, increase productivity and focus, reduce burnout and absenteeism, and build psychologically safe environments.",
    bullets: [
      "Workplace counselling support",
      "Mental health workshops",
      "Psychological safety and first aid",
      "Wellness in the board",
    ],
    cta: { label: "Partner With Us", href: "/contact#partner" },
  },
  {
    slug: "entrepreneur-wellness",
    title: "Entrepreneur Wellness & Performance Support",
    summary: "Specialised support for founders and business leaders.",
    body: "Entrepreneurs and business leaders encounter specific psychological challenges including burnout, decision fatigue, leadership pressure, emotional isolation, and work-life imbalance.",
    bullets: [
      "Executive counselling sessions",
      "Founder wellness programs — relationships, communication, conflict resolution",
      "Mental resilience training",
      "Business-life alignment coaching",
    ],
    cta: { label: "Book a Session", href: "/book" },
  },
  {
    slug: "life-transition-counselling",
    title: "360 Transition Reset Program",
    summary: "Guiding you through life's turning points.",
    body: "Life transitions often create confusion and emotional strain. We provide support through major shifts so you can move forward with clarity and purpose.",
    bullets: [
      "Career changes",
      "Marriage and parenting",
      "Loss and grief",
      "Personal reinvention",
      "Identity shifts",
    ],
    cta: { label: "Book a Session", href: "/book" },
  },
  {
    slug: "family-relationship-counselling",
    title: "Family & Relationship Counselling",
    summary: "Enhancing relationships and promoting harmony.",
    body: "We address issues related to couples, parenting, family dynamics, communication, and conflict resolution to foster healthier, more connected relationships.",
    cta: { label: "Book a Session", href: "/book" },
  },
  {
    slug: "psychoeducation-training",
    title: "Psychoeducation & Training",
    summary: "Equipping individuals and groups with mental health knowledge.",
    body: "We offer workshops, seminars, and educational programs designed to build mental health literacy and practical psychological skills.",
    bullets: ["Workshops", "Seminars", "Educational programs"],
    cta: { label: "Invite Us to Speak", href: "/contact#speak" },
  },
]

// ── EVENTS & PROGRAMS ────────────────────────────────────────
export const events = [
  {
    slug: "thrive360",
    title: "Thrive360 Experience",
    desc: "A holistic mental well-being experience.",
  },
  {
    slug: "complete-living-series",
    title: "Complete Living Series Webinar",
    desc: "Online sessions exploring life development themes.",
  },
  {
    slug: "personal-development-cohorts",
    title: "Personal Development Cohorts",
    desc: "Growth through shared learning and connection.",
  },
  {
    slug: "leadership-circles",
    title: "Leadership Circles",
    desc: "Peer learning and reflection for leaders.",
  },
  {
    slug: "parenthood-transitions",
    title: "Parenthood Transitions Masterclass",
    desc: "Navigating the psychological shifts of parenthood.",
  },
  {
    slug: "adolescence-transitions",
    title: "Adolescence Transitions Program",
    desc: "Supporting young people through identity and growth.",
  },
  {
    slug: "360living-woman-code",
    title: "The 360Living Woman Code",
    desc: "A program dedicated to the journey and power of women.",
  },
]

// ── TEAM ─────────────────────────────────────────────────────
export const team = [
  {
    name: "Rev. (Mrs.) Angela Carmen Appiah",
    role: "Board Chairperson",
    org: "Chief Executive Officer, African Corporate Governance Network (ACGN)",
    bio: [
      "Rev. (Mrs.) Angela Carmen Appiah is a transformative leader and a pioneering force in African governance, serving as the first female Chief Executive Officer of the African Corporate Governance Network (ACGN).",
      "A historic leader, she is also the first female past President and Chair of the 10th Governing Council of the Institute of Directors-Ghana (IoD-Gh).",
      "With nearly three decades of experience, she uniquely integrates deep healthcare expertise as a Nurse Practitioner, Lecturer, and former Assistant Registrar at Ghana's Nursing and Midwifery Council of Ghana with elite governance practice.",
      "An advocate for ethical leadership and boardroom diversity, she holds an MSc in Advanced Practice from Cardiff University, UK and is pursuing a Doctorate in Business Leadership with IPAG Business School France. A Fellow of IoD-Gh and recipient of the 2025 Ghana Women of Excellence Gold Award.",
    ],
    credentials: [
      "MSc in Advanced Practice — Cardiff University, UK",
      "Doctorate in Business Leadership (in progress) — IPAG Business School, France",
      "Fellow, Institute of Directors-Ghana (IoD-Gh)",
      "2025 Ghana Women of Excellence Gold Award",
    ],
  },
  {
    name: "Seyram Kodzo Mankra",
    role: "Board Member",
    org: "Corporate Governance & Board Advisory Specialist",
    bio: [
      "Seyram Kodzo Mankra is a corporate governance professional and board advisory specialist with over two decades of experience supporting boards and executive leadership teams.",
      "He currently serves as Head of Marketing, External Relations, and the Centre for Corporate Governance Excellence (CCGE) at the Institute of Directors-Ghana, leading External Board Evaluations, governance diagnostics, director training, and advisory engagements.",
      "Through the Centre for Corporate Governance Excellence, Seyram works directly with boards to assess governance maturity, refine committee structures, improve performance evaluation systems, and align board strategy with long-term institutional sustainability.",
      "His governance perspective is reinforced by a strong foundation in strategic research, stakeholder engagement, and organisational performance analysis across West and Central Africa.",
    ],
    credentials: [
      "MA in Organisational Leadership and Governance — University of Ghana",
      "Certificate in Corporate Governance — Institute of Directors-Ghana",
      "BA in Political Science & Religion — University of Ghana",
      "Member, Institute of Directors-Ghana",
    ],
    expertise: [
      "External Board Evaluations",
      "Governance Framework Review & Strengthening",
      "Board Strategy & Oversight Effectiveness",
      "Risk Governance & Accountability Systems",
      "ESG Awareness & Sustainability Governance",
      "Director Capacity Building & Facilitation",
    ],
  },
  {
    name: "Selasi Doku (Mrs.)",
    role: "Executive Director / CEO",
    org: "MIoD-GH | Counselling Psychologist | Life Strategist | Speaker",
    bio: [
      "Selasi Doku is a counselling psychologist, life strategist, and systems builder dedicated to one core mission: helping people gain insight into their lives so they can transition intentionally and thrive.",
      "Her journey began in communication design and marketing, where she learned to strategically position ideas and influence perceptions. Over time, she discovered a deeper need — not just for better communication, but for a more profound understanding of human behaviour and life patterns.",
      "This realisation led her to counselling psychology, where she identified a significant gap: many individuals struggle not because of a lack of capability, but because they lack clarity about their current life stage — igniting her interest in life transition psychology.",
      "As Executive Director of the 360 Living Institute and CEO of Medfocus International, she has dedicated herself to transforming lives through mental well-being, personal development, and increased access to care.",
    ],
    credentials: [
      "MA in Guidance and Counselling",
      "Postgraduate Certificate in Psychology",
      "Training in Trauma-Informed Care",
      "Executive Certificate in Counselling",
      "Certificate — Women Entrepreneurship & Leadership for Africa Program (WELA), CEIBS",
      "Most Promising Alumnus 2025 — CEIBS WELA Program",
      "Executive Certificate in Management",
      "Member, Institute of Directors-Ghana (MIoD-GH)",
      "Member, Ghana National Association of Certificated Counsellors (GNACC)",
      "Chairperson, Continuing Professional Development Committee — GNACC",
      "Member, Ghana Psychological Association (GPA)",
    ],
  },
]
