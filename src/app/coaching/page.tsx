import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { CoachingForm } from '@/components/coaching/CoachingForm';

export const metadata = {
  title: 'Private 1:1 Coaching - EAwiz',
  description: 'One hour of personalized coaching for Executive Assistants. Get unstuck, build custom GPTs, app training, resume revamp, and more.',
};

function CoachingContent() {
  return <CoachingForm />;
}

export default function CoachingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Private 1:1 Coaching</h1>
            <p className="mt-6 text-xl text-primary-100">
              One hour. Deep dive. Leave with a plan and momentum.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">What We Can Work On</h2>
            <p className="section-subtitle">
              Every session is tailored to your exact needs. Here are some popular topics:
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card variant="bordered">
              <CardHeader>
                <span className="text-3xl">🚀</span>
                <CardTitle className="mt-2">Get Unstuck Fast</CardTitle>
                <CardDescription>
                  Hands-on guidance to break through blockers and move forward with clarity.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card variant="bordered">
              <CardHeader>
                <span className="text-3xl">🎯</span>
                <CardTitle className="mt-2">Tailored Training</CardTitle>
                <CardDescription>
                  Custom training for your exact workflow, tools, and daily challenges.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card variant="bordered">
              <CardHeader>
                <span className="text-3xl">🤖</span>
                <CardTitle className="mt-2">Build a Custom GPT</CardTitle>
                <CardDescription>
                  Create a GPT tailored to your executive or personal brand.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card variant="bordered">
              <CardHeader>
                <span className="text-3xl">📱</span>
                <CardTitle className="mt-2">App Training</CardTitle>
                <CardDescription>
                  Notion, ChatGPT workflows, email systems, calendar optimization, and more.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card variant="bordered">
              <CardHeader>
                <span className="text-3xl">📝</span>
                <CardTitle className="mt-2">Resume + LinkedIn Revamp</CardTitle>
                <CardDescription>
                  Position yourself for high-impact EA, Chief of Staff, or operator roles.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card variant="bordered">
              <CardHeader>
                <span className="text-3xl">💼</span>
                <CardTitle className="mt-2">Job Search Strategy</CardTitle>
                <CardDescription>
                  Interview prep, salary positioning, and career strategy for your next move.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="mt-8 max-w-3xl mx-auto text-center">
            <p className="text-gray-600">
              <strong>Anything you choose</strong> — we&apos;ll shape the session around your goal.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What You&apos;ll Get</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Pre-session intake to shape the agenda</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">60 minutes of focused, 1:1 coaching</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Actionable takeaways and next steps</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Templates, prompts, or resources as needed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Session recording (upon request)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Who It&apos;s For</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">👩‍💼</span>
                    <span className="text-gray-700">Executive Assistants ready to level up</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <span className="text-gray-700">Chiefs of Staff seeking strategic tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">⚡</span>
                    <span className="text-gray-700">Operators building efficient systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🚀</span>
                    <span className="text-gray-700">Founders who want to work smarter</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  1
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Choose Your Coach</h3>
                <p className="mt-2 text-gray-600">
                  Select Courtney or Molly based on your goals and preferences.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  2
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Complete Payment</h3>
                <p className="mt-2 text-gray-600">
                  Secure checkout via Stripe. You&apos;ll receive confirmation instantly.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  3
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Schedule & Meet</h3>
                <p className="mt-2 text-gray-600">
                  We&apos;ll contact you within 24 hours to schedule your session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card variant="bordered">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Book Your Session</CardTitle>
                <CardDescription>
                  Fill out the form below and complete payment to secure your spot.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                  <CoachingContent />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
