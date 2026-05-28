'use client';

import { useBrokerProperties } from '@/features/landing/services/broker-service';
import { ChevronRight, Home, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef } from 'react';
import { FloatingWhatsapp } from '../components/floating-whatsapp';
import { PremiumFooter } from '../components/premium-footer';
import { PremiumHeader } from '../components/premium-header';
import { useBrokerHomeData } from '../hooks/use-broker-home-data';
import { WhatsappProvider } from '../hooks/whatsapp-context';
import { DetailContactForm } from './components/detail-contact-form';
import { DetailDescription } from './components/detail-description';
import { DetailFeatures } from './components/detail-features';
import { DetailFinalCta } from './components/detail-final-cta';
import { DetailHeroGallery } from './components/detail-hero-gallery';
import { DetailHighlights } from './components/detail-highlights';
import { DetailMobileCta } from './components/detail-mobile-cta';
import { DetailQuickActions } from './components/detail-quick-actions';
import { DetailSidebar } from './components/detail-sidebar';
import { DetailSimilar } from './components/detail-similar';
import { DetailSummary } from './components/detail-summary';

interface PropertyDetailProps {
  brokerSlug: string;
  propertySlug: string;
}

function parseMoney(value: string | null | undefined): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

export function PropertyDetail({ brokerSlug, propertySlug }: PropertyDetailProps) {
  const meta = useBrokerHomeData(brokerSlug);
  const brokerProperties = useBrokerProperties(brokerSlug);

  // Deriva o imóvel da listagem completa (evita endpoint individual que
  // ainda não existe no backend público). Bonus: 1 fetch só.
  const allProperties = brokerProperties.data?.data.all ?? [];
  const property = useMemo(
    () => allProperties.find(p => p.slug === propertySlug) ?? null,
    [allProperties, propertySlug]
  );
  const user = brokerProperties.data?.data.user;

  const formRef = useRef<HTMLDivElement>(null);

  const propertyType: 'sale' | 'rent' = useMemo(() => {
    if (!property) return 'sale';
    return property.sale ? 'sale' : 'rent';
  }, [property]);

  const propertyValueNumber = property
    ? property.value_raw ?? parseMoney(property.value)
    : 0;

  const badges = useMemo(() => {
    if (!property) return [];
    const out: { label: string; tone: 'dark' | 'light' | 'gold' | 'rose' }[] = [];
    out.push({
      label: property.sale ? 'À venda' : 'Aluguel',
      tone: property.sale ? 'dark' : 'light',
    });
    if (property.highlighted) out.push({ label: 'Destaque', tone: 'gold' });
    if (property.sale && propertyValueNumber >= 5_000_000) {
      out.push({ label: 'Luxo', tone: 'gold' });
    }
    return out;
  }, [property, propertyValueNumber]);

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (brokerProperties.isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center text-[#0F0820]/60">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Carregando imóvel…
      </div>
    );
  }

  if (brokerProperties.error) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center text-[#0F0820]/60 text-center px-4">
        <div>
          <p className="font-display text-2xl text-[#0F0820] mb-2">
            Não foi possível carregar o imóvel
          </p>
          <p className="text-sm">Tente novamente em instantes.</p>
        </div>
      </div>
    );
  }

  if (!property || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center text-[#0F0820]/60 text-center px-4">
        <div>
          <p className="font-display text-2xl text-[#0F0820] mb-2">
            Imóvel não encontrado
          </p>
          <p className="text-sm">
            O imóvel pode ter sido removido ou o link está incorreto.
          </p>
        </div>
      </div>
    );
  }

  const homeHref = `/${brokerSlug}`;
  const listingHref = `/${brokerSlug}/imoveis`;

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

      <main className="pt-24 md:pt-28 pb-32 md:pb-20">
        <div className="container mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[#0F0820]/50 mb-5 flex-wrap"
          >
            <Link
              href={homeHref}
              className="inline-flex items-center gap-1 hover:text-[#0F0820] transition-colors"
            >
              <Home className="w-3 h-3" />
              Início
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href={listingHref}
              className="hover:text-[#0F0820] transition-colors"
            >
              Imóveis
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#0F0820]/80 truncate max-w-[60vw]">
              {property.title}
            </span>
          </nav>

          {/* Hero gallery */}
          <DetailHeroGallery
            images={property.attachments}
            title={property.title}
            badges={badges}
          />

          {/* Two-column layout */}
          <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 md:gap-12 items-start">
            {/* Main column */}
            <div className="space-y-10 md:space-y-14 min-w-0">
              <DetailSummary
                title={property.title}
                street={property.street}
                neighborhood={property.neighborhood}
                city={property.city}
                state={property.state}
                code={property.code}
                type={propertyType}
                createdAt={property.created_at}
              />

              <DetailQuickActions
                propertyId={property.slug}
                title={property.title}
                whatsappNumber={meta.whatsappNumber}
                onScheduleVisit={scrollToForm}
              />

              <DetailHighlights
                bedrooms={property.bedrooms}
                suites={property.suites}
                bathrooms={property.bathrooms}
                garages={property.garages}
                size={property.size}
              />

              <DetailDescription text={property.description} />

              <DetailFeatures characteristics={property.characteristics} />

              {/* Inline form (visível em mobile, esconde no desktop pra evitar duplicação com sidebar) */}
              <section
                ref={formRef}
                className="lg:hidden bg-white rounded-3xl border border-black/[0.05] p-6"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#9747FF] mb-2">
                  Solicitar atendimento
                </p>
                <h2 className="font-display text-2xl text-[#0F0820] tracking-tight mb-5">
                  Fale com um consultor
                </h2>
                <DetailContactForm
                  propertyTitle={property.title}
                  propertySlug={property.slug}
                  whatsappNumber={meta.whatsappNumber}
                  variant="block"
                />
              </section>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block sticky top-24">
              <DetailSidebar
                propertyTitle={property.title}
                propertySlug={property.slug}
                type={propertyType}
                value={property.value}
                condominiumValue={property.condominium_value}
                iptuValue={property.iptu_value}
                brokerName={user.name}
                whatsappNumber={meta.whatsappNumber}
                creci={user.site?.footer?.creci ?? null}
                brokerPhoto={meta.brandLogo}
              />
            </aside>
          </div>

          {/* Similar */}
          <div className="mt-16 md:mt-24">
            <DetailSimilar
              currentSlug={property.slug}
              currentNeighborhood={property.neighborhood}
              currentType={propertyType}
              allProperties={allProperties}
              whatsappNumber={meta.whatsappNumber}
              brokerSlug={brokerSlug}
            />
          </div>

          {/* Final CTA */}
          <div className="mt-16 md:mt-20">
            <DetailFinalCta
              propertyTitle={property.title}
              whatsappNumber={meta.whatsappNumber}
              onOpenForm={scrollToForm}
            />
          </div>
        </div>
      </main>

      <PremiumFooter data={meta.footer} />
      <FloatingWhatsapp />
      <DetailMobileCta
        propertyTitle={property.title}
        value={property.value}
        type={propertyType}
        whatsappNumber={meta.whatsappNumber}
      />
    </div>
    </WhatsappProvider>
  );
}
