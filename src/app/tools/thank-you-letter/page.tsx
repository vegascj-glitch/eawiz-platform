import Link from 'next/link';
import { ThankYouLetter } from '@/components/tools/thank-you-letter/ThankYouLetter';

export const metadata = {
  title: 'Thank You Letter Generator | EAwiz',
  description:
    'Generate a personalized, human-sounding post-interview thank you letter using your resume and interview notes. Free, no AI API required.',
};

export default function ThankYouLetterPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-12">
          <div className="max-w-3xl">
            <Link
              href="/tools"
              className="inline-flex items-center text-primary-100 hover:text-white mb-4 text-sm"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Tools
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">
              Thank You Letter Generator
            </h1>
            <p className="mt-3 text-lg text-primary-100">
              Create a genuine, personalized thank you note that references your
              actual interview conversation. No generic AI fluff.
            </p>
          </div>
        </div>
      </section>

      {/* Tool */}
      <section className="section bg-white">
        <div className="container">
          <ThankYouLetter />
        </div>
      </section>

      {/* Tips */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tips for a Great Thank You Letter
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong>Send within 24 hours</strong> of your interview while
                  the conversation is fresh.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong>Reference specific details</strong> from your
                  conversation to show you were engaged and listening.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong>Keep it concise</strong> - hiring managers are busy.
                  A few well-crafted paragraphs work better than a long letter.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong>Proofread before sending</strong> - typos can undermine
                  an otherwise strong impression.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong>Send individual notes</strong> if you met with multiple
                  people, personalizing each one.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
