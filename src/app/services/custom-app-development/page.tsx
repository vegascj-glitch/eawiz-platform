'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

const projectTypes = [
  { value: '', label: 'Select project type...' },
  { value: 'internal-tool', label: 'Internal Tool / Dashboard' },
  { value: 'automation', label: 'Workflow Automation' },
  { value: 'integration', label: 'App Integration' },
  { value: 'custom-gpt', label: 'Custom GPT / AI Assistant' },
  { value: 'notion-system', label: 'Notion System / Template' },
  { value: 'other', label: 'Other' },
];

const budgetRanges = [
  { value: '', label: 'Select budget range...' },
  { value: 'under-1k', label: 'Under $1,000' },
  { value: '1k-2.5k', label: '$1,000 - $2,500' },
  { value: '2.5k-5k', label: '$2,500 - $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-plus', label: '$10,000+' },
  { value: 'not-sure', label: 'Not sure yet' },
];

const timelineOptions = [
  { value: '', label: 'Select timeline...' },
  { value: 'asap', label: 'ASAP' },
  { value: '1-2-weeks', label: '1-2 weeks' },
  { value: '2-4-weeks', label: '2-4 weeks' },
  { value: '1-2-months', label: '1-2 months' },
  { value: 'flexible', label: 'Flexible' },
];

const hearAboutOptions = [
  { value: '', label: 'Select...' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'google', label: 'Google Search' },
  { value: 'referral', label: 'Referral' },
  { value: 'eawiz-member', label: 'EAwiz Member' },
  { value: 'event', label: 'Event / Conference' },
  { value: 'other', label: 'Other' },
];

const services = [
  {
    title: 'Internal Tools',
    description: 'Custom dashboards, trackers, and tools tailored to your workflow',
    icon: '🛠️',
  },
  {
    title: 'Workflow Automation',
    description: 'Zapier, Make, or custom automations to eliminate repetitive tasks',
    icon: '⚡',
  },
  {
    title: 'App Integrations',
    description: 'Connect your tools and create seamless data flows',
    icon: '🔗',
  },
  {
    title: 'Custom GPTs',
    description: 'AI assistants built for your specific needs and brand',
    icon: '🤖',
  },
  {
    title: 'Notion Systems',
    description: 'Comprehensive Notion setups for teams and executives',
    icon: '📋',
  },
  {
    title: 'AI Training',
    description: 'Custom training sessions for your team on AI tools',
    icon: '🎓',
  },
];

export default function CustomAppDevelopmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Honeypot check - if this field is filled, it's likely a bot
    const honeypot = formData.get('website_url') as string;
    if (honeypot) {
      // Silently "succeed" for bots
      setSubmitted(true);
      return;
    }

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      projectType: formData.get('projectType') as string,
      budget: formData.get('budget') as string,
      timeline: formData.get('timeline') as string,
      description: formData.get('description') as string,
      currentTools: formData.get('currentTools') as string,
      hearAbout: formData.get('hearAbout') as string,
    };

    try {
      const response = await fetch('/api/app-dev-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to submit');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <Card variant="bordered" className="max-w-lg w-full text-center">
          <CardContent className="py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You for Your Inquiry!
            </h2>
            <p className="text-gray-600 mb-6">
              We&apos;ve received your project request and will review the details.
              Expect to hear from us within 1-2 business days.
            </p>
            <Button
              variant="primary"
              onClick={() => (window.location.href = '/')}
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Custom App Development</h1>
            <p className="mt-6 text-xl text-primary-100">
              Need a custom tool, automation, or integration? We build solutions
              tailored to your workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">What We Build</h2>
            <p className="section-subtitle">
              From simple automations to complex custom tools, we help EAs and teams
              work smarter.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((service) => (
              <Card key={service.title} variant="bordered">
                <CardHeader>
                  <span className="text-3xl">{service.icon}</span>
                  <CardTitle className="mt-2">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  1
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Submit Inquiry</h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Tell us about your project and goals.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  2
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Discovery Call</h3>
                <p className="mt-2 text-gray-600 text-sm">
                  We&apos;ll discuss requirements and scope.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  3
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Proposal</h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Receive a detailed quote and timeline.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  4
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Build & Launch</h3>
                <p className="mt-2 text-gray-600 text-sm">
                  We build, test, and deliver your solution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card variant="bordered">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Request a Quote</CardTitle>
                <CardDescription>
                  Tell us about your project and we&apos;ll get back to you within 1-2 business days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field - hidden from users, bots will fill it */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website_url">Website URL</label>
                    <input
                      type="text"
                      id="website_url"
                      name="website_url"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Your Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <Input name="name" placeholder="Your full name" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <Input name="email" type="email" placeholder="your@email.com" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company / Organization <span className="text-gray-400">(optional)</span>
                        </label>
                        <Input name="company" placeholder="Your company name" />
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Project Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Type *
                        </label>
                        <Select name="projectType" options={projectTypes} required />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Budget Range *
                          </label>
                          <Select name="budget" options={budgetRanges} required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timeline *
                          </label>
                          <Select name="timeline" options={timelineOptions} required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Description *
                        </label>
                        <Textarea
                          name="description"
                          rows={4}
                          placeholder="Describe your project, the problem you're solving, and what success looks like..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Tools You Use <span className="text-gray-400">(optional)</span>
                        </label>
                        <Input
                          name="currentTools"
                          placeholder="e.g., Notion, Google Workspace, Slack, Zapier..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          How did you hear about us? *
                        </label>
                        <Select name="hearAbout" options={hearAboutOptions} required />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    Submit Inquiry
                  </Button>

                  <p className="text-center text-xs text-gray-500">
                    We typically respond within 1-2 business days.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
