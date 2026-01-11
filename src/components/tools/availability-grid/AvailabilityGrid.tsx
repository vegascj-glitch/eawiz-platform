'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, copyToClipboard } from '@/lib/utils';

// Constants
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const minute = (i % 2) * 30;
  return { hour, minute, index: i };
});

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

const TIMEZONES = [
  { id: 'America/New_York', label: 'Eastern (ET)', short: 'ET' },
  { id: 'America/Chicago', label: 'Central (CT)', short: 'CT' },
  { id: 'America/Denver', label: 'Mountain (MT)', short: 'MT' },
  { id: 'America/Los_Angeles', label: 'Pacific (PT)', short: 'PT' },
  { id: 'Europe/London', label: 'London (GMT/BST)', short: 'GMT' },
  { id: 'Europe/Paris', label: 'Paris (CET)', short: 'CET' },
  { id: 'Asia/Tokyo', label: 'Tokyo (JST)', short: 'JST' },
  { id: 'Asia/Singapore', label: 'Singapore (SGT)', short: 'SGT' },
  { id: 'Australia/Sydney', label: 'Sydney (AEST)', short: 'AEST' },
];

const DURATIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '60 min' },
];

const BUFFERS = [
  { value: 0, label: 'None' },
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
];

const TEMPLATES = [
  { id: 'crisp', label: 'Short & Crisp', intro: "Here are the times I'm available:", outro: 'Let me know what works.' },
  { id: 'warm', label: 'Warm & Polished', intro: "I'd be happy to find a time that works for us. Here are some options:", outro: 'Please let me know your preference, and I\'ll send a calendar invitation.' },
  { id: 'firm', label: 'Firm Boundary-Setter', intro: 'The following times are available for this meeting:', outro: 'Please confirm one of these options at your earliest convenience.' },
  { id: 'highstakes', label: 'High-Stakes (Board/Investor)', intro: 'Thank you for making time to connect. I\'ve identified the following windows:', outro: 'Please advise on your preferred time, and I will coordinate accordingly.' },
];

interface SlotSelection {
  [dayIndex: number]: number[];
}

interface GridState {
  weekStart: string;
  selections: SlotSelection;
  duration: number;
  buffer: number;
  selectedTimezones: string[];
  primaryTimezone: string;
  template: string;
  groupByDay: boolean;
  includeDate: boolean;
  includeDayOfWeek: boolean;
  outputFormat: 'bullets' | 'table';
  singleTimezone: boolean;
  lunchBlackout: boolean;
  avoidBackToBack: boolean;
}

const STORAGE_KEY = 'eawiz-availability-grid';

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatSlotTime(hour: number, minute: number): string {
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, '0');
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h}:${m} ${ampm}`;
}

function getDateForSlot(weekStart: Date, dayIndex: number, hour: number, minute: number): Date {
  const date = new Date(weekStart);
  date.setDate(date.getDate() + dayIndex);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function convertTimezone(date: Date, fromTz: string, toTz: string): { time: string; dayShift: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: toTz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: toTz,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const fromDayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: fromTz,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const toDay = dayFormatter.format(date);
  const fromDay = fromDayFormatter.format(date);

  let dayShift = 0;
  if (toDay !== fromDay) {
    const toDate = new Date(date.toLocaleString('en-US', { timeZone: toTz }));
    const fromDate = new Date(date.toLocaleString('en-US', { timeZone: fromTz }));
    dayShift = toDate.getDate() > fromDate.getDate() ? 1 : -1;
  }

  return { time: formatter.format(date), dayShift };
}

function generateICS(events: { start: Date; end: Date; title: string; description: string }[]): string {
  const formatICSDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const uid = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@eawiz.com`;

  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EAwiz//Availability Grid//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

  events.forEach(event => {
    ics += `BEGIN:VEVENT
UID:${uid()}
DTSTART:${formatICSDate(event.start)}
DTEND:${formatICSDate(event.end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
STATUS:TENTATIVE
TRANSP:OPAQUE
END:VEVENT
`;
  });

  ics += 'END:VCALENDAR';
  return ics;
}

export function AvailabilityGrid() {
  const [state, setState] = useState<GridState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      weekStart: getMonday(new Date()).toISOString(),
      selections: {},
      duration: 30,
      buffer: 0,
      selectedTimezones: ['America/New_York'],
      primaryTimezone: 'America/New_York',
      template: 'crisp',
      groupByDay: true,
      includeDate: true,
      includeDayOfWeek: true,
      outputFormat: 'bullets',
      singleTimezone: false,
      lunchBlackout: false,
      avoidBackToBack: false,
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<boolean>(true);
  const [history, setHistory] = useState<SlotSelection[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const weekStart = useMemo(() => new Date(state.weekStart), [state.weekStart]);

  const weekDates = useMemo(() => {
    return DAYS.map((day, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return date;
    });
  }, [weekStart]);

  const isLunchSlot = useCallback((slotIndex: number) => {
    const slot = TIME_SLOTS[slotIndex];
    return slot.hour >= 12 && slot.hour < 13;
  }, []);

  const slotsNeeded = useMemo(() => Math.ceil(state.duration / 30), [state.duration]);

  const canSelectSlot = useCallback((dayIndex: number, slotIndex: number): boolean => {
    if (state.lunchBlackout && isLunchSlot(slotIndex)) return false;
    if (slotIndex + slotsNeeded > TIME_SLOTS.length) return false;

    for (let i = 0; i < slotsNeeded; i++) {
      if (state.lunchBlackout && isLunchSlot(slotIndex + i)) return false;
    }
    return true;
  }, [state.lunchBlackout, slotsNeeded, isLunchSlot]);

  const toggleSlot = useCallback((dayIndex: number, slotIndex: number, forceValue?: boolean) => {
    if (!canSelectSlot(dayIndex, slotIndex)) return;

    setHistory(h => [...h.slice(-9), state.selections]);

    setState(prev => {
      const current = prev.selections[dayIndex] || [];
      const isSelected = current.includes(slotIndex);
      const shouldSelect = forceValue !== undefined ? forceValue : !isSelected;

      let newSlots: number[];
      if (shouldSelect) {
        const toAdd = Array.from({ length: slotsNeeded }, (_, i) => slotIndex + i)
          .filter(s => s < TIME_SLOTS.length);
        newSlots = Array.from(new Set([...current, ...toAdd])).sort((a, b) => a - b);
      } else {
        newSlots = current.filter(s => s < slotIndex || s >= slotIndex + slotsNeeded);
      }

      return {
        ...prev,
        selections: {
          ...prev.selections,
          [dayIndex]: newSlots,
        },
      };
    });
  }, [canSelectSlot, slotsNeeded, state.selections]);

  const handleMouseDown = useCallback((dayIndex: number, slotIndex: number) => {
    if (!canSelectSlot(dayIndex, slotIndex)) return;
    const current = state.selections[dayIndex] || [];
    const isSelected = current.includes(slotIndex);
    setDragValue(!isSelected);
    setIsDragging(true);
    toggleSlot(dayIndex, slotIndex, !isSelected);
  }, [canSelectSlot, state.selections, toggleSlot]);

  const handleMouseEnter = useCallback((dayIndex: number, slotIndex: number) => {
    if (isDragging && canSelectSlot(dayIndex, slotIndex)) {
      toggleSlot(dayIndex, slotIndex, dragValue);
    }
  }, [isDragging, canSelectSlot, dragValue, toggleSlot]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  const navigateWeek = useCallback((direction: number) => {
    setState(prev => {
      const current = new Date(prev.weekStart);
      current.setDate(current.getDate() + direction * 7);
      return { ...prev, weekStart: current.toISOString(), selections: {} };
    });
  }, []);

  const goToThisWeek = useCallback(() => {
    setState(prev => ({
      ...prev,
      weekStart: getMonday(new Date()).toISOString(),
      selections: {},
    }));
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setState(prev => ({ ...prev, selections: last }));
  }, [history]);

  const clearAll = useCallback(() => {
    setHistory(h => [...h.slice(-9), state.selections]);
    setState(prev => ({ ...prev, selections: {} }));
  }, [state.selections]);

  const toggleTimezone = useCallback((tzId: string) => {
    setState(prev => {
      const selected = prev.selectedTimezones.includes(tzId)
        ? prev.selectedTimezones.filter(t => t !== tzId)
        : [...prev.selectedTimezones, tzId];

      if (selected.length === 0) return prev;

      const primary = selected.includes(prev.primaryTimezone)
        ? prev.primaryTimezone
        : selected[0];

      return { ...prev, selectedTimezones: selected, primaryTimezone: primary };
    });
  }, []);

  // Generate email content
  const emailContent = useMemo(() => {
    const template = TEMPLATES.find(t => t.id === state.template) || TEMPLATES[0];
    const primaryTz = TIMEZONES.find(t => t.id === state.primaryTimezone);
    const secondaryTzs = state.selectedTimezones
      .filter(tz => tz !== state.primaryTimezone)
      .map(id => TIMEZONES.find(t => t.id === id))
      .filter(Boolean);

    const lines: string[] = [];

    const sortedDays = Object.keys(state.selections)
      .map(Number)
      .filter(d => state.selections[d]?.length > 0)
      .sort((a, b) => a - b);

    if (sortedDays.length === 0) {
      return { full: '', timesOnly: '', html: '' };
    }

    sortedDays.forEach(dayIndex => {
      const slots = [...state.selections[dayIndex]].sort((a, b) => a - b);
      const date = weekDates[dayIndex];

      // Group contiguous slots
      const groups: number[][] = [];
      let currentGroup: number[] = [];

      slots.forEach(slot => {
        if (currentGroup.length === 0 || slot === currentGroup[currentGroup.length - 1] + 1) {
          currentGroup.push(slot);
        } else {
          if (currentGroup.length >= slotsNeeded) groups.push(currentGroup);
          currentGroup = [slot];
        }
      });
      if (currentGroup.length >= slotsNeeded) groups.push(currentGroup);

      groups.forEach(group => {
        const startSlot = TIME_SLOTS[group[0]];
        const fullDate = getDateForSlot(weekStart, dayIndex, startSlot.hour, startSlot.minute);

        const primaryTime = formatSlotTime(startSlot.hour, startSlot.minute);

        let line = '';
        if (state.includeDayOfWeek || state.includeDate) {
          const parts: string[] = [];
          if (state.includeDayOfWeek) parts.push(DAYS[dayIndex]);
          if (state.includeDate) {
            parts.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
          }
          line += parts.join(' ') + ': ';
        }

        line += `${primaryTime} ${primaryTz?.short || ''}`;

        if (!state.singleTimezone && secondaryTzs.length > 0) {
          const converted = secondaryTzs.map(tz => {
            if (!tz) return '';
            const { time, dayShift } = convertTimezone(fullDate, state.primaryTimezone, tz.id);
            let str = `${time} ${tz.short}`;
            if (dayShift === 1) str += ' (+1 day)';
            if (dayShift === -1) str += ' (-1 day)';
            return str;
          }).filter(Boolean);

          if (converted.length > 0) {
            line += ` (${converted.join(', ')})`;
          }
        }

        lines.push(line);
      });
    });

    const timesOnly = state.outputFormat === 'bullets'
      ? lines.map(l => `• ${l}`).join('\n')
      : lines.join('\n');

    const full = `${template.intro}\n\n${timesOnly}\n\n${template.outro}`;

    const htmlLines = lines.map(l => `<li>${l}</li>`).join('\n');
    const html = `<p>${template.intro}</p>\n<ul>\n${htmlLines}\n</ul>\n<p>${template.outro}</p>`;

    return { full, timesOnly, html };
  }, [state, weekDates, weekStart, slotsNeeded]);

  // Back-to-back warning
  const hasBackToBack = useMemo(() => {
    if (!state.avoidBackToBack) return false;

    for (const dayIndex of Object.keys(state.selections).map(Number)) {
      const slots = [...(state.selections[dayIndex] || [])].sort((a, b) => a - b);
      for (let i = 1; i < slots.length; i++) {
        if (slots[i] === slots[i - 1] + slotsNeeded) {
          return true;
        }
      }
    }
    return false;
  }, [state.selections, state.avoidBackToBack, slotsNeeded]);

  const handleCopy = useCallback(async (text: string, type: string) => {
    await copyToClipboard(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const downloadICS = useCallback(() => {
    const events: { start: Date; end: Date; title: string; description: string }[] = [];

    Object.keys(state.selections).map(Number).forEach(dayIndex => {
      const slots = [...state.selections[dayIndex]].sort((a, b) => a - b);

      const groups: number[][] = [];
      let currentGroup: number[] = [];

      slots.forEach(slot => {
        if (currentGroup.length === 0 || slot === currentGroup[currentGroup.length - 1] + 1) {
          currentGroup.push(slot);
        } else {
          if (currentGroup.length >= slotsNeeded) groups.push(currentGroup);
          currentGroup = [slot];
        }
      });
      if (currentGroup.length >= slotsNeeded) groups.push(currentGroup);

      groups.forEach(group => {
        const startSlot = TIME_SLOTS[group[0]];
        const endSlot = TIME_SLOTS[Math.min(group[group.length - 1] + 1, TIME_SLOTS.length - 1)];

        const start = getDateForSlot(weekStart, dayIndex, startSlot.hour, startSlot.minute);
        const end = getDateForSlot(weekStart, dayIndex, endSlot.hour, endSlot.minute);

        if (state.buffer > 0) {
          start.setMinutes(start.getMinutes() - state.buffer);
          end.setMinutes(end.getMinutes() + state.buffer);
        }

        events.push({
          start,
          end,
          title: 'HOLD - Proposed Times',
          description: `Proposed meeting time\\nTimezone: ${state.primaryTimezone}`,
        });
      });
    });

    const ics = generateICS(events);
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'availability-holds.ics';
    a.click();
    URL.revokeObjectURL(url);
  }, [state.selections, state.primaryTimezone, state.buffer, weekStart, slotsNeeded]);

  const totalSelected = useMemo(() => {
    return Object.values(state.selections).reduce((sum, slots) => sum + slots.length, 0);
  }, [state.selections]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" onMouseUp={handleMouseUp}>
      {/* Left Panel - Settings */}
      <div className="lg:col-span-3 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Duration
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DURATIONS.map(d => (
                  <button
                    key={d.value}
                    onClick={() => setState(s => ({ ...s, duration: d.value }))}
                    className={cn(
                      'px-3 py-2 text-sm rounded-lg border transition-colors',
                      state.duration === d.value
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buffer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buffer Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BUFFERS.map(b => (
                  <button
                    key={b.value}
                    onClick={() => setState(s => ({ ...s, buffer: b.value }))}
                    className={cn(
                      'px-3 py-2 text-sm rounded-lg border transition-colors',
                      state.buffer === b.value
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                    )}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.lunchBlackout}
                  onChange={e => setState(s => ({ ...s, lunchBlackout: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Block 12-1pm (Lunch)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.avoidBackToBack}
                  onChange={e => setState(s => ({ ...s, avoidBackToBack: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Warn back-to-back</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Timezones */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Time Zones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary
              </label>
              <select
                value={state.primaryTimezone}
                onChange={e => setState(s => ({ ...s, primaryTimezone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
              >
                {state.selectedTimezones.map(tzId => {
                  const tz = TIMEZONES.find(t => t.id === tzId);
                  return (
                    <option key={tzId} value={tzId}>
                      {tz?.label || tzId}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include in Email
              </label>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {TIMEZONES.map(tz => (
                  <label key={tz.id} className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={state.selectedTimezones.includes(tz.id)}
                      onChange={() => toggleTimezone(tz.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{tz.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" onClick={clearAll} className="w-full">
          Clear All Selections
        </Button>
        <Button variant="ghost" onClick={undo} disabled={history.length === 0} className="w-full">
          Undo Last Action
        </Button>
      </div>

      {/* Center Panel - Grid */}
      <div className="lg:col-span-5">
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Select Available Times</CardTitle>
              <Badge variant="primary">{totalSelected} slots</Badge>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button variant="ghost" size="sm" onClick={() => navigateWeek(-1)}>
                &larr; Prev
              </Button>
              <Button variant="outline" size="sm" onClick={goToThisWeek}>
                This Week
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigateWeek(1)}>
                Next &rarr;
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {hasBackToBack && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                Warning: You have back-to-back meetings selected.
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse select-none">
                <thead>
                  <tr>
                    <th className="p-2 text-xs text-gray-500 text-left w-16"></th>
                    {DAYS.map((day, i) => (
                      <th key={day} className="p-2 text-center">
                        <div className="text-xs font-medium text-gray-500">{day}</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {weekDates[i].getDate()}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((slot, slotIndex) => (
                    <tr key={slotIndex}>
                      <td className="p-1 text-xs text-gray-500 text-right pr-2">
                        {slot.minute === 0 && formatSlotTime(slot.hour, slot.minute)}
                      </td>
                      {DAYS.map((_, dayIndex) => {
                        const isSelected = (state.selections[dayIndex] || []).includes(slotIndex);
                        const isBlocked = state.lunchBlackout && isLunchSlot(slotIndex);
                        const cantSelect = !canSelectSlot(dayIndex, slotIndex);

                        return (
                          <td
                            key={dayIndex}
                            onMouseDown={() => !cantSelect && handleMouseDown(dayIndex, slotIndex)}
                            onMouseEnter={() => handleMouseEnter(dayIndex, slotIndex)}
                            className={cn(
                              'p-0 border border-gray-100',
                              slot.minute === 0 && 'border-t-gray-300'
                            )}
                          >
                            <div
                              className={cn(
                                'h-6 w-full transition-colors',
                                isBlocked
                                  ? 'bg-gray-200 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-primary-500 hover:bg-primary-600 cursor-pointer'
                                  : cantSelect
                                  ? 'bg-gray-100 cursor-not-allowed'
                                  : 'bg-white hover:bg-primary-100 cursor-pointer'
                              )}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Click and drag to select multiple slots. Duration: {state.duration} min per meeting.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Email Draft */}
      <div className="lg:col-span-4 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Email Draft</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Template */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select
                value={state.template}
                onChange={e => setState(s => ({ ...s, template: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
              >
                {TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Format Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.includeDayOfWeek}
                  onChange={e => setState(s => ({ ...s, includeDayOfWeek: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Include day of week</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.includeDate}
                  onChange={e => setState(s => ({ ...s, includeDate: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Include date</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.singleTimezone}
                  onChange={e => setState(s => ({ ...s, singleTimezone: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Show primary timezone only</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setState(s => ({ ...s, outputFormat: 'bullets' }))}
                className={cn(
                  'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors',
                  state.outputFormat === 'bullets'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300'
                )}
              >
                Bullets
              </button>
              <button
                onClick={() => setState(s => ({ ...s, outputFormat: 'table' }))}
                className={cn(
                  'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors',
                  state.outputFormat === 'table'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300'
                )}
              >
                Plain List
              </button>
            </div>

            {/* Preview */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800 whitespace-pre-wrap min-h-[120px] max-h-[300px] overflow-y-auto font-mono">
                {emailContent.full || 'Select time slots to generate email content...'}
              </div>
            </div>

            {/* Copy Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleCopy(emailContent.full, 'full')}
                disabled={!emailContent.full}
              >
                {copied === 'full' ? 'Copied!' : 'Copy Full Email'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(emailContent.timesOnly, 'times')}
                disabled={!emailContent.timesOnly}
              >
                {copied === 'times' ? 'Copied!' : 'Copy Times Only'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(emailContent.html, 'html')}
                disabled={!emailContent.html}
              >
                {copied === 'html' ? 'Copied!' : 'Copy as HTML'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={downloadICS}
                disabled={totalSelected === 0}
              >
                Download ICS
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
