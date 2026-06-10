'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Youtube,
  type LucideIcon,
} from 'lucide-react';

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
import { FloatingWhatsapp } from '@/features/landing/broker-home/components/floating-whatsapp';
import { PremiumFooter } from '@/features/landing/broker-home/components/premium-footer';
import { PremiumHeader } from '@/features/landing/broker-home/components/premium-header';
import { Reveal } from '@/features/landing/broker-home/components/primitives/reveal';
import { useBrokerHomeData, buildWhatsappUrl } from '@/features/landing/broker-home/hooks/use-broker-home-data';
import { WhatsappProvider } from '@/features/landing/broker-home/hooks/whatsapp-context';
import type { SitePage } from '@/features/dashboard/site/services/site-pages-service';

const INTEREST_OPTIONS = [
  'Comprar um imóvel',
  'Alugar um imóvel',
  'Vender / Anunciar',
  'Avaliação de imóvel',
  'Investimento imobiliário',
  'Outro',
];

const DEFAULT_BG =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=80';

interface ContactPageProps {
  brokerSlug: string;
  page: SitePage | null;
}

export function ContactPage({ brokerSlug, page }: ContactPageProps) {
  const meta = useBrokerHomeData(brokerSlug);
  const footer = meta.footer;

  const heroTitle = page?.hero_title || 'Entre em Contato';
  const heroSubtitle =
    page?.hero_subtitle ||
    'Nossa equipe está pronta para oferecer um atendimento exclusivo e ajudá-lo a encontrar o imóvel ideal.';
  const heroBg = page?.featured_image || DEFAULT_BG;

  const overlayColor = meta.hero?.overlayColor || '#0F0820';
  const overlayOpacity = meta.hero?.overlayOpacity ?? 75;
  const toHex = (pct: number) =>
    Math.round(Math.min(100, Math.max(0, pct)) * 2.55)
      .toString(16)
      .padStart(2, '0');
  const overlayGradient = `linear-gradient(to bottom, ${overlayColor}${toHex(overlayOpacity * 0.85)}, ${overlayColor}${toHex(overlayOpacity * 0.55)}, ${overlayColor}${toHex(overlayOpacity)})`;

  const phone = footer?.phone ?? null;
  const whatsapp = meta.whatsappNumber || null;
  const email = footer?.email ?? null;
  const address = footer?.address ?? null;

  return (
    <WhatsappProvider number={meta.whatsappNumber} templates={meta.whatsappTemplates}>
      <div className="min-h-screen bg-[#FAFAF7] text-[#0F0820]">
        <PremiumHeader
          brandName={meta.brandName}
          brandLogo={meta.brandLogo}
          brokerSlug={brokerSlug}
          whatsappNumber={meta.whatsappNumber}
          menu={meta.menu}
          theme="dark"
        />

        {/* ── HERO ── */}
        <section className="relative min-h-[38vh] flex items-end overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={heroBg}
              alt={heroTitle}
              fill
              priority
              className="object-cover scale-105"
              unoptimized={heroBg.startsWith('http')}
            />
            <div className="absolute inset-0" style={{ background: overlayGradient }} />
          </div>

          <div className="relative z-10 w-full container mx-auto px-4 md:px-8 pb-12 pt-32">
            <Reveal>
              <p className="text-xs tracking-[0.3em] uppercase text-amber-200/85 mb-3 font-medium">
                Fale Conosco
              </p>
              <h1 className="font-display text-white text-4xl md:text-5xl font-semibold leading-tight tracking-tight max-w-3xl">
                {heroTitle}
              </h1>
              <p className="mt-3 text-base text-white/70 max-w-2xl leading-relaxed">
                {heroSubtitle}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section className="container mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* LEFT — Info */}
            <Reveal>
              <div className="space-y-10">
                {/* Atendimento Direto */}
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6">
                    Atendimento Direto
                  </h2>
                  <ul className="space-y-4">
                    {phone && (
                      <li className="flex items-center gap-3 text-[#0F0820]/80">
                        <span className="w-9 h-9 rounded-full bg-[#9747FF]/10 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4 text-[#9747FF]" />
                        </span>
                        <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-[#9747FF] transition-colors">
                          {phone}
                        </a>
                      </li>
                    )}
                    {whatsapp && (
                      <li className="flex items-center gap-3 text-[#0F0820]/80">
                        <span className="w-9 h-9 rounded-full bg-[#9747FF]/10 flex items-center justify-center shrink-0">
                          <MessageCircle className="w-4 h-4 text-[#9747FF]" />
                        </span>
                        <a
                          href={buildWhatsappUrl(whatsapp, 'Olá! Gostaria de mais informações.')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#9747FF] transition-colors"
                        >
                          WhatsApp
                        </a>
                      </li>
                    )}
                    {email && (
                      <li className="flex items-center gap-3 text-[#0F0820]/80">
                        <span className="w-9 h-9 rounded-full bg-[#9747FF]/10 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4 text-[#9747FF]" />
                        </span>
                        <a href={`mailto:${email}`} className="hover:text-[#9747FF] transition-colors break-all">
                          {email}
                        </a>
                      </li>
                    )}
                    {!phone && !whatsapp && !email && (
                      <li className="text-[#0F0820]/40 text-sm">Configure os dados de contato em Configurações → Rodapé.</li>
                    )}
                  </ul>
                </div>

                {/* Endereço */}
                {address && (
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-4">Nossa Localização</h3>
                    <div className="flex items-start gap-3 text-[#0F0820]/80">
                      <span className="w-9 h-9 rounded-full bg-[#9747FF]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-[#9747FF]" />
                      </span>
                      <p className="leading-relaxed">{address}</p>
                    </div>
                  </div>
                )}

                {/* Redes sociais */}
                {(meta.footer?.social ?? []).length > 0 && (
                  <div>
                    <h3 className="text-xs tracking-[0.2em] uppercase text-[#0F0820]/40 font-medium mb-3">
                      Siga-nos
                    </h3>
                    <div className="flex items-center gap-3">
                      {(meta.footer?.social ?? []).map(link => {
                        const Icon = PLATFORM_ICON[link.platform] ?? Globe;
                        return (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full border border-[#0F0820]/10 flex items-center justify-center text-[#0F0820]/50 hover:border-[#9747FF]/40 hover:text-[#9747FF] transition-colors"
                            title={link.platform}
                          >
                            <Icon className="w-4 h-4" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            {/* RIGHT — Formulário */}
            <Reveal delay={0.15}>
              <ContactForm whatsappNumber={meta.whatsappNumber} brandName={meta.brandName} />
            </Reveal>
          </div>
        </section>

        <PremiumFooter data={meta.footer} />
        <FloatingWhatsapp />
      </div>
    </WhatsappProvider>
  );
}

/* ── FORMULÁRIO DE CONTATO ── */
interface ContactFormProps {
  whatsappNumber: string;
  brandName: string;
}

function ContactForm({ whatsappNumber, brandName }: ContactFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      `*Nova mensagem via site — ${brandName}*`,
      ``,
      `👤 *Nome:* ${form.name}`,
      form.email ? `📧 *E-mail:* ${form.email}` : null,
      form.phone ? `📱 *Telefone:* ${form.phone}` : null,
      form.interest ? `🏠 *Interesse:* ${form.interest}` : null,
      form.message ? `\n💬 *Mensagem:*\n${form.message}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const url = buildWhatsappUrl(whatsappNumber, lines);
    window.open(url, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const inputCls =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0F0820] bg-white placeholder-[#0F0820]/30 focus:outline-none focus:ring-2 focus:ring-[#9747FF]/30 focus:border-[#9747FF]/50 transition-colors';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <h2 className="font-display text-2xl font-semibold mb-1">Solicite uma Consultoria</h2>
      <p className="text-sm text-[#0F0820]/50 mb-6">
        Preencha o formulário e entraremos em contato em até 24 horas.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className={inputCls}
          placeholder="Nome Completo *"
          required
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className={inputCls}
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <input
            className={inputCls}
            placeholder="Telefone / WhatsApp"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          />
        </div>

        <select
          className={inputCls}
          value={form.interest}
          onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
        >
          <option value="">Tipo de Interesse</option>
          {INTEREST_OPTIONS.map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        <textarea
          className={`${inputCls} resize-none`}
          rows={4}
          placeholder="Mensagem (opcional)"
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#9747FF]/20"
        >
          <Send className="w-4 h-4" />
          {sent ? 'Abrindo WhatsApp…' : 'Enviar Mensagem'}
        </button>

        <p className="text-[10px] text-center text-[#0F0820]/30">
          Ao enviar, você será direcionado ao WhatsApp com os dados preenchidos.
        </p>
      </form>
    </div>
  );
}
