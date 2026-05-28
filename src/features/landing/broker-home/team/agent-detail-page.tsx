'use client';

import { ListingPropertyCard } from '@/features/landing/broker-home/components/listing-property-card';
import { FloatingWhatsapp } from '@/features/landing/broker-home/components/floating-whatsapp';
import { PremiumFooter } from '@/features/landing/broker-home/components/premium-footer';
import { PremiumHeader } from '@/features/landing/broker-home/components/premium-header';
import { Reveal } from '@/features/landing/broker-home/components/primitives/reveal';
import {
  buildWhatsappUrl,
  resolveWhatsappMessage,
  useBrokerHomeData,
} from '@/features/landing/broker-home/hooks/use-broker-home-data';
import { WhatsappProvider, useWhatsapp } from '@/features/landing/broker-home/hooks/whatsapp-context';
import { apiToCardProperty } from '@/features/landing/broker-home/lib/map-property';
import { useBrokerAgentDetail } from '@/features/landing/services/agents-service';
import { useBrokerProperties } from '@/features/landing/services/broker-service';
import {
  ChevronRight,
  Facebook,
  Globe,
  Home,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/shared/configs/api';

interface AgentDetailPageProps {
  brokerSlug: string;
  agentSlug: string;
}

const PHOTO_FALLBACK =
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=1200&q=80';
const BANNER_FALLBACK =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80';

const SPECIALTY_LABEL: Record<string, string> = {
  luxo: 'Luxo',
  lancamentos: 'Lançamentos',
  investimento: 'Investimento',
  destaque: 'Destaque',
};

export function AgentDetailPage({ brokerSlug, agentSlug }: AgentDetailPageProps) {
  const meta = useBrokerHomeData(brokerSlug);
  const agentQuery = useBrokerAgentDetail(brokerSlug, agentSlug);
  const propertiesQuery = useBrokerProperties(brokerSlug);

  const agent = agentQuery.data;
  const homeHref = `/${brokerSlug}`;
  const teamHref = `/${brokerSlug}/equipe`;

  if (agentQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center text-[#0F0820]/60">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Carregando corretor…
      </div>
    );
  }

  if (agentQuery.error || !agent) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center text-[#0F0820]/60 text-center px-4">
        <div>
          <p className="font-display text-2xl text-[#0F0820] mb-2">
            Corretor não encontrado
          </p>
          <p className="text-sm">
            O perfil pode ter sido removido ou o link está incorreto.
          </p>
          <Link
            href={teamHref}
            className="inline-block mt-5 text-amber-700 hover:text-amber-600 text-sm font-medium"
          >
            ← Voltar para a equipe
          </Link>
        </div>
      </div>
    );
  }

  const photo = agent.photo_url || PHOTO_FALLBACK;
  const banner = agent.banner_url || BANNER_FALLBACK;

  // Imóveis exibidos: por enquanto, todos os imóveis da imobiliária
  // (fallback até existir agent_id em properties).
  const allProperties = propertiesQuery.data?.data.all ?? [];

  return (
    <WhatsappProvider number={meta.whatsappNumber} templates={meta.whatsappTemplates}>
    <div className="min-h-screen bg-[#FAFAF7] text-[#0F0820]">
      <PremiumHeader
        brandName={meta.brandName}
        brandLogo={meta.brandLogo}
        brokerSlug={meta.brokerSlug}
        whatsappNumber={meta.whatsappNumber}
        menu={meta.menu}
        theme="light"
      />

      {/* Banner + identidade */}
      <section className="relative">
        <div className="relative h-[280px] md:h-[380px] overflow-hidden">
          <Image
            src={banner}
            alt={agent.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F0820]/40 via-[#0F0820]/20 to-[#FAFAF7]" />
        </div>

        <div className="container mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="absolute top-24 left-4 md:left-8 flex items-center gap-2 text-xs text-white/85"
          >
            <Link href={homeHref} className="inline-flex items-center gap-1 hover:text-white">
              <Home className="w-3 h-3" />
              Início
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={teamHref} className="hover:text-white">
              Equipe
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span>{agent.name}</span>
          </nav>

          {/* Card identidade */}
          <div className="relative -mt-24 md:-mt-32 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
            <Reveal>
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(15,8,32,0.4)] bg-[#0F0820]">
                <Image
                  src={photo}
                  alt={agent.name}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-white rounded-3xl border border-black/[0.05] shadow-[0_10px_30px_-15px_rgba(15,8,32,0.1)] p-6 md:p-8 mt-6 lg:mt-16">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {agent.role_title && (
                    <span className="px-3 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-200">
                      {agent.role_title}
                    </span>
                  )}
                  {agent.creci && (
                    <span className="inline-flex items-center gap-1 text-xs text-[#0F0820]/55">
                      <ShieldCheck className="w-3 h-3" />
                      {agent.creci}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-3xl md:text-5xl text-[#0F0820] tracking-tight leading-tight">
                  {agent.name}
                </h1>

                {agent.specialty && (
                  <p className="mt-2 text-base md:text-lg text-[#0F0820]/70">
                    {agent.specialty}
                  </p>
                )}

                {/* Stats inline */}
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#0F0820]/65">
                  {agent.city && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      {agent.city}
                    </span>
                  )}
                  {agent.languages.length > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-amber-500" />
                      {agent.languages.join(', ')}
                    </span>
                  )}
                  {agent.years_experience && (
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-500" />
                      {agent.years_experience} anos de mercado
                    </span>
                  )}
                </div>

                {agent.specialties.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {agent.specialties.map(s => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-amber-400 text-[#0F0820]"
                      >
                        {SPECIALTY_LABEL[s] ?? s}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTAs */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {agent.whatsapp && (
                    <a
                      href={buildWhatsappUrl(
                        agent.whatsapp,
                        resolveWhatsappMessage(meta.whatsappTemplates, 'interest_agent', {
                          agent: { name: agent.name },
                        })
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-500 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-emerald-400 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Falar no WhatsApp
                    </a>
                  )}
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone.replace(/\D/g, '')}`}
                      className="inline-flex items-center gap-2 bg-white border border-black/10 text-[#0F0820]/80 text-sm font-medium px-5 py-2.5 rounded-full hover:border-[#0F0820]/30 hover:text-[#0F0820] transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Ligar
                    </a>
                  )}
                  <SocialIconLinks agent={agent} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 md:gap-12 items-start">
          {/* Main */}
          <div className="space-y-10 min-w-0">
            {agent.full_bio && (
              <Reveal>
                <section>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-amber-600 mb-3">
                    Sobre
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl text-[#0F0820] tracking-tight mb-5">
                    Conheça {agent.name.split(' ')[0]}
                  </h2>
                  <p className="text-[#0F0820]/75 text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {agent.full_bio}
                  </p>
                </section>
              </Reveal>
            )}

            {agent.neighborhoods.length > 0 && (
              <Reveal>
                <section>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-amber-600 mb-3">
                    Áreas de atuação
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl text-[#0F0820] tracking-tight mb-5">
                    Bairros que conheço a fundo
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {agent.neighborhoods.map(n => (
                      <span
                        key={n}
                        className="px-4 py-2 rounded-full bg-white border border-black/10 text-sm text-[#0F0820]/80 hover:border-amber-400 hover:text-[#0F0820] transition-colors"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* Properties */}
            {allProperties.length > 0 && (
              <Reveal>
                <section>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-amber-600 mb-3">
                    Portfólio
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl text-[#0F0820] tracking-tight mb-2">
                    Imóveis da equipe
                  </h2>
                  <p className="text-[#0F0820]/55 text-sm mb-6">
                    Selecionados pela imobiliária — fale com {agent.name.split(' ')[0]} para
                    saber quais ele acompanha pessoalmente.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {allProperties.slice(0, 4).map(p => (
                      <ListingPropertyCard
                        key={p.slug}
                        property={apiToCardProperty(p)}
                        whatsappNumber={agent.whatsapp ?? meta.whatsappNumber}
                        brokerSlug={brokerSlug}
                      />
                    ))}
                  </div>
                </section>
              </Reveal>
            )}
          </div>

          {/* Sidebar com form */}
          <aside className="hidden lg:block sticky top-24">
            <Reveal>
              <ContactCard agent={agent} fallbackWhatsapp={meta.whatsappNumber} />
            </Reveal>
          </aside>
        </div>

        {/* Form inline mobile */}
        <div className="lg:hidden mt-12">
          <ContactCard agent={agent} fallbackWhatsapp={meta.whatsappNumber} />
        </div>
      </main>

      <PremiumFooter data={meta.footer} />
      <FloatingWhatsapp />
    </div>
    </WhatsappProvider>
  );
}

/* ---------------- subcomponents ---------------- */

function SocialIconLinks({
  agent,
}: {
  agent: { instagram: string | null; facebook: string | null; linkedin: string | null };
}) {
  const items = [
    agent.instagram
      ? {
          icon: Instagram,
          href: agent.instagram.startsWith('http')
            ? agent.instagram
            : `https://instagram.com/${agent.instagram.replace('@', '')}`,
          label: 'Instagram',
        }
      : null,
    agent.linkedin
      ? {
          icon: Linkedin,
          href: agent.linkedin.startsWith('http')
            ? agent.linkedin
            : `https://www.linkedin.com/in/${agent.linkedin}`,
          label: 'LinkedIn',
        }
      : null,
    agent.facebook
      ? {
          icon: Facebook,
          href: agent.facebook.startsWith('http')
            ? agent.facebook
            : `https://facebook.com/${agent.facebook}`,
          label: 'Facebook',
        }
      : null,
  ].filter((x): x is NonNullable<typeof x> => x !== null);

  if (items.length === 0) return null;

  return (
    <div className="ml-1 flex items-center gap-1.5">
      {items.map(it => {
        const Icon = it.icon;
        return (
          <a
            key={it.label}
            href={it.href}
            target="_blank"
            rel="noreferrer"
            aria-label={it.label}
            className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-[#0F0820]/70 hover:text-[#0F0820] hover:border-[#0F0820]/30 transition-colors"
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}

function ContactCard({
  agent,
  fallbackWhatsapp,
}: {
  agent: {
    name: string;
    email: string | null;
    whatsapp: string | null;
    slug: string;
  };
  fallbackWhatsapp: string;
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const whats = agent.whatsapp || fallbackWhatsapp;
  const { message: agentMessage } = useWhatsapp('interest_agent', {
    agent: { name: agent.name },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await api.post('customers', {
        json: {
          ...form,
          interested_property_slug: `agent-${agent.slug}`,
        },
      });
      toast.success(
        `Pronto! ${agent.name.split(' ')[0]} entrará em contato em instantes.`
      );
      setForm({ name: '', email: '', phone: '', message: '' });
      window.open(
        buildWhatsappUrl(whats, agentMessage),
        '_blank'
      );
    } catch {
      toast.error('Não conseguimos enviar agora. Tente novamente em instantes.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-black/[0.05] shadow-[0_20px_50px_-15px_rgba(15,8,32,0.12)] p-6 md:p-7">
      <p className="text-[10px] uppercase tracking-[0.25em] text-amber-600 mb-2 font-medium">
        Fale diretamente
      </p>
      <h3 className="font-display text-xl text-[#0F0820] mb-5">
        Solicite atendimento de {agent.name.split(' ')[0]}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Nome completo"
          className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm text-[#0F0820] placeholder:text-[#0F0820]/40 outline-none focus:border-amber-400/60"
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          placeholder="E-mail"
          className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm text-[#0F0820] placeholder:text-[#0F0820]/40 outline-none focus:border-amber-400/60"
        />
        <input
          required
          type="tel"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          placeholder="Telefone com DDD"
          className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm text-[#0F0820] placeholder:text-[#0F0820]/40 outline-none focus:border-amber-400/60"
        />
        <textarea
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder={`Mensagem para ${agent.name.split(' ')[0]}…`}
          rows={3}
          className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm text-[#0F0820] placeholder:text-[#0F0820]/40 outline-none focus:border-amber-400/60 resize-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#0F0820] text-white font-medium text-sm px-5 py-3 rounded-full hover:bg-[#1f1240] transition-colors disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando…
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Enviar mensagem
            </>
          )}
        </button>
        {agent.whatsapp && (
          <a
            href={buildWhatsappUrl(agent.whatsapp, agentMessage)}
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 text-white font-medium text-sm px-5 py-3 rounded-full hover:bg-emerald-400 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Prefiro WhatsApp
          </a>
        )}
      </form>
    </div>
  );
}
