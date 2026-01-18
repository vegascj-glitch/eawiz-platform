'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { CategoryTotal, formatCurrency, formatCurrencyCompact } from './utils';

interface TotalsSidebarProps {
  grandTotalCents: number;
  itemCount: number;
  categoryTotals: CategoryTotal[];
}

export function TotalsSidebar({
  grandTotalCents,
  itemCount,
  categoryTotals,
}: TotalsSidebarProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Totals Card */}
      <Card variant="bordered" className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-emerald-900">Donation Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Grand Total */}
          <div className="text-center py-4 bg-white/60 rounded-lg">
            <div className="text-4xl font-bold text-emerald-700">
              {formatCurrency(grandTotalCents)}
            </div>
            <div className="text-sm text-emerald-600 mt-1">Estimated Fair Market Value</div>
          </div>

          {/* Item Count */}
          <div className="text-center py-3 bg-white/40 rounded-lg">
            <div className="text-2xl font-semibold text-teal-700">{itemCount}</div>
            <div className="text-sm text-teal-600">Total Items</div>
          </div>

          {/* Category Breakdown */}
          {categoryTotals.length > 0 && (
            <div className="pt-2 border-t border-emerald-200">
              <h4 className="text-sm font-medium text-emerald-800 mb-2">By Category</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {categoryTotals.map((cat) => (
                  <div
                    key={cat.category}
                    className="flex justify-between items-center text-sm py-1 px-2 rounded hover:bg-white/40"
                  >
                    <span className="text-gray-700 truncate mr-2">{cat.category}</span>
                    <span className="font-medium text-emerald-700 whitespace-nowrap">
                      {formatCurrencyCompact(cat.totalCents)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {categoryTotals.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              Enter quantities to see your totals
            </div>
          )}
        </CardContent>
      </Card>

      {/* How Values Are Chosen */}
      <Card variant="bordered">
        <CardHeader className="pb-0">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center justify-between w-full text-left"
          >
            <CardTitle className="text-sm">How Values Are Chosen</CardTitle>
            <svg
              className={cn(
                'w-4 h-4 text-gray-500 transition-transform',
                showExplanation && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </CardHeader>
        {showExplanation && (
          <CardContent className="pt-3">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                  range-high
                </span>
                <div className="text-gray-600">
                  For ranges like "$5-15", uses the high value ($15) for excellent condition.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  plus-min
                </span>
                <div className="text-gray-600">
                  For values like "$50+", uses the base value ($50) as the minimum.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  fixed
                </span>
                <div className="text-gray-600">
                  Single values like "$25" are used as-is.
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-3 pt-3 border-t border-gray-100">
                This keeps FMV consistent and audit-unexciting.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 px-1">
        Values are estimates based on items in excellent condition. Consult a tax professional
        for specific guidance on your charitable deductions.
      </p>
    </div>
  );
}
