import Link from 'next/link';
import { isActiveMember } from '@/lib/supabase-server';
import { EAImpactReport } from '@/components/tools/ea-impact-report/EAImpactReport';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export const metadata = {
  title: 'EA Impact Report Generator - EAwiz',
  description: 'Generate executive-ready reports that quantify EA impact and outcomes.',
};

export default async function EAImpactReportPage() {
  const isMember = await isActiveMember();

  if (!isMember) {
    return (
      <>
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="container py-12">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-4"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Tools
            </Link>
            <h1 className="text-4xl font-bold">EA Impact Report Generator</h1>
            <p className="mt-4 text-lg text-primary-100 max-w-2xl">
              Generate executive-ready reports that quantify EA impact and outcomes.
            </p>
          </div>
        </section>

        <section className="section bg-gray-50">
          <div className="container max-w-2xl">
            <Card variant="bordered" className="text-center">
              <CardHeader>
                <div className="mx-auto text-6xl mb-4">📊</div>
                <CardTitle className="text-2xl">Members Only</CardTitle>
                <CardDescription className="text-base mt-2">
                  The EA Impact Report Generator is available exclusively to EAwiz members.
                  Join today to access this and all our other premium tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Generate monthly, quarterly, and annual impact reports
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Auto-calculate metrics: hours saved, cost avoided, initiatives delivered
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Import from Accomplishments Tracker or CSV
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Confidentiality controls for sensitive items
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Executive-ready and internal EA report outputs
                  </li>
                </ul>
                <Link href="/join?from=ea-impact-report">
                  <Button variant="primary" size="lg">
                    Join EAwiz - $20/month
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-3xl font-bold">EA Impact Report Generator</h1>
          <p className="mt-2 text-primary-100">
            Generate executive-ready reports that quantify EA impact and outcomes.
          </p>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container">
          <EAImpactReport />
        </div>
      </section>
    </>
  );
}
