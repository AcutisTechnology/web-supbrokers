'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Rota legada: redireciona para a listagem nova já filtrada por venda.
export default function ImoveisVendaRedirect({
  params,
}: {
  params: Promise<{ corretor: string }>;
}) {
  const { corretor } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${corretor}/imoveis?purpose=sale`);
  }, [corretor, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7] text-[#0F0820]/60 text-sm">
      Redirecionando…
    </div>
  );
}
