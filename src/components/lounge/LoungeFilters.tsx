'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface LoungeFiltersProps {
  currentFilter: string;
  currentSearch: string;
  currentCategory: string;
}

const filters = [
  { value: 'latest', label: 'Latest' },
  { value: 'top', label: 'Top' },
  { value: 'unanswered', label: 'Unanswered' },
];

export function LoungeFilters({ currentFilter, currentSearch, currentCategory }: LoungeFiltersProps) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);

  const buildUrl = (params: { filter?: string; search?: string; category?: string }) => {
    const searchParams = new URLSearchParams();

    const filter = params.filter ?? currentFilter;
    const searchQuery = params.search ?? currentSearch;
    const category = params.category ?? currentCategory;

    if (filter && filter !== 'latest') {
      searchParams.set('filter', filter);
    }
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    }
    if (category) {
      searchParams.set('category', category);
    }

    const queryString = searchParams.toString();
    return `/lounge${queryString ? `?${queryString}` : ''}`;
  };

  const handleFilterChange = (filter: string) => {
    router.push(buildUrl({ filter }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ search }));
  };

  const clearSearch = () => {
    setSearch('');
    router.push(buildUrl({ search: '' }));
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              currentFilter === filter.value
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discussions..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
        {currentSearch && (
          <Button type="button" variant="outline" onClick={clearSearch}>
            Clear
          </Button>
        )}
      </form>
    </div>
  );
}
