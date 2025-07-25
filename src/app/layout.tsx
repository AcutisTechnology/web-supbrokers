import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';

import './globals.css';
import { AppProviders } from '@/shared/contexts/providers';

const figtreeSans = Figtree({
  variable: '--font-figtree-sans',
  subsets: ['latin'],
});

const figtreeMono = Figtree({
  variable: '--font-figtree-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Imoobile',
  description: 'Seu ecossistema imobiliário!!',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtreeSans.variable} ${figtreeMono.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
