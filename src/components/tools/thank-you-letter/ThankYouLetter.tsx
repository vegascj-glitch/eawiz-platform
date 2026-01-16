'use client';

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { extractHighlights, extractResumeImpact } from '@/lib/writing/extractHighlights';
import { lintPhrases, PhraseWarning } from '@/lib/writing/phraseLint';
import { removeEmDashes, containsEmDash } from '@/lib/writing/noEmDash';
import {
  generateThankYouLetter,
  getWordCount,
  meetsLengthTarget,
  ToneType,
  LengthType,
  InterviewType,
  GeneratedLetter,
} from '@/lib/writing/templatesThankYou';
import { formatEmail, downloadAsTxt, generateFilename, FormatType } from '@/lib/writing/formatExport';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const INTERVIEW_TYPES: Array<{ value: InterviewType; label: string }> = [
  { value: 'recruiter', label: 'Recruiter Screen' },
  { value: 'hiring_manager', label: 'Hiring Manager' },
  { value: 'panel', label: 'Panel Interview' },
  { value: 'peer', label: 'Peer Interview' },
  { value: 'exec_final', label: 'Executive/Final' },
  { value: 'other', label: 'Other' },
];

const TONE_OPTIONS: Array<{ value: ToneType; label: string; description: string }> = [
  { value: 'formal', label: 'Formal', description: 'Traditional, polished language' },
  { value: 'warm', label: 'Warm Professional', description: 'Friendly yet professional' },
  { value: 'direct', label: 'Short & Direct', description: 'Concise and to the point' },
  { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and eager' },
  { value: 'executive', label: 'Executive-level', description: 'Polished and strategic' },
];

const LENGTH_OPTIONS: Array<{ value: LengthType; label: string; range: string }> = [
  { value: 'short', label: 'Short', range: '110-140 words' },
  { value: 'standard', label: 'Standard', range: '160-220 words' },
  { value: 'detailed', label: 'Detailed', range: '230-300 words' },
];

interface FormState {
  interviewerNames: string;
  companyName: string;
  jobTitle: string;
  interviewType: InterviewType;
  resumeText: string;
  jobDescription: string;
  interviewNotes: string;
  keyPoints: string;
  includeSubject: boolean;
  includeReintro: boolean;
  tone: ToneType;
  length: LengthType;
}

const DEFAULT_FORM: FormState = {
  interviewerNames: '',
  companyName: '',
  jobTitle: '',
  interviewType: 'hiring_manager',
  resumeText: '',
  jobDescription: '',
  interviewNotes: '',
  keyPoints: '',
  includeSubject: true,
  includeReintro: false,
  tone: 'warm',
  length: 'standard',
};

export function ThankYouLetter() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetter | null>(null);
  const [editedBody, setEditedBody] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [formatType, setFormatType] = useState<FormatType>('plain');

  // Extract highlights from interview notes
  const highlights = useMemo(() => {
    if (!form.interviewNotes.trim()) return null;
    return extractHighlights(form.interviewNotes);
  }, [form.interviewNotes]);

  // Extract resume impacts
  const resumeImpacts = useMemo(() => {
    if (!form.resumeText.trim()) return [];
    return extractResumeImpact(form.resumeText);
  }, [form.resumeText]);

  // Parse key points from textarea
  const parsedKeyPoints = useMemo(() => {
    if (!form.keyPoints.trim()) return [];
    return form.keyPoints
      .split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 0);
  }, [form.keyPoints]);

  // Lint the current output
  const lintWarnings = useMemo((): PhraseWarning[] => {
    const textToLint = editedBody || generatedLetter?.body || '';
    return lintPhrases(textToLint);
  }, [editedBody, generatedLetter]);

  // Check for em dashes in current output
  const hasEmDash = useMemo(() => {
    const textToCheck = editedBody || generatedLetter?.body || '';
    return containsEmDash(textToCheck);
  }, [editedBody, generatedLetter]);

  // Check length compliance
  const lengthCheck = useMemo(() => {
    const textToCheck = editedBody || generatedLetter?.body || '';
    if (!textToCheck) return null;
    return meetsLengthTarget(textToCheck, form.length);
  }, [editedBody, generatedLetter, form.length]);

  // Word count
  const wordCount = useMemo(() => {
    const textToCount = editedBody || generatedLetter?.body || '';
    return getWordCount(textToCount);
  }, [editedBody, generatedLetter]);

  const updateForm = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleGenerate = useCallback(() => {
    // Build interview references from highlights or key points
    const interviewReferences: string[] = [];

    if (highlights?.keySentences && highlights.keySentences.length > 0) {
      // Use extracted sentences, condensed
      for (const sentence of highlights.keySentences.slice(0, 3)) {
        // Extract key phrase from sentence
        const condensed = sentence.length > 80 ? sentence.substring(0, 77) + '...' : sentence;
        interviewReferences.push(condensed);
      }
    }

    // Add from key points if user provided
    if (parsedKeyPoints.length > 0) {
      interviewReferences.push(...parsedKeyPoints.slice(0, 2));
    }

    // Fallback to topics if no sentences
    if (interviewReferences.length === 0 && highlights?.topTopics) {
      interviewReferences.push(...highlights.topTopics.slice(0, 3));
    }

    const letter = generateThankYouLetter({
      interviewerNames: form.interviewerNames || 'Hiring Team',
      companyName: form.companyName,
      jobTitle: form.jobTitle,
      interviewType: form.interviewType,
      interviewReferences,
      resumeImpacts,
      keyPoints: parsedKeyPoints,
      tone: form.tone,
      length: form.length,
      includeSubject: form.includeSubject,
      includeReintro: form.includeReintro,
    });

    // Sanitize output to remove any em dashes
    const sanitizedLetter: GeneratedLetter = {
      subject: removeEmDashes(letter.subject),
      body: removeEmDashes(letter.body),
      fullEmail: removeEmDashes(letter.fullEmail),
    };

    setGeneratedLetter(sanitizedLetter);
    setEditedBody(sanitizedLetter.body);
  }, [form, highlights, resumeImpacts, parsedKeyPoints]);

  const handleRegenerate = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleCopy = useCallback(async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, []);

  const handleCopySubject = useCallback(() => {
    if (generatedLetter) {
      handleCopy(generatedLetter.subject, 'subject');
    }
  }, [generatedLetter, handleCopy]);

  const handleCopyBody = useCallback(() => {
    const body = editedBody || generatedLetter?.body || '';
    const formatted = formatEmail(generatedLetter?.subject || '', body, {
      format: formatType,
      includeSubject: false,
    });
    handleCopy(formatted, 'body');
  }, [editedBody, generatedLetter, formatType, handleCopy]);

  const handleCopyFull = useCallback(() => {
    const body = editedBody || generatedLetter?.body || '';
    const formatted = formatEmail(generatedLetter?.subject || '', body, {
      format: formatType,
      includeSubject: form.includeSubject,
    });
    handleCopy(formatted, 'full');
  }, [editedBody, generatedLetter, formatType, form.includeSubject, handleCopy]);

  const handleDownloadTxt = useCallback(() => {
    const body = editedBody || generatedLetter?.body || '';
    const formatted = formatEmail(generatedLetter?.subject || '', body, {
      format: 'plain',
      includeSubject: form.includeSubject,
    });
    const filename = generateFilename(form.companyName);
    downloadAsTxt(formatted, filename);
  }, [editedBody, generatedLetter, form.companyName, form.includeSubject]);

  const handleDownloadDocx = useCallback(async () => {
    const body = editedBody || generatedLetter?.body || '';
    const paragraphs = body.split('\n\n').map((para) => {
      return new Paragraph({
        children: [
          new TextRun({
            text: para,
            size: 24,
            font: 'Calibri',
          }),
        ],
        spacing: { after: 200 },
      });
    });

    if (form.includeSubject && generatedLetter?.subject) {
      paragraphs.unshift(
        new Paragraph({
          children: [
            new TextRun({
              text: `Subject: ${generatedLetter.subject}`,
              size: 24,
              font: 'Calibri',
              bold: true,
            }),
          ],
          spacing: { after: 400 },
        })
      );
    }

    const doc = new Document({
      sections: [{ properties: {}, children: paragraphs }],
    });

    const blob = await Packer.toBlob(doc);
    const filename = generateFilename(form.companyName) + '.docx';
    saveAs(blob, filename);
  }, [editedBody, generatedLetter, form.companyName, form.includeSubject]);

  const handleInsertReference = useCallback((reference: string) => {
    setEditedBody(prev => {
      // Insert reference at the end of the second paragraph
      const paragraphs = prev.split('\n\n');
      if (paragraphs.length >= 3) {
        paragraphs[2] = paragraphs[2] + ' ' + reference;
      } else {
        paragraphs.push(reference);
      }
      return paragraphs.join('\n\n');
    });
  }, []);

  // Validation
  const canGenerate = form.interviewerNames.trim() && form.companyName.trim() && form.jobTitle.trim();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Panel - Inputs */}
      <div className="lg:col-span-4 space-y-6">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Interview Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interviewer Name(s) <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={form.interviewerNames}
                onChange={(e) => updateForm('interviewerNames', e.target.value)}
                placeholder="e.g., Sarah Johnson"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={form.companyName}
                onChange={(e) => updateForm('companyName', e.target.value)}
                placeholder="e.g., Acme Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={form.jobTitle}
                onChange={(e) => updateForm('jobTitle', e.target.value)}
                placeholder="e.g., Executive Assistant to CEO"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Type
              </label>
              <select
                value={form.interviewType}
                onChange={(e) => updateForm('interviewType', e.target.value as InterviewType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {INTERVIEW_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume <span className="text-gray-400">(paste text)</span>
              </label>
              <textarea
                value={form.resumeText}
                onChange={(e) => updateForm('resumeText', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                placeholder="Paste your resume text..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description <span className="text-gray-400">(paste text)</span>
              </label>
              <textarea
                value={form.jobDescription}
                onChange={(e) => updateForm('jobDescription', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                placeholder="Paste the job description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Transcript or Notes
              </label>
              <p className="text-xs text-gray-500 mb-2">Paste transcript/notes from notetaker</p>
              <textarea
                value={form.interviewNotes}
                onChange={(e) => updateForm('interviewNotes', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                placeholder="Paste your interview notes or transcript here..."
              />
              {highlights?.warningMessage && (
                <p className="text-xs text-amber-600 mt-1">{highlights.warningMessage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Points to Reinforce <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={form.keyPoints}
                onChange={(e) => updateForm('keyPoints', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                placeholder="- Point one&#10;- Point two&#10;- Point three"
              />
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Include subject line</label>
              <button
                type="button"
                onClick={() => updateForm('includeSubject', !form.includeSubject)}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  form.includeSubject ? 'bg-primary-600' : 'bg-gray-200'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    form.includeSubject ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Include 1-line re-intro</label>
              <button
                type="button"
                onClick={() => updateForm('includeReintro', !form.includeReintro)}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  form.includeReintro ? 'bg-primary-600' : 'bg-gray-200'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    form.includeReintro ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
              <div className="grid grid-cols-3 gap-2">
                {LENGTH_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateForm('length', opt.value)}
                    className={cn(
                      'px-3 py-2 text-xs rounded-lg border transition-colors',
                      form.length === opt.value
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                    )}
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs opacity-75">{opt.range}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
              <div className="space-y-2">
                {TONE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateForm('tone', opt.value)}
                    className={cn(
                      'w-full px-3 py-2 text-left rounded-lg border transition-colors',
                      form.tone === opt.value
                        ? 'bg-primary-50 border-primary-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    <div className="font-medium text-sm">{opt.label}</div>
                    <div className="text-xs text-gray-500">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Center Panel - Draft */}
      <div className="lg:col-span-5 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Generated Letter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="flex-1"
              >
                Generate
              </Button>
              {generatedLetter && (
                <Button variant="outline" onClick={handleRegenerate}>
                  Regenerate
                </Button>
              )}
            </div>

            {!canGenerate && (
              <p className="text-sm text-amber-600">
                Please fill in interviewer name, company, and job title to generate.
              </p>
            )}

            {generatedLetter && (
              <>
                {form.includeSubject && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Subject Line</p>
                    <p className="text-sm font-medium">{generatedLetter.subject}</p>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">Body (editable)</p>
                    <p className="text-xs text-gray-400">{wordCount} words</p>
                  </div>
                  <textarea
                    value={editedBody}
                    onChange={(e) => setEditedBody(removeEmDashes(e.target.value))}
                    rows={16}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                  />
                </div>

                {/* Warnings */}
                <div className="space-y-2">
                  {hasEmDash && (
                    <Badge variant="danger" size="sm">
                      Em dash detected - will be removed on copy
                    </Badge>
                  )}
                  {lengthCheck && !lengthCheck.meets && (
                    <Badge variant="warning" size="sm">
                      {lengthCheck.message}
                    </Badge>
                  )}
                  {lintWarnings.length > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs font-medium text-amber-800 mb-2">
                        Cliche phrases detected ({lintWarnings.length})
                      </p>
                      <ul className="space-y-1">
                        {lintWarnings.slice(0, 3).map((w, i) => (
                          <li key={i} className="text-xs text-amber-700">
                            &quot;{w.phrase}&quot; - {w.suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Reference chips */}
                {highlights && highlights.topTopics.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">References from notes (click to insert)</p>
                    <div className="flex flex-wrap gap-2">
                      {highlights.topTopics.slice(0, 6).map((topic, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleInsertReference(topic)}
                          className="px-2 py-1 text-xs bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Actions */}
      <div className="lg:col-span-3 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Copy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleCopySubject}
              disabled={!generatedLetter}
            >
              {copySuccess === 'subject' ? 'Copied!' : 'Copy Subject'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleCopyBody}
              disabled={!generatedLetter}
            >
              {copySuccess === 'body' ? 'Copied!' : 'Copy Body'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={handleCopyFull}
              disabled={!generatedLetter}
            >
              {copySuccess === 'full' ? 'Copied!' : 'Copy Full Email'}
            </Button>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleDownloadTxt}
              disabled={!generatedLetter}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download .txt
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleDownloadDocx}
              disabled={!generatedLetter}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download .docx
            </Button>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Formatting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(['plain', 'gmail', 'outlook'] as FormatType[]).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormatType(fmt)}
                className={cn(
                  'w-full px-3 py-2 text-sm text-left rounded-lg border transition-colors',
                  formatType === fmt
                    ? 'bg-primary-50 border-primary-300 text-primary-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                )}
              >
                {fmt === 'plain' && 'Plain text'}
                {fmt === 'gmail' && 'Gmail-friendly'}
                {fmt === 'outlook' && 'Outlook-friendly'}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
