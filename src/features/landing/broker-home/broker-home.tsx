'use client';

import { useMemo } from 'react';
import { mockProperties, type MockProperty } from './data/mock';
import { BlogSection } from './components/blog-section';
import { BrokersSection } from './components/brokers-section';
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

export function BrokerHome({ brokerSlug = null }: BrokerHomeProps) {
  const data = useBrokerHomeData(brokerSlug);

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

  return (
    <WhatsappProvider number={data.whatsappNumber} templates={data.whatsappTemplates}>
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

        {buckets.highlighted.length > 0 && (
          <PropertySection
            id="destaques"
            eyebrow="Portfólio exclusivo"
            title="Imóveis em destaque"
            description="Seleção do nosso time de curadoria para você."
            properties={buckets.highlighted}
            variant="carousel"
            background="cream"
          />
        )}

        {buckets.sale.length > 0 && (
          <PropertySection
            id="imoveis-venda"
            eyebrow="Para você ser dono"
            title="À venda"
            description="Imóveis selecionados disponíveis para compra."
            properties={buckets.sale}
            variant="carousel"
            background="light"
          />
        )}

        {buckets.rent.length > 0 && (
          <PropertySection
            id="imoveis-aluguel"
            eyebrow="Pronto para morar"
            title="Para alugar"
            description="Os melhores imóveis disponíveis para locação."
            properties={buckets.rent}
            variant="carousel"
            background="cream"
          />
        )}

        <StatsStrip stats={data.stats} />

        <NeighborhoodsSection
          brokerSlug={data.brokerSlug}
          neighborhoods={data.topNeighborhoods}
        />

        <InstitutionalSection data={brokerSlug ? data.institutional : undefined} />

        <BrokersSection />

        <TestimonialsSection testimonials={brokerSlug ? data.testimonials : undefined} />

        <BlogSection />

        <FinalCta />
      </main>

      <PremiumFooter />
      <FloatingWhatsapp />
    </div>
    </WhatsappProvider>
  );
}
