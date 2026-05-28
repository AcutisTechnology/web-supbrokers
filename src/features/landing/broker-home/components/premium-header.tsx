'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, MessageCircle, Phone, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWhatsapp } from '../hooks/whatsapp-context';

export interface PremiumHeaderProps {
  brandName: string;
  brandLogo: string | null;
  brokerSlug: string | null;
  whatsappNumber: string;
  menu: { id: string; label: string; href: string }[];
  /**
   * dark = transparente sobre fundo escuro (default, usado na home)
   * light = branco/glass sobre fundo claro (usado em páginas internas)
   */
  theme?: 'dark' | 'light';
}

export function PremiumHeader({
  brandName,
  brandLogo,
  brokerSlug,
  whatsappNumber,
  menu,
  theme = 'dark',
}: PremiumHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { url: defaultUrl } = useWhatsapp('default');
  const { url: announceUrl } = useWhatsapp('announce');

  const openWhatsapp = () => window.open(defaultUrl, '_blank');
  const openAnunciar = () => window.open(announceUrl, '_blank');

  const homeHref = brokerSlug ? `/${brokerSlug}` : '#';
  const isLight = theme === 'light';

  // Cores derivadas
  const navTextBase = isLight ? 'text-[#0F0820]/70' : 'text-white/80';
  const navTextHover = isLight ? 'text-[#0F0820]' : 'text-white';
  const navTextActive = isLight ? 'text-rose-600' : 'text-amber-300';
  const logoText = isLight ? 'text-[#0F0820]' : 'text-white';
  const headerBg = scrolled
    ? isLight
      ? 'bg-white/95 backdrop-blur-xl border-b border-black/5 py-3 shadow-[0_4px_20px_-10px_rgba(15,8,32,0.1)]'
      : 'bg-[#0F0820]/85 backdrop-blur-xl border-b border-white/5 py-3'
    : isLight
      ? 'bg-white/80 backdrop-blur-sm py-4'
      : 'bg-transparent py-5';
  const whatsBtn = isLight
    ? 'text-[#0F0820]/80 hover:text-[#0F0820]'
    : 'text-white/90 hover:text-white';
  const anunciarBtn = isLight
    ? 'bg-[#0F0820] text-white hover:bg-[#1f1240]'
    : 'bg-white text-[#0F0820]';

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${headerBg}`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link
          href={homeHref}
          className={`flex items-center gap-2 shrink-0 ${logoText}`}
        >
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
                <Sparkles
                  className={`w-5 h-5 ${isLight ? 'text-amber-500' : 'text-amber-300'}`}
                />
                <span
                  className={`absolute inset-0 blur-md ${isLight ? 'bg-amber-400/30' : 'bg-amber-300/40'}`}
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
          {menu.map(item => {
            const active = item.href.startsWith('#')
              ? false
              : pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
            const className = `relative px-4 py-2 text-sm transition-colors group ${
              active ? navTextActive : `${navTextBase} hover:${navTextHover}`
            }`;
            const underline = `absolute left-4 right-4 -bottom-0.5 h-px transition-transform origin-left ${
              isLight
                ? 'bg-gradient-to-r from-rose-500 to-rose-400'
                : 'bg-gradient-to-r from-amber-300 to-amber-100'
            } ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`;
            return item.href.startsWith('#') ? (
              <a key={item.id} href={item.href} className={className}>
                {item.label}
                <span className={underline} />
              </a>
            ) : (
              <Link key={item.id} href={item.href} className={className}>
                {item.label}
                <span className={underline} />
              </Link>
            );
          })}
        </nav>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={openWhatsapp}
            className={`flex items-center gap-2 text-sm transition-colors px-3 py-2 ${whatsBtn}`}
          >
            <MessageCircle className="w-4 h-4" />
            Falar no WhatsApp
          </button>
          <button
            onClick={openAnunciar}
            className={`relative overflow-hidden group text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:shadow-[0_0_30px_-5px_rgba(15,8,32,0.4)] ${anunciarBtn}`}
          >
            Anunciar Imóvel
          </button>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Abrir menu"
          className={`lg:hidden p-2 ${isLight ? 'text-[#0F0820]' : 'text-white'}`}
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
            className={`lg:hidden absolute top-full inset-x-0 backdrop-blur-xl border-b ${
              isLight
                ? 'bg-white/95 border-black/5'
                : 'bg-[#0F0820]/95 border-white/5'
            }`}
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-1">
              {menu.map(item => {
                const linkClass = `py-3 px-3 rounded-lg transition-colors ${
                  isLight
                    ? 'text-[#0F0820]/85 hover:bg-black/5'
                    : 'text-white/85 hover:bg-white/5'
                }`;
                return item.href.startsWith('#') ? (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={linkClass}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={linkClass}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div
                className={`flex flex-col gap-2 mt-4 pt-4 border-t ${
                  isLight ? 'border-black/5' : 'border-white/5'
                }`}
              >
                <button
                  onClick={openWhatsapp}
                  className={`flex items-center justify-center gap-2 text-sm rounded-full py-3 ${
                    isLight
                      ? 'text-[#0F0820] border border-black/10'
                      : 'text-white border border-white/15'
                  }`}
                >
                  <Phone className="w-4 h-4" /> Falar no WhatsApp
                </button>
                <button
                  onClick={openAnunciar}
                  className={`font-medium text-sm rounded-full py-3 ${
                    isLight
                      ? 'bg-[#0F0820] text-white'
                      : 'bg-white text-[#0F0820]'
                  }`}
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
