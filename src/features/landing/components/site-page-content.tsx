"use client";

import type { SitePage } from "@/features/dashboard/site/services/site-pages-service";
import { cn } from "@/lib/utils";

interface SitePageContentProps {
  page: SitePage;
  className?: string;
}

export function SitePageContent({ page, className }: SitePageContentProps) {
  if (!page.content) {
    return (
      <section className={cn("container mx-auto px-4 py-12", className)}>
        <p className="text-[#777777]">Sem conteúdo cadastrado para esta página.</p>
      </section>
    );
  }

  return (
    <section className={cn("container mx-auto px-4 py-12", className)}>
      <article
        className="prose prose-neutral max-w-3xl mx-auto"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </section>
  );
}
