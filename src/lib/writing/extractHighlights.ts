/**
 * Extract highlights from interview notes/transcript for personalization.
 * Uses heuristic scoring to identify meaningful content.
 */

// Common stopwords to filter out
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'shall', 'can', 'need', 'dare', 'ought', 'used', 'it', 'its', 'this', 'that', 'these',
  'those', 'i', 'you', 'he', 'she', 'we', 'they', 'what', 'which', 'who', 'whom',
  'whose', 'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then', 'once',
  'if', 'because', 'until', 'while', 'about', 'into', 'through', 'during', 'before',
  'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once',
  'any', 'being', 'having', 'doing', 'their', 'them', 'your', 'our', 'my', 'his', 'her',
  'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'got', 'get', 'gets',
  'getting', 'go', 'going', 'goes', 'went', 'come', 'coming', 'came', 'let', 'like',
  'know', 'think', 'want', 'see', 'look', 'make', 'made', 'say', 'said', 'tell', 'told',
  'um', 'uh', 'yeah', 'yes', 'no', 'okay', 'ok', 'sure', 'well', 'right', 'really',
  'actually', 'basically', 'definitely', 'certainly', 'probably', 'maybe', 'perhaps',
]);

// Keywords that indicate important interview content
const IMPORTANCE_KEYWORDS = [
  'we discussed', 'you mentioned', 'team', 'role', 'challenge', 'challenges',
  'priorities', 'priority', 'timeline', 'goals', 'goal', 'project', 'projects',
  'initiative', 'initiatives', 'strategy', 'planning', 'growth', 'scale', 'scaling',
  'executive', 'leadership', 'calendar', 'travel', 'meetings', 'stakeholders',
  'communication', 'organization', 'organizing', 'support', 'supporting',
  'expectations', 'responsibilities', 'culture', 'values', 'mission',
  'collaboration', 'cross-functional', 'deadline', 'deadlines', 'deliverables',
  'metrics', 'success', 'measure', 'impact', 'results', 'outcomes',
  'process', 'systems', 'tools', 'technology', 'automation',
  'board', 'investors', 'clients', 'customers', 'partners',
  'onboarding', 'training', 'development', 'feedback',
];

export interface ExtractedHighlights {
  topTopics: string[];
  keySentences: string[];
  hasEnoughContent: boolean;
  warningMessage?: string;
}

/**
 * Extract meaningful topics from text.
 * Returns 3-6 phrases representing key discussion points.
 */
function extractTopics(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const wordCounts = new Map<string, number>();

  // Count word frequencies, excluding stopwords
  for (const word of words) {
    const cleaned = word.replace(/[^a-z0-9]/g, '');
    if (cleaned.length > 3 && !STOPWORDS.has(cleaned)) {
      wordCounts.set(cleaned, (wordCounts.get(cleaned) || 0) + 1);
    }
  }

  // Find bigrams (two-word phrases)
  const bigrams = new Map<string, number>();
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i].replace(/[^a-z0-9]/g, '');
    const w2 = words[i + 1].replace(/[^a-z0-9]/g, '');
    if (w1.length > 2 && w2.length > 2 && !STOPWORDS.has(w1) && !STOPWORDS.has(w2)) {
      const bigram = `${w1} ${w2}`;
      bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1);
    }
  }

  // Score topics by frequency and importance
  const topicScores = new Map<string, number>();

  // Score single words
  Array.from(wordCounts.entries()).forEach(([word, count]) => {
    let score = count;
    if (IMPORTANCE_KEYWORDS.some(k => k.includes(word))) {
      score *= 2;
    }
    // Boost proper-noun-like words (capitalized in original)
    if (text.match(new RegExp(`\\b${word}\\b`, 'i'))) {
      const matches = text.match(new RegExp(`\\b[A-Z]${word.slice(1)}\\b`, 'g'));
      if (matches && matches.length > 0) {
        score *= 1.5;
      }
    }
    topicScores.set(word, score);
  });

  // Score bigrams (weighted higher)
  Array.from(bigrams.entries()).forEach(([bigram, count]) => {
    if (count >= 2) {
      let score = count * 2;
      if (IMPORTANCE_KEYWORDS.some(k => bigram.includes(k) || k.includes(bigram))) {
        score *= 2;
      }
      topicScores.set(bigram, score);
    }
  });

  // Sort by score and take top topics
  const sorted = Array.from(topicScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Filter to 3-6 meaningful topics
  const topics = sorted
    .filter(([topic, score]) => score >= 2)
    .slice(0, 6)
    .map(([topic]) => topic);

  return topics.length >= 3 ? topics : topics.concat(['the role', 'team dynamics', 'next steps'].slice(0, 3 - topics.length));
}

/**
 * Extract key sentences from interview notes.
 * Scores sentences by relevance indicators.
 */
function extractKeySentences(text: string): string[] {
  // Split into sentences
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 300);

  if (sentences.length === 0) return [];

  // Score each sentence
  const scoredSentences: Array<{ sentence: string; score: number }> = [];

  for (const sentence of sentences) {
    let score = 0;
    const lower = sentence.toLowerCase();

    // Check for importance keywords
    for (const keyword of IMPORTANCE_KEYWORDS) {
      if (lower.includes(keyword)) {
        score += 2;
      }
    }

    // Check for specific patterns
    if (lower.includes('we discussed') || lower.includes('you mentioned')) score += 3;
    if (lower.includes('team') || lower.includes('role')) score += 2;
    if (lower.includes('challenge') || lower.includes('priority')) score += 2;
    if (lower.includes('timeline') || lower.includes('goal')) score += 2;

    // Check for numbers (specificity indicator)
    if (/\d+/.test(sentence)) score += 2;

    // Check for named entities (capitalized words not at start)
    const namedEntities = sentence.match(/(?<!^|\. )[A-Z][a-z]+/g);
    if (namedEntities && namedEntities.length > 0) score += namedEntities.length;

    // Penalize very short or generic sentences
    if (sentence.split(' ').length < 5) score -= 2;
    if (lower.includes('nice to meet') || lower.includes('thank you for')) score -= 3;

    if (score > 0) {
      scoredSentences.push({ sentence, score });
    }
  }

  // Sort by score and return top 2-4 sentences
  return scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ sentence }) => sentence);
}

/**
 * Main extraction function.
 * Returns topics and key sentences from interview notes.
 */
export function extractHighlights(notes: string): ExtractedHighlights {
  const trimmedNotes = notes.trim();
  const charCount = trimmedNotes.length;

  // Check if notes are too short
  if (charCount < 100) {
    return {
      topTopics: [],
      keySentences: [],
      hasEnoughContent: false,
      warningMessage: 'Interview notes are too brief to extract meaningful highlights. Please add more details from your conversation.',
    };
  }

  if (charCount < 400) {
    const topics = extractTopics(trimmedNotes);
    const sentences = extractKeySentences(trimmedNotes);
    return {
      topTopics: topics,
      keySentences: sentences,
      hasEnoughContent: false,
      warningMessage: 'Notes are short. The letter will use what\'s available, but adding more detail will improve personalization.',
    };
  }

  const topTopics = extractTopics(trimmedNotes);
  const keySentences = extractKeySentences(trimmedNotes);

  return {
    topTopics,
    keySentences,
    hasEnoughContent: keySentences.length >= 2,
    warningMessage: keySentences.length < 2
      ? 'Could not find enough specific details. Consider adding notes about what was discussed.'
      : undefined,
  };
}

/**
 * Extract impactful lines from resume text.
 * Looks for metrics, accomplishments, and action verbs.
 */
export function extractResumeImpact(resumeText: string): string[] {
  const lines = resumeText.split('\n').map(l => l.trim()).filter(l => l.length > 10);

  const impactLines: Array<{ line: string; score: number }> = [];

  for (const line of lines) {
    let score = 0;
    const lower = line.toLowerCase();

    // Check for metrics
    if (/\d+%/.test(line)) score += 3;
    if (/\$[\d,]+/.test(line)) score += 3;
    if (/\d+\+?\s*(years?|months?|weeks?|days?|hours?)/i.test(line)) score += 1;
    if (/\d+/.test(line)) score += 1;

    // Check for impact verbs
    const impactVerbs = ['saved', 'reduced', 'built', 'launched', 'improved', 'increased',
      'developed', 'created', 'led', 'managed', 'coordinated', 'implemented',
      'streamlined', 'optimized', 'transformed', 'delivered', 'achieved',
      'exceeded', 'grew', 'expanded', 'established', 'designed', 'executed'];

    for (const verb of impactVerbs) {
      if (lower.includes(verb)) score += 2;
    }

    // Check for EA-specific keywords
    const eaKeywords = ['executive', 'calendar', 'travel', 'board', 'meeting', 'stakeholder',
      'coordination', 'confidential', 'c-suite', 'leadership', 'support'];

    for (const keyword of eaKeywords) {
      if (lower.includes(keyword)) score += 1;
    }

    if (score >= 3) {
      impactLines.push({ line, score });
    }
  }

  return impactLines
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ line }) => line);
}
