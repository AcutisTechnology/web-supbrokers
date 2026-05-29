'use client';

import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa:install-dismissed';

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  if (typeof window === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export interface InstallPromptState {
  /** Pode disparar o prompt nativo (Android/desktop). */
  canInstall: boolean;
  /** iOS exige instrução manual (sem beforeinstallprompt). */
  isIos: boolean;
  /** Já está rodando instalado (standalone). */
  isInstalled: boolean;
  /** Usuário dispensou o convite. */
  dismissed: boolean;
  promptInstall: () => Promise<void>;
  dismiss: () => void;
}

export function useInstallPrompt(): InstallPromptState {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);
  const [dismissed, setDismissed] = useState(true); // assume true até hidratar

  useEffect(() => {
    setInstalled(isStandalone());
    setIos(isIos());
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === '1');

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'accepted') setInstalled(true);
    setDeferred(null);
  }, [deferred]);

  const dismiss = useCallback(() => {
    window.localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  }, []);

  return {
    canInstall: !!deferred && !installed,
    isIos: ios && !installed,
    isInstalled: installed,
    dismissed,
    promptInstall,
    dismiss,
  };
}
