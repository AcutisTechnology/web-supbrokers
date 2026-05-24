'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchResults } from '@/features/landing/broker-home/components/search-results';

function PreviewSearchInner() {
  const params = useSearchParams();
  const broker = params.get('broker');
  return <SearchResults brokerSlug={broker} />;
}

export default function PreviewSearchPage() {
  return (
    <Suspense fallback={null}>
      <PreviewSearchInner />
    </Suspense>
  );
}
