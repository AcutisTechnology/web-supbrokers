import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Imoobile — Seu ecossistema imobiliário',
    short_name: 'Imoobile',
    description:
      'Encontre imóveis de alto padrão, acompanhe lançamentos e fale com corretores. Sua imobiliária premium no bolso.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#0F0820',
    background_color: '#0F0820',
    lang: 'pt-BR',
    dir: 'ltr',
    categories: ['business', 'lifestyle', 'shopping'],
    icons: [
      { src: '/icons/icon-72.png', sizes: '72x72', type: 'image/png' },
      { src: '/icons/icon-96.png', sizes: '96x96', type: 'image/png' },
      { src: '/icons/icon-128.png', sizes: '128x128', type: 'image/png' },
      { src: '/icons/icon-144.png', sizes: '144x144', type: 'image/png' },
      { src: '/icons/icon-152.png', sizes: '152x152', type: 'image/png' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
