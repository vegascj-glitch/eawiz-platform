import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient, isActiveMember } from '@/lib/supabase-server';
import { PromptCard } from '@/components/PromptCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Prompt, PromptCategory } from '@/types/database';

interface PromptsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const params = await searchParams;
  const isMember = await isActiveMember();

  if (!isMember) {
    redirect('/join?from=prompts');
  }

  const supabase = await createServerSupabaseClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from('prompt_categories')
    .select('*')
    .order('display_order') as { data: PromptCategory[] | null };

  // Fetch prompts with optional filtering
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let promptsQuery = (supabase.from('prompts') as any)
    .select('*, category:prompt_categories(*)');

  if (params.category) {
    const category = categories?.find((c) => c.slug === params.category);
    if (category) {
      promptsQuery = promptsQuery.eq('category_id', category.id);
    }
  }

  if (params.search) {
    promptsQuery = promptsQuery.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%,prompt_text.ilike.%${params.search}%`
    );
  }

  const { data: prompts } = await promptsQuery.order('is_featured', { ascending: false }) as { data: (Prompt & { category: PromptCategory })[] | null };

  const selectedCategory = params.category || 'all';

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-12">
          <h1 className="text-4xl font-bold text-center">AI Prompt Library</h1>
          <p className="mt-4 text-lg text-primary-100 text-center max-w-2xl mx-auto">
            {categories?.length || 19} categories, {prompts?.length || 380}+ prompts curated for
            Executive Assistants
          </p>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container">
          {/* Search and Filter */}
          <div className="mb-8">
            <form className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  name="search"
                  placeholder="Search prompts..."
                  defaultValue={params.search}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <Button type="submit" variant="primary">
                Search
              </Button>
            </form>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/prompts">
              <Badge
                variant={selectedCategory === 'all' ? 'primary' : 'default'}
                className="cursor-pointer hover:bg-primary-100 px-4 py-2"
              >
                All
              </Badge>
            </Link>
            {categories?.map((category: PromptCategory) => (
              <Link key={category.slug} href={`/prompts?category=${category.slug}`}>
                <Badge
                  variant={selectedCategory === category.slug ? 'primary' : 'default'}
                  className="cursor-pointer hover:bg-primary-100 px-4 py-2"
                >
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-gray-600 mb-6">
            Showing {prompts?.length || 0} prompts
            {params.category && ` in ${categories?.find((c) => c.slug === params.category)?.name}`}
            {params.search && ` matching "${params.search}"`}
          </p>

          {/* Prompts Grid */}
          {prompts && prompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt: Prompt & { category: PromptCategory }) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  showCategory={selectedCategory === 'all'}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No prompts found matching your criteria.</p>
              <Link href="/prompts" className="text-primary-600 hover:underline mt-2 inline-block">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
