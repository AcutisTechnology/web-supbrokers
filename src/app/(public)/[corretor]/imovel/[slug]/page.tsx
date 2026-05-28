'use client';

import { use } from 'react';
import { PropertyDetail } from '@/features/landing/broker-home/detail/property-detail';

export default function CorretorImovel({
  params,
}: {
  params: Promise<{ corretor: string; slug: string }>;
}) {
  const { corretor, slug } = use(params);
  return <PropertyDetail brokerSlug={corretor} propertySlug={slug} />;
}
