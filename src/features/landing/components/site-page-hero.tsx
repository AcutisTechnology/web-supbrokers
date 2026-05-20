"use client";

import Image from "next/image";
import type { SitePage } from "@/features/dashboard/site/services/site-pages-service";
import { cn } from "@/lib/utils";

interface SitePageHeroProps {
  page: SitePage;
  primaryColor?: string | null;
  className?: string;
}

export function SitePageHero({ page, primaryColor, className }: SitePageHeroProps) {
  const hasHero = page.hero_title || page.hero_subtitle || page.featured_image;
  if (!hasHero) return null;

  const bg = primaryColor || "#9747FF";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-xl mx-4 md:mx-8 mt-4 md:mt-8",
        className
      )}
      style={{ backgroundColor: bg }}
    >
      {page.featured_image && (
        <div className="absolute inset-0">
          <Image
            src={page.featured_image}
            alt={page.title}
            fill
            className="object-cover opacity-40"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      <div className="relative px-6 md:px-20 py-10 md:py-16 text-white">
        {page.hero_title && (
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">{page.hero_title}</h1>
        )}
        {page.hero_subtitle && (
          <p className="text-base md:text-xl mt-3 opacity-95 max-w-3xl">{page.hero_subtitle}</p>
        )}
      </div>
    </section>
  );
}
