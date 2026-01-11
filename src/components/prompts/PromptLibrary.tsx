'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { copyToClipboard } from '@/lib/utils';
import type { PromptCategory, Prompt } from '@/lib/prompts-data';

interface PromptLibraryProps {
  categories: PromptCategory[];
  prompts: Prompt[];
  selectedCategory: string;
  searchQuery: string;
  isMember: boolean;
}

export function PromptLibrary({
  categories,
  prompts,
  selectedCategory,
  searchQuery,
  isMember,
}: PromptLibraryProps) {
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleCopy = async (prompt: Prompt) => {
    if (!isMember) return;
    await copyToClipboard(prompt.promptText);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '';
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || '';
  };

  return (
    <>
      {/* Search */}
      <div className="mb-8">
        <form className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="search"
              placeholder="Search prompts by title, description, or use case..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
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
            All ({prompts.length})
          </Badge>
        </Link>
        {categories.map((category) => {
          const count = prompts.filter(p => p.categoryId === category.id).length;
          return (
            <Link key={category.slug} href={`/prompts?category=${category.slug}`}>
              <Badge
                variant={selectedCategory === category.slug ? 'primary' : 'default'}
                className="cursor-pointer hover:bg-primary-100 px-4 py-2"
              >
                {category.icon} {category.name} ({count})
              </Badge>
            </Link>
          );
        })}
      </div>

      {/* Results Count */}
      <p className="text-gray-600 mb-6">
        Showing {prompts.length} prompts
        {selectedCategory !== 'all' && ` in ${getCategoryName(selectedCategory.replace('-', ''))}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {/* Prompts Grid */}
      {prompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => {
            const isExpanded = expandedPrompt === prompt.id;
            const isCopied = copiedId === prompt.id;

            return (
              <Card key={prompt.id} variant="bordered" className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{prompt.title}</CardTitle>
                    {prompt.isFeatured && (
                      <Badge variant="primary" size="sm">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{prompt.description}</CardDescription>
                  {selectedCategory === 'all' && (
                    <Badge variant="default" size="sm" className="mt-2">
                      {getCategoryIcon(prompt.categoryId)} {getCategoryName(prompt.categoryId)}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="flex-1">
                  {isMember ? (
                    <>
                      <div
                        className={`text-sm text-gray-700 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap ${
                          isExpanded ? '' : 'line-clamp-4'
                        }`}
                      >
                        {prompt.promptText}
                      </div>
                      {prompt.promptText.length > 200 && (
                        <button
                          onClick={() => setExpandedPrompt(isExpanded ? null : prompt.id)}
                          className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                        >
                          {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <div className="text-gray-400 text-sm mb-2">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Full prompt available for members
                      </div>
                      <Link href="/join?from=prompts">
                        <span className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Join to unlock
                        </span>
                      </Link>
                    </div>
                  )}

                  {prompt.useCases.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">Use cases:</p>
                      <div className="flex flex-wrap gap-1">
                        {prompt.useCases.slice(0, 3).map((useCase, i) => (
                          <Badge key={i} variant="default" size="sm">
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex justify-end">
                  {isMember ? (
                    <Button
                      onClick={() => handleCopy(prompt)}
                      variant={isCopied ? 'secondary' : 'primary'}
                      size="sm"
                    >
                      {isCopied ? 'Copied!' : 'Copy Prompt'}
                    </Button>
                  ) : (
                    <Link href="/join?from=prompts">
                      <Button variant="outline" size="sm">
                        Join to Copy
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No prompts found matching your criteria.</p>
          <Link href="/prompts" className="text-primary-600 hover:underline mt-2 inline-block">
            Clear filters
          </Link>
        </div>
      )}

      {/* CTA for non-members */}
      {!isMember && (
        <div className="mt-12 bg-primary-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Unlock All {prompts.length}+ Prompts
          </h3>
          <p className="text-gray-600 mb-4 max-w-xl mx-auto">
            Get instant access to our full library of EA-specific prompts, plus all our other premium tools.
          </p>
          <Link href="/join?from=prompts">
            <Button variant="primary" size="lg">
              Join EAwiz - $40/month
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
