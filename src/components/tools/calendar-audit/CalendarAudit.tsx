'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, copyToClipboard } from '@/lib/utils';

// Types
interface Meeting {
  id: string;
  title: string;
  start_time: Date;
  end_time: Date;
  duration_minutes: number;
  attendee_count: number;
  attendees?: string[];
  category?: string;
  category_source?: 'user' | 'rule' | 'suggested';
  confidence?: 'high' | 'low';
}

interface CategoryRule {
  id: string;
  pattern: string;
  field: 'title' | 'attendee_email' | 'attendee_domain';
  category_name: string;
  confidence: 'high' | 'low';
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface DateRange {
  start: string;
  end: string;
}

// Default categories
const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: '1:1', color: '#10b981' },
  { name: 'Team Meeting', color: '#3b82f6' },
  { name: 'External', color: '#f59e0b' },
  { name: 'Focus Time', color: '#8b5cf6' },
  { name: 'Hiring', color: '#ec4899' },
  { name: 'Admin', color: '#6b7280' },
  { name: 'Project', color: '#06b6d4' },
  { name: 'Other', color: '#9ca3af' },
];

// Storage key
const STORAGE_KEY = 'eawiz-calendar-audit';

// Utility functions
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDefaultDateRange(): DateRange {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

function getDaysBetween(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}

// Parse CSV content
function parseCSV(content: string): Meeting[] {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
  const meetings: Meeting[] = [];

  // Find column indexes
  const titleIdx = headers.findIndex(h => h.includes('subject') || h.includes('title') || h.includes('summary'));
  const startIdx = headers.findIndex(h => h.includes('start'));
  const endIdx = headers.findIndex(h => h.includes('end'));
  const attendeesIdx = headers.findIndex(h => h.includes('attendee') || h.includes('required') || h.includes('optional'));

  if (titleIdx === -1 || startIdx === -1) return [];

  for (let i = 1; i < lines.length; i++) {
    try {
      // Simple CSV parsing (handles basic quotes)
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const title = values[titleIdx]?.replace(/"/g, '') || '';
      const startStr = values[startIdx]?.replace(/"/g, '') || '';
      const endStr = values[endIdx]?.replace(/"/g, '') || '';
      const attendeesStr = attendeesIdx >= 0 ? values[attendeesIdx]?.replace(/"/g, '') : '';

      if (!title || !startStr) continue;

      const start_time = new Date(startStr);
      const end_time = endStr ? new Date(endStr) : new Date(start_time.getTime() + 30 * 60000);

      if (isNaN(start_time.getTime())) continue;

      const duration_minutes = Math.round((end_time.getTime() - start_time.getTime()) / 60000);
      const attendees = attendeesStr ? attendeesStr.split(';').map(a => a.trim()).filter(Boolean) : [];

      meetings.push({
        id: generateId(),
        title,
        start_time,
        end_time,
        duration_minutes: duration_minutes > 0 ? duration_minutes : 30,
        attendee_count: attendees.length,
        attendees,
      });
    } catch {
      continue;
    }
  }

  return meetings;
}

// Parse pasted text (simple format)
function parsePastedText(content: string): Meeting[] {
  const lines = content.split('\n').filter(line => line.trim());
  const meetings: Meeting[] = [];

  for (const line of lines) {
    // Expected format: Title | Duration (min) | Attendees
    // Or: Title | Start | End
    const parts = line.split('|').map(p => p.trim());
    if (parts.length < 2) continue;

    const title = parts[0];
    let duration_minutes = 30;
    let attendee_count = 0;
    let start_time = new Date();
    let end_time = new Date();

    // Try to parse duration or dates
    const secondPart = parts[1];
    const durationMatch = secondPart.match(/^(\d+)\s*(m|min|mins|minutes)?$/i);

    if (durationMatch) {
      duration_minutes = parseInt(durationMatch[1], 10);
      end_time = new Date(start_time.getTime() + duration_minutes * 60000);
    } else {
      // Try as date
      const parsed = new Date(secondPart);
      if (!isNaN(parsed.getTime())) {
        start_time = parsed;
        if (parts[2]) {
          const endParsed = new Date(parts[2]);
          if (!isNaN(endParsed.getTime())) {
            end_time = endParsed;
            duration_minutes = Math.round((end_time.getTime() - start_time.getTime()) / 60000);
          }
        }
      }
    }

    // Parse attendee count if present
    if (parts[2] && !isNaN(parseInt(parts[2], 10))) {
      attendee_count = parseInt(parts[2], 10);
    }

    if (title) {
      meetings.push({
        id: generateId(),
        title,
        start_time,
        end_time,
        duration_minutes: duration_minutes > 0 ? duration_minutes : 30,
        attendee_count,
      });
    }
  }

  return meetings;
}

// Auto-categorization heuristics
function suggestCategory(meeting: Meeting, rules: CategoryRule[]): { category: string; confidence: 'high' | 'low'; source: 'rule' | 'suggested' } {
  const titleLower = meeting.title.toLowerCase();

  // First, check user rules
  for (const rule of rules) {
    const patternLower = rule.pattern.toLowerCase();
    if (rule.field === 'title' && titleLower.includes(patternLower)) {
      return { category: rule.category_name, confidence: rule.confidence as 'high' | 'low', source: 'rule' };
    }
    if (rule.field === 'attendee_email' && meeting.attendees) {
      if (meeting.attendees.some(a => a.toLowerCase().includes(patternLower))) {
        return { category: rule.category_name, confidence: rule.confidence as 'high' | 'low', source: 'rule' };
      }
    }
    if (rule.field === 'attendee_domain' && meeting.attendees) {
      if (meeting.attendees.some(a => a.toLowerCase().includes(`@${patternLower}`) || a.toLowerCase().endsWith(patternLower))) {
        return { category: rule.category_name, confidence: rule.confidence as 'high' | 'low', source: 'rule' };
      }
    }
  }

  // Heuristics
  // 1:1 detection
  if (meeting.attendee_count === 2 || meeting.attendee_count === 1) {
    if (titleLower.includes('1:1') || titleLower.includes('1-1') || titleLower.includes('one on one') ||
        titleLower.includes('check-in') || titleLower.includes('check in') || titleLower.includes('catch up') ||
        titleLower.includes('sync')) {
      return { category: '1:1', confidence: 'high', source: 'suggested' };
    }
    return { category: '1:1', confidence: 'low', source: 'suggested' };
  }

  // Hiring
  if (titleLower.includes('interview') || titleLower.includes('candidate') || titleLower.includes('debrief') ||
      titleLower.includes('hiring') || titleLower.includes('recruiting')) {
    return { category: 'Hiring', confidence: 'high', source: 'suggested' };
  }

  // External
  if (titleLower.includes('external') || titleLower.includes('client') || titleLower.includes('vendor') ||
      titleLower.includes('partner') || titleLower.includes('customer')) {
    return { category: 'External', confidence: 'high', source: 'suggested' };
  }

  // Team meetings
  if (titleLower.includes('team') || titleLower.includes('all hands') || titleLower.includes('standup') ||
      titleLower.includes('stand-up') || titleLower.includes('weekly') || titleLower.includes('staff')) {
    return { category: 'Team Meeting', confidence: 'high', source: 'suggested' };
  }

  // Focus time
  if (titleLower.includes('focus') || titleLower.includes('blocked') || titleLower.includes('do not book') ||
      titleLower.includes('heads down') || titleLower.includes('deep work')) {
    return { category: 'Focus Time', confidence: 'high', source: 'suggested' };
  }

  // Admin
  if (titleLower.includes('admin') || titleLower.includes('expense') || titleLower.includes('review') ||
      titleLower.includes('approval') || titleLower.includes('budget')) {
    return { category: 'Admin', confidence: 'low', source: 'suggested' };
  }

  // Project (if has project-like keywords)
  if (titleLower.includes('project') || titleLower.includes('sprint') || titleLower.includes('planning') ||
      titleLower.includes('kickoff') || titleLower.includes('retro')) {
    return { category: 'Project', confidence: 'low', source: 'suggested' };
  }

  // Default
  return { category: 'Other', confidence: 'low', source: 'suggested' };
}

export function CalendarAudit() {
  // State
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [categories, setCategories] = useState<Category[]>(() => {
    return DEFAULT_CATEGORIES.map(c => ({ ...c, id: generateId() }));
  });
  const [rules, setRules] = useState<CategoryRule[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange);
  const [pasteContent, setPasteContent] = useState('');
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste');
  const [copied, setCopied] = useState<string | null>(null);
  const [showRangeWarning, setShowRangeWarning] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [newRule, setNewRule] = useState({ pattern: '', field: 'title' as const, category_name: '' });
  const [isLoadingRules, setIsLoadingRules] = useState(false);

  // Load saved data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.meetings) {
            setMeetings(data.meetings.map((m: Meeting) => ({
              ...m,
              start_time: new Date(m.start_time),
              end_time: new Date(m.end_time),
            })));
          }
          if (data.categories) setCategories(data.categories);
          if (data.dateRange) setDateRange(data.dateRange);
        } catch {}
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const data = { meetings, categories, dateRange };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [meetings, categories, dateRange]);

  // Load rules from API
  useEffect(() => {
    const loadRules = async () => {
      setIsLoadingRules(true);
      try {
        const res = await fetch('/api/calendar-audit/rules');
        if (res.ok) {
          const data = await res.json();
          setRules(data.rules || []);
        }
      } catch (err) {
        console.error('Failed to load rules:', err);
      }
      setIsLoadingRules(false);
    };
    loadRules();
  }, []);

  // Filter meetings by date range
  const filteredMeetings = useMemo(() => {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    return meetings.filter(m => {
      const meetingDate = new Date(m.start_time);
      return meetingDate >= startDate && meetingDate <= endDate;
    });
  }, [meetings, dateRange]);

  // Categorized meetings
  const categorizedMeetings = useMemo(() => {
    return filteredMeetings.map(meeting => {
      if (meeting.category && meeting.category_source === 'user') {
        return meeting;
      }
      const suggestion = suggestCategory(meeting, rules);
      return {
        ...meeting,
        category: meeting.category || suggestion.category,
        confidence: meeting.confidence || suggestion.confidence,
        category_source: meeting.category_source || suggestion.source,
      };
    });
  }, [filteredMeetings, rules]);

  // Analysis calculations
  const analysis = useMemo(() => {
    const totalMinutes = categorizedMeetings.reduce((sum, m) => sum + m.duration_minutes, 0);

    const byCategory = categories.map(cat => {
      const catMeetings = categorizedMeetings.filter(m => m.category === cat.name);
      const minutes = catMeetings.reduce((sum, m) => sum + m.duration_minutes, 0);
      const count = catMeetings.length;
      const percentage = totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0;
      return { ...cat, minutes, count, percentage };
    }).sort((a, b) => b.minutes - a.minutes);

    const uniqueDays = new Set(categorizedMeetings.map(m => formatDate(new Date(m.start_time)))).size;
    const avgMeetingsPerDay = uniqueDays > 0 ? categorizedMeetings.length / uniqueDays : 0;
    const avgMinutesPerDay = uniqueDays > 0 ? totalMinutes / uniqueDays : 0;

    // Top recurring titles
    const titleCounts: Record<string, number> = {};
    categorizedMeetings.forEach(m => {
      const key = m.title.toLowerCase().slice(0, 50);
      titleCounts[key] = (titleCounts[key] || 0) + 1;
    });
    const topRecurring = Object.entries(titleCounts)
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, count]) => ({ title, count }));

    return {
      totalMinutes,
      totalHours: Math.round(totalMinutes / 60 * 10) / 10,
      meetingCount: categorizedMeetings.length,
      byCategory,
      uniqueDays,
      avgMeetingsPerDay: Math.round(avgMeetingsPerDay * 10) / 10,
      avgHoursPerDay: Math.round(avgMinutesPerDay / 60 * 10) / 10,
      topRecurring,
    };
  }, [categorizedMeetings, categories]);

  // Date range presets
  const setPreset = useCallback((preset: 'last30' | 'last90' | 'thisMonth' | 'thisQuarter') => {
    const end = new Date();
    const start = new Date();

    switch (preset) {
      case 'last30':
        start.setDate(start.getDate() - 30);
        break;
      case 'last90':
        start.setDate(start.getDate() - 90);
        break;
      case 'thisMonth':
        start.setDate(1);
        break;
      case 'thisQuarter':
        const quarter = Math.floor(start.getMonth() / 3);
        start.setMonth(quarter * 3, 1);
        break;
    }

    const days = getDaysBetween(formatDate(start), formatDate(end));
    if (days > 180) {
      setShowRangeWarning(true);
    }

    setDateRange({
      start: formatDate(start),
      end: formatDate(end),
    });
  }, []);

  // Handle date range change
  const handleDateChange = useCallback((field: 'start' | 'end', value: string) => {
    setDateRange(prev => {
      const newRange = { ...prev, [field]: value };
      const days = getDaysBetween(newRange.start, newRange.end);
      if (days > 180) {
        setShowRangeWarning(true);
      }
      return newRange;
    });
  }, []);

  // Import meetings
  const handleImport = useCallback(() => {
    let imported: Meeting[] = [];

    if (inputMode === 'paste' && pasteContent.trim()) {
      // Try CSV first
      imported = parseCSV(pasteContent);
      if (imported.length === 0) {
        // Fall back to simple format
        imported = parsePastedText(pasteContent);
      }
    }

    if (imported.length > 0) {
      setMeetings(prev => [...prev, ...imported]);
      setPasteContent('');
    }
  }, [inputMode, pasteContent]);

  // Handle file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const imported = parseCSV(content);
        if (imported.length > 0) {
          setMeetings(prev => [...prev, ...imported]);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  // Update meeting category
  const updateMeetingCategory = useCallback((meetingId: string, categoryName: string) => {
    setMeetings(prev => prev.map(m =>
      m.id === meetingId
        ? { ...m, category: categoryName, category_source: 'user' as const }
        : m
    ));
  }, []);

  // Create rule from meeting
  const createRuleFromMeeting = useCallback(async (meeting: Meeting) => {
    const pattern = meeting.title.split(' ').slice(0, 3).join(' ');
    const category_name = meeting.category || 'Other';

    try {
      const res = await fetch('/api/calendar-audit/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pattern,
          field: 'title',
          category_name,
          confidence: 'high',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRules(prev => [data.rule, ...prev]);
      }
    } catch (err) {
      console.error('Failed to create rule:', err);
    }
  }, []);

  // Delete rule
  const deleteRule = useCallback(async (ruleId: string) => {
    try {
      const res = await fetch(`/api/calendar-audit/rules?id=${ruleId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setRules(prev => prev.filter(r => r.id !== ruleId));
      }
    } catch (err) {
      console.error('Failed to delete rule:', err);
    }
  }, []);

  // Add new category
  const addCategory = useCallback(() => {
    if (!newCategoryName.trim()) return;
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const color = colors[categories.length % colors.length];
    setCategories(prev => [...prev, { id: generateId(), name: newCategoryName.trim(), color }]);
    setNewCategoryName('');
  }, [newCategoryName, categories.length]);

  // Add rule from modal
  const addRule = useCallback(async () => {
    if (!newRule.pattern.trim() || !newRule.category_name) return;

    try {
      const res = await fetch('/api/calendar-audit/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pattern: newRule.pattern.trim(),
          field: newRule.field,
          category_name: newRule.category_name,
          confidence: 'high',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRules(prev => [data.rule, ...prev]);
        setNewRule({ pattern: '', field: 'title', category_name: '' });
        setShowRuleModal(false);
      }
    } catch (err) {
      console.error('Failed to create rule:', err);
    }
  }, [newRule]);

  // Clear all meetings
  const clearMeetings = useCallback(() => {
    setMeetings([]);
  }, []);

  // Copy summary
  const handleCopy = useCallback(async (text: string, type: string) => {
    await copyToClipboard(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  // Generate summary text
  const summaryText = useMemo(() => {
    if (analysis.meetingCount === 0) return '';

    const lines: string[] = [];
    lines.push('CALENDAR AUDIT SUMMARY');
    lines.push('═'.repeat(40));
    lines.push(`Period: ${formatDateDisplay(dateRange.start)} - ${formatDateDisplay(dateRange.end)}`);
    lines.push(`Total Meetings: ${analysis.meetingCount}`);
    lines.push(`Total Time: ${analysis.totalHours} hours`);
    lines.push(`Days Analyzed: ${analysis.uniqueDays}`);
    lines.push(`Avg Meetings/Day: ${analysis.avgMeetingsPerDay}`);
    lines.push(`Avg Hours/Day: ${analysis.avgHoursPerDay}`);
    lines.push('');
    lines.push('CATEGORY BREAKDOWN:');
    analysis.byCategory
      .filter(c => c.count > 0)
      .forEach(c => {
        const hours = Math.round(c.minutes / 60 * 10) / 10;
        lines.push(`  ${c.name}: ${c.count} meetings, ${hours}h (${c.percentage.toFixed(0)}%)`);
      });

    if (analysis.topRecurring.length > 0) {
      lines.push('');
      lines.push('TOP RECURRING MEETINGS:');
      analysis.topRecurring.forEach(r => {
        lines.push(`  ${r.title} (${r.count}x)`);
      });
    }

    return lines.join('\n');
  }, [analysis, dateRange]);

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="text-lg">Audit Period</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setPreset('last30')}>Last 30 Days</Button>
            <Button variant="outline" size="sm" onClick={() => setPreset('last90')}>Last 90 Days</Button>
            <Button variant="outline" size="sm" onClick={() => setPreset('thisMonth')}>This Month</Button>
            <Button variant="outline" size="sm" onClick={() => setPreset('thisQuarter')}>This Quarter</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          {showRangeWarning && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              Large date range selected ({getDaysBetween(dateRange.start, dateRange.end)} days). Analysis may take longer.
              <button
                onClick={() => setShowRangeWarning(false)}
                className="ml-2 text-amber-600 underline"
              >
                Dismiss
              </button>
            </div>
          )}
          {dateRange.start > dateRange.end && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              End date must be after start date.
            </div>
          )}
          <div className="text-sm text-gray-500">
            Showing: {formatDateDisplay(dateRange.start)} - {formatDateDisplay(dateRange.end)}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Import */}
        <div className="lg:col-span-4 space-y-4">
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Import Meetings</CardTitle>
                <div className="flex gap-1">
                  <button
                    onClick={() => setInputMode('paste')}
                    className={cn(
                      'px-2 py-1 text-xs rounded transition-colors',
                      inputMode === 'paste'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    Paste
                  </button>
                  <button
                    onClick={() => setInputMode('upload')}
                    className={cn(
                      'px-2 py-1 text-xs rounded transition-colors',
                      inputMode === 'upload'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {inputMode === 'paste' ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Paste Calendar Data (CSV or Title | Duration | Attendees)
                    </label>
                    <textarea
                      value={pasteContent}
                      onChange={(e) => setPasteContent(e.target.value)}
                      placeholder={`Subject,Start Date,End Date,Required Attendees\nTeam Standup,2024-01-15 09:00,2024-01-15 09:30,john@co.com\n\nOr simple format:\nTeam Standup | 30 | 5\n1:1 with John | 30 | 2`}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 font-mono"
                    />
                  </div>
                  <Button variant="primary" size="sm" onClick={handleImport} className="w-full">
                    Import Meetings
                  </Button>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Upload CSV (Outlook/Google Calendar export)
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Export from Outlook: File → Open & Export → Import/Export → Export to a file → CSV
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meetings List */}
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Meetings</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="primary">{filteredMeetings.length}</Badge>
                  {meetings.length > 0 && (
                    <button onClick={clearMeetings} className="text-xs text-red-500 hover:underline">
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {categorizedMeetings.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No meetings in selected range</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {categorizedMeetings.slice(0, 50).map(meeting => {
                    const cat = categories.find(c => c.name === meeting.category);
                    return (
                      <div
                        key={meeting.id}
                        className="p-2 bg-gray-50 rounded text-sm border border-gray-100"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{meeting.title}</div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <span>{meeting.duration_minutes}m</span>
                              {meeting.attendee_count > 0 && (
                                <span>{meeting.attendee_count} attendees</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <select
                              value={meeting.category || ''}
                              onChange={(e) => updateMeetingCategory(meeting.id, e.target.value)}
                              className="text-xs px-2 py-1 border border-gray-200 rounded"
                              style={{ backgroundColor: cat?.color ? `${cat.color}20` : undefined }}
                            >
                              {categories.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                            {meeting.category_source !== 'user' && (
                              <button
                                onClick={() => createRuleFromMeeting(meeting)}
                                className="text-xs text-primary-600 hover:underline"
                                title="Remember this categorization"
                              >
                                Remember
                              </button>
                            )}
                          </div>
                        </div>
                        {meeting.confidence === 'low' && meeting.category_source === 'suggested' && (
                          <div className="mt-1 text-xs text-amber-600">Low confidence suggestion</div>
                        )}
                      </div>
                    );
                  })}
                  {categorizedMeetings.length > 50 && (
                    <p className="text-xs text-gray-500 text-center py-2">
                      Showing 50 of {categorizedMeetings.length} meetings
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Center Panel - Analysis */}
        <div className="lg:col-span-4 space-y-4">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary-600">{analysis.totalHours}h</div>
                  <div className="text-xs text-gray-500">Total Time</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary-600">{analysis.meetingCount}</div>
                  <div className="text-xs text-gray-500">Meetings</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary-600">{analysis.avgMeetingsPerDay}</div>
                  <div className="text-xs text-gray-500">Avg/Day</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary-600">{analysis.avgHoursPerDay}h</div>
                  <div className="text-xs text-gray-500">Hrs/Day</div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Time by Category</h4>
                <div className="space-y-2">
                  {analysis.byCategory.filter(c => c.count > 0).map(cat => (
                    <div key={cat.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-gray-500">
                          {cat.count} ({Math.round(cat.minutes / 60 * 10) / 10}h, {cat.percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Breakdown */}
              {analysis.meetingCount > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Distribution</h4>
                  <div className="h-8 flex rounded-lg overflow-hidden">
                    {analysis.byCategory
                      .filter(c => c.percentage > 0)
                      .map(cat => (
                        <div
                          key={cat.id}
                          className="flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                          title={`${cat.name}: ${cat.percentage.toFixed(0)}%`}
                        >
                          {cat.percentage >= 10 && `${cat.percentage.toFixed(0)}%`}
                        </div>
                      ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysis.byCategory
                      .filter(c => c.count > 0)
                      .map(cat => (
                        <div key={cat.id} className="flex items-center gap-1 text-xs">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }} />
                          <span>{cat.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Recurring */}
          {analysis.topRecurring.length > 0 && (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle className="text-lg">Top Recurring Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.topRecurring.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1">{r.title}</span>
                      <Badge variant="default" size="sm">{r.count}x</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Categories & Rules */}
        <div className="lg:col-span-4 space-y-4">
          {/* Categories */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
                <Button variant="outline" size="sm" onClick={addCategory}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    className="px-2 py-1 rounded text-xs text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Category Rules</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowRuleModal(true)}>
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingRules ? (
                <p className="text-sm text-gray-500 text-center py-4">Loading rules...</p>
              ) : rules.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No rules yet. Click &quot;Remember&quot; on a meeting or add a rule manually.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {rules.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{rule.pattern}</div>
                        <div className="text-xs text-gray-500">
                          {rule.field} → {rule.category_name}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="ml-2 text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleCopy(summaryText, 'summary')}
                disabled={!summaryText}
                className="w-full"
              >
                {copied === 'summary' ? 'Copied!' : 'Copy Summary'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Category Rule</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pattern</label>
                <input
                  type="text"
                  value={newRule.pattern}
                  onChange={(e) => setNewRule(r => ({ ...r, pattern: e.target.value }))}
                  placeholder="e.g., 1:1 with"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Match Field</label>
                <select
                  value={newRule.field}
                  onChange={(e) => setNewRule(r => ({ ...r, field: e.target.value as 'title' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                >
                  <option value="title">Meeting Title</option>
                  <option value="attendee_email">Attendee Email</option>
                  <option value="attendee_domain">Attendee Domain</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newRule.category_name}
                  onChange={(e) => setNewRule(r => ({ ...r, category_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowRuleModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" onClick={addRule} className="flex-1">
                Add Rule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
