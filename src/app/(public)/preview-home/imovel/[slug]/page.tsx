'use client';

import { Suspense, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyDetail } from '@/features/landing/broker-home/detail/property-detail';

function PreviewDetailInner({ slug }: { slug: string }) {
  const params = useSearchParams();
  const broker = params.get('broker');
  if (!broker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7] text-[#0F0820]/60 text-sm px-4 text-center">
        Informe um broker via <code className="mx-1">?broker=slug</code> para
        visualizar o preview.
      </div>
    );
  }
  return <PropertyDetail brokerSlug={broker} propertySlug={slug} />;
}

export default function PreviewPropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <Suspense fallback={null}>
      <PreviewDetailInner slug={slug} />
    </Suspense>
  );
}
