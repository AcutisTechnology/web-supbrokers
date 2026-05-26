'use client';

import { TeamPage } from '@/features/landing/broker-home/team/team-page';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function Inner() {
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
  return <TeamPage brokerSlug={broker} />;
}

export default function PreviewTeamPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
