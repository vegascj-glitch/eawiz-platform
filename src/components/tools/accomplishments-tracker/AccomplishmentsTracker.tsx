'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, copyToClipboard } from '@/lib/utils';

// Types
type ImpactType = 'time-saved' | 'cost-saved' | 'revenue' | 'risk-reduced' | 'relationship' | 'process' | 'quality' | 'culture';
type Beneficiary = 'exec' | 'team' | 'client' | 'vendor' | 'org';
type Scope = 'local' | 'regional' | 'global';
type Confidentiality = 'public' | 'internal' | 'sensitive';
type MetricUnit = 'hours' | 'dollars' | 'percent' | 'count' | 'days' | 'weeks' | 'other';
type MetricTimeframe = 'one-time' | 'per-week' | 'per-month' | 'per-year';
type OutputStyle = 'metrics-first' | 'action-first' | 'star-mini';
type Grouping = 'category' | 'month' | 'impact';

interface EvidenceLink {
  url: string;
  label: string;
}

interface Accomplishment {
  id: string;
  title: string;
  date: string;
  reviewPeriod: string;
  category: string;
  impactType: ImpactType;
  metricValue: number | null;
  metricUnit: MetricUnit;
  metricTimeframe: MetricTimeframe;
  beneficiary: Beneficiary;
  scope: Scope;
  evidenceLinks: EvidenceLink[];
  attachmentNote: string;
  tags: string[];
  confidentiality: Confidentiality;
  situation: string;
  task: string;
  action: string;
  result: string;
  notes: string;
  createdAt: string;
}

interface SavedTemplate {
  id: string;
  name: string;
  categories: string[];
  dateFrom: string;
  dateTo: string;
  grouping: Grouping;
  outputStyle: OutputStyle;
  includeMetrics: boolean;
  includeLinks: boolean;
  includeStar: boolean;
  includeSensitive: boolean;
  maxBullets: number;
}

interface TrackerState {
  accomplishments: Accomplishment[];
  categories: string[];
  templates: SavedTemplate[];
  // Filters
  searchQuery: string;
  filterCategory: string;
  filterImpactType: string;
  filterConfidentiality: string;
  filterHasMetrics: string;
  filterDateFrom: string;
  filterDateTo: string;
  // Output settings
  outputStyle: OutputStyle;
  grouping: Grouping;
  includeMetrics: boolean;
  includeLinks: boolean;
  includeStar: boolean;
  includeSensitive: boolean;
  maxBullets: number;
}

// Constants
const DEFAULT_CATEGORIES = [
  'Calendar & Time Optimization',
  'Travel & Logistics',
  'Stakeholder Management',
  'Process Automation',
  'Finance / Expenses',
  'Events & Offsites',
  'Communications & Comms Drafting',
  'Team Ops / PM',
  'Executive Support (General)',
  'Culture / Community',
];

const IMPACT_TYPES: { id: ImpactType; label: string }[] = [
  { id: 'time-saved', label: 'Time Saved' },
  { id: 'cost-saved', label: 'Cost Saved' },
  { id: 'revenue', label: 'Revenue Enabled' },
  { id: 'risk-reduced', label: 'Risk Reduced' },
  { id: 'relationship', label: 'Relationship' },
  { id: 'process', label: 'Process Improvement' },
  { id: 'quality', label: 'Quality' },
  { id: 'culture', label: 'Culture' },
];

const BENEFICIARIES: { id: Beneficiary; label: string }[] = [
  { id: 'exec', label: 'Executive' },
  { id: 'team', label: 'Team' },
  { id: 'client', label: 'Client' },
  { id: 'vendor', label: 'Vendor' },
  { id: 'org', label: 'Organization' },
];

const SCOPES: { id: Scope; label: string }[] = [
  { id: 'local', label: 'Local' },
  { id: 'regional', label: 'Regional' },
  { id: 'global', label: 'Global' },
];

const CONFIDENTIALITIES: { id: Confidentiality; label: string }[] = [
  { id: 'public', label: 'Public' },
  { id: 'internal', label: 'Internal' },
  { id: 'sensitive', label: 'Sensitive' },
];

const METRIC_UNITS: { id: MetricUnit; label: string }[] = [
  { id: 'hours', label: 'Hours' },
  { id: 'dollars', label: 'Dollars ($)' },
  { id: 'percent', label: 'Percent (%)' },
  { id: 'count', label: 'Count' },
  { id: 'days', label: 'Days' },
  { id: 'weeks', label: 'Weeks' },
  { id: 'other', label: 'Other' },
];

const METRIC_TIMEFRAMES: { id: MetricTimeframe; label: string }[] = [
  { id: 'one-time', label: 'One-time' },
  { id: 'per-week', label: 'Per Week' },
  { id: 'per-month', label: 'Per Month' },
  { id: 'per-year', label: 'Per Year' },
];

const STORAGE_KEY = 'eawiz_accomplishments_v1';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getDefaultDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getReviewPeriod(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T12:00:00');
  const year = date.getFullYear();
  const month = date.getMonth();
  if (month < 6) return `H1 ${year}`;
  return `H2 ${year}`;
}

function formatMetric(value: number | null, unit: MetricUnit, timeframe: MetricTimeframe): string {
  if (value === null) return '';
  let str = '';
  if (unit === 'dollars') str = `$${value.toLocaleString()}`;
  else if (unit === 'percent') str = `${value}%`;
  else if (unit === 'hours') str = `${value} hour${value !== 1 ? 's' : ''}`;
  else if (unit === 'days') str = `${value} day${value !== 1 ? 's' : ''}`;
  else if (unit === 'weeks') str = `${value} week${value !== 1 ? 's' : ''}`;
  else str = `${value}`;

  if (timeframe !== 'one-time') {
    const tfLabel = timeframe === 'per-week' ? '/week' : timeframe === 'per-month' ? '/month' : '/year';
    str += tfLabel;
  }
  return str;
}

function createEmptyAccomplishment(): Accomplishment {
  return {
    id: generateId(),
    title: '',
    date: getDefaultDate(),
    reviewPeriod: getReviewPeriod(getDefaultDate()),
    category: DEFAULT_CATEGORIES[0],
    impactType: 'process',
    metricValue: null,
    metricUnit: 'hours',
    metricTimeframe: 'one-time',
    beneficiary: 'exec',
    scope: 'local',
    evidenceLinks: [],
    attachmentNote: '',
    tags: [],
    confidentiality: 'internal',
    situation: '',
    task: '',
    action: '',
    result: '',
    notes: '',
    createdAt: new Date().toISOString(),
  };
}

export function AccomplishmentsTracker() {
  const [state, setState] = useState<TrackerState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
          };
        } catch {}
      }
    }
    return {
      accomplishments: [],
      categories: DEFAULT_CATEGORIES,
      templates: [],
      searchQuery: '',
      filterCategory: '',
      filterImpactType: '',
      filterConfidentiality: '',
      filterHasMetrics: '',
      filterDateFrom: '',
      filterDateTo: '',
      outputStyle: 'metrics-first',
      grouping: 'category',
      includeMetrics: true,
      includeLinks: false,
      includeStar: false,
      includeSensitive: false,
      maxBullets: 10,
    };
  });

  const [editingAccomplishment, setEditingAccomplishment] = useState<Accomplishment | null>(null);
  const [showExpanded, setShowExpanded] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ index: number; value: string } | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Filtered accomplishments
  const filteredAccomplishments = useMemo(() => {
    return state.accomplishments.filter(a => {
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        if (!a.title.toLowerCase().includes(q) && !a.notes.toLowerCase().includes(q) && !a.tags.some(t => t.toLowerCase().includes(q))) {
          return false;
        }
      }
      if (state.filterCategory && a.category !== state.filterCategory) return false;
      if (state.filterImpactType && a.impactType !== state.filterImpactType) return false;
      if (state.filterConfidentiality && a.confidentiality !== state.filterConfidentiality) return false;
      if (state.filterHasMetrics === 'yes' && a.metricValue === null) return false;
      if (state.filterHasMetrics === 'no' && a.metricValue !== null) return false;
      if (state.filterDateFrom && a.date < state.filterDateFrom) return false;
      if (state.filterDateTo && a.date > state.filterDateTo) return false;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [state]);

  // Output accomplishments (respects sensitive filter)
  const outputAccomplishments = useMemo(() => {
    let items = filteredAccomplishments;
    if (!state.includeSensitive) {
      items = items.filter(a => a.confidentiality !== 'sensitive');
    }
    return items.slice(0, state.maxBullets);
  }, [filteredAccomplishments, state.includeSensitive, state.maxBullets]);

  // Save accomplishment
  const saveAccomplishment = useCallback((acc: Accomplishment) => {
    acc.reviewPeriod = getReviewPeriod(acc.date);
    setState(prev => ({
      ...prev,
      accomplishments: prev.accomplishments.find(a => a.id === acc.id)
        ? prev.accomplishments.map(a => a.id === acc.id ? acc : a)
        : [...prev.accomplishments, acc],
    }));
    setEditingAccomplishment(null);
    setShowExpanded(false);
  }, []);

  // Delete accomplishment
  const deleteAccomplishment = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      accomplishments: prev.accomplishments.filter(a => a.id !== id),
    }));
  }, []);

  // Category management
  const addCategory = useCallback(() => {
    if (!newCategory.trim() || state.categories.includes(newCategory.trim())) return;
    setState(prev => ({ ...prev, categories: [...prev.categories, newCategory.trim()] }));
    setNewCategory('');
  }, [newCategory, state.categories]);

  const updateCategory = useCallback((index: number, value: string) => {
    if (!value.trim()) return;
    setState(prev => {
      const oldCat = prev.categories[index];
      const newCategories = [...prev.categories];
      newCategories[index] = value.trim();
      const updatedAccomplishments = prev.accomplishments.map(a =>
        a.category === oldCat ? { ...a, category: value.trim() } : a
      );
      return { ...prev, categories: newCategories, accomplishments: updatedAccomplishments };
    });
    setEditingCategory(null);
  }, []);

  const deleteCategory = useCallback((index: number) => {
    setState(prev => {
      const newCategories = prev.categories.filter((_, i) => i !== index);
      return { ...prev, categories: newCategories };
    });
  }, []);

  // Template management
  const saveTemplate = useCallback(() => {
    if (!templateName.trim()) return;
    const template: SavedTemplate = {
      id: generateId(),
      name: templateName.trim(),
      categories: state.filterCategory ? [state.filterCategory] : [],
      dateFrom: state.filterDateFrom,
      dateTo: state.filterDateTo,
      grouping: state.grouping,
      outputStyle: state.outputStyle,
      includeMetrics: state.includeMetrics,
      includeLinks: state.includeLinks,
      includeStar: state.includeStar,
      includeSensitive: state.includeSensitive,
      maxBullets: state.maxBullets,
    };
    setState(prev => ({ ...prev, templates: [...prev.templates, template] }));
    setTemplateName('');
  }, [templateName, state]);

  const loadTemplate = useCallback((template: SavedTemplate) => {
    setState(prev => ({
      ...prev,
      filterCategory: template.categories[0] || '',
      filterDateFrom: template.dateFrom,
      filterDateTo: template.dateTo,
      grouping: template.grouping,
      outputStyle: template.outputStyle,
      includeMetrics: template.includeMetrics,
      includeLinks: template.includeLinks,
      includeStar: template.includeStar,
      includeSensitive: template.includeSensitive,
      maxBullets: template.maxBullets,
    }));
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setState(prev => ({ ...prev, templates: prev.templates.filter(t => t.id !== id) }));
  }, []);

  // Generate bullet
  const generateBullet = useCallback((a: Accomplishment, style: OutputStyle): string => {
    const metric = formatMetric(a.metricValue, a.metricUnit, a.metricTimeframe);
    const impactLabel = IMPACT_TYPES.find(i => i.id === a.impactType)?.label || '';

    if (style === 'metrics-first' && metric) {
      return `${metric} ${impactLabel.toLowerCase()} by ${a.title.toLowerCase()}.`;
    } else if (style === 'action-first') {
      let bullet = a.title;
      if (metric) bullet += `, resulting in ${metric} ${impactLabel.toLowerCase()}`;
      return bullet + '.';
    } else if (style === 'star-mini') {
      const parts = [];
      if (a.situation) parts.push(a.situation);
      if (a.action) parts.push(a.action);
      if (a.result || metric) parts.push(a.result || `Achieved ${metric}`);
      return parts.join(' → ') || a.title;
    }
    return a.title;
  }, []);

  // Generate bullets output
  const bulletsOutput = useMemo(() => {
    if (outputAccomplishments.length === 0) return '';

    const lines: string[] = [];
    const grouped: Record<string, Accomplishment[]> = {};

    outputAccomplishments.forEach(a => {
      let key = '';
      if (state.grouping === 'category') key = a.category;
      else if (state.grouping === 'month') {
        const d = new Date(a.date + 'T12:00:00');
        key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      } else if (state.grouping === 'impact') key = IMPACT_TYPES.find(i => i.id === a.impactType)?.label || 'Other';

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(a);
    });

    Object.entries(grouped).forEach(([group, items]) => {
      lines.push(`${group.toUpperCase()}`);
      items.forEach(a => {
        const bullet = generateBullet(a, state.outputStyle);
        lines.push(`• ${bullet}`);
        if (state.includeLinks && a.evidenceLinks.length > 0) {
          a.evidenceLinks.forEach(link => lines.push(`  - ${link.label}: ${link.url}`));
        }
        if (state.includeStar && (a.situation || a.task || a.action || a.result)) {
          if (a.situation) lines.push(`  S: ${a.situation}`);
          if (a.task) lines.push(`  T: ${a.task}`);
          if (a.action) lines.push(`  A: ${a.action}`);
          if (a.result) lines.push(`  R: ${a.result}`);
        }
      });
      lines.push('');
    });

    return lines.join('\n').trim();
  }, [outputAccomplishments, state.grouping, state.outputStyle, state.includeLinks, state.includeStar, generateBullet]);

  // Generate narrative output
  const narrativeOutput = useMemo(() => {
    if (outputAccomplishments.length === 0) return '';

    const lines: string[] = [];
    const dateRange = state.filterDateFrom && state.filterDateTo
      ? `from ${state.filterDateFrom} to ${state.filterDateTo}`
      : 'this review period';

    lines.push(`During ${dateRange}, I focused on delivering measurable impact across several key areas.`);
    lines.push('');

    // Top categories
    const catCounts: Record<string, number> = {};
    outputAccomplishments.forEach(a => {
      catCounts[a.category] = (catCounts[a.category] || 0) + 1;
    });
    const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (topCats.length > 0) {
      lines.push(`Key themes included ${topCats.map(([cat]) => cat).join(', ')}.`);
    }

    // Quantified highlights
    const withMetrics = outputAccomplishments.filter(a => a.metricValue !== null);
    if (withMetrics.length > 0) {
      lines.push('');
      lines.push('Quantified highlights:');
      withMetrics.slice(0, 5).forEach(a => {
        const metric = formatMetric(a.metricValue, a.metricUnit, a.metricTimeframe);
        lines.push(`• ${a.title}: ${metric}`);
      });
    }

    lines.push('');
    lines.push(`In total, I documented ${outputAccomplishments.length} accomplishments that supported executive effectiveness, team operations, and organizational goals.`);

    return lines.join('\n');
  }, [outputAccomplishments, state.filterDateFrom, state.filterDateTo]);

  // Generate brag doc output
  const bragDocOutput = useMemo(() => {
    if (outputAccomplishments.length === 0) return '';

    const lines: string[] = [];
    lines.push('BRAG DOC');
    lines.push('═'.repeat(40));
    lines.push('');

    const grouped: Record<string, Accomplishment[]> = {};
    outputAccomplishments.forEach(a => {
      const d = new Date(a.date + 'T12:00:00');
      const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(a);
    });

    Object.entries(grouped).forEach(([month, items]) => {
      lines.push(`─── ${month} ───`);
      items.forEach(a => {
        lines.push(`• ${a.title}`);
        lines.push(`  Category: ${a.category}`);
        if (a.metricValue !== null) {
          lines.push(`  Impact: ${formatMetric(a.metricValue, a.metricUnit, a.metricTimeframe)}`);
        }
        if (a.evidenceLinks.length > 0) {
          a.evidenceLinks.forEach(link => lines.push(`  Link: ${link.url}`));
        }
        if (a.notes) lines.push(`  Notes: ${a.notes}`);
        lines.push('');
      });
    });

    return lines.join('\n').trim();
  }, [outputAccomplishments]);

  // Copy handler
  const handleCopy = useCallback(async (text: string, type: string) => {
    await copyToClipboard(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  // Export JSON
  const exportJson = useCallback(() => {
    const data = {
      accomplishments: state.accomplishments,
      categories: state.categories,
      templates: state.templates,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accomplishments-${new Date().toISOString().split('T')[0]}.json`;
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
        setState(prev => ({
          ...prev,
          accomplishments: data.accomplishments || prev.accomplishments,
          categories: data.categories || prev.categories,
          templates: data.templates || prev.templates,
        }));
      } catch {}
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  // Reset
  const resetData = useCallback(() => {
    if (confirm('This will clear all accomplishments. Are you sure?')) {
      setState(prev => ({
        ...prev,
        accomplishments: [],
        templates: [],
      }));
    }
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchQuery: '',
      filterCategory: '',
      filterImpactType: '',
      filterConfidentiality: '',
      filterHasMetrics: '',
      filterDateFrom: '',
      filterDateTo: '',
    }));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Panel - Filters & Settings */}
      <div className="lg:col-span-3 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="text"
              value={state.searchQuery}
              onChange={e => setState(s => ({ ...s, searchQuery: e.target.value }))}
              placeholder="Search..."
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input type="date" value={state.filterDateFrom} onChange={e => setState(s => ({ ...s, filterDateFrom: e.target.value }))} className="px-2 py-1.5 border border-gray-300 rounded text-xs" placeholder="From" />
              <input type="date" value={state.filterDateTo} onChange={e => setState(s => ({ ...s, filterDateTo: e.target.value }))} className="px-2 py-1.5 border border-gray-300 rounded text-xs" placeholder="To" />
            </div>
            <select value={state.filterCategory} onChange={e => setState(s => ({ ...s, filterCategory: e.target.value }))} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
              <option value="">All Categories</option>
              {state.categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={state.filterImpactType} onChange={e => setState(s => ({ ...s, filterImpactType: e.target.value }))} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
              <option value="">All Impact Types</option>
              {IMPACT_TYPES.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
            </select>
            <select value={state.filterConfidentiality} onChange={e => setState(s => ({ ...s, filterConfidentiality: e.target.value }))} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
              <option value="">All Confidentiality</option>
              {CONFIDENTIALITIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <select value={state.filterHasMetrics} onChange={e => setState(s => ({ ...s, filterHasMetrics: e.target.value }))} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
              <option value="">Has Metrics?</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">Clear Filters</Button>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="max-h-40 overflow-y-auto space-y-1">
              {state.categories.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-1 text-sm">
                  {editingCategory?.index === idx ? (
                    <input
                      type="text"
                      value={editingCategory.value}
                      onChange={e => setEditingCategory({ index: idx, value: e.target.value })}
                      onBlur={() => updateCategory(idx, editingCategory.value)}
                      onKeyDown={e => e.key === 'Enter' && updateCategory(idx, editingCategory.value)}
                      className="flex-1 px-1 py-0.5 border rounded text-xs"
                      autoFocus
                    />
                  ) : (
                    <>
                      <span className="flex-1 truncate">{cat}</span>
                      <button onClick={() => setEditingCategory({ index: idx, value: cat })} className="text-gray-400 hover:text-primary-600 text-xs">✎</button>
                      <button onClick={() => deleteCategory(idx)} className="text-gray-400 hover:text-red-500 text-xs">×</button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category" className="flex-1 px-2 py-1 border rounded text-xs" onKeyDown={e => e.key === 'Enter' && addCategory()} />
              <Button variant="ghost" size="sm" onClick={addCategory}>+</Button>
            </div>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {state.templates.length > 0 && (
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {state.templates.map(t => (
                  <div key={t.id} className="flex items-center justify-between text-sm">
                    <button onClick={() => loadTemplate(t)} className="text-left hover:text-primary-600 truncate flex-1">{t.name}</button>
                    <button onClick={() => deleteTemplate(t.id)} className="text-gray-400 hover:text-red-500">×</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-1">
              <input type="text" value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Template name" className="flex-1 px-2 py-1 border rounded text-xs" />
              <Button variant="ghost" size="sm" onClick={saveTemplate}>Save</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Center Panel - Accomplishments */}
      <div className="lg:col-span-5 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Accomplishments</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="primary">{filteredAccomplishments.length}</Badge>
                <Button variant="primary" size="sm" onClick={() => { setEditingAccomplishment(createEmptyAccomplishment()); setShowExpanded(false); }}>+ Add</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {editingAccomplishment && (
              <div className="mb-4 p-3 border rounded-lg bg-gray-50 space-y-3">
                <input
                  type="text"
                  value={editingAccomplishment.title}
                  onChange={e => setEditingAccomplishment({ ...editingAccomplishment, title: e.target.value })}
                  placeholder="Accomplishment title"
                  className="w-full px-2 py-1.5 border rounded text-sm font-medium"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input type="date" value={editingAccomplishment.date} onChange={e => setEditingAccomplishment({ ...editingAccomplishment, date: e.target.value })} className="px-2 py-1.5 border rounded text-sm" />
                  <select value={editingAccomplishment.category} onChange={e => setEditingAccomplishment({ ...editingAccomplishment, category: e.target.value })} className="px-2 py-1.5 border rounded text-sm">
                    {state.categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={editingAccomplishment.impactType} onChange={e => setEditingAccomplishment({ ...editingAccomplishment, impactType: e.target.value as ImpactType })} className="px-2 py-1.5 border rounded text-sm">
                    {IMPACT_TYPES.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={editingAccomplishment.metricValue ?? ''}
                    onChange={e => setEditingAccomplishment({ ...editingAccomplishment, metricValue: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="Value"
                    className="px-2 py-1.5 border rounded text-sm"
                  />
                  <select value={editingAccomplishment.metricUnit} onChange={e => setEditingAccomplishment({ ...editingAccomplishment, metricUnit: e.target.value as MetricUnit })} className="px-2 py-1.5 border rounded text-sm">
                    {METRIC_UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                  </select>
                  <select value={editingAccomplishment.metricTimeframe} onChange={e => setEditingAccomplishment({ ...editingAccomplishment, metricTimeframe: e.target.value as MetricTimeframe })} className="px-2 py-1.5 border rounded text-sm">
                    {METRIC_TIMEFRAMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>

                <button onClick={() => setShowExpanded(!showExpanded)} className="text-xs text-primary-600 hover:underline">
                  {showExpanded ? '− Hide details' : '+ Show details'}
                </button>

                {showExpanded && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="grid grid-cols-3 gap-2">
                      <select value={editingAccomplishment.beneficiary} onChange={e => setEditingAccomplishment({ ...editingAccomplishment, beneficiary: e.target.value as Beneficiary })} className="px-2 py-1.5 border rounded text-sm">
                        {BENEFICIARIES.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                      </select>
                      <select value={editingAccomplishment.scope} onChange={e => setEditingAccomplishment({ ...editingAccomplishment, scope: e.target.value as Scope })} className="px-2 py-1.5 border rounded text-sm">
                        {SCOPES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                      <select value={editingAccomplishment.confidentiality} onChange={e => setEditingAccomplishment({ ...editingAccomplishment, confidentiality: e.target.value as Confidentiality })} className="px-2 py-1.5 border rounded text-sm">
                        {CONFIDENTIALITIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-700">STAR (Optional)</div>
                      <input type="text" value={editingAccomplishment.situation} onChange={e => setEditingAccomplishment({ ...editingAccomplishment, situation: e.target.value })} placeholder="Situation" className="w-full px-2 py-1 border rounded text-sm" />
                      <input type="text" value={editingAccomplishment.task} onChange={e => setEditingAccomplishment({ ...editingAccomplishment, task: e.target.value })} placeholder="Task" className="w-full px-2 py-1 border rounded text-sm" />
                      <input type="text" value={editingAccomplishment.action} onChange={e => setEditingAccomplishment({ ...editingAccomplishment, action: e.target.value })} placeholder="Action" className="w-full px-2 py-1 border rounded text-sm" />
                      <input type="text" value={editingAccomplishment.result} onChange={e => setEditingAccomplishment({ ...editingAccomplishment, result: e.target.value })} placeholder="Result" className="w-full px-2 py-1 border rounded text-sm" />
                    </div>

                    <textarea
                      value={editingAccomplishment.notes}
                      onChange={e => setEditingAccomplishment({ ...editingAccomplishment, notes: e.target.value })}
                      placeholder="Additional notes..."
                      rows={2}
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />

                    <input
                      type="text"
                      value={editingAccomplishment.tags.join(', ')}
                      onChange={e => setEditingAccomplishment({ ...editingAccomplishment, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                      placeholder="Tags (comma-separated)"
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => saveAccomplishment(editingAccomplishment)}>Save</Button>
                  <Button variant="ghost" size="sm" onClick={() => { setEditingAccomplishment(null); setShowExpanded(false); }}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredAccomplishments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No accomplishments yet. Click &quot;+ Add&quot; to start tracking!</p>
              ) : (
                filteredAccomplishments.map(a => (
                  <div key={a.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{a.title}</div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{a.date}</span>
                          <Badge variant="default" size="sm">{a.category}</Badge>
                          {a.metricValue !== null && (
                            <Badge variant="success" size="sm">{formatMetric(a.metricValue, a.metricUnit, a.metricTimeframe)}</Badge>
                          )}
                          {a.confidentiality === 'sensitive' && (
                            <Badge variant="warning" size="sm">Sensitive</Badge>
                          )}
                        </div>
                        {a.notes && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{a.notes}</p>}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button onClick={() => { setEditingAccomplishment(a); setShowExpanded(true); }} className="text-gray-400 hover:text-primary-600">✎</button>
                        <button onClick={() => deleteAccomplishment(a.id)} className="text-gray-400 hover:text-red-500">×</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Output */}
      <div className="lg:col-span-4 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Output Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Style</label>
              <select value={state.outputStyle} onChange={e => setState(s => ({ ...s, outputStyle: e.target.value as OutputStyle }))} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                <option value="metrics-first">Metrics-first</option>
                <option value="action-first">Action-first</option>
                <option value="star-mini">STAR Mini</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Group by</label>
              <select value={state.grouping} onChange={e => setState(s => ({ ...s, grouping: e.target.value as Grouping }))} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                <option value="category">Category</option>
                <option value="month">Month</option>
                <option value="impact">Impact Type</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max bullets: {state.maxBullets}</label>
              <input type="range" min="5" max="50" value={state.maxBullets} onChange={e => setState(s => ({ ...s, maxBullets: parseInt(e.target.value) }))} className="w-full" />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={state.includeMetrics} onChange={e => setState(s => ({ ...s, includeMetrics: e.target.checked }))} className="rounded" />
                Include metrics
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={state.includeLinks} onChange={e => setState(s => ({ ...s, includeLinks: e.target.checked }))} className="rounded" />
                Include evidence links
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={state.includeStar} onChange={e => setState(s => ({ ...s, includeStar: e.target.checked }))} className="rounded" />
                Include STAR details
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer text-amber-700">
                <input type="checkbox" checked={state.includeSensitive} onChange={e => setState(s => ({ ...s, includeSensitive: e.target.checked }))} className="rounded border-amber-400" />
                Include sensitive items
              </label>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-3">
              <button className={cn('px-2 py-1 text-xs rounded', 'bg-primary-100 text-primary-700')}>Bullets</button>
            </div>
            <div className="p-3 bg-gray-50 rounded text-sm text-gray-800 whitespace-pre-wrap min-h-[200px] max-h-[300px] overflow-y-auto font-mono">
              {bulletsOutput || 'Add accomplishments and apply filters to generate output...'}
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="primary" size="sm" onClick={() => handleCopy(bulletsOutput, 'bullets')} disabled={!bulletsOutput} className="w-full">
              {copied === 'bullets' ? 'Copied!' : 'Copy Bullets'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleCopy(narrativeOutput, 'narrative')} disabled={!narrativeOutput} className="w-full">
              {copied === 'narrative' ? 'Copied!' : 'Copy Narrative'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleCopy(bragDocOutput, 'brag')} disabled={!bragDocOutput} className="w-full">
              {copied === 'brag' ? 'Copied!' : 'Copy Brag Doc'}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={exportJson}>Export JSON</Button>
              <label className="cursor-pointer">
                <Button variant="secondary" size="sm" className="w-full pointer-events-none">Import JSON</Button>
                <input type="file" accept=".json" onChange={importJson} className="hidden" />
              </label>
            </div>
            <Button variant="ghost" size="sm" onClick={resetData} className="w-full text-red-600">Reset All Data</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
