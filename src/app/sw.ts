import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { NetworkFirst, Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // APIs dinâmicas: rede primeiro (com timeout) e cache como fallback.
    {
      matcher: ({ url }) => url.pathname.includes('/api/v1/'),
      handler: new NetworkFirst({
        cacheName: 'api-v1',
        networkTimeoutSeconds: 5,
        plugins: [
          {
            cacheWillUpdate: async ({ response }) =>
              response && response.status === 200 ? response : null,
          },
        ],
      }),
    },
    // Demais recursos (estáticos, fontes, imagens, páginas) usam os defaults do Serwist.
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher: ({ request }) => request.destination === 'document',
      },
    ],
  },
});

// --- Scaffold de Push Notifications (inerte até integrar Firebase/OneSignal) ---
self.addEventListener('push', event => {
  if (!event.data) return;
  let payload: { title?: string; body?: string; url?: string; icon?: string } = {};
  try {
    payload = event.data.json();
  } catch {
    payload = { body: event.data.text() };
  }
  event.waitUntil(
    self.registration.showNotification(payload.title ?? 'Imoobile', {
      body: payload.body ?? '',
      icon: payload.icon ?? '/icons/icon-192.png',
      badge: '/icons/icon-96.png',
      data: { url: payload.url ?? '/' },
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data as { url?: string })?.url ?? '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      const existing = clients.find(c => 'focus' in c);
      if (existing) return (existing as WindowClient).focus();
      return self.clients.openWindow(url);
    })
  );
});

serwist.addEventListeners();
