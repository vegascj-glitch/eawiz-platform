'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

const benefits = [
  '380+ AI prompts curated for Executive Assistants',
  'Access to The EAwiz Lounge community',
  'Member-only events and workshops',
  'Early access to new tools',
  'Monthly AI for Admins sessions',
  'Cancel anytime',
];

export default function JoinPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const canceled = searchParams.get('canceled');

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'signup' | 'checkout' | 'magic-link'>('signup');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const supabase = createClient();

    // First, sign up/sign in the user
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/join?step=checkout`,
        data: {
          first_name: firstName,
        },
      },
    });

    if (authError) {
      setMessage({ type: 'error', text: authError.message });
      setIsLoading(false);
      return;
    }

    setStep('magic-link');
    setIsLoading(false);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Something went wrong',
      });
      setIsLoading(false);
    }
  };

  // Check if user is returning from auth callback
  if (typeof window !== 'undefined' && searchParams.get('step') === 'checkout') {
    // Auto-trigger checkout
    if (step === 'signup') {
      setStep('checkout');
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Join EAwiz</h1>
          <p className="mt-4 text-xl text-gray-600">
            Get instant access to everything you need to excel as an EA
          </p>
        </div>

        {canceled && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-yellow-800">
              Checkout was canceled. No worries - you can try again when you&apos;re ready.
            </p>
          </div>
        )}

        {from === 'prompts' && (
          <div className="mb-8 p-4 bg-primary-50 border border-primary-200 rounded-lg text-center">
            <p className="text-primary-800">
              Join EAwiz to get full access to our library of 380+ AI prompts.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Benefits */}
          <div>
            <Card variant="bordered" className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">EAwiz Membership</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold text-primary-600">$20</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
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
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right: Form */}
          <div>
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>
                  {step === 'magic-link'
                    ? 'Check Your Email'
                    : step === 'checkout'
                    ? 'Complete Your Subscription'
                    : 'Get Started'}
                </CardTitle>
                <CardDescription>
                  {step === 'magic-link'
                    ? "We've sent you a magic link to verify your email."
                    : step === 'checkout'
                    ? 'Click below to complete your subscription with Stripe.'
                    : 'Create your account to continue.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {step === 'signup' && (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {message && (
                      <div
                        className={`p-4 rounded-lg text-sm ${
                          message.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {message.text}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      size="lg"
                      isLoading={isLoading}
                    >
                      Continue
                    </Button>
                  </form>
                )}

                {step === 'magic-link' && (
                  <div className="text-center space-y-4">
                    <div className="text-6xl">📧</div>
                    <p className="text-gray-600">
                      Click the link in your email to verify your account and continue to
                      checkout.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setStep('signup')}
                    >
                      Use a different email
                    </Button>
                  </div>
                )}

                {step === 'checkout' && (
                  <div className="space-y-4">
                    {message && (
                      <div
                        className={`p-4 rounded-lg text-sm ${
                          message.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {message.text}
                      </div>
                    )}

                    <Button
                      variant="primary"
                      className="w-full"
                      size="lg"
                      onClick={handleCheckout}
                      isLoading={isLoading}
                    >
                      Subscribe for $20/month
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Secure checkout powered by Stripe. Cancel anytime.
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Secure payment
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Email support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
