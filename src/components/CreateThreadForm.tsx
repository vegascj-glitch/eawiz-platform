'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { createClient } from '@/lib/supabase';
import type { LoungeCategory } from '@/types/database';

interface CreateThreadFormProps {
  categories: LoungeCategory[];
  userId: string;
}

export function CreateThreadForm({ categories, userId }: CreateThreadFormProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const categoryOptions = [
    { value: '', label: 'Select a category...' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();

    const { error: insertError } = await supabase.from('lounge_threads').insert({
      title: title.trim(),
      content: content.trim(),
      category_id: categoryId,
      author_id: userId,
    });

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return;
    }

    setTitle('');
    setContent('');
    setCategoryId('');
    setIsExpanded(false);
    router.refresh();
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        What&apos;s on your mind? Start a discussion...
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Discussion title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={categoryOptions}
          required
        />
      </div>

      <div>
        <Textarea
          placeholder="Share your thoughts, questions, or insights..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setIsExpanded(false);
            setTitle('');
            setContent('');
            setCategoryId('');
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          Post Discussion
        </Button>
      </div>
    </form>
  );
}
