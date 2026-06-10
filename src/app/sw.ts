import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { NetworkOnly, Serwist } from 'serwist';

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
  navigationPreload: false,
  runtimeCaching: [
    // App autenticado e rotas de API same-origin: SEMPRE rede, nunca cache.
    // O dashboard é dinâmico e protegido por auth — cachear páginas/RSC aqui
    // causa estados stale e o erro "no-response" em navegações dinâmicas
    // (ex.: após salvar um imóvel). Deve se comportar como se não houvesse SW.
    {
      matcher: ({ url, sameOrigin }) =>
        sameOrigin &&
        (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/api')),
      handler: new NetworkOnly(),
    },
    // API externa do backend — POST/PUT/DELETE passam direto (sem cache),
    // pois podem ter body com arquivos binários que o SW não deve interceptar.
    {
      matcher: ({ url, request }) =>
        url.pathname.includes('/api/v1/') && request.method !== 'GET',
      handler: new NetworkOnly(),
    },
    // API externa do backend (GET): sem cache no SW — o React Query gerencia cache client-side.
    // Cachear aqui causava respostas stale quando campos novos eram adicionados ao backend.
    {
      matcher: ({ url, request }) =>
        url.pathname.includes('/api/v1/') && request.method === 'GET',
      handler: new NetworkOnly(),
    },
    // Demais recursos (estáticos, fontes, imagens, páginas públicas) usam os defaults do Serwist.
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

// Suppresses uncaught "no-response" rejections that occur when Next.js cancels
// in-flight prefetch requests (AbortError). These are harmless — the page still
// loads normally via its own navigation fetch.
self.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  const msg: string = event.reason?.message ?? '';
  if (msg.startsWith('no-response')) {
    event.preventDefault();
  }
});
