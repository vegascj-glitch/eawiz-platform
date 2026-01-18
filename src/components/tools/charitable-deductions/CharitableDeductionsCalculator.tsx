'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { ITEMS, getCategories } from '@/lib/tools/charitable-deductions/items';
import { CatalogTable } from './CatalogTable';
import { TotalsSidebar } from './TotalsSidebar';
import {
  ItemEntry,
  QuantityMap,
  parseRaw,
  getItemKey,
  filterItems,
  calculateGrandTotal,
  calculateItemCount,
  calculateCategoryTotals,
  generateCSV,
  getCSVFilename,
  generateTurboTaxSummary,
  copyToClipboard,
  downloadFile,
} from './utils';
import { saveDeductionsState, loadDeductionsState, clearDeductionsState } from './storage';

// Parse all items once at module level
const PARSED_ITEMS: ItemEntry[] = ITEMS.map((item) => {
  const parsed = parseRaw(item.raw);
  return {
    ...item,
    unit: parsed.unit,
    unitCents: parsed.unitCents,
    rule: parsed.rule,
  };
});

const ALL_CATEGORIES = getCategories();

type FeedbackType = 'success' | 'error' | 'idle';

export function CharitableDeductionsCalculator() {
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [feedback, setFeedback] = useState<{ type: FeedbackType; message: string }>({
    type: 'idle',
    message: '',
  });

  // Debounce ref for Supabase saves
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial state
  useEffect(() => {
    const loadData = async () => {
      const result = await loadDeductionsState();
      if (result.success && result.data) {
        setQuantities(result.data.quantities);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Debounced save to Supabase
  const debouncedSave = useCallback((newQuantities: QuantityMap) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      await saveDeductionsState(newQuantities);
    }, 800);
  }, []);

  // Handle quantity change
  const handleQuantityChange = useCallback(
    (itemKey: string, qty: number) => {
      setQuantities((prev) => {
        const next = { ...prev };
        if (qty === 0) {
          delete next[itemKey];
        } else {
          next[itemKey] = qty;
        }
        // Trigger debounced save
        debouncedSave(next);
        return next;
      });
    },
    [debouncedSave]
  );

  // Toggle category expansion
  const handleToggleCategory = useCallback((category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  // Expand all categories
  const handleExpandAll = useCallback(() => {
    setExpandedCategories(new Set(ALL_CATEGORIES));
  }, []);

  // Collapse all categories
  const handleCollapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  // Filter items by search
  const filteredItems = useMemo(() => {
    return filterItems(PARSED_ITEMS, searchQuery);
  }, [searchQuery]);

  // Calculate totals
  const grandTotalCents = useMemo(
    () => calculateGrandTotal(PARSED_ITEMS, quantities),
    [quantities]
  );

  const itemCount = useMemo(
    () => calculateItemCount(quantities),
    [quantities]
  );

  const categoryTotals = useMemo(
    () => calculateCategoryTotals(PARSED_ITEMS, quantities),
    [quantities]
  );

  // Show feedback message
  const showFeedback = useCallback((type: FeedbackType, message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: 'idle', message: '' }), 2500);
  }, []);

  // Export CSV
  const handleExportCSV = useCallback(() => {
    if (itemCount === 0) {
      showFeedback('error', 'No items to export. Add quantities first.');
      return;
    }
    const csv = generateCSV(PARSED_ITEMS, quantities);
    const filename = getCSVFilename();
    downloadFile(csv, filename, 'text/csv');
    showFeedback('success', 'CSV exported successfully');
  }, [quantities, itemCount, showFeedback]);

  // Copy TurboTax summary
  const handleCopySummary = useCallback(async () => {
    if (itemCount === 0) {
      showFeedback('error', 'No items to copy. Add quantities first.');
      return;
    }
    const summary = generateTurboTaxSummary(PARSED_ITEMS, quantities);
    const success = await copyToClipboard(summary);
    if (success) {
      showFeedback('success', 'Summary copied to clipboard');
    } else {
      showFeedback('error', 'Failed to copy to clipboard');
    }
  }, [quantities, itemCount, showFeedback]);

  // Clear all quantities
  const handleClearAll = useCallback(async () => {
    setQuantities({});
    await clearDeductionsState();
    setShowClearConfirm(false);
    showFeedback('success', 'All quantities cleared');
  }, [showFeedback]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedback.type !== 'idle' && (
        <div
          className={cn(
            'fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all',
            feedback.type === 'success' && 'bg-emerald-600 text-white',
            feedback.type === 'error' && 'bg-red-600 text-white'
          )}
        >
          {feedback.message}
        </div>
      )}

      {/* Controls Row */}
      <Card variant="bordered" className="bg-gray-50">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[200px] max-w-md">
              <Input
                placeholder="Search items or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Expand/Collapse */}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleExpandAll}>
                Expand All
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCollapseAll}>
                Collapse All
              </Button>
            </div>

            <div className="h-6 w-px bg-gray-300 hidden md:block" />

            {/* Export Actions */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportCSV}
                disabled={itemCount === 0}
              >
                Export CSV
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopySummary}
                disabled={itemCount === 0}
              >
                Copy Summary
              </Button>
            </div>

            {/* Clear All */}
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              disabled={itemCount === 0}
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Catalog - Left Side */}
        <div className="lg:col-span-2">
          <CatalogTable
            items={filteredItems}
            quantities={quantities}
            expandedCategories={expandedCategories}
            onQuantityChange={handleQuantityChange}
            onToggleCategory={handleToggleCategory}
            searchQuery={searchQuery}
          />
        </div>

        {/* Totals Sidebar - Right Side (Sticky) */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4">
            <TotalsSidebar
              grandTotalCents={grandTotalCents}
              itemCount={itemCount}
              categoryTotals={categoryTotals}
            />
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card variant="elevated" className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Clear All Quantities?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This will remove all entered quantities and reset your calculator. This cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </Button>
                <Button variant="danger" className="flex-1" onClick={handleClearAll}>
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
