import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { CoverLetterFormData, GeneratedCoverLetter } from '@/types/cover-letter';

// Lazy initialization to avoid build-time errors
let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    _openai = new OpenAI({ apiKey });
  }
  return _openai;
}

const SYSTEM_PROMPT = `You are an expert career coach and professional writer specializing in Executive Assistant and senior administrative roles. You write cover letters that sound authentically human and highly tailored.

CRITICAL RULES - VIOLATIONS ARE UNACCEPTABLE:

1. NEVER use em dashes (—) - use commas, periods, or parentheses instead
2. NEVER use these phrases or close variations:
   - "I am thrilled to apply"
   - "I am excited to apply"
   - "I identify with the mission"
   - "I am passionate about"
   - "This role aligns with my background"
   - "I would love the opportunity"
   - "I believe I am a strong fit"
   - "I am confident my skills"
   - "I am eager to"
   - "I look forward to the opportunity"
3. NEVER use generic openings like "Dear Hiring Manager, I am writing to express my interest..."
4. NEVER use obvious AI structures or filler language
5. NEVER use buzzwords like "synergy", "leverage", "dynamic", "innovative" without specific context
6. NEVER end with "I look forward to hearing from you" - be more specific

REQUIRED APPROACH:

1. Open with a specific, contextual statement about the role or company - not enthusiasm
2. Ground every claim in concrete evidence from the resume
3. Reference company context factually, not with marketing language
4. Show understanding of what the role actually requires
5. Demonstrate judgment and executive presence through writing style
6. Be concise - no fluff or padding
7. Close with a specific, actionable statement

STRUCTURE GUIDELINES:

- 3-4 paragraphs maximum
- First paragraph: Context and positioning (why you, why this role)
- Middle paragraph(s): Specific evidence and value proposition
- Final paragraph: Clear, confident close without cliches

Write as a real executive-level professional would - someone who respects the reader's time and makes every sentence count.`;

function buildUserPrompt(data: CoverLetterFormData, version: 1 | 2 | 3): string {
  const toneInstructions = {
    professional: 'Use a polished, traditional professional tone that conveys competence and reliability.',
    direct: 'Be notably direct and concise. Lead with results. Minimize qualifiers. Every sentence should deliver value.',
    warm: 'Balance warmth with professionalism. Emphasize partnership, trust-building, and collaborative approach.',
    executive: 'Write with strategic gravitas. Emphasize leadership support, anticipation of needs, and business impact.',
  };

  const versionInstructions = {
    1: `VERSION 1 - TRADITIONAL BUT MODERN:
- Open with a strong contextual statement about your relevant experience
- Focus on execution and proven track record
- Emphasize operational excellence and reliability
- Structure: Context > Experience > Specific achievements > Close`,

    2: `VERSION 2 - DIRECT AND RESULTS-FOCUSED:
- Open with your most relevant accomplishment or qualification
- Lead every paragraph with impact
- Use shorter sentences and active voice throughout
- Minimize transitional phrases
- Structure: Key qualification > Results evidence > Business impact > Close`,

    3: `VERSION 3 - PARTNERSHIP-ORIENTED:
- Open by demonstrating understanding of what the role truly requires
- Emphasize judgment, discretion, and anticipatory support
- Highlight relationship-building and trust
- Show understanding of the executive partnership dynamic
- Structure: Role understanding > Partnership approach > Evidence > Close`,
  };

  let prompt = `Write a cover letter for this application:

COMPANY: ${data.companyName}
ROLE: ${data.roleTitle}
${data.companyUrl ? `COMPANY URL: ${data.companyUrl}` : ''}

JOB DESCRIPTION:
${data.jobDescription}

CANDIDATE RESUME:
${data.resumeText}

${data.additionalContext ? `ADDITIONAL CONTEXT: ${data.additionalContext}` : ''}

TONE: ${toneInstructions[data.tonePreference]}

${versionInstructions[version]}

REMEMBER:
- NO em dashes
- NO "thrilled/excited to apply"
- NO "passionate about"
- NO "strong fit" or "confident my skills"
- NO generic closings
- Ground everything in specific evidence from the resume
- Reference company context factually if the URL was provided
- Keep it to 3-4 paragraphs
- Make every sentence count

Write the complete cover letter now:`;

  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    const data: CoverLetterFormData = await request.json();

    // Validate required fields
    if (!data.resumeText || data.resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide your resume text (at least 50 characters)' },
        { status: 400 }
      );
    }

    if (!data.jobDescription || data.jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide the job description (at least 50 characters)' },
        { status: 400 }
      );
    }

    if (!data.companyName || data.companyName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide the company name' },
        { status: 400 }
      );
    }

    if (!data.roleTitle || data.roleTitle.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide the role title' },
        { status: 400 }
      );
    }

    const openai = getOpenAI();

    // Generate all three versions in parallel
    const versions: (1 | 2 | 3)[] = [1, 2, 3];
    const letterPromises = versions.map(async (version) => {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(data, version) },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      return completion.choices[0]?.message?.content || '';
    });

    const letterContents = await Promise.all(letterPromises);

    // Post-process to ensure no violations
    const cleanedLetters = letterContents.map((content) => {
      let cleaned = content;
      // Remove any em dashes that might have slipped through
      cleaned = cleaned.replace(/—/g, ', ');
      cleaned = cleaned.replace(/–/g, ', ');
      return cleaned;
    });

    const letters: GeneratedCoverLetter[] = [
      {
        id: 'version-1',
        title: 'Version 1: Traditional & Modern',
        description: 'Strong opening with context, focus on experience and execution',
        content: cleanedLetters[0],
      },
      {
        id: 'version-2',
        title: 'Version 2: Direct & Results-Focused',
        description: 'Concise approach emphasizing results and operational impact',
        content: cleanedLetters[1],
      },
      {
        id: 'version-3',
        title: 'Version 3: Partnership-Oriented',
        description: 'Warmer tone emphasizing trust, judgment, and partnership',
        content: cleanedLetters[2],
      },
    ];

    return NextResponse.json({ letters });
  } catch (error) {
    console.error('Error generating cover letters:', error);

    if (error instanceof Error && error.message === 'OPENAI_API_KEY is not set') {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate cover letters. Please try again.' },
      { status: 500 }
    );
  }
}
