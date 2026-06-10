'use client';

import { use } from 'react';
import { ArticleDetail } from '@/features/landing/blog/article-detail';

export default function CorretorArtigo({
  params,
}: {
  params: Promise<{ corretor: string; slug: string }>;
}) {
  const { corretor, slug } = use(params);
  return <ArticleDetail brokerSlug={corretor} postSlug={slug} />;
}
