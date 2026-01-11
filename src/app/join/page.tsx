'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
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

type Msg = { type: 'success' | 'error'; text: string } | null;

export default function JoinPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Msg>(null);

  // Create the Supabase client once (not on every render)
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const missingEnv =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // If you haven't set up Supabase yet, don't crash — show a helpful message.
    if (missingEnv) {
      setIsLoading(false);
      setMessage({
        type: 'error',
        text:
          "Supabase isn't configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel → Project → Settings → Environment Variables.",
      });
      return;
    }

    // For now, we'll just do an email magic link signup/signin (no Stripe required to preview the UI)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsLoading(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({
        type: 'success',
        text: 'Check your email for the magic link to finish creating your account.',
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card variant="bordered">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join EAwiz</CardTitle>
            <CardDescription>
              Enter your email and we'll send you a magic link to get started.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {missingEnv && (
              <div className="mb-4 p-3 rounded-lg text-sm bg-amber-50 text-amber-900 border border-amber-200">
                Heads up: Supabase env vars aren't set yet. The page will still
                load, but signup won't work until you add them in Vercel.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                Send Magic Link
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
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            No passwords. Just a secure sign-in link.
          </p>
        </div>
      </div>
    </div>
  );
}
