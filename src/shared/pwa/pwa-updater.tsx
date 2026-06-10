'use client';

import { useEffect } from 'react';

/**
 * Detecta quando um novo service worker assume o controle (controllerchange)
 * e recarrega a página automaticamente, garantindo que o PWA sempre rode
 * a versão mais recente após um deploy.
 *
 * Também checa por atualizações a cada 60s e ao retornar ao app.
 */
export function PwaUpdater() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const reload = () => window.location.reload();

    navigator.serviceWorker.addEventListener('controllerchange', reload);

    const checkUpdate = () => {
      navigator.serviceWorker.getRegistration().then(reg => {
        reg?.update();
      });
    };

    const interval = setInterval(checkUpdate, 60_000);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') checkUpdate();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', reload);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return null;
}
