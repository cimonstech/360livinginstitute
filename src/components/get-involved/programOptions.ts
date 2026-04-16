export const programOptions = {
  'thrive360-experience': 'Thrive360 Experience',
  'transformation-lab': '360 Transformation Lab',
  'thrive360-accelerator': 'Thrive360 Accelerator',
  'community-outreach': 'Community Outreach',
  mentorship: 'Mentorship Programmes',
  'mental-health-awareness': 'Mental Health Awareness',
  general: 'General / Any Programme',
} as const

export type ProgramOptionKey = keyof typeof programOptions
