'use client';

import { AgentDetailPage } from '@/features/landing/broker-home/team/agent-detail-page';
import { useSearchParams } from 'next/navigation';
import { Suspense, use } from 'react';

function Inner({ slug }: { slug: string }) {
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
  return <AgentDetailPage brokerSlug={broker} agentSlug={slug} />;
}

export default function PreviewAgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <Suspense fallback={null}>
      <Inner slug={slug} />
    </Suspense>
  );
}
