'use client';

import { FloatingWhatsapp } from '@/features/landing/broker-home/components/floating-whatsapp';
import { PremiumFooter } from '@/features/landing/broker-home/components/premium-footer';
import { PremiumHeader } from '@/features/landing/broker-home/components/premium-header';
import { Reveal, Stagger, StaggerItem } from '@/features/landing/broker-home/components/primitives/reveal';
import { useBrokerHomeData } from '@/features/landing/broker-home/hooks/use-broker-home-data';
import { WhatsappProvider } from '@/features/landing/broker-home/hooks/whatsapp-context';
import { useBrokerAgents } from '@/features/landing/services/agents-service';
import { ChevronRight, Home, Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { TeamAgentCard } from './components/team-agent-card';
import { TeamCta } from './components/team-cta';
import {
  EMPTY_FILTERS,
  hasActiveFilters,
  TeamFilters,
  type TeamFiltersState,
} from './components/team-filters';

interface TeamPageProps {
  brokerSlug: string;
}

export function TeamPage({ brokerSlug }: TeamPageProps) {
  const meta = useBrokerHomeData(brokerSlug);
  const agentsQuery = useBrokerAgents(brokerSlug);
  const [filters, setFilters] = useState<TeamFiltersState>(EMPTY_FILTERS);

  const agents = agentsQuery.data ?? [];

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return agents.filter(a => {
      if (filters.city && a.city !== filters.city) return false;
      if (filters.specialty && !a.specialties.includes(filters.specialty))
        return false;
      if (filters.language && !a.languages.includes(filters.language))
        return false;
      if (q) {
        const haystack = [
          a.name,
          a.specialty ?? '',
          a.role_title ?? '',
          a.city ?? '',
          ...(a.neighborhoods ?? []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [agents, filters]);

  const homeHref = `/${brokerSlug}`;

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

      <main className="pt-24 md:pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[#0F0820]/50 mb-5"
          >
            <Link
              href={homeHref}
              className="inline-flex items-center gap-1 hover:text-[#0F0820] transition-colors"
            >
              <Home className="w-3 h-3" />
              Início
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#0F0820]/80">Equipe</span>
          </nav>

          {/* Hero institucional */}
          <Reveal>
            <div className="text-center max-w-3xl mx-auto pt-8 md:pt-12 pb-10 md:pb-14">
              <p className="text-xs tracking-[0.25em] uppercase text-amber-600 mb-4 font-medium">
                Especialistas em alto padrão
              </p>
              <h1 className="font-display text-4xl md:text-6xl text-[#0F0820] tracking-tight leading-[1.05]">
                Conheça a Equipe por trás do{' '}
                <span className="italic">seu Próximo Investimento.</span>
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#0F0820]/65 max-w-2xl mx-auto">
                Nossos corretores são consultores dedicados, especializados no
                mercado de luxo e prontos para oferecer uma experiência
                personalizada e discreta.
              </p>
            </div>
          </Reveal>

          {/* Filters */}
          {agents.length > 0 && (
            <Reveal delay={0.1}>
              <TeamFilters
                agents={agents}
                filters={filters}
                onChange={setFilters}
              />
            </Reveal>
          )}

          {/* Grid */}
          <section className="mt-10">
            {agentsQuery.isLoading ? (
              <LoadingGrid />
            ) : agentsQuery.error ? (
              <EmptyState
                title="Erro ao carregar a equipe"
                description="Tente novamente em instantes."
              />
            ) : agents.length === 0 ? (
              <EmptyState
                title="Nenhum corretor cadastrado ainda"
                description="Em breve nossa equipe estará aqui para te atender."
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="Nenhum corretor encontrado"
                description="Ajuste os filtros para ver mais profissionais."
                action={
                  hasActiveFilters(filters) ? (
                    <button
                      onClick={() => setFilters(EMPTY_FILTERS)}
                      className="mt-5 inline-flex items-center gap-2 bg-[#0F0820] text-white px-5 py-2.5 rounded-full text-sm hover:bg-[#1f1240] transition-colors"
                    >
                      Limpar filtros
                    </button>
                  ) : null
                }
              />
            ) : (
              <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {filtered.map(agent => (
                  <StaggerItem key={agent.id}>
                    <TeamAgentCard
                      agent={agent}
                      detailHref={`/${brokerSlug}/equipe/${agent.slug}`}
                    />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </section>

          {/* CTA */}
          <div className="mt-16 md:mt-20">
            <TeamCta whatsappNumber={meta.whatsappNumber} />
          </div>
        </div>
      </main>

      <PremiumFooter data={meta.footer} />
      <FloatingWhatsapp />
    </div>
    </WhatsappProvider>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl overflow-hidden border border-black/[0.05] animate-pulse"
        >
          <div className="aspect-[3/4] bg-gray-200" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      ))}
      <div className="col-span-full flex items-center justify-center pt-4 text-[#0F0820]/40">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Carregando equipe…
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-black/5">
      <div className="inline-flex w-16 h-16 rounded-full bg-[#FAFAF7] items-center justify-center mb-5 text-amber-500">
        <Users className="w-7 h-7" />
      </div>
      <h2 className="font-display text-2xl text-[#0F0820] mb-2">{title}</h2>
      <p className="text-[#0F0820]/60 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}
