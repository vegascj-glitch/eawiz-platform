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

export function CoachingForm() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

    if (!name || !email || !topic || !timezone || !availability) {
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
      coach: 'courtney', // Always Courtney
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
          Thank you for booking a coaching session with Courtney! We&apos;ll be in touch within 24 hours
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
            window.history.replaceState({}, '', '/services/coaching');
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

      {/* Coach Info - Courtney Only */}
      <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-200 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Your Coach: Courtney</p>
            <p className="text-sm text-gray-600">Founder of EAwiz, AI & productivity expert</p>
          </div>
        </div>
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
