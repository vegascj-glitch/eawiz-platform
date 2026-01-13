'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  CoverLetterFormData,
  GeneratedCoverLetter,
  TonePreference,
  TONE_OPTIONS,
} from '@/types/cover-letter';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export function CoverLetterGenerator() {
  const [resumeInputMode, setResumeInputMode] = useState<'paste' | 'upload'>('paste');
  const [resumeText, setResumeText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parseError, setParseError] = useState('');

  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [tonePreference, setTonePreference] = useState<TonePreference>('professional');
  const [additionalContext, setAdditionalContext] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetters, setGeneratedLetters] = useState<GeneratedCoverLetter[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingFile(true);
    setParseError('');
    setUploadedFileName(file.name);

    try {
      const fileType = file.name.toLowerCase();

      if (fileType.endsWith('.txt')) {
        const text = await file.text();
        setResumeText(text);
      } else if (fileType.endsWith('.docx')) {
        // Parse DOCX using mammoth
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setResumeText(result.value);
      } else if (fileType.endsWith('.pdf')) {
        // For PDF, we'll use a simpler approach - read as text
        // Note: Full PDF parsing would require pdf-parse on the server side
        setParseError('PDF parsing is limited. For best results, please paste your resume text directly or use a .docx file.');
        setResumeInputMode('paste');
      } else {
        setParseError('Unsupported file type. Please use .txt, .docx, or paste your resume directly.');
      }
    } catch (err) {
      console.error('Error parsing file:', err);
      setParseError('Failed to parse file. Please paste your resume text directly.');
    } finally {
      setIsParsingFile(false);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGeneratedLetters([]);

    if (!resumeText.trim()) {
      setError('Please provide your resume text');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please provide the job description');
      return;
    }

    if (!companyName.trim()) {
      setError('Please provide the company name');
      return;
    }

    if (!roleTitle.trim()) {
      setError('Please provide the role title');
      return;
    }

    setIsGenerating(true);

    try {
      const formData: CoverLetterFormData = {
        resumeText: resumeText.trim(),
        jobDescription: jobDescription.trim(),
        companyName: companyName.trim(),
        companyUrl: companyUrl.trim() || undefined,
        roleTitle: roleTitle.trim(),
        tonePreference,
        additionalContext: additionalContext.trim() || undefined,
      };

      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate cover letters');
        return;
      }

      setGeneratedLetters(data.letters);
      setActiveTab(0);
    } catch (err) {
      console.error('Error generating cover letters:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy to clipboard
  const handleCopy = async (content: string, letterId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(letterId);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Export to Word
  const handleExportWord = async (letter: GeneratedCoverLetter) => {
    const paragraphs = letter.content.split('\n\n').map((para) => {
      return new Paragraph({
        children: [
          new TextRun({
            text: para,
            size: 24, // 12pt
            font: 'Calibri',
          }),
        ],
        spacing: { after: 200 },
      });
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `Cover_Letter_${companyName.replace(/\s+/g, '_')}_${letter.id}.docx`;
    saveAs(blob, fileName);
  };

  // Export for Google Docs (downloads as .docx which can be uploaded to Google Docs)
  const handleExportGoogleDocs = async (letter: GeneratedCoverLetter) => {
    // Same as Word export, but with a note that it's optimized for Google Docs
    await handleExportWord(letter);
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Generate Cover Letters</CardTitle>
          <CardDescription>
            Provide your resume and job details to generate three tailored cover letter options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resume Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Resume <span className="text-red-500">*</span>
              </label>

              {/* Input mode toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setResumeInputMode('paste')}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                    resumeInputMode === 'paste'
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  Paste Text
                </button>
                <button
                  type="button"
                  onClick={() => setResumeInputMode('upload')}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                    resumeInputMode === 'upload'
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  Upload File
                </button>
              </div>

              {resumeInputMode === 'paste' ? (
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Paste your resume content here..."
                />
              ) : (
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.docx,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {isParsingFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600" />
                        <span className="text-gray-600">Parsing file...</span>
                      </div>
                    ) : uploadedFileName ? (
                      <div>
                        <p className="text-sm text-gray-600">Uploaded: <span className="font-medium">{uploadedFileName}</span></p>
                        <p className="text-xs text-gray-500 mt-1">Click to upload a different file</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600">Click to upload your resume</p>
                        <p className="text-xs text-gray-500 mt-1">Supports .txt and .docx files</p>
                      </div>
                    )}
                  </div>
                  {parseError && (
                    <p className="text-sm text-amber-600">{parseError}</p>
                  )}
                  {resumeText && resumeInputMode === 'upload' && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-2">Extracted text (you can edit):</p>
                      <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Paste the full job description here..."
              />
            </div>

            {/* Company Name and URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Anthropic"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website URL <span className="text-gray-400">(optional)</span>
                </label>
                <Input
                  type="url"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  placeholder="e.g., https://anthropic.com"
                />
                <p className="text-xs text-gray-500 mt-1">Helps tailor the letter to company context</p>
              </div>
            </div>

            {/* Role Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g., Executive Assistant to CEO"
              />
            </div>

            {/* Tone Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone Preference
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TONE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                      tonePreference === option.value
                        ? 'bg-primary-50 border-primary-300'
                        : 'border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={option.value}
                      checked={tonePreference === option.value}
                      onChange={(e) => setTonePreference(e.target.value as TonePreference)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{option.label}</p>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Context */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Context <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Referral from Jane Smith, career transition from marketing, returning after sabbatical..."
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isGenerating}
            >
              {isGenerating ? 'Generating Cover Letters...' : 'Generate Cover Letters'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Generated Letters Section */}
      {generatedLetters.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Cover Letters</h2>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {generatedLetters.map((letter, index) => (
              <button
                key={letter.id}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                  activeTab === index
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                Version {index + 1}
              </button>
            ))}
          </div>

          {/* Active Letter */}
          {generatedLetters[activeTab] && (
            <Card variant="bordered">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{generatedLetters[activeTab].title}</CardTitle>
                    <CardDescription>{generatedLetters[activeTab].description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(generatedLetters[activeTab].content, generatedLetters[activeTab].id)}
                    >
                      {copySuccess === generatedLetters[activeTab].id ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {generatedLetters[activeTab].content}
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-3">Export this version:</p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportWord(generatedLetters[activeTab])}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export to Word
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportGoogleDocs(generatedLetters[activeTab])}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export for Google Docs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <p className="text-sm text-gray-500 text-center py-4">
            These letters are generated based on the information you provided. Always review and edit before submitting.
          </p>
        </div>
      )}
    </div>
  );
}
