'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

const topicOptions = [
  { value: '', label: 'Select a topic...' },
  { value: 'get-unstuck', label: 'Get unstuck / General guidance' },
  { value: 'custom-gpt', label: 'Build a custom GPT' },
  { value: 'app-training', label: 'App training (Notion, ChatGPT, etc.)' },
  { value: 'resume-linkedin', label: 'Resume + LinkedIn revamp' },
  { value: 'job-search', label: 'Job search strategy & interview prep' },
  { value: 'salary-negotiation', label: 'Salary positioning & negotiation' },
  { value: 'workflow-optimization', label: 'Workflow & systems optimization' },
  { value: 'ai-for-eas', label: 'AI tools for Executive Assistants' },
  { value: 'other', label: 'Other (describe below)' },
];

const timezoneOptions = [
  { value: '', label: 'Select your timezone...' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Phoenix', label: 'Arizona (AZ)' },
  { value: 'America/Anchorage', label: 'Alaska (AK)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii (HT)' },
  { value: 'other', label: 'Other' },
];

const coachOptions = [
  {
    value: 'courtney',
    name: 'Courtney',
    description: 'Founder of EAwiz, AI & productivity expert',
  },
  {
    value: 'molly',
    name: 'Molly',
    description: 'Career coach & EA strategy specialist',
  },
];

export function CoachingForm() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === '1') {
      setShowSuccess(true);
    }
    if (searchParams.get('canceled') === '1') {
      setShowCanceled(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Validate required fields
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const topic = formData.get('topic') as string;
    const timezone = formData.get('timezone') as string;
    const availability = formData.get('availability') as string;

    if (!name || !email || !topic || !timezone || !availability || !selectedCoach) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    const data = {
      name,
      email,
      linkedin: formData.get('linkedin') as string,
      topic,
      timezone,
      availability,
      coach: selectedCoach,
      notes: formData.get('notes') as string,
    };

    try {
      const response = await fetch('/api/stripe/create-coaching-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for booking a coaching session! We&apos;ll be in touch within 24 hours
          to schedule your 1:1 session.
        </p>
        <p className="text-sm text-gray-500">
          Check your email for a confirmation receipt from Stripe.
        </p>
      </div>
    );
  }

  if (showCanceled) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Canceled
        </h2>
        <p className="text-gray-600 mb-6">
          No worries! Your payment was not processed. Feel free to try again when you&apos;re ready.
        </p>
        <Button
          variant="primary"
          onClick={() => {
            setShowCanceled(false);
            window.history.replaceState({}, '', '/coaching');
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              LinkedIn URL <span className="text-gray-400">(recommended)</span>
            </label>
            <Input name="linkedin" type="url" placeholder="https://linkedin.com/in/yourprofile" />
          </div>
        </div>
      </div>

      {/* Session Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Session Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What would you like to work on? *
            </label>
            <Select name="topic" options={topicOptions} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Time Zone *
            </label>
            <Select name="timezone" options={timezoneOptions} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Hours *
            </label>
            <Textarea
              name="availability"
              rows={3}
              placeholder="e.g., Mon-Wed 2-5pm ET, Thu after 4pm, Fri mornings flexible"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Share your general availability so we can find a time that works.
            </p>
          </div>
        </div>
      </div>

      {/* Coach Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Choose Your Coach *
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coachOptions.map((coach) => (
            <label
              key={coach.value}
              className={`relative flex cursor-pointer rounded-lg border p-4 transition-colors ${
                selectedCoach === coach.value
                  ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="coach"
                value={coach.value}
                checked={selectedCoach === coach.value}
                onChange={(e) => setSelectedCoach(e.target.value)}
                className="sr-only"
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900">
                  {coach.name}
                </span>
                <span className="text-sm text-gray-600">{coach.description}</span>
              </div>
              {selectedCoach === coach.value && (
                <svg
                  className="absolute top-4 right-4 h-5 w-5 text-primary-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </label>
          ))}
        </div>
        {!selectedCoach && (
          <p className="mt-2 text-sm text-gray-500">
            Please select a coach to continue.
          </p>
        )}
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Anything else we should know? <span className="text-gray-400">(optional)</span>
        </label>
        <Textarea
          name="notes"
          rows={3}
          placeholder="Share any context, specific questions, or goals for our session..."
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="border-t pt-6">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
          disabled={!selectedCoach}
        >
          {isSubmitting ? 'Redirecting to checkout...' : 'Continue to Payment'}
        </Button>
        <p className="mt-3 text-center text-xs text-gray-500">
          Secure payment via Stripe. You&apos;ll be redirected to complete your purchase.
        </p>
      </div>
    </form>
  );
}
