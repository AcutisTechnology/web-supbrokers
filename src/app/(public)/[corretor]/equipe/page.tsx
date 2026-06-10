'use client';

import { use } from 'react';
import { TeamPage } from '@/features/landing/broker-home/team/team-page';

export default function CorretorEquipe({
  params,
}: {
  params: Promise<{ corretor: string }>;
}) {
  const { corretor } = use(params);
  return <TeamPage brokerSlug={corretor} />;
}
