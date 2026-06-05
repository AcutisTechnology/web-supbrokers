"use client";

import type { SiteFooter, SiteSetting, SiteSocialLink } from "../services/site-service";
import type { SitePage } from "../services/site-pages-service";
import type { SitePageFormValues } from "./site-pages-form";
import { SitePreview } from "./site-preview";

interface SitePagePreviewProps {
  settings: Partial<SiteSetting> | undefined;
  footer?: Partial<SiteFooter> | undefined;
  socialLinks?: SiteSocialLink[];
  menuPages: SitePage[];
  page?: SitePage | null;
  draft?: SitePageFormValues | null;
}

/**
 * Preview combinando: identidade visual da FASE 1 + página atual da FASE 2.
 * Reutiliza o SitePreview para a parte superior e renderiza um bloco extra
 * com hero/conteúdo da página selecionada.
 */
export function SitePagePreview({
  settings,
  footer,
  socialLinks,
  menuPages,
  page,
  draft,
}: SitePagePreviewProps) {
  const merged = draft
    ? {
        title: draft.title || page?.title || "",
        hero_title: draft.hero_title ?? page?.hero_title ?? "",
        hero_subtitle: draft.hero_subtitle ?? page?.hero_subtitle ?? "",
        content: draft.content ?? page?.content ?? "",
        featured_image: draft.featured_image ?? page?.featured_image ?? "",
      }
    : page
      ? {
          title: page.title,
          hero_title: page.hero_title ?? "",
          hero_subtitle: page.hero_subtitle ?? "",
          content: page.content ?? "",
          featured_image: page.featured_image ?? "",
        }
      : null;

  const primaryColor = "#9747FF";

  return (
    <div className="space-y-4">
      <SitePreview settings={settings} footer={footer} socialLinks={socialLinks} />

      <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div
          className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white"
          style={{ backgroundColor: primaryColor }}
        >
          Menu dinâmico
        </div>
        <div className="bg-white px-3 py-2 flex flex-wrap gap-2 text-xs">
          {menuPages.length === 0 ? (
            <span className="text-[#777777]">Nenhuma página marcada para o menu.</span>
          ) : (
            menuPages.map((p) => (
              <span
                key={p.id}
                className="px-2 py-1 rounded-full bg-gray-100 text-[#141414]"
              >
                {p.title}
              </span>
            ))
          )}
        </div>
      </div>

      {merged && (
        <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div
            className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: primaryColor }}
          >
            Preview da página: {merged.title || "Sem título"}
          </div>

          <div className="bg-white">
            {(merged.featured_image || merged.hero_title || merged.hero_subtitle) && (
              <div className="relative">
                {merged.featured_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={merged.featured_image}
                    alt={merged.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div
                  className="px-4 py-3 text-white"
                  style={{
                    backgroundColor: merged.featured_image
                      ? "rgba(0,0,0,0.4)"
                      : primaryColor,
                    ...(merged.featured_image
                      ? { position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center" }
                      : {}),
                  }}
                >
                  {merged.hero_title && <p className="text-base font-semibold">{merged.hero_title}</p>}
                  {merged.hero_subtitle && <p className="text-xs opacity-90 mt-1">{merged.hero_subtitle}</p>}
                </div>
              </div>
            )}

            <div className="p-3 prose prose-sm max-w-none">
              {merged.content ? (
                <div
                  className="text-xs leading-relaxed text-[#141414]"
                  dangerouslySetInnerHTML={{ __html: merged.content }}
                />
              ) : (
                <p className="text-xs text-[#777777]">Sem conteúdo.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
