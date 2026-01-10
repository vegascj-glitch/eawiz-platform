'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { copyToClipboard } from '@/lib/utils';
import type { Prompt, PromptCategory } from '@/types/database';

interface PromptCardProps {
  prompt: Prompt & { category?: PromptCategory };
  showCategory?: boolean;
}

export function PromptCard({ prompt, showCategory = false }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(prompt.prompt_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Track copy count (fire and forget)
    fetch('/api/prompts/track-copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId: prompt.id }),
    });
  };

  const useCases = prompt.use_cases?.split(',').map((s) => s.trim()) || [];

  return (
    <Card variant="bordered" className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{prompt.title}</CardTitle>
          {prompt.is_featured && (
            <Badge variant="primary" size="sm">
              Featured
            </Badge>
          )}
        </div>
        {prompt.description && (
          <CardDescription>{prompt.description}</CardDescription>
        )}
        {showCategory && prompt.category && (
          <Badge variant="default" size="sm" className="mt-2">
            {prompt.category.name}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <div
          className={`text-sm text-gray-700 bg-gray-50 rounded-lg p-4 ${
            expanded ? '' : 'line-clamp-4'
          }`}
        >
          {prompt.prompt_text}
        </div>
        {prompt.prompt_text.length > 300 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-primary-600 hover:text-primary-700 mt-2"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}

        {useCases.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Use cases:</p>
            <div className="flex flex-wrap gap-1">
              {useCases.slice(0, 3).map((useCase, i) => (
                <Badge key={i} variant="default" size="sm">
                  {useCase}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-gray-400">
          Copied {prompt.copy_count} times
        </span>
        <Button
          onClick={handleCopy}
          variant={copied ? 'secondary' : 'primary'}
          size="sm"
        >
          {copied ? 'Copied!' : 'Copy Prompt'}
        </Button>
      </CardFooter>
    </Card>
  );
}
