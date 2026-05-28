'use client';

import { use } from 'react';
import { SearchResults } from '@/features/landing/broker-home/components/search-results';

export default function CorretorImoveis({
  params,
}: {
  params: Promise<{ corretor: string }>;
}) {
  const { corretor } = use(params);
  return <SearchResults brokerSlug={corretor} />;
}
