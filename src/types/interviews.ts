// Interview Tracker Types

export type EmploymentType = 'full_time' | 'contract' | 'temp' | 'part_time' | 'intern';
export type WorkMode = 'remote' | 'hybrid' | 'in_office';
export type PipelineStatus = 'saved' | 'applied' | 'screening' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';
export type EventType = 'screen' | 'phone' | 'video' | 'onsite' | 'assessment' | 'final' | 'other';
export type EventStatus = 'scheduled' | 'completed' | 'canceled' | 'rescheduled';
export type EventOutcome = 'pending' | 'passed' | 'failed' | 'unknown';

export interface InterviewApplication {
  id: string;
  user_id: string;
  company_name: string;
  role_title: string;
  employment_type: EmploymentType | null;
  work_mode: WorkMode | null;
  company_address: string | null;
  job_url: string | null;
  job_description: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_notes: string | null;
  recruiting_firm: string | null;
  recruiter_name: string | null;
  recruiter_email: string | null;
  recruiter_phone: string | null;
  pipeline_status: PipelineStatus;
  overall_notes: string | null;
  internal_tags: string[] | null;
  created_at: string;
  updated_at: string;
  // Derived field
  next_interview?: InterviewEvent | null;
}

export interface InterviewEvent {
  id: string;
  user_id: string;
  application_id: string;
  event_type: EventType | null;
  event_title: string | null;
  scheduled_at: string | null;
  duration_minutes: number | null;
  timezone: string | null;
  interviewer_names: string | null;
  location_or_link: string | null;
  status: EventStatus;
  outcome: EventOutcome;
  notes: string | null;
  thank_you_sent: boolean;
  thank_you_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationWithEvents extends InterviewApplication {
  interview_events?: InterviewEvent[];
}

// Form types
export interface ApplicationFormData {
  company_name: string;
  role_title: string;
  employment_type?: EmploymentType | '';
  work_mode?: WorkMode | '';
  company_address?: string;
  job_url?: string;
  job_description?: string;
  salary_min?: number | '';
  salary_max?: number | '';
  salary_notes?: string;
  recruiting_firm?: string;
  recruiter_name?: string;
  recruiter_email?: string;
  recruiter_phone?: string;
  pipeline_status?: PipelineStatus;
  internal_tags?: string;
  overall_notes?: string;
}

export interface EventFormData {
  application_id: string;
  event_type?: EventType | '';
  event_title?: string;
  scheduled_at?: string;
  duration_minutes?: number | '';
  timezone?: string;
  interviewer_names?: string;
  location_or_link?: string;
  status?: EventStatus;
  outcome?: EventOutcome;
  notes?: string;
  thank_you_sent?: boolean;
}

// Constants for dropdowns
export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temp', label: 'Temporary' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'intern', label: 'Internship' },
];

export const WORK_MODES: { value: WorkMode; label: string }[] = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'in_office', label: 'In Office' },
];

export const PIPELINE_STATUSES: { value: PipelineStatus; label: string; color: string }[] = [
  { value: 'saved', label: 'Saved', color: 'bg-gray-100 text-gray-800' },
  { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-800' },
  { value: 'screening', label: 'Screening', color: 'bg-purple-100 text-purple-800' },
  { value: 'interviewing', label: 'Interviewing', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'offer', label: 'Offer', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'bg-gray-100 text-gray-600' },
];

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'screen', label: 'Screening' },
  { value: 'phone', label: 'Phone Interview' },
  { value: 'video', label: 'Video Interview' },
  { value: 'onsite', label: 'On-site' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'final', label: 'Final Round' },
  { value: 'other', label: 'Other' },
];

export const EVENT_STATUSES: { value: EventStatus; label: string; color: string }[] = [
  { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'canceled', label: 'Canceled', color: 'bg-red-100 text-red-800' },
  { value: 'rescheduled', label: 'Rescheduled', color: 'bg-yellow-100 text-yellow-800' },
];

export const EVENT_OUTCOMES: { value: EventOutcome; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'passed', label: 'Passed' },
  { value: 'failed', label: 'Failed' },
  { value: 'unknown', label: 'Unknown' },
];
