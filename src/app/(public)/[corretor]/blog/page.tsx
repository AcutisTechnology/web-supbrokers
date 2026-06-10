'use client';

import { use } from 'react';
import { BlogListing } from '@/features/landing/blog/blog-listing';

export default function CorretorBlog({
  params,
}: {
  params: Promise<{ corretor: string }>;
}) {
  const { corretor } = use(params);
  return <BlogListing brokerSlug={corretor} />;
}
