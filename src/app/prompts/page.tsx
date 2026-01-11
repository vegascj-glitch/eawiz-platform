import Link from 'next/link';
import { isActiveMember } from '@/lib/supabase-server';
import { categories, prompts, getPromptsByCategory, searchPrompts, getCategoryBySlug } from '@/lib/prompts-data';
import { PromptLibrary } from '@/components/prompts/PromptLibrary';

interface PromptsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export const metadata = {
  title: 'AI Prompt Library - EAwiz',
  description: 'Curated AI prompts for Executive Assistants. Browse 7 categories and 25+ prompts for career growth, meetings, communications, travel, events, and more.',
};

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const params = await searchParams;
  const isMember = await isActiveMember();

  // Filter prompts based on category and search
  let filteredPrompts = [...prompts];

  if (params.category) {
    const category = getCategoryBySlug(params.category);
    if (category) {
      filteredPrompts = getPromptsByCategory(category.id);
    }
  }

  if (params.search) {
    const searchResults = searchPrompts(params.search);
    filteredPrompts = params.category
      ? filteredPrompts.filter(p => searchResults.some(sr => sr.id === p.id))
      : searchResults;
  }

  const selectedCategory = params.category || 'all';

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-12">
          <h1 className="text-4xl font-bold text-center">AI Prompt Library</h1>
          <p className="mt-4 text-lg text-primary-100 text-center max-w-2xl mx-auto">
            {categories.length} categories, {prompts.length}+ prompts curated for Executive Assistants
          </p>
          {!isMember && (
            <p className="mt-2 text-sm text-primary-200 text-center">
              Browse categories and titles for free. <Link href="/join?from=prompts" className="underline hover:text-white">Join EAwiz</Link> to unlock full prompts.
            </p>
          )}
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container">
          <PromptLibrary
            categories={categories}
            prompts={filteredPrompts}
            selectedCategory={selectedCategory}
            searchQuery={params.search || ''}
            isMember={isMember}
          />
        </div>
      </section>
    </>
  );
}
