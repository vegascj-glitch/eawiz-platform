import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const metadata = {
  title: 'Pricing - EAwiz',
  description: 'Join EAwiz for access to AI prompts, tools, community, and exclusive member events.',
};

const benefits = [
  {
    title: 'Prompt Library',
    description: '380+ AI prompts curated specifically for Executive Assistants',
    icon: '✨',
  },
  {
    title: 'Premium Tools',
    description: 'Access all Members-only tools including Calendar Audit, Executive Brief Generator, and more',
    icon: '🛠️',
  },
  {
    title: 'EAwiz Lounge',
    description: 'Connect with fellow EAs in our private community',
    icon: '💬',
  },
  {
    title: 'Live Events',
    description: 'Monthly AI for Admins sessions, workshops, and exclusive office hours',
    icon: '📅',
  },
  {
    title: 'Priority Support',
    description: 'Get help when you need it from our team',
    icon: '🎯',
  },
  {
    title: 'Early Access',
    description: 'Be the first to try new tools and features',
    icon: '🚀',
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Simple, Transparent Pricing</h1>
            <p className="mt-6 text-xl text-primary-100">
              One membership. Everything you need to excel as an EA.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <Card variant="bordered" className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Monthly</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900">$25</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription className="mt-4">
                  Flexible monthly billing. Cancel anytime.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/join?plan=monthly">
                  <Button variant="outline" className="w-full" size="lg">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Annual Plan */}
            <Card variant="bordered" className="relative border-primary-500 ring-2 ring-primary-500">
              <div className="absolute -top-3 right-4">
                <Badge variant="success" size="sm">
                  Save 17%
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Annual</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900">$250</span>
                  <span className="text-gray-500">/year</span>
                </div>
                <CardDescription className="mt-4">
                  Best value. Save $50 compared to monthly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/join?plan=annual">
                  <Button variant="primary" className="w-full" size="lg">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Everything Included</h2>
            <p className="section-subtitle">
              One membership unlocks the full EAwiz experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-4">
                <span className="text-3xl flex-shrink-0">{benefit.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 mt-1">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Tools */}
      <section className="section bg-white">
        <div className="container text-center">
          <h2 className="section-title">Free Tools Available</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Not ready to commit? Try our free tools first.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/tools">
              <Button variant="outline">EAwiz GPT</Button>
            </Link>
            <Link href="/tools/cover-letter-generator">
              <Button variant="outline">Cover Letter Generator</Button>
            </Link>
            <Link href="/tools/interview-tracker">
              <Button variant="outline">Interview Tracker</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center">Frequently Asked Questions</h2>
            <div className="mt-12 space-y-8">
              <div>
                <h3 className="font-semibold text-gray-900">Can I cancel anytime?</h3>
                <p className="mt-2 text-gray-600">
                  Yes! You can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">What payment methods do you accept?</h3>
                <p className="mt-2 text-gray-600">
                  We accept all major credit cards through our secure payment processor, Stripe.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Do you offer refunds?</h3>
                <p className="mt-2 text-gray-600">
                  If you&apos;re not satisfied within the first 7 days, contact us and we&apos;ll make it right.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Can I use a coupon code?</h3>
                <p className="mt-2 text-gray-600">
                  Yes! Enter your coupon code during checkout to apply any available discounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your Workflow?
          </h2>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Join hundreds of EAs who are already working smarter with EAwiz.
          </p>
          <div className="mt-10">
            <Link href="/join">
              <Button variant="secondary" size="lg">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
