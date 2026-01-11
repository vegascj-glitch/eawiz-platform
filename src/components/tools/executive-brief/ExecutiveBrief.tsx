'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, copyToClipboard } from '@/lib/utils';

// Types
type BriefMode = 'daily' | 'weekly';

interface Section {
  id: string;
  label: string;
  placeholder: string;
  dailyOnly?: boolean;
  weeklyOnly?: boolean;
}

interface BriefState {
  mode: BriefMode;
  executiveName: string;
  date: string;
  sections: Record<string, { enabled: boolean; content: string }>;
  internalNotes: string;
  tone: 'formal' | 'conversational';
}

const DAILY_SECTIONS: Section[] = [
  {
    id: 'schedule',
    label: 'Schedule Overview',
    placeholder: '9:00 AM - Leadership sync (30 min)\n10:00 AM - Client call with Acme Corp\n12:00 PM - Lunch with Board Member\n2:00 PM - Q4 Planning Session (2 hrs)',
    dailyOnly: true,
  },
  {
    id: 'priorities',
    label: 'Top Priorities',
    placeholder: '1. Review and approve Q4 budget proposal\n2. Prepare talking points for investor meeting\n3. Sign off on new hire offer letters',
  },
  {
    id: 'decisions',
    label: 'Decisions Needed',
    placeholder: '- Approve travel itinerary for NYC trip (due today)\n- Confirm speaker for All Hands meeting\n- Select vendor for office renovation',
  },
  {
    id: 'prep',
    label: 'Meeting Prep Notes',
    placeholder: 'Client call (10 AM): They may ask about timeline delays. Draft response attached.\n\nBoard lunch: John mentioned wanting to discuss succession planning.',
  },
  {
    id: 'fyi',
    label: 'FYI / Awareness',
    placeholder: '- Marketing launched new campaign yesterday\n- IT maintenance scheduled for Saturday\n- Press coverage from conference is trending positive',
  },
];

const WEEKLY_SECTIONS: Section[] = [
  {
    id: 'weekHighlights',
    label: 'Week Ahead Highlights',
    placeholder: 'Monday: Board dinner\nTuesday: All-day strategy offsite\nWednesday: Analyst call (earnings preview)\nThursday: Open - recommend using for deep work\nFriday: Team celebration lunch',
    weeklyOnly: true,
  },
  {
    id: 'priorities',
    label: 'Key Priorities This Week',
    placeholder: '1. Finalize investor deck for Friday\n2. Complete annual reviews for direct reports\n3. Approve marketing budget reallocation',
  },
  {
    id: 'deadlines',
    label: 'Deadlines & Deliverables',
    placeholder: 'Tuesday: Board materials due\nWednesday: Sign-off on press release\nFriday: Submit expense report',
    weeklyOnly: true,
  },
  {
    id: 'travel',
    label: 'Travel & Logistics',
    placeholder: 'No travel this week.\n\nNext week: NYC trip (Mon-Wed)\n- Flight confirmation: AA1234\n- Hotel: The Standard, confirmed',
  },
  {
    id: 'personal',
    label: 'Personal Reminders',
    placeholder: "- Sarah's birthday is Thursday (gift ordered)\n- Dentist appointment Friday 4pm\n- Kids' recital Saturday 2pm",
  },
];

const TONES = [
  { id: 'formal', label: 'Formal' },
  { id: 'conversational', label: 'Conversational' },
] as const;

const STORAGE_KEY = 'eawiz-executive-brief';

function getDefaultDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function getDefaultSections(mode: BriefMode): Record<string, { enabled: boolean; content: string }> {
  const sections = mode === 'daily' ? DAILY_SECTIONS : WEEKLY_SECTIONS;
  return sections.reduce((acc, section) => {
    acc[section.id] = { enabled: true, content: '' };
    return acc;
  }, {} as Record<string, { enabled: boolean; content: string }>);
}

function formatDate(dateStr: string, mode: BriefMode): string {
  const date = new Date(dateStr + 'T12:00:00');
  if (mode === 'daily') {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } else {
    // For weekly, show the week range
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 4); // Friday

    const startStr = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `Week of ${startStr} - ${endStr}`;
  }
}

export function ExecutiveBrief() {
  const [state, setState] = useState<BriefState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      mode: 'daily',
      executiveName: '',
      date: getDefaultDate(),
      sections: getDefaultSections('daily'),
      internalNotes: '',
      tone: 'formal',
    };
  });

  const [copied, setCopied] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Get current sections based on mode
  const currentSections = useMemo(() => {
    return state.mode === 'daily' ? DAILY_SECTIONS : WEEKLY_SECTIONS;
  }, [state.mode]);

  // Handle mode change
  const handleModeChange = useCallback((mode: BriefMode) => {
    setState(prev => ({
      ...prev,
      mode,
      sections: getDefaultSections(mode),
    }));
  }, []);

  // Update section content
  const updateSection = useCallback((sectionId: string, content: string) => {
    setState(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: { ...prev.sections[sectionId], content },
      },
    }));
  }, []);

  // Toggle section enabled
  const toggleSection = useCallback((sectionId: string) => {
    setState(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: {
          ...prev.sections[sectionId],
          enabled: !prev.sections[sectionId]?.enabled
        },
      },
    }));
  }, []);

  // Generate brief content
  const briefContent = useMemo(() => {
    const title = state.mode === 'daily' ? 'Daily Brief' : 'Weekly Brief';
    const dateStr = formatDate(state.date, state.mode);
    const execName = state.executiveName || '[Executive Name]';

    let content = '';

    if (state.tone === 'formal') {
      content += `${title}\n`;
      content += `Prepared for: ${execName}\n`;
      content += `${dateStr}\n`;
      content += '═'.repeat(50) + '\n\n';
    } else {
      content += `${title} for ${execName}\n`;
      content += `${dateStr}\n`;
      content += '—'.repeat(30) + '\n\n';
    }

    currentSections.forEach(section => {
      const sectionState = state.sections[section.id];
      if (!sectionState?.enabled) return;

      const sectionContent = sectionState.content.trim();
      if (!sectionContent) return;

      if (state.tone === 'formal') {
        content += `▸ ${section.label.toUpperCase()}\n`;
        content += sectionContent + '\n\n';
      } else {
        content += `${section.label}\n`;
        content += sectionContent + '\n\n';
      }
    });

    return content.trim();
  }, [state, currentSections]);

  // Generate HTML version
  const briefHtml = useMemo(() => {
    const title = state.mode === 'daily' ? 'Daily Brief' : 'Weekly Brief';
    const dateStr = formatDate(state.date, state.mode);
    const execName = state.executiveName || '[Executive Name]';

    let html = `<h2>${title}</h2>\n`;
    html += `<p><strong>Prepared for:</strong> ${execName}</p>\n`;
    html += `<p><strong>${dateStr}</strong></p>\n<hr/>\n`;

    currentSections.forEach(section => {
      const sectionState = state.sections[section.id];
      if (!sectionState?.enabled) return;

      const sectionContent = sectionState.content.trim();
      if (!sectionContent) return;

      html += `<h3>${section.label}</h3>\n`;
      const paragraphs = sectionContent.split('\n').filter(Boolean);
      paragraphs.forEach(p => {
        if (p.startsWith('-') || p.startsWith('•') || /^\d+\./.test(p)) {
          html += `<li>${p.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '')}</li>\n`;
        } else {
          html += `<p>${p}</p>\n`;
        }
      });
    });

    return html;
  }, [state, currentSections]);

  // Count active sections with content
  const activeSections = useMemo(() => {
    return currentSections.filter(s => {
      const sectionState = state.sections[s.id];
      return sectionState?.enabled && sectionState.content.trim();
    }).length;
  }, [currentSections, state.sections]);

  const handleCopy = useCallback(async (text: string, type: string) => {
    await copyToClipboard(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const clearAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      sections: getDefaultSections(prev.mode),
      internalNotes: '',
    }));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Panel - Settings */}
      <div className="lg:col-span-3 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Brief Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleModeChange('daily')}
                  className={cn(
                    'px-3 py-2 text-sm rounded-lg border transition-colors',
                    state.mode === 'daily'
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                  )}
                >
                  Daily
                </button>
                <button
                  onClick={() => handleModeChange('weekly')}
                  className={cn(
                    'px-3 py-2 text-sm rounded-lg border transition-colors',
                    state.mode === 'weekly'
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                  )}
                >
                  Weekly
                </button>
              </div>
            </div>

            {/* Executive Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Executive Name
              </label>
              <input
                type="text"
                value={state.executiveName}
                onChange={e => setState(s => ({ ...s, executiveName: e.target.value }))}
                placeholder="e.g., Sarah Chen"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {state.mode === 'daily' ? 'Date' : 'Week Starting'}
              </label>
              <input
                type="date"
                value={state.date}
                onChange={e => setState(s => ({ ...s, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Tone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setState(s => ({ ...s, tone: t.id }))}
                    className={cn(
                      'px-3 py-2 text-sm rounded-lg border transition-colors',
                      state.tone === t.id
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Toggles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include Sections
              </label>
              <div className="space-y-2">
                {currentSections.map(section => (
                  <label key={section.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.sections[section.id]?.enabled ?? true}
                      onChange={() => toggleSection(section.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{section.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" onClick={clearAll} className="w-full">
          Clear All Content
        </Button>
      </div>

      {/* Center Panel - Content Entry */}
      <div className="lg:col-span-5 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {state.mode === 'daily' ? 'Daily' : 'Weekly'} Brief Content
              </CardTitle>
              <Badge variant="primary">{activeSections} sections</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentSections.map(section => {
              const sectionState = state.sections[section.id];
              if (!sectionState?.enabled) return null;

              return (
                <div key={section.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {section.label}
                  </label>
                  <textarea
                    value={sectionState.content}
                    onChange={e => updateSection(section.id, e.target.value)}
                    placeholder={section.placeholder}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Internal Notes - EA Only */}
        <Card variant="bordered" className="border-amber-300 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">EA Internal Notes</CardTitle>
              <Badge variant="warning" size="sm">Not included in output</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              value={state.internalNotes}
              onChange={e => setState(s => ({ ...s, internalNotes: e.target.value }))}
              placeholder="Personal notes, reminders, context that shouldn't be shared with the executive..."
              rows={4}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none bg-white"
            />
            <p className="mt-2 text-xs text-amber-700">
              These notes are for your reference only and will never appear in the generated brief.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Preview & Export */}
      <div className="lg:col-span-4 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview */}
            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-800 whitespace-pre-wrap min-h-[300px] max-h-[500px] overflow-y-auto font-mono">
              {briefContent || 'Fill in sections to generate your brief...'}
            </div>

            {/* Copy Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleCopy(briefContent, 'plain')}
                disabled={!briefContent}
              >
                {copied === 'plain' ? 'Copied!' : 'Copy Plain Text'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(briefHtml, 'html')}
                disabled={!briefContent}
              >
                {copied === 'html' ? 'Copied!' : 'Copy as HTML'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card variant="bordered" className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base text-blue-900">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Start lines with numbers or dashes for automatic list formatting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Toggle sections on/off based on what&apos;s relevant that day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Internal notes are never shared - use them freely!</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
