'use client';

import { useRouter } from 'next/navigation';

export function SiteHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background flex justify-center items-center">
      <div className="container flex h-16 items-center gap-4 px-4 md:px-6">
        <button onClick={() => router.back()} className="flex items-center gap-2">
          <span className="text-sm md:text-base font-semibold text-primary bg-secondary py-2 px-3 md:px-4 rounded-full">
            Voltar
          </span>
        </button>
      </div>
    </header>
  );
}
