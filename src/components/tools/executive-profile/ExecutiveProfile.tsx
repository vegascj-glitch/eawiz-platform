'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { SECTIONS, isTableGroup, type FieldGroup, type Section } from './sectionSchema';
import {
  ProfileState,
  ProfileTables,
  ContactRow,
  DocumentRow,
  VendorRow,
  SaveStatus,
  CONTACT_COLUMNS,
  DOCUMENT_COLUMNS,
  VENDOR_COLUMNS,
  createEmptyContactRow,
  createEmptyDocumentRow,
  createEmptyVendorRow,
  createEmptyState,
} from './types';
import {
  saveProfileState,
  loadProfileState,
  exportStateAsJson,
  importStateFromJson,
  isLoggedIn,
} from './storage';

export function ExecutiveProfile() {
  const [state, setState] = useState<ProfileState>(createEmptyState);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isLocalOnly, setIsLocalOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial state
  useEffect(() => {
    async function load() {
      const result = await loadProfileState();
      if (result.success && result.data) {
        setState(result.data);
        setLastSaved(result.data.lastSaved || null);
        setIsLocalOnly(result.isLocal || false);
      }
    }
    load();
  }, []);

  // Check if user is logged in
  useEffect(() => {
    async function checkLogin() {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        setIsLocalOnly(true);
      }
    }
    checkLogin();
  }, []);

  // Autosave with debounce
  const triggerAutosave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      const result = await saveProfileState(state);
      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(new Date().toISOString());
        setIsLocalOnly(result.isLocal || false);
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    }, 800);
  }, [state]);

  // Trigger autosave on state change
  useEffect(() => {
    if (state.fields && Object.keys(state.fields).length > 0) {
      triggerAutosave();
    }
  }, [state, triggerAutosave]);

  // Manual save
  const handleManualSave = async () => {
    setSaveStatus('saving');
    const result = await saveProfileState(state);
    if (result.success) {
      setSaveStatus('saved');
      setLastSaved(new Date().toISOString());
      setIsLocalOnly(result.isLocal || false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setSaveStatus('error');
    }
  };

  // Update field
  const updateField = useCallback((fieldId: string, value: string) => {
    setState((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldId]: value,
      },
    }));
  }, []);

  // Update table row
  const updateTableRow = useCallback(
    <T extends ContactRow | DocumentRow | VendorRow>(
      tableKey: keyof ProfileTables,
      rowId: string,
      column: string,
      value: string
    ) => {
      setState((prev) => ({
        ...prev,
        tables: {
          ...prev.tables,
          [tableKey]: (prev.tables[tableKey] as T[]).map((row) =>
            row.id === rowId ? { ...row, [column]: value } : row
          ),
        },
      }));
    },
    []
  );

  // Add table row
  const addTableRow = useCallback((tableKey: keyof ProfileTables) => {
    setState((prev) => {
      const newRow =
        tableKey === 'contacts'
          ? createEmptyContactRow()
          : tableKey === 'documents'
          ? createEmptyDocumentRow()
          : createEmptyVendorRow();

      return {
        ...prev,
        tables: {
          ...prev.tables,
          [tableKey]: [...prev.tables[tableKey], newRow],
        },
      };
    });
  }, []);

  // Remove table row
  const removeTableRow = useCallback((tableKey: keyof ProfileTables, rowId: string) => {
    setState((prev) => ({
      ...prev,
      tables: {
        ...prev.tables,
        [tableKey]: prev.tables[tableKey].filter((row) => row.id !== rowId),
      },
    }));
  }, []);

  // Export JSON
  const handleExportJson = () => {
    const json = exportStateAsJson(state);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `executive-profile-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy JSON
  const handleCopyJson = async () => {
    const json = exportStateAsJson(state);
    try {
      await navigator.clipboard.writeText(json);
      alert('JSON copied to clipboard');
    } catch {
      alert('Failed to copy to clipboard');
    }
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = importStateFromJson(content);
      if (result.success && result.data) {
        setState(result.data);
        setImportError(null);
        handleManualSave();
      } else {
        setImportError(result.error || 'Import failed');
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get current section
  const currentSection = useMemo(
    () => SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0],
    [activeSection]
  );

  // Filter fields by search
  const filterBySearch = useCallback(
    (text: string) => {
      if (!searchQuery) return true;
      return text.toLowerCase().includes(searchQuery.toLowerCase());
    },
    [searchQuery]
  );

  // Render field input
  const renderFieldInput = (field: { id: string; label: string; type: string; placeholder?: string; options?: string[] }) => {
    const value = state.fields[field.id] || '';

    if (field.type === 'textarea') {
      return (
        <div key={field.id} className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
          <textarea
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y min-h-[100px]"
          />
        </div>
      );
    }

    if (field.type === 'select' && field.options) {
      return (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
          <select
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select...</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={field.id}>
        <Input
          type={field.type as 'text' | 'email' | 'tel' | 'url' | 'date'}
          label={field.label}
          value={value}
          onChange={(e) => updateField(field.id, e.target.value)}
          placeholder={field.placeholder}
        />
      </div>
    );
  };

  // Render editable table
  const renderTable = (tableKey: 'contacts' | 'documents' | 'vendors') => {
    const columns =
      tableKey === 'contacts'
        ? CONTACT_COLUMNS
        : tableKey === 'documents'
        ? DOCUMENT_COLUMNS
        : VENDOR_COLUMNS;

    const rows = state.tables[tableKey];

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((col) => (
                <th key={col} className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                  {col}
                </th>
              ))}
              <th className="px-3 py-2 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-gray-200">
                {columns.map((col) => (
                  <td key={col} className="px-1 py-1">
                    <input
                      type="text"
                      value={(row as unknown as Record<string, string>)[col] || ''}
                      onChange={(e) => updateTableRow(tableKey, row.id, col, e.target.value)}
                      className="w-full min-w-[100px] px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </td>
                ))}
                <td className="px-2 py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTableRow(tableKey, row.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="text-center text-gray-500 py-4">No entries yet. Add one below.</p>
        )}
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={() => addTableRow(tableKey)}>
            + Add Row
          </Button>
        </div>
      </div>
    );
  };

  // Format last saved time
  const formatLastSaved = (isoString: string | null) => {
    if (!isoString) return null;
    try {
      const date = new Date(isoString);
      return date.toLocaleString();
    } catch {
      return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Mobile Nav Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <span>{currentSection.icon}</span>
            <span>{currentSection.name}</span>
          </span>
          <svg
            className={cn('w-4 h-4 transition-transform', mobileNavOpen && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </div>

      {/* Left Sidebar - Navigation */}
      <div
        className={cn(
          'lg:w-64 flex-shrink-0',
          mobileNavOpen ? 'block' : 'hidden lg:block'
        )}
      >
        <Card variant="bordered" className="sticky top-4">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setMobileNavOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors',
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span>{section.name}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentSection.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{currentSection.name}</h2>
              <p className="text-gray-600">{currentSection.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Search (for field sections only) */}
        {currentSection.groups.some((g) => !isTableGroup(g)) && (
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search fields in this section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Section Groups */}
        <div className="space-y-6">
          {currentSection.groups.map((group, idx) => {
            if (isTableGroup(group)) {
              return (
                <Card key={idx} variant="bordered">
                  <CardHeader>
                    <CardTitle className="text-lg">{group.title}</CardTitle>
                  </CardHeader>
                  <CardContent>{renderTable(group.tableKey)}</CardContent>
                </Card>
              );
            }

            const fieldGroup = group as FieldGroup;
            const filteredFields = fieldGroup.fields.filter((f) =>
              filterBySearch(f.label)
            );

            if (filteredFields.length === 0 && searchQuery) return null;

            return (
              <Card key={idx} variant="bordered">
                <CardHeader>
                  <CardTitle className="text-lg">{fieldGroup.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredFields.map((field) => renderFieldInput(field))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar - Actions */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="sticky top-4 space-y-4">
          {/* Save Status Card */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge
                  variant={
                    saveStatus === 'saved'
                      ? 'success'
                      : saveStatus === 'saving'
                      ? 'info'
                      : saveStatus === 'error'
                      ? 'danger'
                      : 'default'
                  }
                >
                  {saveStatus === 'idle' && 'Ready'}
                  {saveStatus === 'saving' && 'Saving...'}
                  {saveStatus === 'saved' && 'Saved'}
                  {saveStatus === 'error' && 'Error'}
                </Badge>
              </div>
              {lastSaved && (
                <p className="text-xs text-gray-500">Last saved: {formatLastSaved(lastSaved)}</p>
              )}
              {isLocalOnly && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800">
                    Saved locally on this device. Log in to sync across devices.
                  </p>
                </div>
              )}
              <Button variant="primary" size="sm" className="w-full" onClick={handleManualSave}>
                Save Now
              </Button>
            </CardContent>
          </Card>

          {/* Export/Import Card */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">Export / Import</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full" onClick={handleExportJson}>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export JSON
              </Button>
              <Button variant="outline" size="sm" className="w-full" onClick={handleCopyJson}>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                Copy JSON
              </Button>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                  id="import-json"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Import JSON
                </Button>
              </div>
              {importError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-800">{importError}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Jump to Section */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">Jump to Section</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {SECTIONS.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.icon} {section.name}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
