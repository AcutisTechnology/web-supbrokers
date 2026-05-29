'use client';

/**
 * Scaffold de Push Notifications — NÃO ativado.
 * Pronto para integrar Firebase/OneSignal futuramente. O service worker
 * (src/app/sw.ts) já possui os listeners `push`/`notificationclick`.
 *
 * Para ativar:
 * 1. Definir NEXT_PUBLIC_VAPID_PUBLIC_KEY no ambiente.
 * 2. Implementar o endpoint de salvar a subscription no backend.
 * 3. Chamar `subscribeToPush()` após consentimento do usuário.
 */

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) return 'denied';
  return Notification.requestPermission();
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

/**
 * Inscreve o dispositivo em push. Retorna a subscription (a ser enviada ao
 * backend). Inerte enquanto VAPID_PUBLIC_KEY não estiver configurada.
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!isPushSupported() || !VAPID_PUBLIC_KEY) return null;
  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  if (existing) return existing;
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });
}
