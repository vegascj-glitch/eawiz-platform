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

// Parse ICS file content (Google Calendar export)
function parseICS(content: string): Meeting[] {
  const meetings: Meeting[] = [];
  const events = content.split('BEGIN:VEVENT');

  for (let i = 1; i < events.length; i++) {
    try {
      const event = events[i];
      const endIdx = event.indexOf('END:VEVENT');
      const eventContent = endIdx >= 0 ? event.substring(0, endIdx) : event;

      // Extract fields - handle line folding (lines starting with space are continuations)
      const unfoldedContent = eventContent.replace(/\r?\n[ \t]/g, '');
      const lines = unfoldedContent.split(/\r?\n/);

      let title = '';
      let dtstart = '';
      let dtend = '';
      let attendees: string[] = [];

      for (const line of lines) {
        if (line.startsWith('SUMMARY:')) {
          title = line.substring(8).replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\n/g, '\n').trim();
        } else if (line.startsWith('DTSTART')) {
          // Handle both DTSTART:20240115T090000Z and DTSTART;TZID=America/New_York:20240115T090000
          const colonIdx = line.indexOf(':');
          if (colonIdx >= 0) {
            dtstart = line.substring(colonIdx + 1).trim();
          }
        } else if (line.startsWith('DTEND')) {
          const colonIdx = line.indexOf(':');
          if (colonIdx >= 0) {
            dtend = line.substring(colonIdx + 1).trim();
          }
        } else if (line.startsWith('ATTENDEE')) {
          // Extract email from ATTENDEE;...mailto:email@example.com
          const mailtoMatch = line.match(/mailto:([^\s;]+)/i);
          if (mailtoMatch) {
            attendees.push(mailtoMatch[1]);
          }
        }
      }

      if (!title || !dtstart) continue;

      // Parse ICS date format: 20240115T090000Z or 20240115T090000 or 20240115 (all-day)
      const parseICSDate = (dateStr: string): Date => {
        // Remove any trailing Z for UTC (we'll handle timezone simply)
        const clean = dateStr.replace('Z', '');

        if (clean.length === 8) {
          // All-day event: YYYYMMDD
          const year = parseInt(clean.substring(0, 4), 10);
          const month = parseInt(clean.substring(4, 6), 10) - 1;
          const day = parseInt(clean.substring(6, 8), 10);
          return new Date(year, month, day, 0, 0, 0);
        } else if (clean.length >= 15) {
          // DateTime: YYYYMMDDTHHmmss
          const year = parseInt(clean.substring(0, 4), 10);
          const month = parseInt(clean.substring(4, 6), 10) - 1;
          const day = parseInt(clean.substring(6, 8), 10);
          const hour = parseInt(clean.substring(9, 11), 10);
          const minute = parseInt(clean.substring(11, 13), 10);
          const second = parseInt(clean.substring(13, 15), 10);
          return new Date(year, month, day, hour, minute, second);
        }
        return new Date(dateStr);
      };

      const start_time = parseICSDate(dtstart);
      const end_time = dtend ? parseICSDate(dtend) : new Date(start_time.getTime() + 30 * 60000);

      if (isNaN(start_time.getTime())) continue;

      const duration_minutes = Math.round((end_time.getTime() - start_time.getTime()) / 60000);

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

// Check if meeting is all-day (duration >= 24 hours or starts at midnight and spans full day)
function isAllDayEvent(meeting: Meeting): boolean {
  // If duration is 24 hours or more, it's all-day
  if (meeting.duration_minutes >= 24 * 60) return true;

  // Check if it starts at midnight and is 24h (common ICS pattern for all-day)
  const start = new Date(meeting.start_time);
  if (start.getHours() === 0 && start.getMinutes() === 0 && meeting.duration_minutes === 24 * 60) {
    return true;
  }

  return false;
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
  const [copied, setCopied] = useState<string | null>(null);
  // Filter states
  const [excludeAllDay, setExcludeAllDay] = useState(true);
  const [minDuration, setMinDuration] = useState(0);
  const [excludeKeywords, setExcludeKeywords] = useState('');
  // Export instructions accordion
  const [showExportInstructions, setShowExportInstructions] = useState(false);
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

  // Filter meetings by date range and additional filters
  const filteredMeetings = useMemo(() => {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    // Parse exclude keywords
    const keywordsList = excludeKeywords
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);

    return meetings.filter(m => {
      // 1. Date range filter
      const meetingDate = new Date(m.start_time);
      if (meetingDate < startDate || meetingDate > endDate) return false;

      // 2. Exclude all-day events
      if (excludeAllDay && isAllDayEvent(m)) return false;

      // 3. Minimum duration filter
      if (m.duration_minutes < minDuration) return false;

      // 4. Exclude keywords filter
      if (keywordsList.length > 0) {
        const titleLower = m.title.toLowerCase();
        if (keywordsList.some(keyword => titleLower.includes(keyword))) {
          return false;
        }
      }

      return true;
    });
  }, [meetings, dateRange, excludeAllDay, minDuration, excludeKeywords]);

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

  // Handle file upload (CSV for Outlook, ICS for Google Calendar)
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        let imported: Meeting[] = [];

        // Determine file type by extension or content
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith('.ics') || content.includes('BEGIN:VCALENDAR')) {
          imported = parseICS(content);
        } else {
          imported = parseCSV(content);
        }

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
      {/* Export Instructions Accordion */}
      <Card variant="bordered">
        <button
          onClick={() => setShowExportInstructions(!showExportInstructions)}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-semibold text-gray-900">How to Export Your Calendar</span>
          </div>
          <svg
            className={cn('w-5 h-5 text-gray-500 transition-transform', showExportInstructions && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showExportInstructions && (
          <CardContent className="pt-0 pb-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Outlook Instructions */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.01V2.38q0-.46.33-.8.33-.32.8-.32h14.49q.46 0 .79.33.33.33.33.8zM17.38 6h-6.38v6.38q0 .41-.3.7-.29.3-.7.3H6v4.62h11.38zM7.5 2.62v3.38h2.75V4.5h.875v1.5h.875V2.62zm6.5 5.88h-5v5h5z"/>
                  </svg>
                  <h4 className="font-semibold text-blue-900">Microsoft Outlook</h4>
                </div>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Open Outlook and go to <strong>File</strong></li>
                  <li>Click <strong>Open & Export</strong></li>
                  <li>Select <strong>Import/Export</strong></li>
                  <li>Choose <strong>Export to a file</strong></li>
                  <li>Select <strong>Comma Separated Values (CSV)</strong></li>
                  <li>Select your <strong>Calendar</strong> folder</li>
                  <li>Choose a save location and click <strong>Finish</strong></li>
                </ol>
                <p className="mt-3 text-xs text-blue-600">Exports as .csv file</p>
              </div>

              {/* Google Calendar Instructions */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.5 22h-15A2.5 2.5 0 012 19.5v-15A2.5 2.5 0 014.5 2H9v2H4.5a.5.5 0 00-.5.5v15a.5.5 0 00.5.5h15a.5.5 0 00.5-.5V15h2v4.5a2.5 2.5 0 01-2.5 2.5z"/>
                    <path d="M18 2v4h4v2h-6V2h2z"/>
                    <path d="M21 8l-6-6v6h6z"/>
                    <path d="M8 12h8v2H8zM8 16h6v2H8z"/>
                  </svg>
                  <h4 className="font-semibold text-green-900">Google Calendar</h4>
                </div>
                <ol className="text-sm text-green-800 space-y-2 list-decimal list-inside">
                  <li>Go to <strong>calendar.google.com</strong></li>
                  <li>Click the <strong>gear icon</strong> → <strong>Settings</strong></li>
                  <li>Under <strong>Import & export</strong>, click <strong>Export</strong></li>
                  <li>Click <strong>Export</strong> to download a .zip file</li>
                  <li>Extract the .zip to find your <strong>.ics</strong> file(s)</li>
                  <li>Upload the .ics file here</li>
                </ol>
                <p className="mt-3 text-xs text-green-600">Exports as .ics file</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

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
        {/* Left Panel - Import & Filters */}
        <div className="lg:col-span-4 space-y-4">
          {/* Upload File */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">Import Meetings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Upload Calendar Export
                </label>
                <input
                  type="file"
                  accept=".csv,.ics"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Supports <strong>.csv</strong> (Outlook) and <strong>.ics</strong> (Google Calendar)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Filters Panel */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Exclude All-Day Events */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Exclude all-day events</label>
                <button
                  onClick={() => setExcludeAllDay(!excludeAllDay)}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    excludeAllDay ? 'bg-primary-600' : 'bg-gray-200'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      excludeAllDay ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>

              {/* Minimum Duration Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Minimum duration</label>
                  <span className="text-sm text-gray-500">{minDuration} min</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="240"
                  step="15"
                  value={minDuration}
                  onChange={(e) => setMinDuration(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>60</span>
                  <span>120</span>
                  <span>180</span>
                  <span>240</span>
                </div>
              </div>

              {/* Exclude Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exclude by keywords
                </label>
                <input
                  type="text"
                  value={excludeKeywords}
                  onChange={(e) => setExcludeKeywords(e.target.value)}
                  placeholder="lunch, blocked, hold"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">Comma-separated list of keywords to exclude</p>
              </div>
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
