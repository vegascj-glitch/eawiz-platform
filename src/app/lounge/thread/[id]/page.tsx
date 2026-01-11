import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient, getProfile, isActiveMember } from '@/lib/supabase-server';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getRelativeTime } from '@/lib/utils';
import { ReplyForm } from '@/components/ReplyForm';
import type { Profile, LoungePost, LoungeCategory, LoungeThread } from '@/types/database';

interface ThreadPageProps {
  params: Promise<{ id: string }>;
}

type PostWithAuthor = LoungePost & {
  author: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'email'>;
};

type ThreadWithDetails = LoungeThread & {
  author: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'email'>;
  category: LoungeCategory;
};

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { id } = await params;
  const profile = await getProfile();
  const isMember = await isActiveMember();

  if (!isMember) {
    redirect('/join?from=lounge');
  }

  const supabase = await createServerSupabaseClient();

  // Fetch thread
  const { data: thread } = await supabase
    .from('lounge_threads')
    .select(`
      *,
      author:profiles(id, first_name, last_name, email),
      category:lounge_categories(*)
    `)
    .eq('id', id)
    .single() as { data: ThreadWithDetails | null };

  if (!thread) {
    notFound();
  }

  // Fetch replies
  const { data: replies } = await supabase
    .from('lounge_posts')
    .select(`
      *,
      author:profiles(id, first_name, last_name, email)
    `)
    .eq('thread_id', id)
    .order('created_at', { ascending: true }) as { data: PostWithAuthor[] | null };

  const author = thread.author;
  const category = thread.category;

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-8">
          <Link
            href="/lounge"
            className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Lounge
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">{thread.title}</h1>
          <div className="flex items-center gap-3 mt-4 text-sm text-primary-100">
            <Badge variant="default" size="sm" className="bg-white/20 text-white border-0">
              {category?.name || 'General'}
            </Badge>
            <span>·</span>
            <span>
              {author?.first_name || author?.email?.split('@')[0] || 'Anonymous'}
            </span>
            <span>·</span>
            <span>{getRelativeTime(thread.created_at)}</span>
          </div>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container max-w-3xl">
          {/* Original Post */}
          <Card variant="bordered" className="mb-8">
            <CardContent className="py-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-semibold text-lg">
                    {author?.first_name?.[0] || author?.email?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {author?.first_name
                        ? `${author.first_name} ${author.last_name || ''}`
                        : author?.email?.split('@')[0] || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getRelativeTime(thread.created_at)}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {thread.content}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Replies */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {thread.reply_count} {thread.reply_count === 1 ? 'Reply' : 'Replies'}
            </h2>

            {replies && replies.length > 0 ? (
              <div className="space-y-4">
                {replies.map((reply: PostWithAuthor) => (
                  <Card key={reply.id} variant="bordered">
                    <CardContent className="py-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {reply.author?.first_name?.[0] ||
                              reply.author?.email?.[0]?.toUpperCase() ||
                              '?'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {reply.author?.first_name
                                ? `${reply.author.first_name} ${reply.author.last_name || ''}`
                                : reply.author?.email?.split('@')[0] || 'Anonymous'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {getRelativeTime(reply.created_at)}
                            </span>
                          </div>
                          <div className="text-gray-700 whitespace-pre-wrap">
                            {reply.content}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card variant="bordered">
                <CardContent className="py-8 text-center text-gray-500">
                  No replies yet. Be the first to respond!
                </CardContent>
              </Card>
            )}
          </div>

          {/* Reply Form */}
          {profile && (
            <Card variant="bordered">
              <CardContent className="py-4">
                <h3 className="font-semibold text-gray-900 mb-4">Add a Reply</h3>
                <ReplyForm threadId={id} userId={profile.id} />
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
