import type { Metadata } from "next";
import { Figtree } from "next/font/google";

import "./globals.css";

const figtreeSans = Figtree({
  variable: "--font-figtree-sans",
  subsets: ["latin"],
});

const figtreeMono = Figtree({
  variable: "--font-figtree-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Supbrokers",
  description: "Seu ecossistema imobiliário!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtreeSans.variable} ${figtreeMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
