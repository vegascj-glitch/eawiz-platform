/**
 * Utility to remove and prevent em dashes from appearing in output.
 * Em dashes (U+2014) are replaced with appropriate alternatives.
 */

const EM_DASH = '\u2014';
const EN_DASH = '\u2013';
const HORIZONTAL_BAR = '\u2015';

/**
 * Removes all em dashes and similar characters from text.
 * Replaces with comma or spaced hyphen depending on context.
 */
export function removeEmDashes(text: string): string {
  // Replace em dash with appropriate punctuation
  let result = text;

  // Em dash between words with spaces -> comma
  result = result.replace(new RegExp(` ${EM_DASH} `, 'g'), ', ');

  // Em dash at start of sentence (rare) -> remove
  result = result.replace(new RegExp(`^${EM_DASH} `, 'gm'), '');

  // Em dash without spaces -> spaced hyphen
  result = result.replace(new RegExp(EM_DASH, 'g'), ' - ');

  // Also handle en dash and horizontal bar
  result = result.replace(new RegExp(` ${EN_DASH} `, 'g'), ', ');
  result = result.replace(new RegExp(EN_DASH, 'g'), '-');
  result = result.replace(new RegExp(HORIZONTAL_BAR, 'g'), ' - ');

  // Clean up any double spaces
  result = result.replace(/  +/g, ' ');

  return result;
}

/**
 * Checks if text contains any em dashes.
 */
export function containsEmDash(text: string): boolean {
  return text.includes(EM_DASH) || text.includes(EN_DASH) || text.includes(HORIZONTAL_BAR);
}

/**
 * Process subject and body to ensure no em dashes exist.
 */
export function sanitizeEmail(subject: string, body: string): { subject: string; body: string } {
  return {
    subject: removeEmDashes(subject),
    body: removeEmDashes(body),
  };
}
