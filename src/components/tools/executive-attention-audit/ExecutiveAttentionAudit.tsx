'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, copyToClipboard } from '@/lib/utils';

// Types
interface TimeEntry {
  id: string;
  date: string;
  title: string;
  duration: number;
  category: Category;
  notes: string;
}

type Category = 'strategy' | 'operations' | 'people' | 'external' | 'admin' | 'personal';

interface SavedAudit {
  id: string;
  name: string;
  entries: TimeEntry[];
  createdAt: string;
}

interface AuditState {
  entries: TimeEntry[];
  pasteContent: string;
  savedAudits: SavedAudit[];
  currentAuditName: string;
  internalNotes: string;
}

const CATEGORIES: { id: Category; label: string; color: string }[] = [
  { id: 'strategy', label: 'Strategy', color: 'bg-purple-500' },
  { id: 'operations', label: 'Operations', color: 'bg-blue-500' },
  { id: 'people', label: 'People', color: 'bg-green-500' },
  { id: 'external', label: 'External', color: 'bg-orange-500' },
  { id: 'admin', label: 'Admin', color: 'bg-gray-500' },
  { id: 'personal', label: 'Personal', color: 'bg-pink-500' },
];

const STORAGE_KEY = 'eawiz-attention-audit';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getDefaultDate(): string {
  return new Date().toISOString().split('T')[0];
}

function parsePasteContent(content: string): TimeEntry[] {
  const lines = content.split('\n').filter(line => line.trim());
  const entries: TimeEntry[] = [];

  for (const line of lines) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 2) {
      const title = parts[0];
      const duration = parseInt(parts[1], 10);
      const categoryStr = (parts[2] || 'admin').toLowerCase();

      if (title && !isNaN(duration) && duration > 0) {
        const category = CATEGORIES.find(c => c.id === categoryStr)?.id || 'admin';
        entries.push({
          id: generateId(),
          date: getDefaultDate(),
          title,
          duration,
          category,
          notes: '',
        });
      }
    }
  }

  return entries;
}

// Threshold constants for insights
const THRESHOLDS = {
  strategyLow: 15,
  adminHigh: 25,
  externalHigh: 30,
  operationsHigh: 35,
};

export function ExecutiveAttentionAudit() {
  const [state, setState] = useState<AuditState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      entries: [],
      pasteContent: '',
      savedAudits: [],
      currentAuditName: '',
      internalNotes: '',
    };
  });

  const [newEntry, setNewEntry] = useState<Omit<TimeEntry, 'id'>>({
    date: getDefaultDate(),
    title: '',
    duration: 30,
    category: 'operations',
    notes: '',
  });

  const [inputMode, setInputMode] = useState<'structured' | 'paste'>('structured');
  const [copied, setCopied] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Add entry
  const addEntry = useCallback(() => {
    if (!newEntry.title.trim() || newEntry.duration <= 0) return;

    setState(prev => ({
      ...prev,
      entries: [...prev.entries, { ...newEntry, id: generateId() }],
    }));

    setNewEntry({
      date: getDefaultDate(),
      title: '',
      duration: 30,
      category: 'operations',
      notes: '',
    });
  }, [newEntry]);

  // Remove entry
  const removeEntry = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      entries: prev.entries.filter(e => e.id !== id),
    }));
  }, []);

  // Parse and add pasted content
  const parsePaste = useCallback(() => {
    const parsed = parsePasteContent(state.pasteContent);
    if (parsed.length > 0) {
      setState(prev => ({
        ...prev,
        entries: [...prev.entries, ...parsed],
        pasteContent: '',
      }));
    }
  }, [state.pasteContent]);

  // Analysis calculations
  const analysis = useMemo(() => {
    const totalMinutes = state.entries.reduce((sum, e) => sum + e.duration, 0);

    const byCategory = CATEGORIES.map(cat => {
      const minutes = state.entries
        .filter(e => e.category === cat.id)
        .reduce((sum, e) => sum + e.duration, 0);
      const percentage = totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0;
      return { ...cat, minutes, percentage };
    }).sort((a, b) => b.minutes - a.minutes);

    const uniqueDays = new Set(state.entries.map(e => e.date)).size;
    const meetingDensity = uniqueDays > 0 ? state.entries.length / uniqueDays : 0;

    const top3 = byCategory.slice(0, 3).filter(c => c.minutes > 0);

    return {
      totalMinutes,
      totalHours: Math.round(totalMinutes / 60 * 10) / 10,
      byCategory,
      top3,
      meetingDensity: Math.round(meetingDensity * 10) / 10,
      entryCount: state.entries.length,
      uniqueDays,
    };
  }, [state.entries]);

  // Generate insights
  const insights = useMemo(() => {
    const items: { type: 'warning' | 'info' | 'success'; message: string }[] = [];

    if (analysis.totalMinutes === 0) {
      return [{ type: 'info' as const, message: 'Add entries to see insights about attention allocation.' }];
    }

    const strategyPct = analysis.byCategory.find(c => c.id === 'strategy')?.percentage || 0;
    const adminPct = analysis.byCategory.find(c => c.id === 'admin')?.percentage || 0;
    const externalPct = analysis.byCategory.find(c => c.id === 'external')?.percentage || 0;
    const operationsPct = analysis.byCategory.find(c => c.id === 'operations')?.percentage || 0;
    const peoplePct = analysis.byCategory.find(c => c.id === 'people')?.percentage || 0;

    // Strategy insights
    if (strategyPct < THRESHOLDS.strategyLow) {
      items.push({
        type: 'warning',
        message: `Strategic time is under-allocated (${strategyPct.toFixed(0)}%). Consider protecting dedicated strategy blocks.`,
      });
    } else if (strategyPct >= 20) {
      items.push({
        type: 'success',
        message: `Good strategic allocation (${strategyPct.toFixed(0)}%). Executive is investing in forward-looking work.`,
      });
    }

    // Admin insights
    if (adminPct > THRESHOLDS.adminHigh) {
      items.push({
        type: 'warning',
        message: `Administrative load is high (${adminPct.toFixed(0)}%). Review for delegation opportunities.`,
      });
    }

    // External insights
    if (externalPct > THRESHOLDS.externalHigh) {
      items.push({
        type: 'warning',
        message: `Significant external commitments (${externalPct.toFixed(0)}%). Assess alignment with priorities.`,
      });
    }

    // Operations insights
    if (operationsPct > THRESHOLDS.operationsHigh) {
      items.push({
        type: 'warning',
        message: `Heavy operational focus (${operationsPct.toFixed(0)}%). May limit strategic bandwidth.`,
      });
    }

    // People insights
    if (peoplePct === 0 && analysis.totalMinutes > 120) {
      items.push({
        type: 'info',
        message: 'No dedicated people time logged. Consider 1:1s or team touchpoints.',
      });
    } else if (peoplePct >= 15) {
      items.push({
        type: 'success',
        message: `Solid people investment (${peoplePct.toFixed(0)}%). Leadership visibility is strong.`,
      });
    }

    // Meeting density
    if (analysis.meetingDensity > 8) {
      items.push({
        type: 'warning',
        message: `High meeting density (${analysis.meetingDensity} per day). Consider consolidation.`,
      });
    }

    if (items.length === 0) {
      items.push({
        type: 'success',
        message: 'Attention allocation looks balanced across categories.',
      });
    }

    return items;
  }, [analysis]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    const items: string[] = [];

    if (analysis.totalMinutes === 0) return items;

    const adminPct = analysis.byCategory.find(c => c.id === 'admin')?.percentage || 0;
    const strategyPct = analysis.byCategory.find(c => c.id === 'strategy')?.percentage || 0;
    const operationsPct = analysis.byCategory.find(c => c.id === 'operations')?.percentage || 0;

    if (adminPct > THRESHOLDS.adminHigh) {
      items.push('Delegate recurring admin tasks (scheduling, expenses, routine approvals)');
      items.push('Batch administrative work into dedicated blocks');
    }

    if (strategyPct < THRESHOLDS.strategyLow) {
      items.push('Block 2-3 hours weekly for strategic thinking');
      items.push('Decline or delegate meetings that lack strategic value');
    }

    if (operationsPct > THRESHOLDS.operationsHigh) {
      items.push('Empower direct reports to handle operational decisions');
      items.push('Create escalation criteria to filter what reaches executive');
    }

    if (analysis.meetingDensity > 6) {
      items.push('Audit recurring meetings for continued necessity');
      items.push('Implement "no meeting" blocks for deep work');
    }

    if (items.length === 0) {
      items.push('Continue current allocation patterns');
      items.push('Monitor for shifts over time');
    }

    return items;
  }, [analysis]);

  // Generate executive summary
  const executiveSummary = useMemo(() => {
    if (analysis.totalMinutes === 0) return '';

    const lines: string[] = [];
    lines.push('EXECUTIVE ATTENTION AUDIT');
    lines.push('═'.repeat(40));
    lines.push('');
    lines.push(`Total Time Analyzed: ${analysis.totalHours} hours (${analysis.entryCount} entries)`);
    lines.push(`Period: ${analysis.uniqueDays} day(s)`);
    lines.push('');
    lines.push('TIME ALLOCATION:');
    analysis.byCategory
      .filter(c => c.minutes > 0)
      .forEach(c => {
        const hours = Math.round(c.minutes / 60 * 10) / 10;
        lines.push(`  ${c.label}: ${hours}h (${c.percentage.toFixed(0)}%)`);
      });
    lines.push('');
    lines.push('KEY OBSERVATIONS:');
    insights.forEach(i => {
      lines.push(`  • ${i.message}`);
    });

    return lines.join('\n');
  }, [analysis, insights]);

  // Generate EA internal summary
  const eaInternalSummary = useMemo(() => {
    if (analysis.totalMinutes === 0) return '';

    const lines: string[] = [];
    lines.push('EA INTERNAL ANALYSIS');
    lines.push('═'.repeat(40));
    lines.push('');
    lines.push('RAW METRICS:');
    lines.push(`  Total entries: ${analysis.entryCount}`);
    lines.push(`  Total minutes: ${analysis.totalMinutes}`);
    lines.push(`  Unique days: ${analysis.uniqueDays}`);
    lines.push(`  Meeting density: ${analysis.meetingDensity}/day`);
    lines.push('');
    lines.push('CATEGORY BREAKDOWN:');
    analysis.byCategory.forEach(c => {
      lines.push(`  ${c.label}: ${c.minutes} min (${c.percentage.toFixed(1)}%)`);
    });
    lines.push('');
    lines.push('FLAGS & INSIGHTS:');
    insights.forEach(i => {
      const prefix = i.type === 'warning' ? '[!]' : i.type === 'success' ? '[✓]' : '[i]';
      lines.push(`  ${prefix} ${i.message}`);
    });
    lines.push('');
    lines.push('RECOMMENDATIONS:');
    recommendations.forEach(r => {
      lines.push(`  → ${r}`);
    });
    if (state.internalNotes.trim()) {
      lines.push('');
      lines.push('EA NOTES:');
      lines.push(state.internalNotes);
    }

    return lines.join('\n');
  }, [analysis, insights, recommendations, state.internalNotes]);

  // Generate HTML summary
  const htmlSummary = useMemo(() => {
    if (analysis.totalMinutes === 0) return '';

    let html = '<h2>Executive Attention Audit</h2>\n';
    html += `<p><strong>Total Time:</strong> ${analysis.totalHours} hours (${analysis.entryCount} entries over ${analysis.uniqueDays} day(s))</p>\n`;
    html += '<h3>Time Allocation</h3>\n<ul>\n';
    analysis.byCategory
      .filter(c => c.minutes > 0)
      .forEach(c => {
        const hours = Math.round(c.minutes / 60 * 10) / 10;
        html += `<li><strong>${c.label}:</strong> ${hours}h (${c.percentage.toFixed(0)}%)</li>\n`;
      });
    html += '</ul>\n';
    html += '<h3>Key Observations</h3>\n<ul>\n';
    insights.forEach(i => {
      html += `<li>${i.message}</li>\n`;
    });
    html += '</ul>\n';

    return html;
  }, [analysis, insights]);

  // Export JSON
  const exportJson = useCallback(() => {
    const data = {
      exportDate: new Date().toISOString(),
      auditName: state.currentAuditName || 'Unnamed Audit',
      entries: state.entries,
      analysis: {
        totalMinutes: analysis.totalMinutes,
        totalHours: analysis.totalHours,
        byCategory: analysis.byCategory,
        meetingDensity: analysis.meetingDensity,
      },
      insights: insights.map(i => i.message),
      recommendations,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attention-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.entries, state.currentAuditName, analysis, insights, recommendations]);

  // Save named audit
  const saveAudit = useCallback(() => {
    const name = state.currentAuditName.trim() || `Audit ${new Date().toLocaleDateString()}`;
    const audit: SavedAudit = {
      id: generateId(),
      name,
      entries: state.entries,
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      savedAudits: [...prev.savedAudits, audit],
      currentAuditName: '',
    }));
  }, [state.currentAuditName, state.entries]);

  // Load saved audit
  const loadAudit = useCallback((audit: SavedAudit) => {
    setState(prev => ({
      ...prev,
      entries: audit.entries,
      currentAuditName: audit.name,
    }));
  }, []);

  // Delete saved audit
  const deleteAudit = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      savedAudits: prev.savedAudits.filter(a => a.id !== id),
    }));
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      entries: [],
      pasteContent: '',
      currentAuditName: '',
      internalNotes: '',
    }));
  }, []);

  // Copy handler
  const handleCopy = useCallback(async (text: string, type: string) => {
    await copyToClipboard(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Panel - Input */}
      <div className="lg:col-span-4 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Add Time Entries</CardTitle>
              <div className="flex gap-1">
                <button
                  onClick={() => setInputMode('structured')}
                  className={cn(
                    'px-2 py-1 text-xs rounded transition-colors',
                    inputMode === 'structured'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  Form
                </button>
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
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {inputMode === 'structured' ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newEntry.date}
                      onChange={e => setNewEntry(n => ({ ...n, date: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Duration (min)</label>
                    <input
                      type="number"
                      value={newEntry.duration}
                      onChange={e => setNewEntry(n => ({ ...n, duration: parseInt(e.target.value) || 0 }))}
                      min={1}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Meeting / Activity</label>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={e => setNewEntry(n => ({ ...n, title: e.target.value }))}
                    placeholder="e.g., Q4 Planning Session"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newEntry.category}
                    onChange={e => setNewEntry(n => ({ ...n, category: e.target.value as Category }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <input
                    type="text"
                    value={newEntry.notes}
                    onChange={e => setNewEntry(n => ({ ...n, notes: e.target.value }))}
                    placeholder="Quick context..."
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <Button variant="primary" size="sm" onClick={addEntry} className="w-full">
                  Add Entry
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Paste Data (Title | Duration | Category)
                  </label>
                  <textarea
                    value={state.pasteContent}
                    onChange={e => setState(s => ({ ...s, pasteContent: e.target.value }))}
                    placeholder={`Board Prep | 60 | strategy\nTeam 1:1 | 30 | people\nExpense Review | 15 | admin`}
                    rows={6}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 font-mono"
                  />
                </div>
                <Button variant="primary" size="sm" onClick={parsePaste} className="w-full">
                  Parse & Add Entries
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Entries List */}
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Entries</CardTitle>
              <Badge variant="primary">{state.entries.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {state.entries.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No entries yet</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {state.entries.map(entry => {
                  const cat = CATEGORIES.find(c => c.id === entry.category);
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{entry.title}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{entry.duration}m</span>
                          <span className={cn('px-1.5 py-0.5 rounded text-white text-xs', cat?.color)}>
                            {cat?.label}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="ml-2 text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Audits */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Saved Audits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={state.currentAuditName}
                onChange={e => setState(s => ({ ...s, currentAuditName: e.target.value }))}
                placeholder="Audit name..."
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={saveAudit}
                disabled={state.entries.length === 0}
              >
                Save
              </Button>
            </div>
            {state.savedAudits.length > 0 && (
              <div className="space-y-1">
                {state.savedAudits.map(audit => (
                  <div key={audit.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <button
                      onClick={() => loadAudit(audit)}
                      className="text-left flex-1 hover:text-primary-600"
                    >
                      {audit.name}
                    </button>
                    <button
                      onClick={() => deleteAudit(audit.id)}
                      className="text-gray-400 hover:text-red-500 ml-2"
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

        <Button variant="outline" onClick={clearAll} className="w-full">
          Clear All
        </Button>
      </div>

      {/* Center Panel - Analysis */}
      <div className="lg:col-span-4 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary-600">{analysis.totalHours}h</div>
                <div className="text-xs text-gray-500">Total Time</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary-600">{analysis.entryCount}</div>
                <div className="text-xs text-gray-500">Entries</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary-600">{analysis.uniqueDays}</div>
                <div className="text-xs text-gray-500">Days</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary-600">{analysis.meetingDensity}</div>
                <div className="text-xs text-gray-500">Per Day</div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Time by Category</h4>
              <div className="space-y-2">
                {analysis.byCategory.map(cat => (
                  <div key={cat.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{cat.label}</span>
                      <span className="text-gray-500">
                        {Math.round(cat.minutes / 60 * 10) / 10}h ({cat.percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full transition-all', cat.color)}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 3 */}
            {analysis.top3.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Top Categories</h4>
                <div className="flex gap-2">
                  {analysis.top3.map((cat, i) => (
                    <div
                      key={cat.id}
                      className={cn(
                        'flex-1 p-2 rounded text-center text-white text-sm',
                        cat.color
                      )}
                    >
                      <div className="font-bold">#{i + 1}</div>
                      <div className="text-xs opacity-90">{cat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visual Breakdown */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Visual Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.totalMinutes === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Add entries to see the breakdown
              </p>
            ) : (
              <div className="space-y-4">
                {/* Stacked bar */}
                <div className="h-8 flex rounded-lg overflow-hidden">
                  {analysis.byCategory
                    .filter(c => c.percentage > 0)
                    .map(cat => (
                      <div
                        key={cat.id}
                        className={cn('flex items-center justify-center text-xs text-white font-medium', cat.color)}
                        style={{ width: `${cat.percentage}%` }}
                        title={`${cat.label}: ${cat.percentage.toFixed(0)}%`}
                      >
                        {cat.percentage >= 10 && `${cat.percentage.toFixed(0)}%`}
                      </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-2">
                  {analysis.byCategory
                    .filter(c => c.percentage > 0)
                    .map(cat => (
                      <div key={cat.id} className="flex items-center gap-1 text-xs">
                        <div className={cn('w-3 h-3 rounded', cat.color)} />
                        <span>{cat.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Insights & Export */}
      <div className="lg:col-span-4 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-3 rounded-lg text-sm',
                    insight.type === 'warning' && 'bg-amber-50 text-amber-800 border border-amber-200',
                    insight.type === 'success' && 'bg-green-50 text-green-800 border border-green-200',
                    insight.type === 'info' && 'bg-blue-50 text-blue-800 border border-blue-200'
                  )}
                >
                  {insight.message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.length === 0 ? (
              <p className="text-sm text-gray-500">Add entries to see recommendations.</p>
            ) : (
              <ul className="space-y-2">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-primary-500 mt-0.5">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* EA Internal Notes */}
        <Card variant="bordered" className="border-amber-300 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">EA Internal Notes</CardTitle>
              <Badge variant="warning" size="sm">Private</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              value={state.internalNotes}
              onChange={e => setState(s => ({ ...s, internalNotes: e.target.value }))}
              placeholder="Your private observations and action items..."
              rows={3}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 bg-white resize-none"
            />
          </CardContent>
        </Card>

        {/* Export Actions */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleCopy(executiveSummary, 'exec')}
              disabled={!executiveSummary}
              className="w-full"
            >
              {copied === 'exec' ? 'Copied!' : 'Copy Executive Summary'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(htmlSummary, 'html')}
              disabled={!htmlSummary}
              className="w-full"
            >
              {copied === 'html' ? 'Copied!' : 'Copy as HTML'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(eaInternalSummary, 'ea')}
              disabled={!eaInternalSummary}
              className="w-full"
            >
              {copied === 'ea' ? 'Copied!' : 'Copy EA Internal'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={exportJson}
              disabled={state.entries.length === 0}
              className="w-full"
            >
              Export JSON
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
