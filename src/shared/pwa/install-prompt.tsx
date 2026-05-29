'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Share, SquarePlus, X } from 'lucide-react';
import Image from 'next/image';
import { useInstallPrompt } from './use-install-prompt';

/**
 * Banner discreto premium de instalação do PWA.
 * - Android/desktop: dispara o prompt nativo.
 * - iOS: mostra instrução "Compartilhar → Adicionar à Tela de Início".
 * Oculto quando já instalado ou dispensado.
 */
export function InstallPrompt() {
  const { canInstall, isIos, isInstalled, dismissed, promptInstall, dismiss } =
    useInstallPrompt();
  const [iosSheet, setIosSheet] = useState(false);
  // Evita flash no SSR/hidratação.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || isInstalled || dismissed) return null;

  const showBanner = canInstall || isIos;
  if (!showBanner) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-md
            bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] lg:bottom-6"
          role="dialog"
          aria-label="Instalar aplicativo"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-[#0F0820] text-white p-3 pr-2 shadow-[0_20px_50px_-15px_rgba(15,8,32,0.6)] border border-white/10">
            <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <Image src="/icons/icon-192.png" alt="Imoobile" width={28} height={28} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Instalar o app</p>
              <p className="text-xs text-white/60 truncate">
                Acesso rápido, tela cheia e offline.
              </p>
            </div>
            <button
              type="button"
              onClick={() => (isIos ? setIosSheet(true) : promptInstall())}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-300 text-[#0F0820] text-sm font-medium hover:bg-amber-200 transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              Instalar
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dispensar"
              className="w-8 h-8 inline-flex items-center justify-center rounded-full text-white/50 hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Instrução iOS */}
      <AnimatePresence>
        {iosSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setIosSheet(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-6 text-[#0F0820]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl">Adicionar à Tela de Início</h3>
                <button
                  type="button"
                  onClick={() => setIosSheet(false)}
                  aria-label="Fechar"
                  className="w-8 h-8 inline-flex items-center justify-center rounded-full text-[#777] hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="space-y-4 text-sm text-[#444]">
                <li className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#9747FF]/10 text-[#9747FF] flex items-center justify-center font-medium shrink-0">
                    1
                  </span>
                  Toque em <Share className="w-4 h-4 inline text-[#9747FF]" /> Compartilhar
                  na barra do Safari.
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#9747FF]/10 text-[#9747FF] flex items-center justify-center font-medium shrink-0">
                    2
                  </span>
                  <span>
                    Escolha <SquarePlus className="w-4 h-4 inline text-[#9747FF]" />{' '}
                    {'“Adicionar à Tela de Início”'}.
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#9747FF]/10 text-[#9747FF] flex items-center justify-center font-medium shrink-0">
                    3
                  </span>
                  <span>Confirme em {'“Adicionar”'}. Pronto!</span>
                </li>
              </ol>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
