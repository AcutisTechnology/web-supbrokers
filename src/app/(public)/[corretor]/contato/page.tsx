'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPublicSitePage } from '@/features/dashboard/site/services/site-pages-service';
import { ContactPage } from '@/features/landing/broker-home/contact/contact-page';

export default function CorretorContato({
  params,
}: {
  params: Promise<{ corretor: string }>;
}) {
  const { corretor } = use(params);

  const { data: page = null } = useQuery({
    queryKey: ['public-site-page', corretor, 'contato'],
    queryFn: () => fetchPublicSitePage(corretor, 'contato'),
    retry: false,
  });

  return <ContactPage brokerSlug={corretor} page={page} />;
}
