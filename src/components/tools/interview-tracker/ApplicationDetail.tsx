'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
  ApplicationWithEvents,
  InterviewEvent,
  EventFormData,
  ApplicationFormData,
  PIPELINE_STATUSES,
  WORK_MODES,
  EMPLOYMENT_TYPES,
  EVENT_TYPES,
  EVENT_STATUSES,
  EVENT_OUTCOMES,
  PipelineStatus,
  EventType,
  EventStatus,
  EventOutcome,
} from '@/types/interviews';

export interface ApplicationDetailProps {
  applicationId: string;
}

export function ApplicationDetail({ applicationId }: ApplicationDetailProps) {
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationWithEvents | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAppModal, setShowAppModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<InterviewEvent | null>(null);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [appFormData, setAppFormData] = useState<ApplicationFormData>({
    company_name: '',
    role_title: '',
    employment_type: '',
    work_mode: '',
    company_address: '',
    job_url: '',
    job_description: '',
    salary_min: '',
    salary_max: '',
    salary_notes: '',
    recruiting_firm: '',
    recruiter_name: '',
    recruiter_email: '',
    recruiter_phone: '',
    pipeline_status: 'applied',
    internal_tags: '',
    overall_notes: '',
  });

  const [eventFormData, setEventFormData] = useState<EventFormData>({
    application_id: applicationId,
    event_type: '',
    event_title: '',
    scheduled_at: '',
    duration_minutes: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    interviewer_names: '',
    location_or_link: '',
    status: 'scheduled',
    outcome: 'pending',
    notes: '',
    thank_you_sent: false,
  });

  // Fetch application data
  const fetchApplication = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/interviews/applications/${applicationId}`);
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (res.status === 404) {
          setError('Application not found');
          return;
        }
        setError('Failed to load application');
        return;
      }
      const data = await res.json();
      setApplication(data.application);
      // Set form data after loading
      const app = data.application;
      setAppFormData({
        company_name: app.company_name,
        role_title: app.role_title,
        employment_type: app.employment_type || '',
        work_mode: app.work_mode || '',
        company_address: app.company_address || '',
        job_url: app.job_url || '',
        job_description: app.job_description || '',
        salary_min: app.salary_min || '',
        salary_max: app.salary_max || '',
        salary_notes: app.salary_notes || '',
        recruiting_firm: app.recruiting_firm || '',
        recruiter_name: app.recruiter_name || '',
        recruiter_email: app.recruiter_email || '',
        recruiter_phone: app.recruiter_phone || '',
        pipeline_status: app.pipeline_status,
        internal_tags: app.internal_tags?.join(', ') || '',
        overall_notes: app.overall_notes || '',
      });
    } catch (err) {
      console.error('Failed to fetch application:', err);
      setError('Failed to load application');
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, router]);

  // Initial load
  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  // Refresh application data
  const refreshApplication = useCallback(async () => {
    try {
      const res = await fetch(`/api/interviews/applications/${applicationId}`);
      if (res.ok) {
        const data = await res.json();
        setApplication(data.application);
      }
    } catch (err) {
      console.error('Failed to refresh application:', err);
    }
  }, [applicationId]);

  // Handle application update
  const handleAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSaving(true);

    try {
      const res = await fetch(`/api/interviews/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appFormData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Failed to update application');
        setIsSaving(false);
        return;
      }

      setShowAppModal(false);
      refreshApplication();
    } catch {
      setFormError('An error occurred. Please try again.');
    }
    setIsSaving(false);
  };

  // Open event modal for new event
  const openNewEventModal = () => {
    setEditingEvent(null);
    setEventFormData({
      application_id: applicationId,
      event_type: '',
      event_title: '',
      scheduled_at: '',
      duration_minutes: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      interviewer_names: '',
      location_or_link: '',
      status: 'scheduled',
      outcome: 'pending',
      notes: '',
      thank_you_sent: false,
    });
    setFormError('');
    setShowEventModal(true);
  };

  // Open event modal for editing
  const openEditEventModal = (event: InterviewEvent) => {
    setEditingEvent(event);
    setEventFormData({
      application_id: applicationId,
      event_type: event.event_type || '',
      event_title: event.event_title || '',
      scheduled_at: event.scheduled_at ? new Date(event.scheduled_at).toISOString().slice(0, 16) : '',
      duration_minutes: event.duration_minutes || '',
      timezone: event.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      interviewer_names: event.interviewer_names || '',
      location_or_link: event.location_or_link || '',
      status: event.status,
      outcome: event.outcome,
      notes: event.notes || '',
      thank_you_sent: event.thank_you_sent,
    });
    setFormError('');
    setShowEventModal(true);
  };

  // Handle event submit
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSaving(true);

    try {
      const url = editingEvent
        ? `/api/interviews/events/${editingEvent.id}`
        : '/api/interviews/events';
      const method = editingEvent ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventFormData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Failed to save event');
        setIsSaving(false);
        return;
      }

      setShowEventModal(false);
      refreshApplication();
    } catch {
      setFormError('An error occurred. Please try again.');
    }
    setIsSaving(false);
  };

  // Handle event delete
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this interview event?')) {
      return;
    }

    try {
      const res = await fetch(`/api/interviews/events/${eventId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        refreshApplication();
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  // Handle thank you toggle
  const handleThankYouToggle = async (event: InterviewEvent) => {
    try {
      await fetch(`/api/interviews/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thank_you_sent: !event.thank_you_sent }),
      });
      refreshApplication();
    } catch (err) {
      console.error('Failed to update thank you status:', err);
    }
  };

  // Format date/time
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Format salary
  const formatSalary = (app: ApplicationWithEvents) => {
    if (!app.salary_min && !app.salary_max) return null;
    const min = app.salary_min ? `$${app.salary_min.toLocaleString()}` : '';
    const max = app.salary_max ? `$${app.salary_max.toLocaleString()}` : '';
    if (min && max) return `${min} - ${max}`;
    return min || max;
  };

  // Get status badge color
  const getStatusColor = (status: PipelineStatus) => {
    const found = PIPELINE_STATUSES.find(s => s.value === status);
    return found?.color || 'bg-gray-100 text-gray-800';
  };

  const getEventStatusColor = (status: EventStatus) => {
    const found = EVENT_STATUSES.find(s => s.value === status);
    return found?.color || 'bg-gray-100 text-gray-800';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
        <p className="mt-4 text-gray-500">Loading application...</p>
      </div>
    );
  }

  // Error state
  if (error || !application) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Application not found'}</p>
        <Link href="/tools/interview-tracker">
          <Button variant="outline">Back to Applications</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/tools/interview-tracker"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Applications
      </Link>

      {/* Application Overview */}
      <Card variant="bordered">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{application.company_name}</CardTitle>
              <p className="text-lg text-gray-600 mt-1">{application.role_title}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn('px-3 py-1 text-sm font-medium rounded-full', getStatusColor(application.pipeline_status))}>
                {PIPELINE_STATUSES.find(s => s.value === application.pipeline_status)?.label}
              </span>
              <Button variant="outline" onClick={() => setShowAppModal(true)}>
                Edit Application
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Work Mode</h4>
              <p className="text-gray-900">
                {WORK_MODES.find(w => w.value === application.work_mode)?.label || '—'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Employment Type</h4>
              <p className="text-gray-900">
                {EMPLOYMENT_TYPES.find(t => t.value === application.employment_type)?.label || '—'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
              <p className="text-gray-900">{application.company_address || '—'}</p>
            </div>
          </div>

          {application.internal_tags && application.internal_tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {application.internal_tags.map((tag, i) => (
                <Badge key={i} variant="default" size="sm">{tag}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {application.job_url && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Job URL</h4>
                <a
                  href={application.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline break-all"
                >
                  {application.job_url}
                </a>
              </div>
            )}

            {formatSalary(application) && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Salary Range</h4>
                <p className="text-gray-900">{formatSalary(application)}</p>
                {application.salary_notes && (
                  <p className="text-sm text-gray-500">{application.salary_notes}</p>
                )}
              </div>
            )}

            {application.job_description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Job Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap text-sm">{application.job_description}</p>
              </div>
            )}

            {application.overall_notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                <p className="text-gray-700 whitespace-pre-wrap text-sm">{application.overall_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recruiter Info */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Recruiter Information</CardTitle>
          </CardHeader>
          <CardContent>
            {application.recruiter_name || application.recruiter_email || application.recruiting_firm ? (
              <div className="space-y-3">
                {application.recruiting_firm && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Firm</h4>
                    <p className="text-gray-900">{application.recruiting_firm}</p>
                  </div>
                )}
                {application.recruiter_name && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Name</h4>
                    <p className="text-gray-900">{application.recruiter_name}</p>
                  </div>
                )}
                {application.recruiter_email && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                    <a href={`mailto:${application.recruiter_email}`} className="text-primary-600 hover:underline">
                      {application.recruiter_email}
                    </a>
                  </div>
                )}
                {application.recruiter_phone && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                    <a href={`tel:${application.recruiter_phone}`} className="text-primary-600 hover:underline">
                      {application.recruiter_phone}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No recruiter information added</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Interview Events */}
      <Card variant="bordered">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Interview Events</CardTitle>
            <Button variant="primary" onClick={openNewEventModal}>
              Add Interview Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!application.interview_events || application.interview_events.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No interview events yet</p>
          ) : (
            <div className="space-y-4">
              {application.interview_events.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900">
                          {EVENT_TYPES.find(t => t.value === event.event_type)?.label || event.event_type || 'Interview'}
                        </span>
                        {event.event_title && (
                          <span className="text-gray-600">- {event.event_title}</span>
                        )}
                        <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', getEventStatusColor(event.status))}>
                          {EVENT_STATUSES.find(s => s.value === event.status)?.label}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{formatDateTime(event.scheduled_at)}</p>
                        {event.duration_minutes && <p>Duration: {event.duration_minutes} minutes</p>}
                        {event.interviewer_names && <p>Interviewers: {event.interviewer_names}</p>}
                        {event.location_or_link && (
                          <p>
                            Location:{' '}
                            {event.location_or_link.startsWith('http') ? (
                              <a href={event.location_or_link} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                {event.location_or_link}
                              </a>
                            ) : (
                              event.location_or_link
                            )}
                          </p>
                        )}
                        {event.outcome !== 'pending' && (
                          <p>
                            Outcome: <span className={event.outcome === 'passed' ? 'text-green-600' : event.outcome === 'failed' ? 'text-red-600' : ''}>
                              {EVENT_OUTCOMES.find(o => o.value === event.outcome)?.label}
                            </span>
                          </p>
                        )}
                        {event.notes && <p className="text-gray-500 mt-2">{event.notes}</p>}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditEventModal(event)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={event.thank_you_sent}
                          onChange={() => handleThankYouToggle(event)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        Thank-you sent
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Edit Modal */}
      {showAppModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Application</h2>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAppSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={appFormData.company_name}
                      onChange={(e) => setAppFormData({ ...appFormData, company_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={appFormData.role_title}
                      onChange={(e) => setAppFormData({ ...appFormData, role_title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pipeline Status</label>
                    <select
                      value={appFormData.pipeline_status}
                      onChange={(e) => setAppFormData({ ...appFormData, pipeline_status: e.target.value as PipelineStatus })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    >
                      {PIPELINE_STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                    <select
                      value={appFormData.work_mode}
                      onChange={(e) => setAppFormData({ ...appFormData, work_mode: e.target.value as '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select...</option>
                      {WORK_MODES.map(w => (
                        <option key={w.value} value={w.value}>{w.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overall Notes</label>
                  <textarea
                    value={appFormData.overall_notes || ''}
                    onChange={(e) => setAppFormData({ ...appFormData, overall_notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowAppModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isSaving}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingEvent ? 'Edit Interview Event' : 'Add Interview Event'}
              </h2>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  {formError}
                </div>
              )}

              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                    <select
                      value={eventFormData.event_type}
                      onChange={(e) => setEventFormData({ ...eventFormData, event_type: e.target.value as EventType | '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select...</option>
                      {EVENT_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                    <Input
                      type="text"
                      value={eventFormData.event_title || ''}
                      onChange={(e) => setEventFormData({ ...eventFormData, event_title: e.target.value })}
                      placeholder="e.g., Hiring Manager Interview"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date/Time</label>
                    <Input
                      type="datetime-local"
                      value={eventFormData.scheduled_at || ''}
                      onChange={(e) => setEventFormData({ ...eventFormData, scheduled_at: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={eventFormData.duration_minutes || ''}
                      onChange={(e) => setEventFormData({ ...eventFormData, duration_minutes: e.target.value ? parseInt(e.target.value) : '' })}
                      placeholder="60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <Input
                    type="text"
                    value={eventFormData.timezone || ''}
                    onChange={(e) => setEventFormData({ ...eventFormData, timezone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer Names</label>
                  <Input
                    type="text"
                    value={eventFormData.interviewer_names || ''}
                    onChange={(e) => setEventFormData({ ...eventFormData, interviewer_names: e.target.value })}
                    placeholder="John Smith, Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location or Link</label>
                  <Input
                    type="text"
                    value={eventFormData.location_or_link || ''}
                    onChange={(e) => setEventFormData({ ...eventFormData, location_or_link: e.target.value })}
                    placeholder="Zoom link or office address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={eventFormData.status}
                      onChange={(e) => setEventFormData({ ...eventFormData, status: e.target.value as EventStatus })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    >
                      {EVENT_STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                    <select
                      value={eventFormData.outcome}
                      onChange={(e) => setEventFormData({ ...eventFormData, outcome: e.target.value as EventOutcome })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    >
                      {EVENT_OUTCOMES.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={eventFormData.notes || ''}
                    onChange={(e) => setEventFormData({ ...eventFormData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    placeholder="Prep notes, questions to ask, etc."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="thank_you_sent"
                    checked={eventFormData.thank_you_sent || false}
                    onChange={(e) => setEventFormData({ ...eventFormData, thank_you_sent: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="thank_you_sent" className="text-sm text-gray-700">
                    Thank-you note sent
                  </label>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowEventModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isSaving}>
                    {editingEvent ? 'Save Changes' : 'Add Event'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
