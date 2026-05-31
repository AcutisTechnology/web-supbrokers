'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { mockProperties, type MockProperty } from './data/mock';
import { BlogSection } from './components/blog-section';
import { BrokersSection } from './components/brokers-section';
import { DynamicSeo } from './components/dynamic-seo';
import { FinalCta } from './components/final-cta';
import { FloatingWhatsapp } from './components/floating-whatsapp';
import { InstitutionalSection } from './components/institutional-section';
import { NeighborhoodsSection } from './components/neighborhoods-section';
import { PremiumFooter } from './components/premium-footer';
import { PremiumHeader } from './components/premium-header';
import { PremiumHero } from './components/premium-hero';
import { PropertySection } from './components/property-section';
import { StatsStrip } from './components/stats-strip';
import { TestimonialsSection } from './components/testimonials-section';
import { useBrokerHomeData } from './hooks/use-broker-home-data';
import { WhatsappProvider } from './hooks/whatsapp-context';
import { apiToCardProperty } from './lib/map-property';

interface BrokerHomeProps {
  brokerSlug?: string | null;
}

interface Buckets {
  highlighted: MockProperty[];
  sale: MockProperty[];
  rent: MockProperty[];
}

const EMPTY_BUCKETS: Buckets = { highlighted: [], sale: [], rent: [] };

const DEFAULT_SECTION_ORDER = [
  'destaques',
  'venda',
  'aluguel',
  'stats',
  'regioes',
  'institucional',
  'equipe',
  'depoimentos',
  'blog',
];

function BrokerSiteLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Image
        src="/logo-extendida-roxo.svg"
        alt="iMoobile"
        width={200}
        height={52}
        priority
        className="mb-8"
      />
      <div className="flex gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#9747FF] animate-bounce [animation-delay:0ms]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#9747FF] animate-bounce [animation-delay:150ms]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#9747FF] animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export function BrokerHome({ brokerSlug = null }: BrokerHomeProps) {
  const data = useBrokerHomeData(brokerSlug);

  // Todos os hooks devem ser chamados antes de qualquer return condicional
  const orderedSections = useMemo(() => {
    if (data.homeLayout && data.homeLayout.length > 0) {
      return data.homeLayout.filter(s => s.enabled).map(s => s.key);
    }
    return DEFAULT_SECTION_ORDER;
  }, [data.homeLayout]);

  const buckets: Buckets = useMemo(() => {
    // Modo broker real → consome a API
    if (brokerSlug && data.properties) {
      return {
        highlighted: data.properties.highlighted.map(apiToCardProperty),
        sale: data.properties.sale.map(apiToCardProperty),
        rent: data.properties.rent.map(apiToCardProperty),
      };
    }
    // Modo broker mas ainda carregando
    if (brokerSlug) return EMPTY_BUCKETS;

    // Sem broker → mock pra demonstrar visual
    return {
      highlighted: mockProperties.filter(p => p.badges.includes('destaque')),
      sale: mockProperties.filter(p => p.type === 'sale'),
      rent: mockProperties.filter(p => p.type === 'rent'),
    };
  }, [brokerSlug, data.properties]);

  // Loader: só após todos os hooks
  if (brokerSlug && data.loading) {
    return <BrokerSiteLoader />;
  }

  return (
    <WhatsappProvider number={data.whatsappNumber} templates={data.whatsappTemplates}>
    <DynamicSeo
      title={data.seo.title || (brokerSlug ? data.brandName : undefined)}
      description={data.seo.description}
      ogImage={data.seo.ogImage}
    />
    <div className="min-h-screen bg-white text-[#0F0820] antialiased">
      <PremiumHeader
        brandName={data.brandName}
        brandLogo={data.brandLogo}
        brokerSlug={data.brokerSlug}
        whatsappNumber={data.whatsappNumber}
        menu={data.menu}
      />

      <main>
        <PremiumHero
          brokerSlug={data.brokerSlug}
          neighborhoodSuggestions={data.neighborhoodSuggestions}
          citySuggestions={data.citySuggestions}
          hero={data.hero}
        />

        {orderedSections.map(key => {
          switch (key) {
            case 'destaques':
              return buckets.highlighted.length > 0 ? (
                <PropertySection
                  key={key}
                  id="destaques"
                  eyebrow="Portfólio exclusivo"
                  title="Imóveis em destaque"
                  description="Seleção do nosso time de curadoria para você."
                  properties={buckets.highlighted}
                  variant="carousel"
                  background="cream"
                  brokerSlug={data.brokerSlug}
                />
              ) : null;
            case 'venda':
              return buckets.sale.length > 0 ? (
                <PropertySection
                  key={key}
                  id="imoveis-venda"
                  eyebrow="Para você ser dono"
                  title="À venda"
                  description="Imóveis selecionados disponíveis para compra."
                  properties={buckets.sale}
                  variant="carousel"
                  background="light"
                  brokerSlug={data.brokerSlug}
                />
              ) : null;
            case 'aluguel':
              return buckets.rent.length > 0 ? (
                <PropertySection
                  key={key}
                  id="imoveis-aluguel"
                  eyebrow="Pronto para morar"
                  title="Para alugar"
                  description="Os melhores imóveis disponíveis para locação."
                  properties={buckets.rent}
                  variant="carousel"
                  background="cream"
                  brokerSlug={data.brokerSlug}
                />
              ) : null;
            case 'stats':
              return <StatsStrip key={key} stats={data.stats} />;
            case 'regioes':
              return (
                <NeighborhoodsSection
                  key={key}
                  brokerSlug={data.brokerSlug}
                  neighborhoods={data.topNeighborhoods}
                />
              );
            case 'institucional':
              return (
                <InstitutionalSection
                  key={key}
                  data={brokerSlug ? data.institutional : undefined}
                />
              );
            case 'equipe':
              return <BrokersSection key={key} brokerSlug={data.brokerSlug} />;
            case 'depoimentos':
              return (
                <TestimonialsSection
                  key={key}
                  testimonials={brokerSlug ? data.testimonials : undefined}
                />
              );
            case 'blog':
              return (
                <BlogSection
                  key={key}
                  posts={brokerSlug ? data.posts : undefined}
                  brokerSlug={brokerSlug}
                />
              );
            default:
              return null;
          }
        })}

        <FinalCta />
      </main>

      <PremiumFooter data={data.footer} />
      <FloatingWhatsapp />
    </div>
    </WhatsappProvider>
  );
}
