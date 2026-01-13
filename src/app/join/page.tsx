'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

type Msg = { type: 'success' | 'error'; text: string } | null;
type PlanType = 'monthly' | 'annual';

const plans = {
  monthly: {
    name: 'Monthly',
    price: 25,
    period: '/month',
    description: 'Flexible monthly billing',
  },
  annual: {
    name: 'Annual',
    price: 250,
    period: '/year',
    description: 'Save $50 vs monthly',
    savings: 'Save 17%',
  },
};

const benefits = [
  '380+ AI Prompts for EAs',
  'Access to The EAwiz Lounge community',
  'All premium AI tools',
  'Exclusive member events',
  'Priority support',
];

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = (searchParams.get('plan') as PlanType) || 'monthly';
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(initialPlan);
  const [email, setEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [message, setMessage] = useState<Msg>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const missingEnv =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if user canceled from Stripe
  const canceled = searchParams.get('canceled');

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setCheckingAuth(false);
    };
    checkAuth();
  }, [supabase]);

  // Update selected plan from URL
  useEffect(() => {
    const planFromUrl = searchParams.get('plan') as PlanType;
    if (planFromUrl && (planFromUrl === 'monthly' || planFromUrl === 'annual')) {
      setSelectedPlan(planFromUrl);
    }
  }, [searchParams]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (missingEnv) {
      setIsLoading(false);
      setMessage({
        type: 'error',
        text: "Supabase isn't configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel → Project → Settings → Environment Variables.",
      });
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/join`,
      },
    });

    setIsLoading(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({
        type: 'success',
        text: 'Check your email for the magic link! Once logged in, return here to complete checkout.',
      });
    }
  };

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          couponCode: couponCode.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Join EAwiz
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Get access to 380+ AI prompts, The EAwiz Lounge, premium tools, and exclusive member events.
          </p>
        </div>

        {canceled && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
            <p className="text-amber-800">
              Checkout was canceled. Select a plan below to try again.
            </p>
          </div>
        )}

        {/* Plan Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Monthly Plan */}
          <Card
            variant="bordered"
            className={`cursor-pointer transition-all ${
              selectedPlan === 'monthly'
                ? 'border-primary-500 ring-2 ring-primary-500'
                : 'hover:border-gray-300'
            }`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{plans.monthly.name}</CardTitle>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === 'monthly'
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPlan === 'monthly' && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">${plans.monthly.price}</span>
                <span className="text-gray-500">{plans.monthly.period}</span>
              </div>
              <CardDescription className="mt-2">
                {plans.monthly.description}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Annual Plan */}
          <Card
            variant="bordered"
            className={`cursor-pointer transition-all relative ${
              selectedPlan === 'annual'
                ? 'border-primary-500 ring-2 ring-primary-500'
                : 'hover:border-gray-300'
            }`}
            onClick={() => setSelectedPlan('annual')}
          >
            <div className="absolute -top-3 right-4">
              <Badge variant="success" size="sm">
                {plans.annual.savings}
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{plans.annual.name}</CardTitle>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === 'annual'
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPlan === 'annual' && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">${plans.annual.price}</span>
                <span className="text-gray-500">{plans.annual.period}</span>
              </div>
              <CardDescription className="mt-2">
                {plans.annual.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Benefits */}
        <Card variant="bordered" className="mb-8">
          <CardContent className="py-6">
            <h3 className="font-semibold text-gray-900 mb-4">What&apos;s included:</h3>
            <ul className="grid md:grid-cols-2 gap-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Auth / Checkout Section */}
        <Card variant="bordered">
          <CardContent className="py-8">
            {checkingAuth ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : isLoggedIn ? (
              <div className="max-w-md mx-auto">
                <p className="text-center text-gray-600 mb-6">
                  You&apos;re logged in and ready to subscribe to the{' '}
                  <span className="font-semibold text-gray-900">
                    {plans[selectedPlan].name}
                  </span>{' '}
                  plan at{' '}
                  <span className="font-semibold text-gray-900">
                    ${plans[selectedPlan].price}{plans[selectedPlan].period}
                  </span>
                </p>

                {/* Coupon Code Field */}
                <div className="mb-6">
                  <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code <span className="text-gray-400">(optional)</span>
                  </label>
                  <Input
                    id="couponCode"
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>

                {message && (
                  <div
                    className={`mb-6 p-4 rounded-lg text-sm ${
                      message.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  variant="primary"
                  size="lg"
                  isLoading={isCheckoutLoading}
                  className="w-full"
                >
                  Continue to Checkout
                </Button>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                {missingEnv && (
                  <div className="mb-4 p-3 rounded-lg text-sm bg-amber-50 text-amber-900 border border-amber-200">
                    Heads up: Supabase env vars aren&apos;t set yet. The page will still
                    load, but signup won&apos;t work until you add them in Vercel.
                  </div>
                )}

                <p className="text-center text-gray-600 mb-6">
                  Enter your email to get started with the{' '}
                  <span className="font-semibold text-gray-900">
                    {plans[selectedPlan].name}
                  </span>{' '}
                  plan.
                </p>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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

                  {/* Coupon Code Field (shown pre-login too) */}
                  <div>
                    <label htmlFor="couponCodePreLogin" className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon Code <span className="text-gray-400">(optional)</span>
                    </label>
                    <Input
                      id="couponCodePreLogin"
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
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

                  <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                    Continue with Email
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                      Log in
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Cancel anytime. No contracts. Secure checkout powered by Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
