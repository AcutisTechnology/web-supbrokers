'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchPublicSitePage } from '@/features/dashboard/site/services/site-pages-service';
import { useBrokerHomeData } from '@/features/landing/broker-home/hooks/use-broker-home-data';
import { PremiumHeader } from '@/features/landing/broker-home/components/premium-header';
import { PremiumFooter } from '@/features/landing/broker-home/components/premium-footer';
import { FloatingWhatsapp } from '@/features/landing/broker-home/components/floating-whatsapp';
import { WhatsappProvider } from '@/features/landing/broker-home/hooks/whatsapp-context';
import { SitePageHero } from '@/features/landing/components/site-page-hero';
import { SitePageContent } from '@/features/landing/components/site-page-content';
import { Loader2 } from 'lucide-react';

interface DynamicPageParams {
  corretor: string;
  slug: string[];
}

export default function DynamicSitePage({
  params,
}: {
  params: Promise<DynamicPageParams>;
}) {
  const { corretor, slug } = use(params);
  const pageSlug = (slug ?? []).join('/');

  const meta = useBrokerHomeData(corretor);

  const {
    data: page,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['public-site-page', corretor, pageSlug],
    queryFn: () => fetchPublicSitePage(corretor, pageSlug),
    enabled: !!corretor && !!pageSlug,
  });

  const primary = meta.primaryColor;

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

        <main className="pt-24 md:pt-28 pb-20">
          {isLoading ? (
            <div className="min-h-[40vh] flex items-center justify-center text-[#0F0820]/60">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Carregando…
            </div>
          ) : error || !page ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-center px-4">
              <p className="font-display text-2xl text-[#0F0820]">
                Página não encontrada.
              </p>
              <Link href={`/${corretor}`} className="text-[#9747FF] underline">
                Voltar para a home
              </Link>
            </div>
          ) : (
            <>
              <SitePageHero page={page} primaryColor={primary} />
              <SitePageContent page={page} />
            </>
          )}
        </main>

        <PremiumFooter data={meta.footer} />
        <FloatingWhatsapp />
      </div>
    </WhatsappProvider>
  );
}
