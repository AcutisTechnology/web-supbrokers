'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ListingPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/**
 * Calcula os números a exibir, incluindo ellipsis.
 * Sempre mostra: primeira | (… | janela ao redor da atual | …) | última
 */
function buildPages(page: number, totalPages: number): (number | 'dots')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'dots')[] = [1];

  const startWindow = Math.max(2, page - 1);
  const endWindow = Math.min(totalPages - 1, page + 1);

  if (startWindow > 2) pages.push('dots');
  for (let i = startWindow; i <= endWindow; i++) pages.push(i);
  if (endWindow < totalPages - 1) pages.push('dots');

  pages.push(totalPages);
  return pages;
}

export function ListingPagination({
  page,
  totalPages,
  onChange,
}: ListingPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  const go = (next: number) => {
    if (next < 1 || next > totalPages || next === page) return;
    onChange(next);
    // Scroll suave pro topo dos resultados
    document
      .getElementById('listing-results')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Paginação"
      className="flex items-center justify-center gap-1.5 select-none"
    >
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        aria-label="Página anterior"
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-black/10 text-[#0F0820]/70 hover:text-[#0F0820] hover:border-[#0F0820]/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, idx) =>
        p === 'dots' ? (
          <span
            key={`dots-${idx}`}
            className="w-10 h-10 flex items-center justify-center text-[#0F0820]/40 text-sm"
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => go(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
              p === page
                ? 'bg-[#0F0820] text-white shadow-[0_8px_20px_-8px_rgba(15,8,32,0.4)]'
                : 'border border-black/10 text-[#0F0820]/70 hover:text-[#0F0820] hover:border-[#0F0820]/30'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        aria-label="Próxima página"
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-black/10 text-[#0F0820]/70 hover:text-[#0F0820] hover:border-[#0F0820]/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
