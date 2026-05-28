'use client';

import { Search, X } from 'lucide-react';
import type { BlogSort, PostsMeta } from '../services/blog-service';

interface BlogFiltersProps {
  meta?: PostsMeta;
  search: string;
  category: string | null;
  tag: string | null;
  sort: BlogSort;
  onSearch: (value: string) => void;
  onCategory: (value: string | null) => void;
  onTag: (value: string | null) => void;
  onSort: (value: BlogSort) => void;
}

const SORTS: { value: BlogSort; label: string }[] = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'most_read', label: 'Mais lidos' },
  { value: 'featured', label: 'Em destaque' },
];

export function BlogFilters({
  meta,
  search,
  category,
  tag,
  sort,
  onSearch,
  onCategory,
  onTag,
  onSort,
}: BlogFiltersProps) {
  const categories = meta?.categories ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Buscar artigos…"
            className="w-full pl-11 pr-10 py-3 rounded-full border border-[#0F0820]/10 bg-white text-sm text-[#0F0820] placeholder:text-[#999] focus:outline-none focus:border-[#9747FF] transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearch('')}
              aria-label="Limpar busca"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#0F0820]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          value={sort}
          onChange={e => onSort(e.target.value as BlogSort)}
          className="py-3 px-4 rounded-full border border-[#0F0820]/10 bg-white text-sm text-[#0F0820] focus:outline-none focus:border-[#9747FF] cursor-pointer"
        >
          {SORTS.map(s => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onCategory(null);
              onTag(null);
            }}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              !category && !tag
                ? 'bg-[#0F0820] text-white'
                : 'bg-white border border-[#0F0820]/10 text-[#555] hover:border-[#9747FF]'
            }`}
          >
            Todos
          </button>
          {categories.map(c => (
            <button
              key={c.name}
              type="button"
              onClick={() => {
                onTag(null);
                onCategory(category === c.name ? null : c.name);
              }}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                category === c.name
                  ? 'bg-[#9747FF] text-white'
                  : 'bg-white border border-[#0F0820]/10 text-[#555] hover:border-[#9747FF]'
              }`}
            >
              {c.name}
              <span className="ml-1.5 text-xs opacity-60">{c.count}</span>
            </button>
          ))}
        </div>
      )}

      {tag && (
        <div className="flex items-center gap-2 text-sm text-[#555]">
          <span>Tag:</span>
          <button
            type="button"
            onClick={() => onTag(null)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#9747FF]/10 text-[#9747FF]"
          >
            #{tag}
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
