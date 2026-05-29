'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Heart, HeartOff } from 'lucide-react';
import { useBrokerProperties } from '@/features/landing/services/broker-service';
import { Reveal, Stagger, StaggerItem } from '../components/primitives/reveal';
import { useBrokerHomeData } from '../hooks/use-broker-home-data';
import { useFavorites } from '../hooks/use-favorites';
import { WhatsappProvider } from '../hooks/whatsapp-context';
import { apiToCardProperty } from '../lib/map-property';
import { brokerUrls } from '../lib/broker-urls';
import { DynamicSeo } from '../components/dynamic-seo';
import { FloatingWhatsapp } from '../components/floating-whatsapp';
import { ListingPropertyCard } from '../components/listing-property-card';
import { PremiumFooter } from '../components/premium-footer';
import { PremiumHeader } from '../components/premium-header';

export function FavoritesPage({ brokerSlug }: { brokerSlug: string }) {
  const meta = useBrokerHomeData(brokerSlug);
  const { favorites, count } = useFavorites();
  const propertiesQuery = useBrokerProperties(brokerSlug);

  const items = useMemo(() => {
    const all = (propertiesQuery.data?.data.all ?? []).map(apiToCardProperty);
    return all.filter(p => favorites.has(p.id));
  }, [propertiesQuery.data, favorites]);

  return (
    <WhatsappProvider number={meta.whatsappNumber} templates={meta.whatsappTemplates}>
      <DynamicSeo title={`Favoritos — ${meta.brandName}`} description="Seus imóveis favoritos." />
      <div className="min-h-screen bg-[#FAFAF7] text-[#0F0820]">
        <PremiumHeader
          brandName={meta.brandName}
          brandLogo={meta.brandLogo}
          brokerSlug={meta.brokerSlug}
          whatsappNumber={meta.whatsappNumber}
          menu={meta.menu}
          theme="light"
        />

        <main className="container mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-16">
          <Reveal>
            <nav className="flex items-center gap-2 text-xs text-[#999] mb-6">
              <Link href={brokerUrls(brokerSlug).home} className="hover:text-[#0F0820]">
                {meta.brandName}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#555]">Favoritos</span>
            </nav>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-11 h-11 rounded-2xl bg-[#9747FF]/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#9747FF] fill-[#9747FF]" />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl tracking-tight">
                  Meus favoritos
                </h1>
                <p className="text-sm text-[#777]">
                  {count === 0
                    ? 'Você ainda não salvou imóveis'
                    : `${items.length} imóvel(is) salvo(s)`}
                </p>
              </div>
            </div>
          </Reveal>

          {propertiesQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 rounded-3xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#0F0820]/10">
              <HeartOff className="w-12 h-12 text-[#9747FF]/40 mx-auto mb-4" />
              <p className="font-display text-xl text-[#0F0820]">
                Nenhum favorito ainda
              </p>
              <p className="mt-2 text-sm text-[#777]">
                Toque no coração dos imóveis para salvá-los aqui.
              </p>
              <Link
                href={brokerUrls(brokerSlug).listing}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F0820] text-white text-sm hover:bg-[#0F0820]/90 transition-colors"
              >
                Explorar imóveis
              </Link>
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map(p => (
                <StaggerItem key={p.id}>
                  <ListingPropertyCard
                    property={p}
                    whatsappNumber={meta.whatsappNumber}
                    brokerSlug={brokerSlug}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </main>

        <PremiumFooter data={meta.footer} />
        <FloatingWhatsapp />
      </div>
    </WhatsappProvider>
  );
}
