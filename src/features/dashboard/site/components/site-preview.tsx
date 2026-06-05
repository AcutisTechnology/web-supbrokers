"use client";

import {
  Bath,
  BedDouble,
  Car,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Youtube,
} from "lucide-react";
import type { SiteFooter, SiteSetting, SiteSocialLink, SocialPlatform } from "../services/site-service";

const PLATFORM_ICON: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Globe,
  whatsapp: MessageCircle,
  twitter: Globe,
  custom: Globe,
};

interface SitePreviewProps {
  settings: Partial<SiteSetting> | undefined;
  footer?: Partial<SiteFooter> | undefined;
  socialLinks?: SiteSocialLink[];
}

const NAVY = "#0F0820";

export function SitePreview({ settings, footer, socialLinks = [] }: SitePreviewProps) {
  const brandImage = settings?.brand_image || null;
  const companyName = footer?.company_name || "LuxuryEstate";

  const eyebrow = settings?.hero_eyebrow || null;
  const titleLine1 = settings?.hero_title_line_1 || null;
  const titleLine2 = settings?.hero_title_line_2 || null;
  const subtitle = settings?.site_subtitle || null;
  const heroBg = settings?.hero_background_url || null;

  const showSocial = footer?.show_social_links !== false;
  const activeSocial = socialLinks.filter((s) => s.is_active);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
      {/* HERO premium */}
      <div className="relative" style={{ backgroundColor: NAVY }}>
        {heroBg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${NAVY}cc, ${NAVY}88, ${NAVY})`,
          }}
        />

        <div className="relative p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            {brandImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brandImage} alt="Logo" className="max-h-6 max-w-[90px] object-contain" />
            ) : (
              <div className="flex items-center gap-1 text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-sm font-semibold tracking-wide">{companyName}</span>
              </div>
            )}
            <div className="flex gap-1.5">
              <span className="text-[9px] text-white/80 px-2 py-1">Falar no WhatsApp</span>
              <span className="text-[9px] text-[#0F0820] bg-white rounded-full px-2.5 py-1 font-medium">
                Anunciar Imóvel
              </span>
            </div>
          </div>

          {/* Eyebrow + título */}
          {eyebrow && (
            <p className="text-[8px] tracking-[0.25em] uppercase text-amber-200/90 mb-1.5">
              {eyebrow}
            </p>
          )}
          {(titleLine1 || titleLine2) && (
            <h3 className="text-white text-lg font-semibold leading-tight font-display">
              {titleLine1}
              {titleLine2 && (
                <>
                  {titleLine1 && <br />}
                  <span className="bg-gradient-to-r from-amber-200 to-white bg-clip-text text-transparent italic">
                    {titleLine2}
                  </span>
                </>
              )}
            </h3>
          )}
          {subtitle && (
            <p className="text-white/70 text-[10px] mt-2 line-clamp-2 max-w-[90%]">{subtitle}</p>
          )}

          {/* Tabs + busca glass */}
          <div className="mt-4">
            <div className="inline-flex gap-1 p-0.5 rounded-full bg-white/10 border border-white/15 mb-2">
              <span className="text-[9px] bg-white text-[#0F0820] rounded-full px-2.5 py-0.5">Comprar</span>
              <span className="text-[9px] text-white/80 rounded-full px-2.5 py-0.5">Alugar</span>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-full p-1 flex items-center gap-2 backdrop-blur">
              <div className="flex items-center gap-1 flex-grow px-2">
                <MapPin className="w-3 h-3 text-amber-300" />
                <span className="text-[9px] text-white/60">Cidade ou bairro</span>
              </div>
              <span className="bg-gradient-to-r from-amber-300 to-amber-400 text-[#0F0820] rounded-full px-3 py-1 text-[9px] font-medium flex items-center gap-1">
                <Search className="w-2.5 h-2.5" />
                Buscar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards (cream) */}
      <div className="p-4 bg-[#FAFAF7]">
        <p className="text-[8px] tracking-[0.2em] uppercase text-[#9747FF] mb-0.5">
          Portfólio exclusivo
        </p>
        <h4 className="text-sm font-semibold text-[#0F0820] font-display mb-3">Imóveis em destaque</h4>

        <div className="grid grid-cols-2 gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-black/5 shadow-sm">
              <div className="relative h-14 bg-gradient-to-br from-gray-200 to-gray-300">
                <span className="absolute top-1.5 left-1.5 text-[7px] font-semibold uppercase tracking-wider bg-[#0F0820] text-white px-1.5 py-0.5 rounded">
                  Venda
                </span>
              </div>
              <div className="p-2">
                <p className="text-[8px] uppercase tracking-wider text-[#0F0820]/45">Jardins, SP</p>
                <p className="text-[10px] font-semibold text-[#0F0820] truncate font-display">
                  Mansão Contemporânea
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[7px] text-[#0F0820]/55">
                  <span className="inline-flex items-center gap-0.5"><BedDouble className="w-2 h-2" />4</span>
                  <span className="inline-flex items-center gap-0.5"><Bath className="w-2 h-2" />3</span>
                  <span className="inline-flex items-center gap-0.5"><Car className="w-2 h-2" />2</span>
                </div>
                <p className="text-[11px] font-bold text-[#0F0820] mt-1 font-display">R$ 2.5M</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer premium */}
      <footer className="px-4 py-3 text-white text-[9px] space-y-2" style={{ backgroundColor: "#08040F" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span className="font-semibold">{companyName}</span>
            </div>
            {footer?.creci && <p className="opacity-60">{footer.creci}</p>}
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 opacity-60">
              {footer?.email && <span>{footer.email}</span>}
              {footer?.phone && <span>{footer.phone}</span>}
            </div>
          </div>

          {showSocial && activeSocial.length > 0 && (
            <div className="flex gap-1.5 shrink-0">
              {activeSocial.slice(0, 4).map((link) => {
                const Icon = PLATFORM_ICON[link.platform] ?? Globe;
                return (
                  <span
                    key={link.id}
                    className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center"
                    title={link.platform}
                  >
                    <Icon className="w-2.5 h-2.5" />
                  </span>
                );
              })}
            </div>
          )}
        </div>
        {footer?.footer_text && (
          <p className="opacity-50 leading-snug border-t border-white/10 pt-1.5 line-clamp-2">
            {footer.footer_text}
          </p>
        )}
      </footer>
    </div>
  );
}
