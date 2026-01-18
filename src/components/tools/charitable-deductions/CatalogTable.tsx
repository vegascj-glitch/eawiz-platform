'use client';

import { useState, useCallback, useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
  ItemEntry,
  QuantityMap,
  ValueRule,
  getItemKey,
  calculateLineTotal,
  formatCurrency,
} from './utils';

interface CatalogTableProps {
  items: ItemEntry[];
  quantities: QuantityMap;
  expandedCategories: Set<string>;
  onQuantityChange: (itemKey: string, qty: number) => void;
  onToggleCategory: (category: string) => void;
  searchQuery: string;
}

const RULE_BADGE_VARIANT: Record<ValueRule, 'warning' | 'success' | 'default'> = {
  'range-high': 'warning',
  'plus-min': 'success',
  'fixed': 'default',
};

const RULE_LABEL: Record<ValueRule, string> = {
  'range-high': 'range-high',
  'plus-min': 'plus-min',
  'fixed': 'fixed',
};

export function CatalogTable({
  items,
  quantities,
  expandedCategories,
  onQuantityChange,
  onToggleCategory,
  searchQuery,
}: CatalogTableProps) {
  // Group items by category
  const groupedItems = useMemo(() => {
    const groups = new Map<string, ItemEntry[]>();
    for (const item of items) {
      if (!groups.has(item.cat)) {
        groups.set(item.cat, []);
      }
      groups.get(item.cat)!.push(item);
    }
    return groups;
  }, [items]);

  // Get sorted category names
  const categories = useMemo(() => {
    return Array.from(groupedItems.keys()).sort();
  }, [groupedItems]);

  // Calculate category totals for display
  const categoryStats = useMemo(() => {
    const stats = new Map<string, { totalCents: number; itemCount: number; hasEntries: boolean }>();
    const entries = Array.from(groupedItems.entries());
    for (let i = 0; i < entries.length; i++) {
      const [cat, catItems] = entries[i];
      let totalCents = 0;
      let itemCount = 0;
      let hasEntries = false;
      for (const item of catItems) {
        const key = getItemKey(item.cat, item.item);
        const qty = quantities[key] || 0;
        if (qty > 0) {
          totalCents += calculateLineTotal(item.unitCents, qty);
          itemCount += qty;
          hasEntries = true;
        }
      }
      stats.set(cat, { totalCents, itemCount, hasEntries });
    }
    return stats;
  }, [groupedItems, quantities]);

  const handleQtyChange = useCallback(
    (itemKey: string, value: string) => {
      const qty = parseInt(value, 10);
      if (isNaN(qty) || qty < 0) {
        onQuantityChange(itemKey, 0);
      } else {
        onQuantityChange(itemKey, qty);
      }
    },
    [onQuantityChange]
  );

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {searchQuery
          ? `No items match "${searchQuery}"`
          : 'No items available'}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const catItems = groupedItems.get(category) || [];
        const isExpanded = expandedCategories.has(category);
        const stats = categoryStats.get(category) || { totalCents: 0, itemCount: 0, hasEntries: false };

        return (
          <div
            key={category}
            className={cn(
              'border rounded-lg overflow-hidden transition-colors',
              stats.hasEntries ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200'
            )}
          >
            {/* Category Header */}
            <button
              onClick={() => onToggleCategory(category)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
                'hover:bg-gray-50',
                isExpanded && 'border-b border-gray-200'
              )}
            >
              <div className="flex items-center gap-3">
                <svg
                  className={cn(
                    'w-4 h-4 text-gray-500 transition-transform',
                    isExpanded && 'rotate-90'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="font-medium text-gray-900">{category}</span>
                <span className="text-sm text-gray-500">({catItems.length} items)</span>
              </div>
              {stats.hasEntries && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-emerald-700 font-medium">
                    {formatCurrency(stats.totalCents)}
                  </span>
                  <span className="text-gray-500">
                    {stats.itemCount} {stats.itemCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
              )}
            </button>

            {/* Category Items Table */}
            {isExpanded && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Item</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600 w-24">Raw</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600 w-28">Unit (Exc.)</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600 w-24">Rule</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-600 w-24">Qty</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600 w-28">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {catItems.map((item) => {
                      const key = getItemKey(item.cat, item.item);
                      const qty = quantities[key] || 0;
                      const lineTotalCents = calculateLineTotal(item.unitCents, qty);
                      const hasQty = qty > 0;

                      return (
                        <tr
                          key={key}
                          className={cn(
                            'transition-colors',
                            hasQty ? 'bg-emerald-50/50' : 'hover:bg-gray-50'
                          )}
                        >
                          <td className="px-4 py-2 text-gray-900">{item.item}</td>
                          <td className="px-4 py-2 text-gray-500 font-mono text-xs">{item.raw}</td>
                          <td className="px-4 py-2 text-gray-700 font-medium">
                            {formatCurrency(item.unitCents)}
                          </td>
                          <td className="px-4 py-2">
                            <Badge variant={RULE_BADGE_VARIANT[item.rule]} size="sm">
                              {RULE_LABEL[item.rule]}
                            </Badge>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={qty || ''}
                              onChange={(e) => handleQtyChange(key, e.target.value)}
                              placeholder="0"
                              className={cn(
                                'w-20 px-2 py-1 text-center border rounded-lg text-sm',
                                'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                                hasQty
                                  ? 'border-emerald-300 bg-emerald-50'
                                  : 'border-gray-300 bg-white'
                              )}
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                            {hasQty ? (
                              <span className="font-medium text-emerald-700">
                                {formatCurrency(lineTotalCents)}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
