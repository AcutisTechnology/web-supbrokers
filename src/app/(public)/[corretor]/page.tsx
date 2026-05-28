'use client';

import { use } from 'react';
import { BrokerHome } from '@/features/landing/broker-home/broker-home';

export default function CorretorHome({
  params,
}: {
  params: Promise<{ corretor: string }>;
}) {
  const { corretor } = use(params);
  return <BrokerHome brokerSlug={corretor} />;
}
