import Link from 'next/link';
import { createServerSupabaseClient, getProfile } from '@/lib/supabase-server';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getRelativeTime } from '@/lib/utils';
import { CreateThreadForm } from '@/components/CreateThreadForm';
import { LoungeFilters } from '@/components/lounge/LoungeFilters';
import type { LoungeThread, LoungeCategory, Profile } from '@/types/database';

type ThreadWithDetails = LoungeThread & {
  author: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'email'>;
  category: LoungeCategory;
};

interface LoungePageProps {
  searchParams: Promise<{
    category?: string;
    filter?: string;
    search?: string;
  }>;
}

export default async function LoungePage({ searchParams }: LoungePageProps) {
  const params = await searchParams;
  const profile = await getProfile();
  const isLoggedIn = !!profile;

  const supabase = await createServerSupabaseClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from('lounge_categories')
    .select('*')
    .order('display_order');

  // Build query for threads
  let query = supabase
    .from('lounge_threads')
    .select(`
      *,
      author:profiles(id, first_name, last_name, email),
      category:lounge_categories(*)
    `);

  // Apply category filter
  if (params.category) {
    const category = categories?.find((c: LoungeCategory) => c.slug === params.category);
    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  // Apply search filter
  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,content.ilike.%${params.search}%`);
  }

  // Apply sorting based on filter
  const filter = params.filter || 'latest';
  switch (filter) {
    case 'top':
      query = query.order('reply_count', { ascending: false });
      break;
    case 'unanswered':
      query = query.eq('reply_count', 0).order('created_at', { ascending: false });
      break;
    case 'latest':
    default:
      query = query
        .order('is_pinned', { ascending: false })
        .order('last_activity_at', { ascending: false });
      break;
  }

  const { data: threads } = await query.limit(20);

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-12">
          <h1 className="text-4xl font-bold text-center">The EA Lounge</h1>
          <p className="mt-4 text-lg text-primary-100 text-center max-w-2xl mx-auto">
            Connect with fellow Executive Assistants, share strategies, and learn from
            the community.
          </p>
          {!isLoggedIn && (
            <p className="mt-2 text-sm text-primary-200 text-center">
              <Link href="/login" className="underline hover:text-white">Sign in</Link> to join the conversation
            </p>
          )}
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/lounge"
                        className={`block px-3 py-2 rounded-lg ${
                          !params.category
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        All Discussions
                      </Link>
                    </li>
                    {categories?.map((category: LoungeCategory) => (
                      <li key={category.id}>
                        <Link
                          href={`/lounge?category=${category.slug}`}
                          className={`block px-3 py-2 rounded-lg ${
                            params.category === category.slug
                              ? 'bg-primary-50 text-primary-700 font-medium'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Community Guidelines */}
              <Card variant="bordered" className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Be respectful and supportive</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Share knowledge generously</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Keep discussions professional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Protect confidential information</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Login CTA for anonymous users */}
              {!isLoggedIn && (
                <Card variant="bordered" className="mt-4 bg-primary-50 border-primary-200">
                  <CardContent className="py-4">
                    <p className="text-sm text-primary-800 mb-3">
                      Join the conversation! Sign in to start discussions and reply to threads.
                    </p>
                    <Link href="/login?from=lounge">
                      <Button variant="primary" size="sm" className="w-full">
                        Sign In to Post
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Content - Threads */}
            <div className="lg:col-span-3">
              {/* Filters and Search */}
              <LoungeFilters
                currentFilter={filter}
                currentSearch={params.search || ''}
                currentCategory={params.category || ''}
              />

              {/* Create Thread - Only for logged in users */}
              {isLoggedIn && profile ? (
                <Card variant="bordered" className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Start a Discussion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CreateThreadForm
                      categories={categories || []}
                      userId={profile.id}
                    />
                  </CardContent>
                </Card>
              ) : (
                <Card variant="bordered" className="mb-6 bg-gray-50">
                  <CardContent className="py-6 text-center">
                    <p className="text-gray-600 mb-3">Want to start a discussion?</p>
                    <Link href="/login?from=lounge">
                      <Button variant="primary">
                        Sign In to Post
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Thread List */}
              <div className="space-y-4">
                {threads && threads.length > 0 ? (
                  threads.map((thread: ThreadWithDetails) => (
                    <Link key={thread.id} href={`/lounge/thread/${thread.id}`}>
                      <Card
                        variant="bordered"
                        className="hover:border-primary-300 transition-colors cursor-pointer"
                      >
                        <CardContent className="py-4">
                          <div className="flex items-start gap-4">
                            {/* Author Avatar */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-primary-700 font-medium">
                                {thread.author?.first_name?.[0] ||
                                  thread.author?.email?.[0]?.toUpperCase() ||
                                  '?'}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {thread.is_pinned && (
                                  <Badge variant="warning" size="sm">
                                    Pinned
                                  </Badge>
                                )}
                                <Badge variant="default" size="sm">
                                  {thread.category?.name || 'General'}
                                </Badge>
                                {thread.reply_count === 0 && (
                                  <Badge variant="info" size="sm">
                                    Unanswered
                                  </Badge>
                                )}
                              </div>

                              <h3 className="font-semibold text-gray-900 truncate">
                                {thread.title}
                              </h3>

                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {thread.content}
                              </p>

                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>
                                  {thread.author?.first_name ||
                                    thread.author?.email?.split('@')[0] ||
                                    'Anonymous'}
                                </span>
                                <span>·</span>
                                <span>{getRelativeTime(thread.created_at)}</span>
                                <span>·</span>
                                <span>
                                  {thread.reply_count}{' '}
                                  {thread.reply_count === 1 ? 'reply' : 'replies'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <Card variant="bordered">
                    <CardContent className="py-12 text-center">
                      <div className="text-4xl mb-4">💬</div>
                      <p className="text-gray-600 mb-2">
                        {params.search
                          ? `No discussions found for "${params.search}"`
                          : filter === 'unanswered'
                          ? 'No unanswered discussions right now!'
                          : 'No discussions yet.'}
                      </p>
                      {isLoggedIn ? (
                        <p className="text-gray-500 text-sm">Be the first to start a conversation!</p>
                      ) : (
                        <div className="mt-4">
                          <Link href="/login?from=lounge">
                            <Button variant="primary" size="sm">
                              Sign In to Start a Discussion
                            </Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
