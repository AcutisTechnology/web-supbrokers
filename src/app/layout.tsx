import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';

import './globals.css';
import { AppProviders } from '@/shared/contexts/providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const appleStartupImages = [
  ['430px', '932px', 3, '/icons/splash-1290x2796.png'],
  ['393px', '852px', 3, '/icons/splash-1179x2556.png'],
  ['428px', '926px', 3, '/icons/splash-1284x2778.png'],
  ['390px', '844px', 3, '/icons/splash-1170x2532.png'],
  ['375px', '812px', 3, '/icons/splash-1125x2436.png'],
  ['414px', '896px', 2, '/icons/splash-828x1792.png'],
  ['375px', '667px', 2, '/icons/splash-750x1334.png'],
  ['768px', '1024px', 2, '/icons/splash-1536x2048.png'],
].map(([w, h, ratio, url]) => ({
  url: url as string,
  media: `(device-width: ${w}) and (device-height: ${h}) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)`,
}));

export const metadata: Metadata = {
  title: 'Imoobile',
  description: 'Seu ecossistema imobiliário!!',
  applicationName: 'Imoobile',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Imoobile',
    startupImage: appleStartupImages,
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: '#0F0820',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
