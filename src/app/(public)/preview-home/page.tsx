'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BrokerHome } from '@/features/landing/broker-home/broker-home';

function PreviewHomeInner() {
  const params = useSearchParams();
  const broker = params.get('broker');
  return <BrokerHome brokerSlug={broker} />;
}

export default function PreviewHomePage() {
  return (
    <Suspense fallback={null}>
      <PreviewHomeInner />
    </Suspense>
  );
}
