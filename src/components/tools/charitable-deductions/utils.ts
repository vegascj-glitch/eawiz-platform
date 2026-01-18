// Charitable Deductions Calculator - Utility Functions

export type ValueRule = 'range-high' | 'plus-min' | 'fixed';

export interface ParsedValue {
  unit: number; // In dollars (e.g., 15.00)
  unitCents: number; // In cents (e.g., 1500)
  rule: ValueRule;
}

export interface ItemEntry {
  cat: string;
  item: string;
  raw: string;
  unit: number;
  unitCents: number;
  rule: ValueRule;
}

export interface QuantityMap {
  [itemKey: string]: number;
}

export interface CategoryTotal {
  category: string;
  totalCents: number;
  itemCount: number;
}

/**
 * Parse raw value string to get unit value and rule.
 * Rules:
 * - "A-B" (range): uses B (high end), rule = "range-high"
 * - "X+" (minimum plus): uses X (base number), rule = "plus-min"
 * - "X" (fixed): uses X as-is, rule = "fixed"
 */
export function parseRaw(raw: string): ParsedValue {
  const trimmed = raw.trim();

  // Check for range: "A-B"
  if (trimmed.includes('-')) {
    const parts = trimmed.split('-');
    if (parts.length === 2) {
      const high = parseFloat(parts[1]);
      if (!isNaN(high)) {
        return {
          unit: high,
          unitCents: Math.round(high * 100),
          rule: 'range-high',
        };
      }
    }
  }

  // Check for plus-min: "X+"
  if (trimmed.endsWith('+')) {
    const base = parseFloat(trimmed.slice(0, -1));
    if (!isNaN(base)) {
      return {
        unit: base,
        unitCents: Math.round(base * 100),
        rule: 'plus-min',
      };
    }
  }

  // Fixed value: "X"
  const fixed = parseFloat(trimmed);
  if (!isNaN(fixed)) {
    return {
      unit: fixed,
      unitCents: Math.round(fixed * 100),
      rule: 'fixed',
    };
  }

  // Fallback to 0 if parsing fails
  return {
    unit: 0,
    unitCents: 0,
    rule: 'fixed',
  };
}

/**
 * Create a unique key for an item (category + item name)
 */
export function getItemKey(cat: string, item: string): string {
  return `${cat}::${item}`;
}

/**
 * Format cents as USD currency string
 */
export function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(dollars);
}

/**
 * Format cents as compact USD (no decimal if whole dollar)
 */
export function formatCurrencyCompact(cents: number): string {
  const dollars = cents / 100;
  if (dollars % 1 === 0) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(dollars);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(dollars);
}

/**
 * Calculate line total in cents
 */
export function calculateLineTotal(unitCents: number, qty: number): number {
  return unitCents * qty;
}

/**
 * Calculate grand total from quantities
 */
export function calculateGrandTotal(
  items: ItemEntry[],
  quantities: QuantityMap
): number {
  let totalCents = 0;
  for (const item of items) {
    const key = getItemKey(item.cat, item.item);
    const qty = quantities[key] || 0;
    totalCents += calculateLineTotal(item.unitCents, qty);
  }
  return totalCents;
}

/**
 * Calculate total item count
 */
export function calculateItemCount(quantities: QuantityMap): number {
  return Object.values(quantities).reduce((sum, qty) => sum + (qty || 0), 0);
}

/**
 * Calculate totals by category
 */
export function calculateCategoryTotals(
  items: ItemEntry[],
  quantities: QuantityMap
): CategoryTotal[] {
  const categoryMap = new Map<string, { totalCents: number; itemCount: number }>();

  for (const item of items) {
    const key = getItemKey(item.cat, item.item);
    const qty = quantities[key] || 0;
    if (qty > 0) {
      const lineTotalCents = calculateLineTotal(item.unitCents, qty);
      if (!categoryMap.has(item.cat)) {
        categoryMap.set(item.cat, { totalCents: 0, itemCount: 0 });
      }
      const cat = categoryMap.get(item.cat)!;
      cat.totalCents += lineTotalCents;
      cat.itemCount += qty;
    }
  }

  // Convert to array and sort by total descending
  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      totalCents: data.totalCents,
      itemCount: data.itemCount,
    }))
    .sort((a, b) => b.totalCents - a.totalCents);
}

/**
 * Filter items by search query
 */
export function filterItems(
  items: ItemEntry[],
  query: string
): ItemEntry[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase().trim();
  return items.filter(
    (item) =>
      item.item.toLowerCase().includes(q) ||
      item.cat.toLowerCase().includes(q)
  );
}

/**
 * Generate CSV export content (only items with qty > 0)
 */
export function generateCSV(
  items: ItemEntry[],
  quantities: QuantityMap
): string {
  const dateCreated = new Date().toISOString();
  const headers = [
    'date_created',
    'category',
    'item',
    'quantity',
    'raw_value',
    'unit_value',
    'rule',
    'line_total',
  ];

  const rows: string[][] = [];

  for (const item of items) {
    const key = getItemKey(item.cat, item.item);
    const qty = quantities[key] || 0;
    if (qty > 0) {
      const lineTotalCents = calculateLineTotal(item.unitCents, qty);
      rows.push([
        dateCreated,
        `"${item.cat.replace(/"/g, '""')}"`,
        `"${item.item.replace(/"/g, '""')}"`,
        qty.toString(),
        `"${item.raw}"`,
        (item.unitCents / 100).toFixed(2),
        item.rule,
        (lineTotalCents / 100).toFixed(2),
      ]);
    }
  }

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * Generate filename for CSV export
 */
export function getCSVFilename(): string {
  const date = new Date().toISOString().split('T')[0];
  return `charitable_deductions_2025_${date}.csv`;
}

/**
 * Generate TurboTax summary for clipboard
 */
export function generateTurboTaxSummary(
  items: ItemEntry[],
  quantities: QuantityMap
): string {
  const categoryTotals = calculateCategoryTotals(items, quantities);
  const grandTotalCents = calculateGrandTotal(items, quantities);
  const itemCount = calculateItemCount(quantities);

  if (categoryTotals.length === 0) {
    return 'No items entered. Add quantities to generate a summary.';
  }

  const parts: string[] = [];

  // Add category totals
  for (const cat of categoryTotals) {
    parts.push(`${cat.category}: ${formatCurrencyCompact(cat.totalCents)}`);
  }

  // Add grand total and item count
  parts.push(`Grand Total: ${formatCurrencyCompact(grandTotalCents)}`);
  parts.push(`Item Count: ${itemCount}`);

  return parts.join(' | ');
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch {
      return false;
    }
  }
}

/**
 * Download content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Local storage key for quantities
 */
export const STORAGE_KEY = 'charitable_deductions_2025_v1';

/**
 * Save quantities to localStorage
 */
export function saveToLocalStorage(quantities: QuantityMap): void {
  try {
    const data = {
      quantities,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Load quantities from localStorage
 */
export function loadFromLocalStorage(): { quantities: QuantityMap; updatedAt: string | null } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        quantities: data.quantities || {},
        updatedAt: data.updatedAt || null,
      };
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return { quantities: {}, updatedAt: null };
}

/**
 * Clear quantities from localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
