'use client';

import { use } from 'react';
import { AgentDetailPage } from '@/features/landing/broker-home/team/agent-detail-page';

export default function CorretorAgente({
  params,
}: {
  params: Promise<{ corretor: string; slug: string }>;
}) {
  const { corretor, slug } = use(params);
  return <AgentDetailPage brokerSlug={corretor} agentSlug={slug} />;
}
