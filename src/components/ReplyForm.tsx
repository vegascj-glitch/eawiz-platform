'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { createClient } from '@/lib/supabase';

interface ReplyFormProps {
  threadId: string;
  userId: string;
}

export function ReplyForm({ threadId, userId }: ReplyFormProps) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please enter a reply');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();

    const { error: insertError } = await supabase.from('lounge_posts').insert({
      thread_id: threadId,
      author_id: userId,
      content: content.trim(),
    });

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return;
    }

    setContent('');
    router.refresh();
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Write your reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          Post Reply
        </Button>
      </div>
    </form>
  );
}
