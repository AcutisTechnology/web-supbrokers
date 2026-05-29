'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { RefreshCw, WifiOff } from 'lucide-react';

export default function OfflinePage() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  useEffect(() => {
    if (online) {
      // Reconectou: tenta recarregar a última rota.
      const id = setTimeout(() => window.location.reload(), 600);
      return () => clearTimeout(id);
    }
  }, [online]);

  return (
    <main className="min-h-[100dvh] bg-[#0F0820] text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#9747FF]/20 blur-[120px]" />

      <div className="relative flex flex-col items-center">
        <Image src="/logo-roxo.svg" alt="Imoobile" width={64} height={56} priority />

        <div className="mt-10 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <WifiOff className="w-7 h-7 text-amber-300" />
        </div>

        <h1 className="mt-8 font-display text-3xl md:text-4xl tracking-tight">
          Você está offline
        </h1>
        <p className="mt-4 text-white/60 max-w-md leading-relaxed">
          Não foi possível conectar. Verifique sua internet — reconectaremos
          automaticamente assim que o sinal voltar.
        </p>

        <div className="mt-8 flex items-center gap-2 text-sm">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              online ? 'bg-green-400' : 'bg-red-400 animate-pulse'
            }`}
          />
          <span className="text-white/50">
            {online ? 'Conexão restaurada — recarregando…' : 'Sem conexão'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-300 text-[#0F0820] text-sm font-medium hover:bg-amber-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
