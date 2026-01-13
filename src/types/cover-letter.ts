// Cover Letter Generator Types

export type TonePreference = 'professional' | 'direct' | 'warm' | 'executive';

export interface CoverLetterFormData {
  resumeText: string;
  jobDescription: string;
  companyName: string;
  companyUrl?: string;
  roleTitle: string;
  tonePreference: TonePreference;
  additionalContext?: string;
}

export interface GeneratedCoverLetter {
  id: string;
  title: string;
  description: string;
  content: string;
}

export interface CoverLetterResponse {
  letters: GeneratedCoverLetter[];
  error?: string;
}

export const TONE_OPTIONS: { value: TonePreference; label: string; description: string }[] = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Traditional but modern, strong opening with context',
  },
  {
    value: 'direct',
    label: 'Direct and concise',
    description: 'Emphasis on results and operational impact',
  },
  {
    value: 'warm',
    label: 'Warm but formal',
    description: 'Focus on partnership, trust, and judgment',
  },
  {
    value: 'executive',
    label: 'Executive-level',
    description: 'Strategic focus, leadership presence',
  },
];
