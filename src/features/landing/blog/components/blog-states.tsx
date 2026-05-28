'use client';

import { FileSearch, RotateCw } from 'lucide-react';

export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-[#0F0820]/5">
      <div className="aspect-[16/10] bg-gray-100 animate-pulse" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse mt-4" />
      </div>
    </div>
  );
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BlogEmptyState({ message }: { message?: string }) {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#0F0820]/10">
      <FileSearch className="w-12 h-12 text-[#9747FF]/50 mx-auto mb-4" />
      <p className="font-display text-xl text-[#0F0820]">
        Nenhum artigo encontrado
      </p>
      <p className="mt-2 text-sm text-[#777]">
        {message ?? 'Tente ajustar os filtros ou volte mais tarde.'}
      </p>
    </div>
  );
}

export function BlogErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-red-200">
      <p className="font-display text-xl text-[#0F0820]">
        Não foi possível carregar os artigos
      </p>
      <p className="mt-2 text-sm text-[#777]">Verifique sua conexão e tente novamente.</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F0820] text-white text-sm hover:bg-[#0F0820]/90 transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
