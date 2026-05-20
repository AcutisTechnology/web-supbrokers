"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  fetchPublicSiteMenu,
  fetchPublicSitePage,
} from "@/features/dashboard/site/services/site-pages-service";
import { useBrokerProperties } from "@/features/landing/services/broker-service";
import { BrokerFooter } from "@/features/landing/components/broker-footer";
import { SitePageHero } from "@/features/landing/components/site-page-hero";
import { SitePageContent } from "@/features/landing/components/site-page-content";
import { SiteDynamicMenu } from "@/features/landing/components/site-dynamic-menu";

interface DynamicPageParams {
  corretor: string;
  slug: string[];
}

export default function DynamicSitePage({
  params,
}: {
  params: Promise<DynamicPageParams>;
}) {
  const router = useRouter();
  const { corretor, slug } = use(params);
  const pageSlug = (slug ?? []).join("/");

  const { data: broker } = useBrokerProperties(corretor);
  const site = broker?.data.user.site;

  const { data: page, isLoading: isLoadingPage, error: pageError } = useQuery({
    queryKey: ["public-site-page", corretor, pageSlug],
    queryFn: () => fetchPublicSitePage(corretor, pageSlug),
    enabled: !!corretor && !!pageSlug,
  });

  const { data: menu = [] } = useQuery({
    queryKey: ["public-site-menu", corretor],
    queryFn: () => fetchPublicSiteMenu(corretor),
    enabled: !!corretor,
  });

  const primary = site?.primary_color || "#9747FF";

  if (isLoadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  if (pageError || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-xl">Página não encontrada.</p>
        <Link href={`/${corretor}`} className="text-[#9747FF] underline">
          Voltar para a home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header
        className="rounded-xl m-4 md:m-8 p-4 md:px-10 md:py-6"
        style={{ backgroundColor: primary }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link href={`/${corretor}`} className="inline-flex items-center">
            <Image
              src={site?.brand_image || "/logo-extendida-roxo.svg"}
              width={142}
              alt="logo do corretor"
              height={42}
            />
          </Link>

          <SiteDynamicMenu brokerSlug={corretor} pages={menu} />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="rounded-full border border-white px-4 py-2 text-white text-sm hover:bg-white hover:text-black"
            >
              Área do Corretor
            </button>
          </div>
        </div>
      </header>

      <SitePageHero page={page} primaryColor={primary} />

      <SitePageContent page={page} />

      <BrokerFooter site={site} />
    </div>
  );
}
