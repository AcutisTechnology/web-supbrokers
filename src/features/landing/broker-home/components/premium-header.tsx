'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, MessageCircle, Phone, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  buildWhatsappUrl,
  WHATSAPP_MESSAGES,
} from '../hooks/use-broker-home-data';

export interface PremiumHeaderProps {
  brandName: string;
  brandLogo: string | null;
  brokerSlug: string | null;
  whatsappNumber: string;
  menu: { id: string; label: string; href: string }[];
}

export function PremiumHeader({
  brandName,
  brandLogo,
  brokerSlug,
  whatsappNumber,
  menu,
}: PremiumHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openWhatsapp = () => {
    window.open(
      buildWhatsappUrl(whatsappNumber, WHATSAPP_MESSAGES.default),
      '_blank'
    );
  };

  const openAnunciar = () => {
    window.open(
      buildWhatsappUrl(whatsappNumber, WHATSAPP_MESSAGES.anunciar),
      '_blank'
    );
  };

  const homeHref = brokerSlug ? `/${brokerSlug}` : '#';

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0F0820]/85 backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href={homeHref} className="flex items-center gap-2 text-white shrink-0">
          {brandLogo ? (
            <Image
              src={brandLogo}
              alt={brandName}
              width={140}
              height={36}
              className="h-9 w-auto object-contain"
            />
          ) : (
            <>
              <span className="relative">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span
                  className="absolute inset-0 blur-md bg-amber-300/40"
                  aria-hidden
                />
              </span>
              <span className="font-display text-xl tracking-wide">
                {brandName}
              </span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {menu.map(item =>
            item.href.startsWith('#') ? (
              <a
                key={item.id}
                href={item.href}
                className="relative px-4 py-2 text-sm text-white/80 hover:text-white transition-colors group"
              >
                {item.label}
                <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-gradient-to-r from-amber-300 to-amber-100 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ) : (
              <Link
                key={item.id}
                href={item.href}
                className="relative px-4 py-2 text-sm text-white/80 hover:text-white transition-colors group"
              >
                {item.label}
                <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-gradient-to-r from-amber-300 to-amber-100 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            )
          )}
        </nav>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={openWhatsapp}
            className="flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors px-3 py-2"
          >
            <MessageCircle className="w-4 h-4" />
            Falar no WhatsApp
          </button>
          <button
            onClick={openAnunciar}
            className="relative overflow-hidden group bg-white text-[#0F0820] text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.6)]"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-[#0F0820]">
              Anunciar Imóvel
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Abrir menu"
          className="lg:hidden text-white p-2"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden absolute top-full inset-x-0 bg-[#0F0820]/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-1">
              {menu.map(item => {
                const className =
                  'text-white/85 py-3 px-3 rounded-lg hover:bg-white/5 transition-colors';
                return item.href.startsWith('#') ? (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={className}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={className}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5">
                <button
                  onClick={openWhatsapp}
                  className="flex items-center justify-center gap-2 text-sm text-white border border-white/15 rounded-full py-3"
                >
                  <Phone className="w-4 h-4" /> Falar no WhatsApp
                </button>
                <button
                  onClick={openAnunciar}
                  className="bg-white text-[#0F0820] font-medium text-sm rounded-full py-3"
                >
                  Anunciar Imóvel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
