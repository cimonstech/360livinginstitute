export type BoardMember = {
  id: string
  name: string
  role: string
  /** Short line under the name in the modal (not a credential list). */
  headline?: string
  image: string
  tags: string[]
  /** Teaser on the grid card */
  bioFirst: string
  /** Full profile in the modal; credentials are not included as separate lists. */
  modalParagraphs: string[]
  /** Optional labelled list (e.g. areas of practice), not academic/professional credentials. */
  modalFocusTitle?: string
  modalFocusItems?: string[]
  photoSoon: boolean
}

export const boardMembers: BoardMember[] = [
  {
    id: 'angela-appiah',
    name: 'Rev. (Mrs.) Angela Carmen Appiah',
    role: 'Board Chairperson',
    headline: 'Chief Executive Officer, African Corporate Governance Network (ACGN)',
    image: '/images/Rev.Angela.jpeg',
    tags: ['ACGN', 'IoD-Gh', 'Governance'],
    bioFirst:
      'Rev. (Mrs.) Angela Carmen Appiah is a transformative leader and a pioneering force in African governance, serving as the first female Chief Executive Officer of the African Corporate Governance Network (ACGN).',
    modalParagraphs: [
      'Rev. (Mrs.) Angela Carmen Appiah is a transformative leader and a pioneering force in African governance, serving as the first female Chief Executive Officer of the African Corporate Governance Network (ACGN).',
      'A historic leader, she is also the first female past President and Chair of the 10th Governing Council of the Institute of Directors-Ghana (IoD-Gh).',
      'With nearly three decades of experience, she uniquely integrates deep healthcare expertise as a Nurse Practitioner, Lecturer, and former Assistant Registrar at Ghana’s Nursing and Midwifery Council of Ghana with elite governance practice. Her unparalleled insight spans the roles of Board Chair, CEO, and Board Secretary, specializing in strengthening organizational integrity and policy frameworks across the continent.',
      'An advocate for ethical leadership and boardroom diversity, she holds an MSc in Advanced Practice from Cardiff University, UK and is pursuing a Doctorate in Business Leadership with IPAG Business School France. A Fellow of IoD-Gh and recipient of the 2025 Ghana Women of Excellence Gold Award, she champions strong governance as the key to unlocking Africa’s sustainable development.',
    ],
    photoSoon: false,
  },
  {
    id: 'selasi-doku',
    name: 'Selasi Doku (Mrs.)',
    role: 'Executive Director / CEO',
    headline: 'MIoD-GH, Counselling Psychologist | Life Strategist | Speaker',
    image: '/images/selasi.jpeg',
    tags: ['Counselling', 'Life Strategy', '360 Living Institute'],
    bioFirst:
      'Selasi Doku is a counselling psychologist, life strategist, and systems builder dedicated to helping people gain insight into their lives so they can transition intentionally and thrive.',
    modalParagraphs: [
      'Selasi Doku is a counselling psychologist, life strategist, and systems builder. She is dedicated to one core mission: helping people gain insight into their lives so they can transition intentionally and thrive. She focuses on assisting individuals and organisations in understanding life transitions and functioning more effectively.',
      'Her journey began in communication design and marketing, where she learned to strategically position ideas and influence perceptions. Over time, she realised there was a deeper need not just for better communication but for a more profound understanding of human behaviour and life patterns.',
      'This realisation led her to the field of counselling psychology. In her work, she identified a significant gap: Many individuals struggle not because of a lack of capability, but because they lack clarity about their current life stage. This insight ignited her interest in life transition psychology.',
      'Currently, she collaborates with individuals, families, and corporate organisations to provide psychological insights, counselling support, and life development strategies. As the Executive Director of the 360 Living Institute and the CEO of Medfocus International, she has dedicated herself to managing health programs for prestigious corporate organisations. Her commitment lies in transforming lives through mental well-being, personal development, and increased access to care.',
      'Her work lies at the intersection of psychology, strategy, and system building. She aims to help individuals not only improve their well-being but also lead fulfilling lives and contribute meaningfully to society.',
    ],
    photoSoon: false,
  },
  {
    id: 'seyram-mankra',
    name: 'Seyram Kodzo Mankra',
    role: 'Board Member',
    headline: 'Corporate Governance & Board Advisory Specialist | Leadership Development Facilitator',
    image: '/images/members/person7.webp',
    tags: ['Governance', 'Board Advisory', 'Leadership Development'],
    bioFirst:
      'Seyram Kodzo Mankra is a corporate governance professional and board advisory specialist with over two decades of experience supporting boards and executive leadership teams.',
    modalParagraphs: [
      'Seyram Kodzo Mankra is a corporate governance professional and board advisory specialist with over two decades of experience supporting boards and executive leadership teams to strengthen governance effectiveness, strategic oversight, and institutional performance.',
      'He currently serves as Head of Marketing, External Relations, and the Centre for Corporate Governance Excellence (CCGE) at the Institute of Directors-Ghana. In this role, he leads External Board Evaluations, governance diagnostics, director training, and advisory engagements across regulated and non-regulated sectors. His work focuses on improving board effectiveness, strengthening oversight structures, enhancing board–management relationships, and promoting ethical leadership culture.',
      'Through the Centre for Corporate Governance Excellence, Seyram works directly with boards to assess governance maturity, refine committee structures, improve performance evaluation systems, and align board strategy with long-term institutional sustainability. He has facilitated governance training and board performance engagements in financial services, telecommunications, energy, FMCG, and professional services institutions.',
      'His governance perspective is reinforced by a strong foundation in strategic research, stakeholder engagement, and organisational performance analysis. Prior to his governance leadership role, Seyram held senior strategic positions within multinational research and advisory firms, where he managed regional portfolios and supported executive decision-making across West and Central Africa. This background enables him to approach board advisory work with analytical rigour and strategic clarity.',
      'Seyram is a member of the Institute of Directors-Ghana and remains committed to advancing professional directorship, institutional integrity, and responsible leadership in Ghana and across the region.',
    ],
    modalFocusTitle: 'Board & governance expertise',
    modalFocusItems: [
      'External Board Evaluations',
      'Governance Framework Review & Strengthening',
      'Board Strategy & Oversight Effectiveness',
      'Risk Governance & Accountability Systems',
      'Board–CEO Relationship Dynamics',
      'ESG Awareness & Sustainability Governance',
      'Leadership Ethics & Board Culture',
      'Director Capacity Building & Facilitation',
    ],
    photoSoon: false,
  },
]
