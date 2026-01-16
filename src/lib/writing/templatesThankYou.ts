/**
 * Thank you letter templates with tone and length variations.
 * All templates are designed to sound human and EA-professional.
 * NO em dashes are used in any template.
 */

export type ToneType = 'formal' | 'warm' | 'direct' | 'enthusiastic' | 'executive';
export type LengthType = 'short' | 'standard' | 'detailed';
export type InterviewType = 'recruiter' | 'hiring_manager' | 'panel' | 'peer' | 'exec_final' | 'other';

export interface TemplateInput {
  interviewerNames: string;
  companyName: string;
  jobTitle: string;
  interviewType: InterviewType;
  interviewReferences: string[];
  resumeImpacts: string[];
  keyPoints: string[];
  tone: ToneType;
  length: LengthType;
  includeSubject: boolean;
  includeReintro: boolean;
}

export interface GeneratedLetter {
  subject: string;
  body: string;
  fullEmail: string;
}

// Greeting variations by tone
const GREETINGS: Record<ToneType, string[]> = {
  formal: ['Dear', 'Dear'],
  warm: ['Hi', 'Hello'],
  direct: ['Hi', 'Hello'],
  enthusiastic: ['Hi', 'Hello'],
  executive: ['Dear', 'Hello'],
};

// Opening lines - gratitude without cliches
const OPENING_LINES: Record<ToneType, string[]> = {
  formal: [
    'I appreciate the opportunity to speak with you about the {jobTitle} position.',
    'Thank you for meeting with me to discuss the {jobTitle} role.',
    'I valued our conversation about the {jobTitle} opportunity at {companyName}.',
  ],
  warm: [
    'I genuinely enjoyed our conversation about the {jobTitle} role.',
    'Our discussion about the {jobTitle} position gave me a clear picture of the opportunity.',
    'It was great connecting with you to learn more about the {jobTitle} role.',
  ],
  direct: [
    'Thank you for the conversation about the {jobTitle} position.',
    'I appreciated learning more about the {jobTitle} role today.',
    'Thanks for taking the time to discuss the {jobTitle} opportunity.',
  ],
  enthusiastic: [
    'What a great conversation about the {jobTitle} role.',
    'I walked away from our discussion energized about the {jobTitle} opportunity.',
    'Our talk about the {jobTitle} position reinforced my interest in joining {companyName}.',
  ],
  executive: [
    'Thank you for the thoughtful discussion regarding the {jobTitle} position.',
    'I appreciated the candid conversation about the {jobTitle} role and its strategic importance.',
    'Our meeting provided valuable insight into the {jobTitle} opportunity.',
  ],
};

// Interview reference bridges
const REFERENCE_BRIDGES: Record<ToneType, string[]> = {
  formal: [
    'Our discussion about {reference} resonated with my experience.',
    'I found our conversation regarding {reference} particularly relevant.',
    'Your insights on {reference} aligned well with my background.',
  ],
  warm: [
    'When you mentioned {reference}, it clicked with my experience.',
    'I kept thinking about what you shared regarding {reference}.',
    'Your point about {reference} really stood out to me.',
  ],
  direct: [
    'Regarding {reference}, I have direct experience in this area.',
    'What you described about {reference} matches my background.',
    'The discussion of {reference} connects to my past work.',
  ],
  enthusiastic: [
    'I found myself nodding when you described {reference}.',
    'Your description of {reference} got me thinking about how I can contribute.',
    'The conversation about {reference} was exactly what I hoped to hear.',
  ],
  executive: [
    'The strategic considerations around {reference} align with my approach.',
    'Your perspective on {reference} reflects the kind of challenges I navigate well.',
    'Our discussion of {reference} highlighted clear synergies with my experience.',
  ],
};

// Fit statement bridges
const FIT_BRIDGES: Record<ToneType, string[]> = {
  formal: [
    'My background in {impact} positions me to contribute meaningfully to your team.',
    'Having {impact}, I understand the demands of this type of work.',
    'My experience with {impact} prepares me for the expectations of this role.',
  ],
  warm: [
    'My work on {impact} gave me skills that translate directly to this role.',
    'What I learned from {impact} would help me hit the ground running.',
    'The experience of {impact} shaped how I approach this type of work.',
  ],
  direct: [
    'My track record with {impact} applies here.',
    'I have done similar work: {impact}.',
    'This connects to my experience: {impact}.',
  ],
  enthusiastic: [
    'I cannot wait to bring my experience with {impact} to this role.',
    'My work on {impact} fuels my eagerness to take on this challenge.',
    'Having accomplished {impact}, I see real potential to make an impact here.',
  ],
  executive: [
    'My experience delivering {impact} demonstrates the caliber of support I provide.',
    'The results I achieved with {impact} reflect my standard of execution.',
    'My approach to {impact} exemplifies how I operate at the executive level.',
  ],
};

// Enthusiasm/next steps closings
const CLOSINGS: Record<ToneType, string[]> = {
  formal: [
    'I remain interested in this opportunity and look forward to the next steps.',
    'Please do not hesitate to reach out if you need any additional information.',
    'I welcome the opportunity to continue our conversation.',
  ],
  warm: [
    'I am looking forward to what comes next in this process.',
    'Please let me know if there is anything else helpful I can share.',
    'I hope we get the chance to continue this conversation soon.',
  ],
  direct: [
    'Let me know the next steps when you have a chance.',
    'Happy to provide any additional information you need.',
    'Looking forward to hearing about next steps.',
  ],
  enthusiastic: [
    'I am eager to see where this goes and ready to jump in.',
    'Cannot wait to hear about next steps in the process.',
    'I am ready to bring this energy to your team.',
  ],
  executive: [
    'I look forward to discussing how I can support your leadership.',
    'Please reach out as next steps become clear.',
    'I welcome further discussion at your convenience.',
  ],
};

// Sign-offs by tone
const SIGNOFFS: Record<ToneType, string[]> = {
  formal: ['Best regards,', 'Sincerely,', 'With appreciation,'],
  warm: ['Warmly,', 'Best,', 'Thanks again,'],
  direct: ['Best,', 'Thanks,', 'Regards,'],
  enthusiastic: ['With enthusiasm,', 'Cheers,', 'Best,'],
  executive: ['Best regards,', 'Respectfully,', 'With appreciation,'],
};

// Subject line templates
const SUBJECT_LINES: Record<InterviewType, string[]> = {
  recruiter: [
    'Following up - {jobTitle} conversation',
    'Thank you - {jobTitle} discussion',
    'Great speaking with you - {jobTitle}',
  ],
  hiring_manager: [
    'Thank you - {jobTitle} interview',
    'Following our {jobTitle} conversation',
    'Appreciated our discussion - {jobTitle}',
  ],
  panel: [
    'Thank you - {jobTitle} panel interview',
    'Great meeting the team - {jobTitle}',
    'Following up after panel - {jobTitle}',
  ],
  peer: [
    'Great connecting - {jobTitle} role',
    'Thank you for the perspective - {jobTitle}',
    'Enjoyed our conversation - {jobTitle}',
  ],
  exec_final: [
    'Thank you - {jobTitle} final interview',
    'Following our conversation - {jobTitle}',
    'Appreciated the discussion - {jobTitle}',
  ],
  other: [
    'Following up - {jobTitle}',
    'Thank you - {jobTitle} conversation',
    'Great speaking with you - {jobTitle}',
  ],
};

// Re-intro lines
const REINTRO_LINES: Record<InterviewType, string[]> = {
  recruiter: [
    'We spoke {timeframe} about the {jobTitle} opening.',
    'You and I connected {timeframe} regarding the {jobTitle} role.',
  ],
  hiring_manager: [
    'We met {timeframe} to discuss the {jobTitle} position on your team.',
    'I interviewed with you {timeframe} for the {jobTitle} role.',
  ],
  panel: [
    'I met with you and the team {timeframe} for the {jobTitle} position.',
    'We spoke as part of the panel interview {timeframe} for {jobTitle}.',
  ],
  peer: [
    'We connected {timeframe} as part of my interview process for {jobTitle}.',
    'You shared your perspective on the team {timeframe} during my {jobTitle} interview.',
  ],
  exec_final: [
    'We met {timeframe} for the final interview regarding the {jobTitle} role.',
    'I had the opportunity to speak with you {timeframe} about the {jobTitle} position.',
  ],
  other: [
    'We spoke {timeframe} about the {jobTitle} opportunity.',
    'You and I connected {timeframe} regarding {jobTitle}.',
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

/**
 * Build a reference paragraph from interview notes.
 */
function buildReferenceParagraph(references: string[], tone: ToneType, length: LengthType): string {
  if (references.length === 0) return '';

  const sentences: string[] = [];
  const refCount = length === 'short' ? 1 : length === 'standard' ? 2 : 3;
  const selectedRefs = references.slice(0, refCount);

  for (const ref of selectedRefs) {
    const bridge = pickRandom(REFERENCE_BRIDGES[tone]);
    sentences.push(fillTemplate(bridge, { reference: ref }));
  }

  return sentences.join(' ');
}

/**
 * Build a fit statement from resume impacts.
 */
function buildFitStatement(impacts: string[], tone: ToneType, length: LengthType): string {
  if (impacts.length === 0) return '';

  const sentences: string[] = [];
  const impactCount = length === 'short' ? 1 : 2;
  const selectedImpacts = impacts.slice(0, impactCount);

  for (const impact of selectedImpacts) {
    const bridge = pickRandom(FIT_BRIDGES[tone]);
    // Clean up the impact line for insertion
    const cleanImpact = impact.replace(/^[-•*]\s*/, '').trim();
    sentences.push(fillTemplate(bridge, { impact: cleanImpact }));
  }

  return sentences.join(' ');
}

/**
 * Build key points reinforcement paragraph.
 */
function buildKeyPointsParagraph(keyPoints: string[], tone: ToneType): string {
  if (keyPoints.length === 0) return '';

  const intro = tone === 'direct'
    ? 'To reinforce:'
    : tone === 'enthusiastic'
    ? 'A few things I wanted to emphasize:'
    : 'I also wanted to highlight:';

  const formatted = keyPoints.map(p => p.trim()).join('; ');
  return `${intro} ${formatted}.`;
}

/**
 * Generate a thank you letter based on inputs.
 */
export function generateThankYouLetter(input: TemplateInput): GeneratedLetter {
  const {
    interviewerNames,
    companyName,
    jobTitle,
    interviewType,
    interviewReferences,
    resumeImpacts,
    keyPoints,
    tone,
    length,
    includeSubject,
    includeReintro,
  } = input;

  const vars = {
    interviewerNames,
    companyName,
    jobTitle,
    timeframe: 'recently',
  };

  // Build subject
  const subjectTemplate = pickRandom(SUBJECT_LINES[interviewType]);
  const subject = fillTemplate(subjectTemplate, vars);

  // Build body paragraphs
  const paragraphs: string[] = [];

  // Greeting
  const greeting = `${pickRandom(GREETINGS[tone])} ${interviewerNames},`;
  paragraphs.push(greeting);

  // Re-intro (optional)
  if (includeReintro) {
    const reintroTemplate = pickRandom(REINTRO_LINES[interviewType]);
    paragraphs.push(fillTemplate(reintroTemplate, vars));
  }

  // Opening line
  const openingTemplate = pickRandom(OPENING_LINES[tone]);
  paragraphs.push(fillTemplate(openingTemplate, vars));

  // Interview references paragraph
  const refParagraph = buildReferenceParagraph(interviewReferences, tone, length);
  if (refParagraph) {
    paragraphs.push(refParagraph);
  }

  // Fit statement paragraph
  const fitParagraph = buildFitStatement(resumeImpacts, tone, length);
  if (fitParagraph) {
    paragraphs.push(fitParagraph);
  }

  // Key points (if provided and length allows)
  if (keyPoints.length > 0 && length !== 'short') {
    const keyPointsPara = buildKeyPointsParagraph(keyPoints, tone);
    paragraphs.push(keyPointsPara);
  }

  // Closing
  const closing = pickRandom(CLOSINGS[tone]);
  paragraphs.push(closing);

  // Sign-off
  const signoff = pickRandom(SIGNOFFS[tone]);
  paragraphs.push(signoff);
  paragraphs.push('[Your Name]');

  // Assemble body
  const body = paragraphs.join('\n\n');

  // Full email
  const fullEmail = includeSubject ? `Subject: ${subject}\n\n${body}` : body;

  return {
    subject,
    body,
    fullEmail,
  };
}

/**
 * Get word count for a text.
 */
export function getWordCount(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Check if letter meets length target.
 */
export function meetsLengthTarget(text: string, length: LengthType): { meets: boolean; message?: string } {
  const wordCount = getWordCount(text);
  const targets: Record<LengthType, { min: number; max: number }> = {
    short: { min: 110, max: 140 },
    standard: { min: 160, max: 220 },
    detailed: { min: 230, max: 300 },
  };

  const { min, max } = targets[length];

  if (wordCount < min) {
    return { meets: false, message: `Letter is ${wordCount} words, below the ${min} word target for ${length} length.` };
  }
  if (wordCount > max) {
    return { meets: false, message: `Letter is ${wordCount} words, exceeding the ${max} word target for ${length} length.` };
  }
  return { meets: true };
}
