'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Types
type ImpactCategory = 'strategic' | 'operational' | 'communication' | 'project' | 'administrative' | 'relationship' | 'other';
type ImpactType = 'time-saved' | 'cost-avoided' | 'risk-reduced' | 'process-improved' | 'stakeholder-enabled' | 'initiative-delivered' | 'other';
type Confidentiality = 'public' | 'internal' | 'sensitive';
type ReportPeriod = 'monthly' | 'quarterly' | 'annual' | 'custom';
type Audience = 'executive' | 'leadership' | 'hr';
type Tone = 'executive-summary' | 'performance-review' | 'board-ready';

interface ImpactRecord {
  id: string;
  date: string;
  category: ImpactCategory;
  impactType: ImpactType;
  metricValue: string;
  metricUnit: string;
  description: string;
  beneficiary: string;
  confidentiality: Confidentiality;
}

interface ReportSection {
  id: string;
  name: string;
  enabled: boolean;
  notes: string;
  order: number;
}

interface ReportConfig {
  title: string;
  executives: string;
  period: ReportPeriod;
  customStartDate: string;
  customEndDate: string;
  audience: Audience;
  tone: Tone;
}

interface SavedReport {
  id: string;
  name: string;
  config: ReportConfig;
  records: ImpactRecord[];
  sections: ReportSection[];
  savedAt: string;
}

const CATEGORIES: { value: ImpactCategory; label: string }[] = [
  { value: 'strategic', label: 'Strategic' },
  { value: 'operational', label: 'Operational' },
  { value: 'communication', label: 'Communication' },
  { value: 'project', label: 'Project Management' },
  { value: 'administrative', label: 'Administrative' },
  { value: 'relationship', label: 'Relationship Management' },
  { value: 'other', label: 'Other' },
];

const IMPACT_TYPES: { value: ImpactType; label: string }[] = [
  { value: 'time-saved', label: 'Time Saved' },
  { value: 'cost-avoided', label: 'Cost Avoided' },
  { value: 'risk-reduced', label: 'Risk Reduced' },
  { value: 'process-improved', label: 'Process Improved' },
  { value: 'stakeholder-enabled', label: 'Stakeholder Enabled' },
  { value: 'initiative-delivered', label: 'Initiative Delivered' },
  { value: 'other', label: 'Other' },
];

const DEFAULT_SECTIONS: Omit<ReportSection, 'order'>[] = [
  { id: 'executive-summary', name: 'Executive Summary', enabled: true, notes: '' },
  { id: 'key-metrics', name: 'Key Metrics & Quantified Impact', enabled: true, notes: '' },
  { id: 'strategic', name: 'Strategic Contributions', enabled: true, notes: '' },
  { id: 'operational', name: 'Operational Excellence', enabled: true, notes: '' },
  { id: 'risk', name: 'Risk Reduction & Continuity', enabled: true, notes: '' },
  { id: 'stakeholder', name: 'Stakeholder Enablement', enabled: true, notes: '' },
  { id: 'process', name: 'Process Improvements & Automation', enabled: true, notes: '' },
  { id: 'highlights', name: 'Highlights & Wins', enabled: true, notes: '' },
  { id: 'challenges', name: 'Challenges & Learnings', enabled: false, notes: '' },
  { id: 'looking-ahead', name: 'Looking Ahead', enabled: false, notes: '' },
];

const STORAGE_KEY = 'eawiz_impact_reports_v1';
const ACCOMPLISHMENTS_KEY = 'eawiz-accomplishments-tracker';

export function EAImpactReport() {
  // Config state
  const [config, setConfig] = useState<ReportConfig>({
    title: 'EA Impact Report',
    executives: '',
    period: 'quarterly',
    customStartDate: '',
    customEndDate: '',
    audience: 'executive',
    tone: 'executive-summary',
  });

  // Data state
  const [records, setRecords] = useState<ImpactRecord[]>([]);
  const [sections, setSections] = useState<ReportSection[]>(
    DEFAULT_SECTIONS.map((s, i) => ({ ...s, order: i }))
  );
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<'manual' | 'import' | 'csv'>('manual');
  const [csvInput, setCsvInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);

  // New record form
  const [newRecord, setNewRecord] = useState<Omit<ImpactRecord, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    category: 'operational',
    impactType: 'initiative-delivered',
    metricValue: '',
    metricUnit: '',
    description: '',
    beneficiary: '',
    confidentiality: 'internal',
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.config) setConfig(data.config);
        if (data.records) setRecords(data.records);
        if (data.sections) setSections(data.sections);
        if (data.savedReports) setSavedReports(data.savedReports);
      } catch {
        // Invalid data
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      config,
      records,
      sections,
      savedReports,
    }));
  }, [config, records, sections, savedReports]);

  // Add new record
  const addRecord = () => {
    if (!newRecord.description.trim()) return;

    setRecords(prev => [...prev, {
      ...newRecord,
      id: `record-${Date.now()}`,
    }]);

    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      category: 'operational',
      impactType: 'initiative-delivered',
      metricValue: '',
      metricUnit: '',
      description: '',
      beneficiary: '',
      confidentiality: 'internal',
    });
  };

  // Delete record
  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  // Import from Accomplishments Tracker
  const importFromAccomplishments = () => {
    const saved = localStorage.getItem(ACCOMPLISHMENTS_KEY);
    if (!saved) {
      alert('No Accomplishments Tracker data found.');
      return;
    }

    try {
      const data = JSON.parse(saved);
      const accomplishments = data.accomplishments || [];

      const imported: ImpactRecord[] = accomplishments.map((a: {
        id: string;
        date: string;
        category: string;
        impactType: string;
        metric: string;
        description: string;
        confidentiality: string;
      }) => ({
        id: `imported-${a.id || Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: a.date || new Date().toISOString().split('T')[0],
        category: mapCategory(a.category),
        impactType: mapImpactType(a.impactType),
        metricValue: a.metric || '',
        metricUnit: '',
        description: a.description || '',
        beneficiary: '',
        confidentiality: (a.confidentiality as Confidentiality) || 'internal',
      }));

      setRecords(prev => [...prev, ...imported]);
      alert(`Imported ${imported.length} records from Accomplishments Tracker.`);
    } catch {
      alert('Failed to parse Accomplishments Tracker data.');
    }
  };

  // Parse CSV input
  const parseCSV = () => {
    if (!csvInput.trim()) return;

    const lines = csvInput.trim().split('\n');
    const parsed: ImpactRecord[] = [];

    for (let i = 1; i < lines.length; i++) { // Skip header
      const cols = lines[i].split(/[,\t]/).map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length >= 3) {
        parsed.push({
          id: `csv-${Date.now()}-${i}`,
          date: cols[0] || new Date().toISOString().split('T')[0],
          category: mapCategory(cols[1]),
          impactType: mapImpactType(cols[2]),
          metricValue: cols[3] || '',
          metricUnit: cols[4] || '',
          description: cols[5] || cols[2] || '',
          beneficiary: cols[6] || '',
          confidentiality: 'internal',
        });
      }
    }

    if (parsed.length > 0) {
      setRecords(prev => [...prev, ...parsed]);
      setCsvInput('');
      alert(`Imported ${parsed.length} records from CSV.`);
    }
  };

  // Helper to map categories
  const mapCategory = (cat: string): ImpactCategory => {
    const lower = (cat || '').toLowerCase();
    if (lower.includes('strategic')) return 'strategic';
    if (lower.includes('operational')) return 'operational';
    if (lower.includes('communication')) return 'communication';
    if (lower.includes('project')) return 'project';
    if (lower.includes('admin')) return 'administrative';
    if (lower.includes('relationship')) return 'relationship';
    return 'other';
  };

  // Helper to map impact types
  const mapImpactType = (type: string): ImpactType => {
    const lower = (type || '').toLowerCase();
    if (lower.includes('time')) return 'time-saved';
    if (lower.includes('cost')) return 'cost-avoided';
    if (lower.includes('risk')) return 'risk-reduced';
    if (lower.includes('process')) return 'process-improved';
    if (lower.includes('stakeholder')) return 'stakeholder-enabled';
    if (lower.includes('initiative') || lower.includes('deliver')) return 'initiative-delivered';
    return 'other';
  };

  // Toggle section
  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  // Update section notes
  const updateSectionNotes = (id: string, notes: string) => {
    setSections(prev => prev.map(s =>
      s.id === id ? { ...s, notes } : s
    ));
  };

  // Drag and drop for sections
  const handleDragStart = (id: string) => {
    setDraggedSection(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedSection || draggedSection === targetId) return;

    setSections(prev => {
      const dragged = prev.find(s => s.id === draggedSection);
      const target = prev.find(s => s.id === targetId);
      if (!dragged || !target) return prev;

      const newOrder = [...prev].sort((a, b) => a.order - b.order);
      const draggedIdx = newOrder.findIndex(s => s.id === draggedSection);
      const targetIdx = newOrder.findIndex(s => s.id === targetId);

      newOrder.splice(draggedIdx, 1);
      newOrder.splice(targetIdx, 0, dragged);

      return newOrder.map((s, i) => ({ ...s, order: i }));
    });
  };

  const handleDragEnd = () => {
    setDraggedSection(null);
  };

  // Filter records by period
  const getFilteredRecords = useCallback(() => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;

    switch (config.period) {
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarterly':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'annual':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        startDate = config.customStartDate ? new Date(config.customStartDate) : new Date(0);
        endDate = config.customEndDate ? new Date(config.customEndDate) : now;
        break;
      default:
        startDate = new Date(0);
    }

    return records.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= startDate && recordDate <= endDate;
    });
  }, [records, config.period, config.customStartDate, config.customEndDate]);

  // Calculate metrics
  const calculateMetrics = useCallback(() => {
    const filtered = getFilteredRecords();

    let totalHours = 0;
    let totalCost = 0;
    let initiativesDelivered = 0;
    const stakeholders = new Set<string>();
    const categoryCount: Record<string, number> = {};

    filtered.forEach(r => {
      // Count by category
      categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;

      // Parse metrics
      if (r.impactType === 'time-saved' && r.metricValue) {
        const hours = parseFloat(r.metricValue) || 0;
        totalHours += r.metricUnit?.toLowerCase().includes('day') ? hours * 8 : hours;
      }
      if (r.impactType === 'cost-avoided' && r.metricValue) {
        totalCost += parseFloat(r.metricValue.replace(/[$,]/g, '')) || 0;
      }
      if (r.impactType === 'initiative-delivered') {
        initiativesDelivered++;
      }
      if (r.beneficiary) {
        stakeholders.add(r.beneficiary);
      }
    });

    const total = filtered.length;
    const categoryPercentages = Object.entries(categoryCount).map(([cat, count]) => ({
      category: CATEGORIES.find(c => c.value === cat)?.label || cat,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      count,
    }));

    return {
      totalRecords: total,
      totalHours,
      totalCost,
      initiativesDelivered,
      stakeholdersSupported: stakeholders.size,
      categoryBreakdown: categoryPercentages.sort((a, b) => b.count - a.count),
    };
  }, [getFilteredRecords]);

  // Generate report content
  const generateReport = useCallback((internal: boolean = false) => {
    const filtered = getFilteredRecords();
    const metrics = calculateMetrics();
    const enabledSections = sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);

    // Filter by confidentiality for executive report
    const visibleRecords = internal
      ? filtered
      : filtered.filter(r => r.confidentiality !== 'sensitive');

    let report = '';

    // Header
    report += `${config.title.toUpperCase()}\n`;
    report += `${'='.repeat(50)}\n\n`;

    if (config.executives) {
      report += `Executive(s) Supported: ${config.executives}\n`;
    }

    const periodLabel = config.period === 'custom'
      ? `${config.customStartDate} to ${config.customEndDate}`
      : config.period.charAt(0).toUpperCase() + config.period.slice(1);
    report += `Reporting Period: ${periodLabel}\n`;
    report += `Generated: ${new Date().toLocaleDateString()}\n\n`;

    // Generate each section
    enabledSections.forEach(section => {
      report += `${section.name.toUpperCase()}\n`;
      report += `${'-'.repeat(40)}\n`;

      switch (section.id) {
        case 'executive-summary':
          report += generateExecutiveSummary(visibleRecords, metrics, config.tone);
          break;
        case 'key-metrics':
          report += generateMetricsSection(metrics);
          break;
        case 'strategic':
          report += generateCategorySection(visibleRecords, 'strategic');
          break;
        case 'operational':
          report += generateCategorySection(visibleRecords, 'operational');
          break;
        case 'risk':
          report += generateImpactTypeSection(visibleRecords, 'risk-reduced');
          break;
        case 'stakeholder':
          report += generateImpactTypeSection(visibleRecords, 'stakeholder-enabled');
          break;
        case 'process':
          report += generateImpactTypeSection(visibleRecords, 'process-improved');
          break;
        case 'highlights':
          report += generateHighlights(visibleRecords);
          break;
        case 'challenges':
          report += section.notes || 'No challenges documented for this period.\n';
          break;
        case 'looking-ahead':
          report += section.notes || 'Goals and focus areas for the next period.\n';
          break;
      }

      if (section.notes && section.id !== 'challenges' && section.id !== 'looking-ahead') {
        report += `\nAdditional Notes: ${section.notes}\n`;
      }

      report += '\n';
    });

    if (internal) {
      report += '\n--- INTERNAL EA NOTES ---\n';
      report += `Total records in period: ${filtered.length}\n`;
      report += `Sensitive items excluded from exec report: ${filtered.filter(r => r.confidentiality === 'sensitive').length}\n`;
    }

    return report;
  }, [getFilteredRecords, calculateMetrics, sections, config]);

  // Section generators
  const generateExecutiveSummary = (
    records: ImpactRecord[],
    metrics: ReturnType<typeof calculateMetrics>,
    tone: Tone
  ) => {
    if (records.length === 0) return 'No impact data recorded for this period.\n';

    let summary = '';

    if (tone === 'board-ready') {
      summary += `${metrics.totalRecords} contributions delivered. `;
      if (metrics.totalHours > 0) summary += `${metrics.totalHours}+ hours saved. `;
      if (metrics.totalCost > 0) summary += `$${metrics.totalCost.toLocaleString()} in costs avoided. `;
      if (metrics.initiativesDelivered > 0) summary += `${metrics.initiativesDelivered} initiatives completed.`;
      summary += '\n';
    } else {
      summary += `This period, the EA function delivered ${metrics.totalRecords} documented contributions `;
      summary += `across ${metrics.categoryBreakdown.length} key areas. `;

      if (metrics.totalHours > 0) {
        summary += `Time savings totaled approximately ${metrics.totalHours} hours. `;
      }
      if (metrics.totalCost > 0) {
        summary += `Cost avoidance measures saved an estimated $${metrics.totalCost.toLocaleString()}. `;
      }
      if (metrics.stakeholdersSupported > 0) {
        summary += `${metrics.stakeholdersSupported} stakeholder(s) were directly supported.`;
      }
      summary += '\n';
    }

    return summary;
  };

  const generateMetricsSection = (metrics: ReturnType<typeof calculateMetrics>) => {
    let content = '';

    content += `Total Contributions: ${metrics.totalRecords}\n`;
    if (metrics.totalHours > 0) content += `Hours Saved: ${metrics.totalHours}\n`;
    if (metrics.totalCost > 0) content += `Cost Avoided: $${metrics.totalCost.toLocaleString()}\n`;
    content += `Initiatives Delivered: ${metrics.initiativesDelivered}\n`;
    content += `Stakeholders Supported: ${metrics.stakeholdersSupported}\n\n`;

    if (metrics.categoryBreakdown.length > 0) {
      content += 'Work Distribution by Category:\n';
      metrics.categoryBreakdown.forEach(c => {
        content += `  - ${c.category}: ${c.percentage}% (${c.count} items)\n`;
      });
    }

    return content;
  };

  const generateCategorySection = (records: ImpactRecord[], category: ImpactCategory) => {
    const items = records.filter(r => r.category === category);
    if (items.length === 0) return 'No items recorded in this category.\n';

    let content = '';
    items.forEach(item => {
      content += `• ${item.description}`;
      if (item.metricValue) content += ` (${item.metricValue} ${item.metricUnit})`;
      content += '\n';
    });
    return content;
  };

  const generateImpactTypeSection = (records: ImpactRecord[], impactType: ImpactType) => {
    const items = records.filter(r => r.impactType === impactType);
    if (items.length === 0) return 'No items recorded in this area.\n';

    let content = '';
    items.forEach(item => {
      content += `• ${item.description}`;
      if (item.metricValue) content += ` (${item.metricValue} ${item.metricUnit})`;
      content += '\n';
    });
    return content;
  };

  const generateHighlights = (records: ImpactRecord[]) => {
    if (records.length === 0) return 'No highlights for this period.\n';

    // Take top 5 by most recent
    const highlights = [...records]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    let content = '';
    highlights.forEach(item => {
      content += `• ${item.description}\n`;
    });
    return content;
  };

  // Generate HTML report
  const generateHTMLReport = () => {
    const plainText = generateReport(false);
    const lines = plainText.split('\n');

    let html = '<div style="font-family: Arial, sans-serif; max-width: 800px;">\n';

    lines.forEach(line => {
      if (line.startsWith('===')) {
        // Skip separator
      } else if (line.startsWith('---')) {
        html += '<hr style="border: 1px solid #ccc;">\n';
      } else if (line === line.toUpperCase() && line.length > 3 && !line.startsWith('•')) {
        html += `<h2 style="color: #333; margin-top: 20px;">${line}</h2>\n`;
      } else if (line.startsWith('•')) {
        html += `<li style="margin-left: 20px;">${line.substring(2)}</li>\n`;
      } else if (line.trim()) {
        html += `<p style="margin: 8px 0;">${line}</p>\n`;
      }
    });

    html += '</div>';
    return html;
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Save report
  const saveReport = () => {
    const name = prompt('Enter a name for this report:', config.title);
    if (!name) return;

    const newSaved: SavedReport = {
      id: `saved-${Date.now()}`,
      name,
      config,
      records,
      sections,
      savedAt: new Date().toISOString(),
    };

    setSavedReports(prev => [...prev, newSaved]);
  };

  // Load saved report
  const loadReport = (report: SavedReport) => {
    setConfig(report.config);
    setRecords(report.records);
    setSections(report.sections);
  };

  // Delete saved report
  const deleteSavedReport = (id: string) => {
    setSavedReports(prev => prev.filter(r => r.id !== id));
  };

  // Export JSON
  const exportJSON = () => {
    const data = { config, records, sections };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ea-impact-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.config) setConfig(data.config);
        if (data.records) setRecords(data.records);
        if (data.sections) setSections(data.sections);
        alert('Report imported successfully!');
      } catch {
        alert('Failed to import report. Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Reset
  const resetReport = () => {
    if (!confirm('Are you sure you want to reset? This will clear all current data.')) return;
    setConfig({
      title: 'EA Impact Report',
      executives: '',
      period: 'quarterly',
      customStartDate: '',
      customEndDate: '',
      audience: 'executive',
      tone: 'executive-summary',
    });
    setRecords([]);
    setSections(DEFAULT_SECTIONS.map((s, i) => ({ ...s, order: i })));
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Panel - Data Sources & Config */}
      <div className="lg:col-span-3 space-y-4">
        {/* Report Setup */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Report Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Title
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Executive(s) Supported
              </label>
              <input
                type="text"
                value={config.executives}
                onChange={(e) => setConfig(prev => ({ ...prev, executives: e.target.value }))}
                placeholder="e.g., Jane Smith, CEO"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reporting Period
              </label>
              <select
                value={config.period}
                onChange={(e) => setConfig(prev => ({ ...prev, period: e.target.value as ReportPeriod }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {config.period === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start</label>
                  <input
                    type="date"
                    value={config.customStartDate}
                    onChange={(e) => setConfig(prev => ({ ...prev, customStartDate: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End</label>
                  <input
                    type="date"
                    value={config.customEndDate}
                    onChange={(e) => setConfig(prev => ({ ...prev, customEndDate: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Audience
              </label>
              <select
                value={config.audience}
                onChange={(e) => setConfig(prev => ({ ...prev, audience: e.target.value as Audience }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="executive">Executive</option>
                <option value="leadership">Leadership</option>
                <option value="hr">HR / Performance Review</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tone
              </label>
              <select
                value={config.tone}
                onChange={(e) => setConfig(prev => ({ ...prev, tone: e.target.value as Tone }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="executive-summary">Executive Summary</option>
                <option value="performance-review">Performance Review</option>
                <option value="board-ready">Board-Ready (Concise)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>{records.length} records loaded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 mb-4">
              {(['manual', 'import', 'csv'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-sm rounded ${
                    activeTab === tab
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'manual' ? 'Manual' : tab === 'import' ? 'Import' : 'CSV'}
                </button>
              ))}
            </div>

            {activeTab === 'manual' && (
              <div className="space-y-3">
                <input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <select
                  value={newRecord.category}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, category: e.target.value as ImpactCategory }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <select
                  value={newRecord.impactType}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, impactType: e.target.value as ImpactType }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  {IMPACT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRecord.metricValue}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, metricValue: e.target.value }))}
                    placeholder="Value"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    value={newRecord.metricUnit}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, metricUnit: e.target.value }))}
                    placeholder="Unit"
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <textarea
                  value={newRecord.description}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description of impact..."
                  rows={2}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <input
                  type="text"
                  value={newRecord.beneficiary}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, beneficiary: e.target.value }))}
                  placeholder="Beneficiary (optional)"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <select
                  value={newRecord.confidentiality}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, confidentiality: e.target.value as Confidentiality }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="public">Public</option>
                  <option value="internal">Internal</option>
                  <option value="sensitive">Sensitive</option>
                </select>
                <Button variant="primary" size="sm" className="w-full" onClick={addRecord}>
                  Add Record
                </Button>
              </div>
            )}

            {activeTab === 'import' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Import data from your Accomplishments Tracker.
                </p>
                <Button variant="secondary" size="sm" className="w-full" onClick={importFromAccomplishments}>
                  Import from Accomplishments
                </Button>
              </div>
            )}

            {activeTab === 'csv' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-600">
                  Paste CSV with columns: Date, Category, Impact Type, Value, Unit, Description, Beneficiary
                </p>
                <textarea
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder="Paste CSV here..."
                  rows={4}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                />
                <Button variant="secondary" size="sm" className="w-full" onClick={parseCSV}>
                  Parse CSV
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Reports */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Saved Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {savedReports.length === 0 ? (
              <p className="text-sm text-gray-500">No saved reports.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {savedReports.map(report => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                  >
                    <button
                      onClick={() => loadReport(report)}
                      className="text-left hover:text-primary-600"
                    >
                      {report.name}
                    </button>
                    <button
                      onClick={() => deleteSavedReport(report.id)}
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
            <Button variant="outline" size="sm" className="w-full mt-3" onClick={saveReport}>
              Save Current Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Center Panel - Sections Builder */}
      <div className="lg:col-span-5 space-y-4">
        {/* Quick Metrics */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Quick Metrics</CardTitle>
            <CardDescription>Auto-calculated from your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-primary-50 p-3 rounded">
                <div className="text-2xl font-bold text-primary-700">{metrics.totalRecords}</div>
                <div className="text-xs text-primary-600">Contributions</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-2xl font-bold text-green-700">{metrics.totalHours || '-'}</div>
                <div className="text-xs text-green-600">Hours Saved</div>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-2xl font-bold text-blue-700">{metrics.initiativesDelivered}</div>
                <div className="text-xs text-blue-600">Initiatives</div>
              </div>
            </div>
            {metrics.totalCost > 0 && (
              <div className="mt-3 text-center p-2 bg-yellow-50 rounded">
                <span className="text-sm text-yellow-700">
                  Cost Avoided: <strong>${metrics.totalCost.toLocaleString()}</strong>
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sections */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Report Sections</CardTitle>
            <CardDescription>Drag to reorder, toggle to include/exclude</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sections.sort((a, b) => a.order - b.order).map(section => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => handleDragStart(section.id)}
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDragEnd={handleDragEnd}
                  className={`p-3 border rounded cursor-move transition-colors ${
                    section.enabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
                  } ${draggedSection === section.id ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                    <label className="flex items-center gap-2 flex-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={section.enabled}
                        onChange={() => toggleSection(section.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className={section.enabled ? 'text-gray-900' : 'text-gray-400'}>
                        {section.name}
                      </span>
                    </label>
                  </div>
                  {section.enabled && (section.id === 'challenges' || section.id === 'looking-ahead') && (
                    <textarea
                      value={section.notes}
                      onChange={(e) => updateSectionNotes(section.id, e.target.value)}
                      placeholder="Add notes for this section..."
                      rows={2}
                      className="w-full mt-2 px-2 py-1 border border-gray-200 rounded text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Impact Records</CardTitle>
            <CardDescription>{getFilteredRecords().length} in selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {records.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No records yet. Add data using the panel on the left.
                </p>
              ) : (
                records.map(record => (
                  <div key={record.id} className="p-2 bg-gray-50 rounded text-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 line-clamp-1">{record.description}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <Badge variant="default" size="sm">
                            {CATEGORIES.find(c => c.value === record.category)?.label}
                          </Badge>
                          {record.metricValue && (
                            <Badge variant="info" size="sm">
                              {record.metricValue} {record.metricUnit}
                            </Badge>
                          )}
                          {record.confidentiality === 'sensitive' && (
                            <Badge variant="warning" size="sm">Sensitive</Badge>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="text-gray-400 hover:text-red-500 ml-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Preview & Export */}
      <div className="lg:col-span-4 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Executive Report Preview</CardTitle>
            <CardDescription>Sensitive items excluded</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-3 rounded border text-xs max-h-64 overflow-y-auto whitespace-pre-wrap font-mono">
              {generateReport(false)}
            </pre>
            <div className="flex gap-2 mt-3">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => copyToClipboard(generateReport(false), 'exec-text')}
              >
                {copied === 'exec-text' ? 'Copied!' : 'Copy Text'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => copyToClipboard(generateHTMLReport(), 'exec-html')}
              >
                {copied === 'exec-html' ? 'Copied!' : 'Copy HTML'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Internal EA Report</CardTitle>
            <CardDescription>Full data including sensitive items</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-3 rounded border text-xs max-h-48 overflow-y-auto whitespace-pre-wrap font-mono">
              {generateReport(true)}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => copyToClipboard(generateReport(true), 'internal')}
            >
              {copied === 'internal' ? 'Copied!' : 'Copy Internal Report'}
            </Button>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="secondary" size="sm" className="w-full" onClick={exportJSON}>
              Export JSON
            </Button>
            <label className="block cursor-pointer">
              <span className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                Import JSON
              </span>
              <input
                type="file"
                accept=".json"
                onChange={importJSON}
                className="hidden"
              />
            </label>
            <Button variant="outline" size="sm" className="w-full" onClick={resetReport}>
              Reset Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
