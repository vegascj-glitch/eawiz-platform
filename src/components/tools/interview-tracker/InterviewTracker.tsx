'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  InterviewApplication,
  ApplicationFormData,
  PIPELINE_STATUSES,
  WORK_MODES,
  EMPLOYMENT_TYPES,
  PipelineStatus,
  WorkMode,
} from '@/types/interviews';

export function InterviewTracker() {
  const [applications, setApplications] = useState<InterviewApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState<InterviewApplication | null>(null);
  const [formData, setFormData] = useState<ApplicationFormData>({
    company_name: '',
    role_title: '',
    pipeline_status: 'saved',
  });
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (workModeFilter) params.set('work_mode', workModeFilter);
      params.set('sort', sortBy);

      const res = await fetch(`/api/interviews/applications?${params}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
    setIsLoading(false);
  }, [search, statusFilter, workModeFilter, sortBy]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchApplications();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchApplications]);

  // Open modal for new application
  const openNewModal = () => {
    setEditingApp(null);
    setFormData({
      company_name: '',
      role_title: '',
      pipeline_status: 'saved',
    });
    setFormError('');
    setShowModal(true);
  };

  // Open modal for editing
  const openEditModal = (app: InterviewApplication) => {
    setEditingApp(app);
    setFormData({
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
    setFormError('');
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSaving(true);

    try {
      const url = editingApp
        ? `/api/interviews/applications/${editingApp.id}`
        : '/api/interviews/applications';
      const method = editingApp ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Failed to save application');
        setIsSaving(false);
        return;
      }

      setShowModal(false);
      fetchApplications();
    } catch (err) {
      setFormError('An error occurred. Please try again.');
    }
    setIsSaving(false);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application? This will also delete all associated interview events.')) {
      return;
    }

    try {
      const res = await fetch(`/api/interviews/applications/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  };

  // Format date/time
  const formatDateTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Get status badge class
  const getStatusColor = (status: PipelineStatus) => {
    const found = PIPELINE_STATUSES.find(s => s.value === status);
    return found?.color || 'bg-gray-100 text-gray-800';
  };

  // Get work mode label
  const getWorkModeLabel = (mode: WorkMode | null) => {
    if (!mode) return '—';
    const found = WORK_MODES.find(w => w.value === mode);
    return found?.label || mode;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            {PIPELINE_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={workModeFilter}
            onChange={(e) => setWorkModeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Work Modes</option>
            {WORK_MODES.map(w => (
              <option key={w.value} value={w.value}>{w.label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="updated">Recently Updated</option>
            <option value="next_interview">Next Interview</option>
            <option value="company">Company A-Z</option>
          </select>
        </div>
        <Button variant="primary" onClick={openNewModal}>
          Add Application
        </Button>
      </div>

      {/* Table */}
      <Card variant="bordered">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="mb-4">No applications found</p>
              <Button variant="primary" onClick={openNewModal}>
                Add Your First Application
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company / Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Interview
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Work Mode
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recruiter
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{app.company_name}</div>
                          <div className="text-sm text-gray-500">{app.role_title}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(app.pipeline_status))}>
                          {PIPELINE_STATUSES.find(s => s.value === app.pipeline_status)?.label || app.pipeline_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDateTime(app.next_interview?.scheduled_at)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {getWorkModeLabel(app.work_mode)}
                      </td>
                      <td className="px-4 py-4">
                        {app.recruiter_name || app.recruiter_email ? (
                          <div className="text-sm">
                            {app.recruiter_name && <div className="text-gray-900">{app.recruiter_name}</div>}
                            {app.recruiter_email && (
                              <div className="text-gray-500 text-xs">{app.recruiter_email}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/tools/interview-tracker/${app.id}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                          <Button variant="outline" size="sm" onClick={() => openEditModal(app)}>
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(app.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingApp ? 'Edit Application' : 'Add Application'}
              </h2>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.role_title}
                      onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pipeline Status</label>
                    <select
                      value={formData.pipeline_status}
                      onChange={(e) => setFormData({ ...formData, pipeline_status: e.target.value as PipelineStatus })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    >
                      {PIPELINE_STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                    <select
                      value={formData.employment_type}
                      onChange={(e) => setFormData({ ...formData, employment_type: e.target.value as '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select...</option>
                      {EMPLOYMENT_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                    <select
                      value={formData.work_mode}
                      onChange={(e) => setFormData({ ...formData, work_mode: e.target.value as '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select...</option>
                      {WORK_MODES.map(w => (
                        <option key={w.value} value={w.value}>{w.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
                    <Input
                      type="text"
                      value={formData.company_address || ''}
                      onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
                  <Input
                    type="url"
                    value={formData.job_url || ''}
                    onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                  <textarea
                    value={formData.job_description || ''}
                    onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Min</label>
                    <Input
                      type="number"
                      value={formData.salary_min || ''}
                      onChange={(e) => setFormData({ ...formData, salary_min: e.target.value ? parseInt(e.target.value) : '' })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Max</label>
                    <Input
                      type="number"
                      value={formData.salary_max || ''}
                      onChange={(e) => setFormData({ ...formData, salary_max: e.target.value ? parseInt(e.target.value) : '' })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Notes</label>
                    <Input
                      type="text"
                      value={formData.salary_notes || ''}
                      onChange={(e) => setFormData({ ...formData, salary_notes: e.target.value })}
                      placeholder="e.g., + bonus, equity"
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Recruiter Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recruiting Firm</label>
                      <Input
                        type="text"
                        value={formData.recruiting_firm || ''}
                        onChange={(e) => setFormData({ ...formData, recruiting_firm: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Name</label>
                      <Input
                        type="text"
                        value={formData.recruiter_name || ''}
                        onChange={(e) => setFormData({ ...formData, recruiter_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Email</label>
                      <Input
                        type="email"
                        value={formData.recruiter_email || ''}
                        onChange={(e) => setFormData({ ...formData, recruiter_email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Phone</label>
                      <Input
                        type="tel"
                        value={formData.recruiter_phone || ''}
                        onChange={(e) => setFormData({ ...formData, recruiter_phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internal Tags</label>
                  <Input
                    type="text"
                    value={formData.internal_tags || ''}
                    onChange={(e) => setFormData({ ...formData, internal_tags: e.target.value })}
                    placeholder="Comma-separated: tech, startup, remote"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overall Notes</label>
                  <textarea
                    value={formData.overall_notes || ''}
                    onChange={(e) => setFormData({ ...formData, overall_notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isSaving}>
                    {editingApp ? 'Save Changes' : 'Add Application'}
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
