/**
 * Export utilities for thank you letters.
 * Handles plain text, Gmail-friendly, and Outlook-friendly formats.
 */

export type FormatType = 'plain' | 'gmail' | 'outlook';

export interface FormatOptions {
  format: FormatType;
  includeSubject: boolean;
}

/**
 * Format email for plain text (default).
 * Simple line breaks, no special formatting.
 */
function formatPlainText(subject: string, body: string, includeSubject: boolean): string {
  if (includeSubject) {
    return `Subject: ${subject}\n\n${body}`;
  }
  return body;
}

/**
 * Format email for Gmail.
 * Uses single line breaks between paragraphs (Gmail adds spacing).
 */
function formatGmail(subject: string, body: string, includeSubject: boolean): string {
  // Gmail handles double line breaks well, but we clean up any triple+ breaks
  const cleanedBody = body.replace(/\n{3,}/g, '\n\n');

  if (includeSubject) {
    return `Subject: ${subject}\n\n${cleanedBody}`;
  }
  return cleanedBody;
}

/**
 * Format email for Outlook.
 * Outlook sometimes needs explicit spacing adjustments.
 */
function formatOutlook(subject: string, body: string, includeSubject: boolean): string {
  // Outlook handles double line breaks, normalize spacing
  const cleanedBody = body
    .replace(/\n{3,}/g, '\n\n')
    // Ensure sign-off has proper spacing
    .replace(/\n\n([A-Za-z]+,)\n\n/g, '\n\n$1\n');

  if (includeSubject) {
    return `Subject: ${subject}\n\n${cleanedBody}`;
  }
  return cleanedBody;
}

/**
 * Format the email based on client type.
 */
export function formatEmail(
  subject: string,
  body: string,
  options: FormatOptions
): string {
  const { format, includeSubject } = options;

  switch (format) {
    case 'gmail':
      return formatGmail(subject, body, includeSubject);
    case 'outlook':
      return formatOutlook(subject, body, includeSubject);
    case 'plain':
    default:
      return formatPlainText(subject, body, includeSubject);
  }
}

/**
 * Generate a .txt file download.
 */
export function downloadAsTxt(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a safe filename from company name and date.
 */
export function generateFilename(companyName: string, prefix = 'Thank_You'): string {
  const safeName = companyName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 30);
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}_${safeName}_${date}`;
}
