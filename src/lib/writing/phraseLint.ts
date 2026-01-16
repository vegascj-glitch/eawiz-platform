/**
 * Phrase linting to detect and warn about cliched/AI-sounding phrases.
 */

export interface PhraseWarning {
  phrase: string;
  suggestion: string;
  index: number;
}

// Cliche phrases to detect with suggested alternatives
const CLICHE_PHRASES: Array<{ pattern: RegExp; phrase: string; suggestion: string }> = [
  {
    pattern: /thank you for your time and consideration/gi,
    phrase: 'Thank you for your time and consideration',
    suggestion: 'Be more specific about what you appreciated',
  },
  {
    pattern: /i am excited about the opportunity/gi,
    phrase: 'I am excited about the opportunity',
    suggestion: 'Show specific excitement: "The challenges you described around X resonate with me"',
  },
  {
    pattern: /i('m| am) excited about this opportunity/gi,
    phrase: 'I am excited about this opportunity',
    suggestion: 'Name what specifically excites you',
  },
  {
    pattern: /i identified with your mission/gi,
    phrase: 'I identified with your mission',
    suggestion: 'Reference a specific company value or goal',
  },
  {
    pattern: /i believe my skills align/gi,
    phrase: 'I believe my skills align',
    suggestion: 'Show alignment with a concrete example',
  },
  {
    pattern: /my skills align well/gi,
    phrase: 'my skills align well',
    suggestion: 'Replace with specific skill match: "My experience doing X directly applies to Y"',
  },
  {
    pattern: /i would love the chance/gi,
    phrase: 'I would love the chance',
    suggestion: 'Be direct: "I look forward to" or state your interest plainly',
  },
  {
    pattern: /i('m| am) confident (that )?i('d| would) be/gi,
    phrase: 'I am confident I would be',
    suggestion: 'Let your experience speak for itself',
  },
  {
    pattern: /perfect fit for/gi,
    phrase: 'perfect fit for',
    suggestion: 'Avoid "perfect" - describe specific fit instead',
  },
  {
    pattern: /i('m| am) a (great|perfect|strong) fit/gi,
    phrase: 'I am a great/perfect/strong fit',
    suggestion: 'Show fit through examples rather than stating it',
  },
  {
    pattern: /looking forward to hearing from you/gi,
    phrase: 'Looking forward to hearing from you',
    suggestion: 'More specific: "Looking forward to discussing next steps" or just end with your availability',
  },
  {
    pattern: /please do not hesitate to/gi,
    phrase: 'Please do not hesitate to',
    suggestion: 'Just say "Feel free to" or remove entirely',
  },
  {
    pattern: /do not hesitate to reach out/gi,
    phrase: 'do not hesitate to reach out',
    suggestion: 'Remove - unnecessary filler',
  },
  {
    pattern: /i('m| am) very interested in/gi,
    phrase: 'I am very interested in',
    suggestion: 'Show interest through specific observations, not statements',
  },
  {
    pattern: /touched base/gi,
    phrase: 'touched base',
    suggestion: 'Say "connected" or "spoke" instead',
  },
  {
    pattern: /circle back/gi,
    phrase: 'circle back',
    suggestion: 'Say "follow up" or "revisit" instead',
  },
  {
    pattern: /at the end of the day/gi,
    phrase: 'at the end of the day',
    suggestion: 'Remove - filler phrase',
  },
  {
    pattern: /hit the ground running/gi,
    phrase: 'hit the ground running',
    suggestion: 'Describe your actual onboarding approach',
  },
  {
    pattern: /think outside the box/gi,
    phrase: 'think outside the box',
    suggestion: 'Give a specific example of creative problem-solving',
  },
  {
    pattern: /passionate about/gi,
    phrase: 'passionate about',
    suggestion: 'Show passion through specific examples instead',
  },
  {
    pattern: /utilize my skills/gi,
    phrase: 'utilize my skills',
    suggestion: 'Say "use" or "apply" - simpler is better',
  },
  {
    pattern: /leverage my experience/gi,
    phrase: 'leverage my experience',
    suggestion: 'Say "apply" or "bring" instead',
  },
  {
    pattern: /synergy/gi,
    phrase: 'synergy',
    suggestion: 'Use plain language - "work well together" or "complement"',
  },
  {
    pattern: /it was a pleasure/gi,
    phrase: 'It was a pleasure',
    suggestion: 'Be specific: "I enjoyed learning about X" or "Our conversation about Y was valuable"',
  },
];

/**
 * Lint text for cliched phrases.
 * Returns array of warnings with positions and suggestions.
 */
export function lintPhrases(text: string): PhraseWarning[] {
  const warnings: PhraseWarning[] = [];

  for (const { pattern, phrase, suggestion } of CLICHE_PHRASES) {
    const matches = Array.from(text.matchAll(new RegExp(pattern, 'gi')));
    for (const match of matches) {
      if (match.index !== undefined) {
        warnings.push({
          phrase,
          suggestion,
          index: match.index,
        });
      }
    }
  }

  // Sort by position in text
  return warnings.sort((a, b) => a.index - b.index);
}

/**
 * Get count of cliche phrases found.
 */
export function countCliches(text: string): number {
  return lintPhrases(text).length;
}

/**
 * Check if text has too many cliches (threshold: 2).
 */
export function hasTooManyCliches(text: string, threshold = 2): boolean {
  return countCliches(text) >= threshold;
}
