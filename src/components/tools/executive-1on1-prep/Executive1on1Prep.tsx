'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, copyToClipboard } from '@/lib/utils';

// Types
interface AgendaItem {
  id: string;
  text: string;
  owner: 'exec' | 'ea' | 'other' | '';
  dueDate: string;
  status: 'on-track' | 'at-risk' | 'blocked' | '';
  completed: boolean;
}

interface AgendaSection {
  id: string;
  title: string;
  enabled: boolean;
  items: AgendaItem[];
  timeAllocation: number;
}

interface MeetingSetup {
  executiveName: string;
  cadence: 'weekly' | 'biweekly' | 'monthly' | 'adhoc';
  meetingDate: string;
  meetingTime: string;
  timezone: string;
  timebox: number;
  attendees: string;
  notes: string;
}

interface SavedMeeting {
  id: string;
  name: string;
  date: string;
  setup: MeetingSetup;
  sections: AgendaSection[];
  openItems: AgendaItem[];
  createdAt: string;
}

interface SavedTemplate {
  id: string;
  name: string;
  sections: AgendaSection[];
}

interface PrepState {
  setup: MeetingSetup;
  sections: AgendaSection[];
  openItems: AgendaItem[];
  eaPrivateNotes: string;
  savedMeetings: SavedMeeting[];
  savedTemplates: SavedTemplate[];
  showOwners: boolean;
  showDueDates: boolean;
  showTimeboxes: boolean;
  outputFormat: 'bullets' | 'numbered';
}

// Constants
const DEFAULT_SECTIONS: AgendaSection[] = [
  { id: 'wins', title: 'Wins since last check-in', enabled: true, items: [], timeAllocation: 3 },
  { id: 'priorities', title: 'Top priorities (this week)', enabled: true, items: [], timeAllocation: 5 },
  { id: 'decisions', title: 'Decisions needed (from exec)', enabled: true, items: [], timeAllocation: 5 },
  { id: 'blockers', title: 'Blockers / risks', enabled: true, items: [], timeAllocation: 4 },
  { id: 'updates', title: 'Updates by topic / stakeholder', enabled: true, items: [], timeAllocation: 5 },
  { id: 'upcoming', title: 'Upcoming deadlines / travel', enabled: true, items: [], timeAllocation: 3 },
  { id: 'delegations', title: 'Delegations / tasks for EA', enabled: true, items: [], timeAllocation: 3 },
  { id: 'followups', title: 'Follow-ups / commitments recap', enabled: true, items: [], timeAllocation: 2 },
];

const CADENCES = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'biweekly', label: 'Biweekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'adhoc', label: 'Ad-hoc' },
] as const;

const TIMEBOXES = [15, 30, 45, 60];

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Singapore',
];

const PRESET_TEMPLATES: SavedTemplate[] = [
  {
    id: 'weekly-standard',
    name: 'Weekly Standard',
    sections: DEFAULT_SECTIONS.map(s => ({ ...s, items: [] })),
  },
  {
    id: 'operator-mode',
    name: 'Operator Mode (tight & tactical)',
    sections: [
      { id: 'open', title: 'Open items from last 1:1', enabled: true, items: [], timeAllocation: 3 },
      { id: 'blockers', title: 'Blockers / risks', enabled: true, items: [], timeAllocation: 5 },
      { id: 'decisions', title: 'Decisions needed', enabled: true, items: [], timeAllocation: 7 },
      { id: 'priorities', title: 'This week priorities', enabled: true, items: [], timeAllocation: 5 },
      { id: 'delegations', title: 'Tasks for EA', enabled: true, items: [], timeAllocation: 5 },
      { id: 'upcoming', title: 'Upcoming deadlines', enabled: true, items: [], timeAllocation: 3 },
      { id: 'followups', title: 'Follow-ups', enabled: true, items: [], timeAllocation: 2 },
    ],
  },
  {
    id: 'strategy-mode',
    name: 'Strategy Mode (higher-level)',
    sections: [
      { id: 'wins', title: 'Key wins & progress', enabled: true, items: [], timeAllocation: 5 },
      { id: 'strategic', title: 'Strategic priorities', enabled: true, items: [], timeAllocation: 10 },
      { id: 'decisions', title: 'Strategic decisions needed', enabled: true, items: [], timeAllocation: 8 },
      { id: 'stakeholders', title: 'Key stakeholder updates', enabled: true, items: [], timeAllocation: 5 },
      { id: 'risks', title: 'Risks & mitigation', enabled: true, items: [], timeAllocation: 5 },
      { id: 'longterm', title: 'Long-term planning items', enabled: true, items: [], timeAllocation: 7 },
    ],
  },
];

const STORAGE_KEY = 'eawiz-1on1-prep';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getDefaultDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/New_York';
  }
}

function distributeTime(totalMinutes: number, sections: AgendaSection[]): AgendaSection[] {
  const enabledSections = sections.filter(s => s.enabled);
  if (enabledSections.length === 0) return sections;

  const totalWeight = enabledSections.reduce((sum, s) => sum + s.timeAllocation, 0);

  return sections.map(s => {
    if (!s.enabled) return { ...s, timeAllocation: 0 };
    const allocated = Math.round((s.timeAllocation / totalWeight) * totalMinutes);
    return { ...s, timeAllocation: Math.max(allocated, 2) };
  });
}

export function Executive1on1Prep() {
  const [state, setState] = useState<PrepState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      setup: {
        executiveName: '',
        cadence: 'weekly',
        meetingDate: getDefaultDate(),
        meetingTime: '09:00',
        timezone: getBrowserTimezone(),
        timebox: 30,
        attendees: '',
        notes: '',
      },
      sections: DEFAULT_SECTIONS.map(s => ({ ...s, items: [] })),
      openItems: [],
      eaPrivateNotes: '',
      savedMeetings: [],
      savedTemplates: [],
      showOwners: true,
      showDueDates: false,
      showTimeboxes: true,
      outputFormat: 'bullets',
    };
  });

  const [copied, setCopied] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState<Record<string, string>>({});

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Redistribute time when timebox changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      sections: distributeTime(prev.setup.timebox, prev.sections),
    }));
  }, [state.setup.timebox]);

  // Update setup
  const updateSetup = useCallback(<K extends keyof MeetingSetup>(key: K, value: MeetingSetup[K]) => {
    setState(prev => ({
      ...prev,
      setup: { ...prev.setup, [key]: value },
    }));
  }, []);

  // Toggle section
  const toggleSection = useCallback((sectionId: string) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  }, []);

  // Move section
  const moveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    setState(prev => {
      const idx = prev.sections.findIndex(s => s.id === sectionId);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.sections.length - 1) return prev;

      const newSections = [...prev.sections];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      [newSections[idx], newSections[swapIdx]] = [newSections[swapIdx], newSections[idx]];
      return { ...prev, sections: newSections };
    });
  }, []);

  // Add item to section
  const addItem = useCallback((sectionId: string) => {
    const text = newItemText[sectionId]?.trim();
    if (!text) return;

    const newItem: AgendaItem = {
      id: generateId(),
      text,
      owner: '',
      dueDate: '',
      status: '',
      completed: false,
    };

    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
      ),
    }));
    setNewItemText(prev => ({ ...prev, [sectionId]: '' }));
  }, [newItemText]);

  // Update item
  const updateItem = useCallback((sectionId: string, itemId: string, updates: Partial<AgendaItem>) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, ...updates } : i) }
          : s
      ),
    }));
  }, []);

  // Remove item
  const removeItem = useCallback((sectionId: string, itemId: string) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
      ),
    }));
  }, []);

  // Add open item to section
  const addOpenItemToSection = useCallback((item: AgendaItem, sectionId: string) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, items: [...s.items, { ...item, id: generateId() }] } : s
      ),
      openItems: prev.openItems.filter(i => i.id !== item.id),
    }));
  }, []);

  // Mark open item complete
  const markOpenItemComplete = useCallback((itemId: string) => {
    setState(prev => ({
      ...prev,
      openItems: prev.openItems.filter(i => i.id !== itemId),
    }));
  }, []);

  // Save meeting
  const saveMeeting = useCallback(() => {
    const name = `${state.setup.executiveName || 'Exec'} 1:1 - ${state.setup.meetingDate}`;

    // Collect incomplete items for carryover
    const incompleteItems: AgendaItem[] = [];
    state.sections.forEach(section => {
      section.items.forEach(item => {
        if (!item.completed) {
          incompleteItems.push({ ...item, id: generateId() });
        }
      });
    });

    const meeting: SavedMeeting = {
      id: generateId(),
      name,
      date: state.setup.meetingDate,
      setup: state.setup,
      sections: state.sections,
      openItems: incompleteItems,
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      savedMeetings: [meeting, ...prev.savedMeetings].slice(0, 20),
      openItems: incompleteItems,
    }));
  }, [state.setup, state.sections]);

  // Load meeting
  const loadMeeting = useCallback((meeting: SavedMeeting) => {
    setState(prev => ({
      ...prev,
      setup: meeting.setup,
      sections: meeting.sections,
    }));
  }, []);

  // Delete saved meeting
  const deleteMeeting = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      savedMeetings: prev.savedMeetings.filter(m => m.id !== id),
    }));
  }, []);

  // Save template
  const saveTemplate = useCallback((name: string) => {
    if (!name.trim()) return;
    const template: SavedTemplate = {
      id: generateId(),
      name: name.trim(),
      sections: state.sections.map(s => ({ ...s, items: [] })),
    };
    setState(prev => ({
      ...prev,
      savedTemplates: [...prev.savedTemplates, template],
    }));
  }, [state.sections]);

  // Load template
  const loadTemplate = useCallback((template: SavedTemplate) => {
    setState(prev => ({
      ...prev,
      sections: template.sections.map(s => ({ ...s, items: [] })),
    }));
  }, []);

  // Delete template
  const deleteTemplate = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      savedTemplates: prev.savedTemplates.filter(t => t.id !== id),
    }));
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setState(prev => ({
      ...prev,
      sections: DEFAULT_SECTIONS.map(s => ({ ...s, items: [] })),
    }));
  }, []);

  // Generate exec-ready output
  const execOutput = useMemo(() => {
    const lines: string[] = [];
    const prefix = state.outputFormat === 'bullets' ? '•' : '';
    let sectionNum = 0;

    if (state.setup.executiveName) {
      lines.push(`1:1 Agenda - ${state.setup.executiveName}`);
    } else {
      lines.push('1:1 Agenda');
    }
    lines.push(`${state.setup.meetingDate}${state.setup.meetingTime ? ` at ${state.setup.meetingTime}` : ''}`);
    if (state.showTimeboxes) {
      lines.push(`Duration: ${state.setup.timebox} minutes`);
    }
    lines.push('═'.repeat(40));
    lines.push('');

    // Open items first if any
    if (state.openItems.length > 0) {
      lines.push('OPEN ITEMS FROM LAST 1:1');
      state.openItems.forEach((item, i) => {
        const num = state.outputFormat === 'numbered' ? `${i + 1}.` : prefix;
        lines.push(`${num} ${item.text}`);
      });
      lines.push('');
    }

    state.sections.filter(s => s.enabled).forEach(section => {
      sectionNum++;
      const timeStr = state.showTimeboxes ? ` (${section.timeAllocation} min)` : '';
      lines.push(`${section.title.toUpperCase()}${timeStr}`);

      if (section.items.length === 0) {
        lines.push('  (No items)');
      } else {
        section.items.forEach((item, i) => {
          const num = state.outputFormat === 'numbered' ? `${i + 1}.` : prefix;
          let line = `${num} ${item.text}`;
          if (state.showOwners && item.owner) {
            line += ` [${item.owner.toUpperCase()}]`;
          }
          if (state.showDueDates && item.dueDate) {
            line += ` (Due: ${item.dueDate})`;
          }
          if (item.status) {
            line += ` - ${item.status}`;
          }
          lines.push(line);
        });
      }
      lines.push('');
    });

    return lines.join('\n').trim();
  }, [state]);

  // Generate EA internal output
  const eaOutput = useMemo(() => {
    const lines: string[] = [];

    lines.push('EA INTERNAL PREP NOTES');
    lines.push('═'.repeat(40));
    lines.push('');
    lines.push(`Meeting: ${state.setup.executiveName || 'Executive'} 1:1`);
    lines.push(`Date: ${state.setup.meetingDate} at ${state.setup.meetingTime}`);
    lines.push(`Cadence: ${state.setup.cadence}`);
    lines.push(`Timebox: ${state.setup.timebox} minutes`);
    if (state.setup.attendees) {
      lines.push(`Attendees: ${state.setup.attendees}`);
    }
    lines.push('');

    if (state.openItems.length > 0) {
      lines.push('⚠️ OPEN ITEMS TO ADDRESS:');
      state.openItems.forEach(item => {
        lines.push(`  → ${item.text}${item.owner ? ` [${item.owner}]` : ''}`);
      });
      lines.push('');
    }

    lines.push('AGENDA BREAKDOWN:');
    state.sections.filter(s => s.enabled).forEach(section => {
      lines.push(`\n▸ ${section.title} (${section.timeAllocation} min)`);
      if (section.items.length === 0) {
        lines.push('  - No items');
      } else {
        section.items.forEach(item => {
          let line = `  - ${item.text}`;
          if (item.owner) line += ` [${item.owner}]`;
          if (item.dueDate) line += ` | Due: ${item.dueDate}`;
          if (item.status) line += ` | ${item.status}`;
          lines.push(line);
        });
      }
    });

    if (state.setup.notes) {
      lines.push('\n--- RAW NOTES ---');
      lines.push(state.setup.notes);
    }

    if (state.eaPrivateNotes) {
      lines.push('\n--- EA PRIVATE NOTES ---');
      lines.push(state.eaPrivateNotes);
    }

    return lines.join('\n');
  }, [state]);

  // Generate HTML output
  const htmlOutput = useMemo(() => {
    let html = '<h2>1:1 Agenda</h2>\n';
    if (state.setup.executiveName) {
      html += `<p><strong>${state.setup.executiveName}</strong></p>\n`;
    }
    html += `<p>${state.setup.meetingDate}</p>\n`;

    if (state.openItems.length > 0) {
      html += '<h3>Open Items from Last 1:1</h3>\n<ul>\n';
      state.openItems.forEach(item => {
        html += `<li>${item.text}</li>\n`;
      });
      html += '</ul>\n';
    }

    state.sections.filter(s => s.enabled).forEach(section => {
      html += `<h3>${section.title}</h3>\n`;
      if (section.items.length === 0) {
        html += '<p><em>No items</em></p>\n';
      } else {
        html += '<ul>\n';
        section.items.forEach(item => {
          html += `<li>${item.text}`;
          if (item.owner) html += ` <em>[${item.owner}]</em>`;
          html += '</li>\n';
        });
        html += '</ul>\n';
      }
    });

    return html;
  }, [state]);

  // Export JSON
  const exportJson = useCallback(() => {
    const data = {
      exportDate: new Date().toISOString(),
      setup: state.setup,
      sections: state.sections,
      openItems: state.openItems,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `1on1-prep-${state.setup.meetingDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  // Import JSON
  const importJson = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.setup && data.sections) {
          setState(prev => ({
            ...prev,
            setup: data.setup,
            sections: data.sections,
            openItems: data.openItems || [],
          }));
        }
      } catch {}
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  // Copy handler
  const handleCopy = useCallback(async (text: string, type: string) => {
    await copyToClipboard(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  // Template name state
  const [templateName, setTemplateName] = useState('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Panel - Setup & Templates */}
      <div className="lg:col-span-3 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Meeting Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Executive Name</label>
              <input
                type="text"
                value={state.setup.executiveName}
                onChange={e => updateSetup('executiveName', e.target.value)}
                placeholder="e.g., Sarah Chen"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cadence</label>
                <select
                  value={state.setup.cadence}
                  onChange={e => updateSetup('cadence', e.target.value as MeetingSetup['cadence'])}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
                >
                  {CADENCES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Timebox</label>
                <select
                  value={state.setup.timebox}
                  onChange={e => updateSetup('timebox', parseInt(e.target.value))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
                >
                  {TIMEBOXES.map(t => (
                    <option key={t} value={t}>{t} min</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={state.setup.meetingDate}
                  onChange={e => updateSetup('meetingDate', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={state.setup.meetingTime}
                  onChange={e => updateSetup('meetingTime', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={state.setup.timezone}
                onChange={e => updateSetup('timezone', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Attendees (optional)</label>
              <input
                type="text"
                value={state.setup.attendees}
                onChange={e => updateSetup('attendees', e.target.value)}
                placeholder="Exec + EA"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Paste Notes</label>
              <textarea
                value={state.setup.notes}
                onChange={e => updateSetup('notes', e.target.value)}
                placeholder="Paste meeting notes, emails, or context here..."
                rows={4}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              {PRESET_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => loadTemplate(t)}
                  className="w-full text-left px-2 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                >
                  {t.name}
                </button>
              ))}
            </div>

            {state.savedTemplates.length > 0 && (
              <>
                <div className="border-t pt-2">
                  <div className="text-xs font-medium text-gray-500 mb-1">Saved Templates</div>
                  {state.savedTemplates.map(t => (
                    <div key={t.id} className="flex items-center justify-between py-1">
                      <button
                        onClick={() => loadTemplate(t)}
                        className="text-sm text-left hover:text-primary-600"
                      >
                        {t.name}
                      </button>
                      <button
                        onClick={() => deleteTemplate(t.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
                placeholder="Template name..."
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => { saveTemplate(templateName); setTemplateName(''); }}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Saved Meetings */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Saved Meetings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="primary" size="sm" onClick={saveMeeting} className="w-full">
              Save Current Meeting
            </Button>

            {state.savedMeetings.length > 0 ? (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {state.savedMeetings.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <button
                      onClick={() => loadMeeting(m)}
                      className="text-left flex-1 hover:text-primary-600 truncate"
                    >
                      {m.name}
                    </button>
                    <button
                      onClick={() => deleteMeeting(m.id)}
                      className="text-gray-400 hover:text-red-500 ml-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 text-center py-2">No saved meetings</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Center Panel - Agenda Builder */}
      <div className="lg:col-span-5 space-y-4">
        {/* Open Items */}
        {state.openItems.length > 0 && (
          <Card variant="bordered" className="border-amber-300 bg-amber-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Open Items from Last 1:1</CardTitle>
                <Badge variant="warning" size="sm">{state.openItems.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {state.openItems.map(item => (
                  <div key={item.id} className="flex items-center gap-2 p-2 bg-white rounded border border-amber-200">
                    <span className="flex-1 text-sm">{item.text}</span>
                    <select
                      onChange={e => {
                        if (e.target.value === 'complete') {
                          markOpenItemComplete(item.id);
                        } else if (e.target.value) {
                          addOpenItemToSection(item, e.target.value);
                        }
                      }}
                      className="text-xs border border-gray-300 rounded px-1 py-0.5"
                      defaultValue=""
                    >
                      <option value="">Add to...</option>
                      {state.sections.filter(s => s.enabled).map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                      <option value="complete">Mark Complete</option>
                    </select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sections */}
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Agenda Sections</CardTitle>
              <Button variant="ghost" size="sm" onClick={resetToDefaults}>
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.sections.map((section, idx) => (
              <div
                key={section.id}
                className={cn(
                  'border rounded-lg p-3 transition-colors',
                  section.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={() => toggleSection(section.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="font-medium text-sm flex-1">{section.title}</span>
                  {state.showTimeboxes && section.enabled && (
                    <Badge variant="default" size="sm">{section.timeAllocation}m</Badge>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={idx === state.sections.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                </div>

                {section.enabled && (
                  <>
                    {section.items.length > 0 && (
                      <div className="space-y-1 mb-2">
                        {section.items.map(item => (
                          <div key={item.id} className="flex items-center gap-2 p-1.5 bg-gray-50 rounded text-sm">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={e => updateItem(section.id, item.id, { completed: e.target.checked })}
                              className="rounded border-gray-300 text-green-600"
                            />
                            <span className={cn('flex-1', item.completed && 'line-through text-gray-400')}>
                              {item.text}
                            </span>
                            {state.showOwners && (
                              <select
                                value={item.owner}
                                onChange={e => updateItem(section.id, item.id, { owner: e.target.value as AgendaItem['owner'] })}
                                className="text-xs border border-gray-200 rounded px-1 py-0.5"
                              >
                                <option value="">Owner</option>
                                <option value="exec">Exec</option>
                                <option value="ea">EA</option>
                                <option value="other">Other</option>
                              </select>
                            )}
                            <select
                              value={item.status}
                              onChange={e => updateItem(section.id, item.id, { status: e.target.value as AgendaItem['status'] })}
                              className="text-xs border border-gray-200 rounded px-1 py-0.5"
                            >
                              <option value="">Status</option>
                              <option value="on-track">On track</option>
                              <option value="at-risk">At risk</option>
                              <option value="blocked">Blocked</option>
                            </select>
                            <button
                              onClick={() => removeItem(section.id, item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newItemText[section.id] || ''}
                        onChange={e => setNewItemText(prev => ({ ...prev, [section.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && addItem(section.id)}
                        placeholder="Add item..."
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-primary-500"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addItem(section.id)}
                      >
                        +
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* EA Private Notes */}
        <Card variant="bordered" className="border-amber-300 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">EA Private Notes</CardTitle>
              <Badge variant="warning" size="sm">Not in exec output</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              value={state.eaPrivateNotes}
              onChange={e => setState(s => ({ ...s, eaPrivateNotes: e.target.value }))}
              placeholder="Private context, reminders, things to watch for..."
              rows={3}
              className="w-full px-3 py-2 border border-amber-300 rounded text-sm focus:ring-2 focus:ring-amber-500 bg-white resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Output */}
      <div className="lg:col-span-4 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Output Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setState(s => ({ ...s, outputFormat: 'bullets' }))}
                className={cn(
                  'flex-1 px-2 py-1.5 text-sm rounded border transition-colors',
                  state.outputFormat === 'bullets'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300'
                )}
              >
                Bullets
              </button>
              <button
                onClick={() => setState(s => ({ ...s, outputFormat: 'numbered' }))}
                className={cn(
                  'flex-1 px-2 py-1.5 text-sm rounded border transition-colors',
                  state.outputFormat === 'numbered'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300'
                )}
              >
                Numbered
              </button>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.showOwners}
                  onChange={e => setState(s => ({ ...s, showOwners: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm">Show owners</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.showDueDates}
                  onChange={e => setState(s => ({ ...s, showDueDates: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm">Show due dates</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.showTimeboxes}
                  onChange={e => setState(s => ({ ...s, showTimeboxes: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm">Show timeboxes</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Exec-Ready Agenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-gray-50 rounded text-sm text-gray-800 whitespace-pre-wrap min-h-[200px] max-h-[300px] overflow-y-auto font-mono">
              {execOutput || 'Build your agenda to see output...'}
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleCopy(execOutput, 'exec')}
              className="w-full"
            >
              {copied === 'exec' ? 'Copied!' : 'Copy Exec-Ready'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(eaOutput, 'ea')}
              className="w-full"
            >
              {copied === 'ea' ? 'Copied!' : 'Copy EA Internal'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(htmlOutput, 'html')}
              className="w-full"
            >
              {copied === 'html' ? 'Copied!' : 'Copy as HTML'}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={exportJson}
              >
                Export JSON
              </Button>
              <label className="cursor-pointer">
                <Button variant="secondary" size="sm" className="w-full pointer-events-none">
                  Import JSON
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importJson}
                  className="hidden"
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
