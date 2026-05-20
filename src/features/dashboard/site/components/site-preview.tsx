"use client";

import { Search, Facebook, Instagram, Linkedin, Youtube, MessageCircle, Globe } from "lucide-react";
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

export function SitePreview({ settings, footer, socialLinks = [] }: SitePreviewProps) {
  const primaryColor = settings?.primary_color || "#9747FF";
  const title = settings?.site_title || "Encontre o imóvel perfeito para você";
  const subtitle = settings?.site_subtitle || "Confira os melhores imóveis disponíveis";
  const brandImage = settings?.brand_image || "/logo-extendida-roxo.svg";

  const showSocial = footer?.show_social_links !== false;
  const activeSocial = socialLinks.filter((s) => s.is_active);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm scale-[0.9] origin-top-left">
      <div className="p-4 rounded-t-lg" style={{ backgroundColor: primaryColor }}>
        <div className="flex justify-between items-center mb-4">
          <div className="bg-white p-1 rounded-md w-24 h-10 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brandImage} alt="Logo" className="max-h-8 max-w-full object-contain" />
          </div>

          <div className="flex gap-2">
            <button className="bg-white text-xs text-black rounded-full px-2 py-1">Área do Corretor</button>
            <button className="bg-white text-xs text-black rounded-full px-2 py-1">Falar com o Corretor</button>
          </div>
        </div>

        <div className="text-white mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-xs">{subtitle}</p>
        </div>

        <div className="bg-white p-2 rounded-full flex items-center gap-2">
          <div className="flex gap-2 bg-gray-100 rounded-full p-1">
            <button className="bg-white text-xs rounded-full px-2 py-1 shadow-sm">Comprar</button>
            <button className="text-xs rounded-full px-2 py-1">Alugar</button>
          </div>
          <div className="flex-grow flex gap-2">
            <input
              type="text"
              placeholder="Bairro"
              className="text-xs bg-gray-100 rounded-full px-2 py-1 w-full"
            />
            <button className="text-white rounded-full p-1" style={{ backgroundColor: primaryColor }}>
              <Search className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white">
        <h4 className="text-sm font-medium">Imóveis à venda</h4>
        <p className="text-xs text-gray-500 mb-3">Confira os imóveis disponíveis para compra</p>

        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-200 h-16 w-full" />
              <div className="p-2">
                <p className="text-xs font-medium truncate">Apartamento Manaíra</p>
                <p className="text-[10px] text-gray-500">Manaíra, João Pessoa</p>
                <p className="text-xs font-bold mt-1">R$ 450.000</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="px-4 py-3 bg-gray-900 text-white text-[11px] space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            {footer?.company_name && <p className="font-semibold">{footer.company_name}</p>}
            {footer?.creci && <p className="opacity-80">{footer.creci}</p>}
            {(footer?.address || footer?.city) && (
              <p className="opacity-80 truncate">
                {[footer?.address, footer?.address_number].filter(Boolean).join(", ")}
                {footer?.district ? ` - ${footer.district}` : ""}
                {footer?.city ? `, ${footer.city}` : ""}
                {footer?.state ? `/${footer.state}` : ""}
              </p>
            )}
            <div className="flex flex-wrap gap-x-3 gap-y-1 opacity-80">
              {footer?.email && <span>{footer.email}</span>}
              {footer?.phone && <span>{footer.phone}</span>}
              {footer?.whatsapp && <span>WhatsApp: {footer.whatsapp}</span>}
            </div>
          </div>

          {showSocial && activeSocial.length > 0 && (
            <div className="flex gap-2 shrink-0">
              {activeSocial.slice(0, 6).map((link) => {
                const Icon = PLATFORM_ICON[link.platform] ?? Globe;
                return (
                  <span
                    key={link.id}
                    className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                    title={link.platform}
                  >
                    <Icon className="w-3 h-3" />
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {footer?.footer_text && (
          <p className="opacity-70 leading-snug border-t border-white/10 pt-2">{footer.footer_text}</p>
        )}
      </footer>
    </div>
  );
}
