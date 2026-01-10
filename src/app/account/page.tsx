import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getProfile, createServerSupabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { ManageSubscriptionButton } from '@/components/ManageSubscriptionButton';

interface AccountPageProps {
  searchParams: Promise<{ success?: string }>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const profile = await getProfile();

  if (!profile) {
    redirect('/login');
  }

  const isActive = profile.subscription_status === 'active';
  const isAdmin = profile.role === 'admin';

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        {params.success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              Welcome to EAwiz! Your subscription is now active.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Card */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{profile.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">
                    {profile.first_name || profile.last_name
                      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                      : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{formatDate(profile.created_at)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Role</span>
                  <Badge variant={isAdmin ? 'primary' : 'default'}>
                    {isAdmin ? 'Admin' : 'Member'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card variant="bordered">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Manage your EAwiz membership</CardDescription>
                </div>
                <Badge
                  variant={
                    isActive
                      ? 'success'
                      : profile.subscription_status === 'canceled'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {isActive
                    ? 'Active'
                    : profile.subscription_status === 'canceled'
                    ? 'Canceled'
                    : profile.subscription_status === 'past_due'
                    ? 'Past Due'
                    : 'Free'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isActive || profile.subscription_status === 'canceled' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium">EAwiz Membership</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Price</span>
                    <span className="font-medium">$20/month</span>
                  </div>
                  {profile.subscription_ends_at && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">
                        {isActive ? 'Next billing date' : 'Access until'}
                      </span>
                      <span className="font-medium">
                        {formatDate(profile.subscription_ends_at)}
                      </span>
                    </div>
                  )}
                  <div className="pt-4">
                    <ManageSubscriptionButton />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Upgrade to get access to all prompts, The EAwiz Lounge, and exclusive events.
                  </p>
                  <Link href="/join">
                    <Button variant="primary" size="lg">
                      Upgrade for $20/month
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/prompts"
                  className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl mb-2">✨</span>
                  <span className="text-sm font-medium text-gray-700">Prompts</span>
                </Link>
                <Link
                  href="/lounge"
                  className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl mb-2">💬</span>
                  <span className="text-sm font-medium text-gray-700">Lounge</span>
                </Link>
                <Link
                  href="/events"
                  className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl mb-2">📅</span>
                  <span className="text-sm font-medium text-gray-700">Events</span>
                </Link>
                <Link
                  href="/tools"
                  className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl mb-2">🛠️</span>
                  <span className="text-sm font-medium text-gray-700">Tools</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
