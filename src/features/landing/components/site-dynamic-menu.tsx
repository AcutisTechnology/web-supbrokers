"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SitePage } from "@/features/dashboard/site/services/site-pages-service";
import { cn } from "@/lib/utils";

interface SiteDynamicMenuProps {
  brokerSlug: string;
  pages: SitePage[];
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
}

function buildHref(brokerSlug: string, pageSlug: string): string {
  if (pageSlug === "/" || pageSlug === "") return `/${brokerSlug}`;
  const normalized = pageSlug.replace(/^\/+/, "");
  return `/${brokerSlug}/p/${normalized}`;
}

export function SiteDynamicMenu({
  brokerSlug,
  pages,
  className,
  itemClassName,
  activeClassName,
}: SiteDynamicMenuProps) {
  const pathname = usePathname();

  if (!pages || pages.length === 0) return null;

  return (
    <nav className={cn("flex flex-wrap items-center gap-3", className)}>
      {pages.map((page) => {
        const href = buildHref(brokerSlug, page.slug);
        const isActive = pathname === href;
        return (
          <Link
            key={page.id}
            href={href}
            className={cn(
              "text-sm font-medium text-white/90 hover:text-white transition-colors",
              itemClassName,
              isActive && (activeClassName ?? "underline underline-offset-4")
            )}
          >
            {page.title}
          </Link>
        );
      })}
    </nav>
  );
}
