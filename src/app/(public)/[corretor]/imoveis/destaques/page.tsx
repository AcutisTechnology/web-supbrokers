'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Rota legada: os destaques agora vivem na home; redireciona para a listagem geral.
export default function ImoveisDestaquesRedirect({
  params,
}: {
  params: Promise<{ corretor: string }>;
}) {
  const { corretor } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${corretor}/imoveis`);
  }, [corretor, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7] text-[#0F0820]/60 text-sm">
      Redirecionando…
    </div>
  );
}
