export const SECTION_IDS = ['about', 'projects', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_LABELS: Record<SectionId, string> = {
  about: 'about',
  projects: 'projects',
  contact: 'contact',
};
