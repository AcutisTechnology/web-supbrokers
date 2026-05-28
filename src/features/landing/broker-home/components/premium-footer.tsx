'use client';

import {
  Clock,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { mockBrand } from '../data/mock';

export interface PremiumFooterSocial {
  id: number | string;
  platform: string;
  url: string;
}

export interface PremiumFooterData {
  brandName?: string;
  brandLogo?: string | null;
  footerText?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  creci?: string | null;
  social?: PremiumFooterSocial[];
  navLinks?: { label: string; href: string }[];
}

interface PremiumFooterProps {
  data?: PremiumFooterData;
}

const PLATFORM_ICON: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: MessageCircle,
  tiktok: Globe,
  twitter: Globe,
  custom: Globe,
};

const SUPPORT_LINKS = ['Privacidade', 'Termos de Uso', 'Mapa do Site', 'Contato'];

export function PremiumFooter({ data }: PremiumFooterProps) {
  const [email, setEmail] = useState('');

  const brandName = data?.brandName || mockBrand.name;
  const brandLogo = data?.brandLogo || null;
  const footerText =
    data?.footerText ||
    'Elevando o padrão imobiliário com exclusividade, tecnologia e transparência.';
  const social = data?.social ?? [];
  const navLinks =
    data?.navLinks ?? [
      { label: 'Comprar Imóvel', href: '#' },
      { label: 'Alugar Imóvel', href: '#' },
      { label: 'Nossa Equipe', href: '#' },
    ];

  const hasContact = !!(data?.phone || data?.email || data?.address);

  return (
    <footer className="bg-[#08040F] text-white pt-20">
      <div className="container mx-auto px-4 md:px-8">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-white/5">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            {brandLogo ? (
              <Image
                src={brandLogo}
                alt={brandName}
                width={150}
                height={40}
                className="h-9 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="font-display text-xl tracking-wide">{brandName}</span>
              </div>
            )}
            <p className="text-sm text-white/55 leading-relaxed">{footerText}</p>
            {social.length > 0 && (
              <div className="flex gap-2 pt-2">
                {social.map(s => {
                  const Icon = PLATFORM_ICON[s.platform] ?? Globe;
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/5 hover:bg-amber-300 hover:text-[#0F0820] text-white/70 flex items-center justify-center transition-all"
                      aria-label={s.platform}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navegação */}
          <div>
            <h4 className="text-sm font-medium mb-5 text-white">Navegação</h4>
            <ul className="space-y-3">
              {navLinks.map(l => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/55 hover:text-amber-300 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="text-sm font-medium mb-5 text-white">Suporte</h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map(l => (
                <li key={l}>
                  <span className="text-sm text-white/55 hover:text-amber-300 transition-colors cursor-pointer">
                    {l}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + contato */}
          <div>
            <h4 className="text-sm font-medium mb-5 text-white">Newsletter</h4>
            <p className="text-sm text-white/55 mb-4 leading-relaxed">
              Receba lançamentos exclusivos e insights de mercado.
            </p>
            <form
              onSubmit={e => {
                e.preventDefault();
                setEmail('');
              }}
              className="relative"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-300/50 transition-colors"
              />
              <button
                type="submit"
                aria-label="Enviar"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-amber-300 text-[#0F0820] rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {hasContact && (
              <div className="mt-6 space-y-2.5 text-xs text-white/55">
                {data?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-300" />
                    {data.phone}
                  </div>
                )}
                {data?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-300" />
                    {data.email}
                  </div>
                )}
                {data?.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-300 mt-0.5" />
                    {data.address}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  Seg–Sex 9h às 19h
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-white/40">
          <p>
            © {new Date().getFullYear()} {brandName}. Todos os direitos reservados.
          </p>
          {data?.creci && <span>{data.creci}</span>}
        </div>
      </div>
    </footer>
  );
}
