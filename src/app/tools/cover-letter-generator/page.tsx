import { CoverLetterGenerator } from '@/components/tools/cover-letter-generator/CoverLetterGenerator';

export const metadata = {
  title: 'Cover Letter Generator | EAwiz',
  description: 'Generate tailored, human-sounding cover letters for Executive Assistant and senior administrative roles.',
};

export default function CoverLetterGeneratorPage() {
  return (
    <section className="section bg-white">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cover Letter Generator</h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Generate three tailored cover letter options that sound authentically human, not like AI.
            Each version offers a different approach while staying true to your experience.
          </p>
        </div>

        {/* Generator Component */}
        <CoverLetterGenerator />
      </div>
    </section>
  );
}
