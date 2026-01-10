'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

const eventTypes = [
  { value: '', label: 'Select event type...' },
  { value: 'keynote', label: 'Keynote' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'panel', label: 'Panel' },
  { value: 'fireside', label: 'Fireside Chat' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'other', label: 'Other' },
];

const audienceTypes = [
  { value: '', label: 'Select audience type...' },
  { value: 'eas', label: 'Executive Assistants' },
  { value: 'hr', label: 'HR Professionals' },
  { value: 'leadership', label: 'Leadership/Executives' },
  { value: 'mixed', label: 'Mixed Audience' },
  { value: 'other', label: 'Other' },
];

const eventFormats = [
  { value: '', label: 'Select format...' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'in-person', label: 'In-Person' },
  { value: 'hybrid', label: 'Hybrid' },
];

const budgetRanges = [
  { value: '', label: 'Select budget range...' },
  { value: 'under-1k', label: 'Under $1,000' },
  { value: '1k-2.5k', label: '$1,000 - $2,500' },
  { value: '2.5k-5k', label: '$2,500 - $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-plus', label: '$10,000+' },
  { value: 'tbd', label: 'To Be Determined' },
  { value: 'other', label: 'Other' },
];

const topicsOfInterest = [
  'AI for Executive Assistants',
  'Prompt Engineering for EAs',
  'Calendar & Time Management',
  'Strategic Partnership with Executives',
  'Professional Development for EAs',
  'Productivity & Automation',
  'Leadership & Communication',
  'Remote/Hybrid Work Strategies',
  'Career Advancement for EAs',
  'Building an EA Community',
];

const hearAboutOptions = [
  { value: '', label: 'Select...' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'google', label: 'Google Search' },
  { value: 'referral', label: 'Referral' },
  { value: 'event', label: 'Previous Event' },
  { value: 'social', label: 'Social Media' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'other', label: 'Other' },
];

const timezones = [
  { value: '', label: 'Select timezone...' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Phoenix', label: 'Arizona Time (AZ)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AK)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'GMT/BST (UK)' },
  { value: 'Europe/Paris', label: 'CET (Central Europe)' },
  { value: 'Asia/Tokyo', label: 'JST (Japan)' },
  { value: 'Australia/Sydney', label: 'AEST (Australia)' },
  { value: 'other', label: 'Other' },
];

export default function SpeakingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [otherTopic, setOtherTopic] = useState('');

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      organization: formData.get('organization') as string,
      roleTitle: formData.get('roleTitle') as string,
      eventName: formData.get('eventName') as string,
      eventType: formData.get('eventType') as string,
      audienceType: formData.get('audienceType') as string,
      audienceSize: formData.get('audienceSize') as string,
      eventDate: formData.get('eventDate') as string,
      timezone: formData.get('timezone') as string,
      eventFormat: formData.get('eventFormat') as string,
      location: formData.get('location') as string,
      budgetRange: formData.get('budgetRange') as string,
      topics: [...selectedTopics, otherTopic].filter(Boolean),
      outcomes: formData.get('outcomes') as string,
      additionalNotes: formData.get('additionalNotes') as string,
      hearAbout: formData.get('hearAbout') as string,
      consent: formData.get('consent') === 'on',
    };

    try {
      const response = await fetch('/api/speaking', {
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
              We&apos;ve received your speaking engagement request and will review the
              details. You can expect to hear back from us within 2-3 business days.
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
            <h1 className="text-4xl md:text-5xl font-bold">Speaking & Training</h1>
            <p className="mt-6 text-xl text-primary-100">
              Bring AI for Admins to your team or event. We offer keynotes,
              workshops, and custom training sessions.
            </p>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">Popular Topics</h2>
            <p className="section-subtitle">
              Our sessions are tailored to help Executive Assistants leverage AI
              effectively.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card variant="bordered">
              <CardHeader>
                <span className="text-3xl">🤖</span>
                <CardTitle className="mt-2">AI for EAs 101</CardTitle>
                <CardDescription>
                  Introduction to AI tools and practical applications for
                  Executive Assistants.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card variant="bordered">
              <CardHeader>
                <span className="text-3xl">✨</span>
                <CardTitle className="mt-2">Prompt Mastery</CardTitle>
                <CardDescription>
                  Learn to write effective prompts for email, scheduling, and
                  research tasks.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card variant="bordered">
              <CardHeader>
                <span className="text-3xl">🚀</span>
                <CardTitle className="mt-2">Strategic Partnership</CardTitle>
                <CardDescription>
                  Elevate your role from task manager to strategic partner using
                  AI.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card variant="bordered">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Request a Speaking Engagement</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you within 2-3
                  business days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <Input name="firstName" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <Input name="lastName" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <Input name="email" type="email" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone (Optional)
                        </label>
                        <Input name="phone" type="tel" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organization / Company *
                        </label>
                        <Input name="organization" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role / Title *
                        </label>
                        <Input name="roleTitle" required />
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Event Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Name *
                        </label>
                        <Input name="eventName" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Type *
                        </label>
                        <Select name="eventType" options={eventTypes} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Audience Type *
                        </label>
                        <Select name="audienceType" options={audienceTypes} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estimated Audience Size *
                        </label>
                        <Input
                          name="audienceSize"
                          placeholder="e.g., 50, 100-200, 500+"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Date (or Date Range) *
                        </label>
                        <Input
                          name="eventDate"
                          placeholder="e.g., March 15, 2026 or March 15-17, 2026"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time Zone *
                        </label>
                        <Select name="timezone" options={timezones} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Format *
                        </label>
                        <Select name="eventFormat" options={eventFormats} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location (if in-person/hybrid)
                        </label>
                        <Input
                          name="location"
                          placeholder="City, State/Country or Venue"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Budget Range *
                        </label>
                        <Select name="budgetRange" options={budgetRanges} required />
                      </div>
                    </div>
                  </div>

                  {/* Topics of Interest */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Topics of Interest
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Select all topics that interest you:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {topicsOfInterest.map((topic) => (
                        <label
                          key={topic}
                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic)}
                            onChange={() => handleTopicToggle(topic)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{topic}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Other Topic (Optional)
                      </label>
                      <Input
                        value={otherTopic}
                        onChange={(e) => setOtherTopic(e.target.value)}
                        placeholder="Describe any other topics..."
                      />
                    </div>
                  </div>

                  {/* Goals and Notes */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Goals & Additional Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Requested Outcomes / Goals *
                        </label>
                        <Textarea
                          name="outcomes"
                          rows={4}
                          placeholder="What do you hope attendees will learn or achieve?"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Notes (Optional)
                        </label>
                        <Textarea
                          name="additionalNotes"
                          rows={3}
                          placeholder="Any other information you'd like to share..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          How did you hear about EAwiz? *
                        </label>
                        <Select name="hearAbout" options={hearAboutOptions} required />
                      </div>
                    </div>
                  </div>

                  {/* Consent */}
                  <div className="border-t pt-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consent"
                        required
                        className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-600">
                        I consent to EAwiz contacting me regarding this speaking
                        engagement inquiry. I understand my information will be
                        handled according to the privacy policy. *
                      </span>
                    </label>
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
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
