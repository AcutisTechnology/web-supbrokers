'use client';

import { use } from 'react';
import { FavoritesPage } from '@/features/landing/broker-home/favorites/favorites-page';

export default function CorretorFavoritos({
  params,
}: {
  params: Promise<{ corretor: string }>;
}) {
  const { corretor } = use(params);
  return <FavoritesPage brokerSlug={corretor} />;
}
