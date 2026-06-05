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
  BarChart2,
  Quote,
  Users,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import type { SiteFooter, SiteSetting, SiteSocialLink, SocialPlatform } from "../services/site-service";
import type { HomeSection } from "../services/home-layout-service";

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

const DEFAULT_LAYOUT: HomeSection[] = [
  { key: "destaques", enabled: true },
  { key: "venda", enabled: true },
  { key: "aluguel", enabled: true },
  { key: "stats", enabled: true },
  { key: "regioes", enabled: true },
  { key: "institucional", enabled: true },
  { key: "equipe", enabled: true },
  { key: "depoimentos", enabled: true },
  { key: "blog", enabled: true },
];

interface SitePreviewProps {
  settings: Partial<SiteSetting> | undefined;
  footer?: Partial<SiteFooter> | undefined;
  socialLinks?: SiteSocialLink[];
  homeLayout?: HomeSection[];
}

const NAVY = "#0F0820";

const MOCK_STATS = [
  { label: "Anos de mercado", value: "15+" },
  { label: "Imóveis vendidos", value: "800+" },
  { label: "Clientes satisfeitos", value: "1.2k" },
  { label: "Cidades atendidas", value: "12" },
];

const MOCK_NEIGHBORHOODS = ["Jardins", "Moema", "Vila Nova", "Itaim"];

const MOCK_TESTIMONIAL = {
  name: "Maria S.",
  text: "Excelente atendimento! Encontrei o apartamento dos meus sonhos.",
};

const MOCK_AGENTS = ["Ana Lima", "Carlos M.", "Beatriz F."];

const MOCK_POSTS = [
  "Como escolher o bairro ideal",
  "Dicas para financiamento",
];

export function SitePreview({ settings, footer, socialLinks = [], homeLayout }: SitePreviewProps) {
  const layout = homeLayout && homeLayout.length > 0 ? homeLayout : DEFAULT_LAYOUT;
  const brandImage = settings?.brand_image || null;
  const companyName = footer?.company_name || "LuxuryEstate";

  const eyebrow = settings?.hero_eyebrow || null;
  const titleLine1 = settings?.hero_title_line_1 || null;
  const titleLine2 = settings?.hero_title_line_2 || null;
  const subtitle = settings?.site_subtitle || null;
  const heroBg = settings?.hero_background_url || null;
  const overlayColor = settings?.hero_overlay_color || NAVY;
  const overlayOpacity = settings?.hero_overlay_opacity ?? 75;
  const toHex = (pct: number) =>
    Math.round(Math.min(100, Math.max(0, pct)) * 2.55)
      .toString(16)
      .padStart(2, "0");
  const overlayGradient = `linear-gradient(to bottom, ${overlayColor}${toHex(overlayOpacity * 0.85)}, ${overlayColor}${toHex(overlayOpacity * 0.55)}, ${overlayColor}${toHex(overlayOpacity)})`;

  const listingPageSize = settings?.listing_page_size ?? 12;
  const listingSort = settings?.listing_default_sort ?? "newest";
  const SORT_LABELS: Record<string, string> = {
    newest: "Mais recentes",
    oldest: "Mais antigos",
    price_asc: "Menor preço",
    price_desc: "Maior preço",
    size_desc: "Maior área",
  };

  const showSocial = footer?.show_social_links !== false;
  const activeSocial = socialLinks.filter((s) => s.is_active);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white text-[#0F0820]">

      {/* ── HERO ── */}
      <div className="relative" style={{ backgroundColor: NAVY }}>
        {heroBg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0" style={{ background: overlayGradient }} />
        <div className="relative p-4">
          <div className="flex justify-between items-center mb-4">
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
              <span className="text-[9px] text-white/80 px-2 py-1">WhatsApp</span>
              <span className="text-[9px] text-[#0F0820] bg-white rounded-full px-2.5 py-1 font-medium">
                Anunciar
              </span>
            </div>
          </div>

          {eyebrow && (
            <p className="text-[8px] tracking-[0.25em] uppercase text-amber-200/90 mb-1.5">{eyebrow}</p>
          )}
          {(titleLine1 || titleLine2) && (
            <h3 className="text-white text-base font-semibold leading-tight font-display">
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
            <p className="text-white/70 text-[10px] mt-1.5 line-clamp-2 max-w-[90%]">{subtitle}</p>
          )}

          <div className="mt-3">
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

      {/* ── SEÇÕES DINÂMICAS ── */}
      {layout.map((section, idx) => {
        if (!section.enabled) return null;
        const bg = idx % 2 === 0 ? "bg-[#FAFAF7]" : "bg-white";

        if (section.key === "destaques") return (
          <div key="destaques" className={`p-4 ${bg} border-t border-gray-100`}>
            <div className="flex items-end justify-between mb-2">
              <div>
                <p className="text-[8px] tracking-[0.2em] uppercase text-[#9747FF] mb-0.5">Portfólio</p>
                <h4 className="text-xs font-semibold font-display">Imóveis em destaque</h4>
              </div>
              <span className="text-[8px] text-[#9747FF] flex items-center gap-0.5">Ver todos <ChevronRight className="w-2.5 h-2.5" /></span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[0, 1].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-black/5 shadow-sm">
                  <div className="relative h-12 bg-gradient-to-br from-gray-200 to-gray-300">
                    <span className="absolute top-1.5 left-1.5 text-[7px] font-semibold uppercase tracking-wider bg-[#0F0820] text-white px-1.5 py-0.5 rounded">Venda</span>
                  </div>
                  <div className="p-2">
                    <p className="text-[8px] uppercase tracking-wider text-[#0F0820]/45">Jardins, SP</p>
                    <p className="text-[10px] font-semibold truncate font-display">Ap. Moderno</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[7px] text-[#0F0820]/55">
                      <span className="inline-flex items-center gap-0.5"><BedDouble className="w-2 h-2" />3</span>
                      <span className="inline-flex items-center gap-0.5"><Bath className="w-2 h-2" />2</span>
                      <span className="inline-flex items-center gap-0.5"><Car className="w-2 h-2" />1</span>
                    </div>
                    <p className="text-[11px] font-bold mt-1 font-display">R$ 850k</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[8px] text-[#0F0820]/40 mt-2 text-right">
              {listingPageSize} imóveis/pág · {SORT_LABELS[listingSort] ?? listingSort}
            </p>
          </div>
        );

        if (section.key === "venda") return (
          <div key="venda" className={`px-4 py-3 ${bg} border-t border-gray-100`}>
            <div className="flex items-end justify-between mb-2">
              <h4 className="text-xs font-semibold font-display">À venda</h4>
              <span className="text-[8px] text-[#9747FF] flex items-center gap-0.5">Ver todos <ChevronRight className="w-2.5 h-2.5" /></span>
            </div>
            <div className="flex gap-2 overflow-hidden">
              {[0, 1, 2].map((i) => (
                <div key={i} className="min-w-[80px] bg-white rounded-lg overflow-hidden border border-black/5 shadow-sm shrink-0">
                  <div className="h-10 bg-gradient-to-br from-gray-200 to-gray-300" />
                  <div className="p-1.5">
                    <p className="text-[9px] font-semibold truncate font-display">Casa {i + 1}</p>
                    <p className="text-[9px] font-bold">R$ {(1.2 + i * 0.3).toFixed(1)}M</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

        if (section.key === "aluguel") return (
          <div key="aluguel" className={`px-4 py-3 ${bg} border-t border-gray-100`}>
            <div className="flex items-end justify-between mb-2">
              <h4 className="text-xs font-semibold font-display">Para alugar</h4>
              <span className="text-[8px] text-[#9747FF] flex items-center gap-0.5">Ver todos <ChevronRight className="w-2.5 h-2.5" /></span>
            </div>
            <div className="flex gap-2 overflow-hidden">
              {[0, 1, 2].map((i) => (
                <div key={i} className="min-w-[80px] bg-[#FAFAF7] rounded-lg overflow-hidden border border-black/5 shadow-sm shrink-0">
                  <div className="h-10 bg-gradient-to-br from-gray-200 to-gray-300" />
                  <div className="p-1.5">
                    <p className="text-[9px] font-semibold truncate font-display">Apto {i + 1}</p>
                    <p className="text-[9px] font-bold">R$ {(2.5 + i * 0.4).toFixed(1)}k/mês</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

        if (section.key === "stats") return (
          <div key="stats" className={`px-4 py-3 ${bg} border-t border-gray-100`}>
            <div className="flex items-center gap-1 mb-2">
              <BarChart2 className="w-3 h-3 text-[#9747FF]" />
              <p className="text-[9px] font-semibold uppercase tracking-wide text-[#0F0820]/60">Números</p>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {MOCK_STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-sm font-bold font-display">{s.value}</p>
                  <p className="text-[7px] text-[#0F0820]/50 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        );

        if (section.key === "regioes") return (
          <div key="regioes" className={`px-4 py-3 ${bg} border-t border-gray-100`}>
            <h4 className="text-xs font-semibold font-display mb-2">Regiões / Bairros</h4>
            <div className="grid grid-cols-4 gap-1.5">
              {MOCK_NEIGHBORHOODS.map((n) => (
                <div key={n} className="bg-white rounded-lg border border-black/5 shadow-sm overflow-hidden">
                  <div className="h-8 bg-gradient-to-br from-gray-200 to-gray-300" />
                  <p className="text-[8px] font-semibold text-center py-1 truncate px-1">{n}</p>
                </div>
              ))}
            </div>
          </div>
        );

        if (section.key === "institucional") return (
          <div key="institucional" className={`px-4 py-3 ${bg} border-t border-gray-100`}>
            <p className="text-[8px] tracking-[0.2em] uppercase text-[#9747FF] mb-0.5">Nossa história</p>
            <h4 className="text-xs font-semibold font-display mb-1.5">Sobre nós</h4>
            <div className="space-y-1">
              <div className="h-1.5 bg-gray-200 rounded-full w-full" />
              <div className="h-1.5 bg-gray-200 rounded-full w-4/5" />
              <div className="h-1.5 bg-gray-200 rounded-full w-3/5" />
            </div>
            <div className="grid grid-cols-3 gap-1.5 mt-3">
              {["Transparência", "Qualidade", "Agilidade"].map((v) => (
                <div key={v} className="bg-white rounded-lg p-1.5 text-center border border-black/5">
                  <p className="text-[8px] font-semibold">{v}</p>
                </div>
              ))}
            </div>
          </div>
        );

        if (section.key === "equipe") return (
          <div key="equipe" className={`px-4 py-3 ${bg} border-t border-gray-100`}>
            <div className="flex items-center gap-1 mb-2">
              <Users className="w-3 h-3 text-[#9747FF]" />
              <h4 className="text-xs font-semibold font-display">Equipe</h4>
            </div>
            <div className="flex gap-2">
              {MOCK_AGENTS.map((a) => (
                <div key={a} className="flex flex-col items-center gap-1">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  <p className="text-[8px] font-medium text-center w-10 truncate">{a}</p>
                </div>
              ))}
            </div>
          </div>
        );

        if (section.key === "depoimentos") return (
          <div key="depoimentos" className={`px-4 py-3 ${bg} border-t border-gray-100`}>
            <div className="flex items-center gap-1 mb-2">
              <Quote className="w-3 h-3 text-[#9747FF]" />
              <h4 className="text-xs font-semibold font-display">Depoimentos</h4>
            </div>
            <div className="bg-white rounded-xl p-3 border border-black/5">
              <p className="text-[9px] text-[#0F0820]/70 italic line-clamp-2">&ldquo;{MOCK_TESTIMONIAL.text}&rdquo;</p>
              <p className="text-[8px] font-semibold mt-1.5">{MOCK_TESTIMONIAL.name}</p>
            </div>
          </div>
        );

        if (section.key === "blog") return (
          <div key="blog" className={`px-4 py-3 ${bg} border-t border-gray-100`}>
            <div className="flex items-center gap-1 mb-2">
              <Newspaper className="w-3 h-3 text-[#9747FF]" />
              <h4 className="text-xs font-semibold font-display">Blog</h4>
            </div>
            <div className="space-y-1.5">
              {MOCK_POSTS.map((p) => (
                <div key={p} className="flex items-center gap-2 bg-white rounded-lg p-2 border border-black/5">
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gray-200 to-gray-300 shrink-0" />
                  <p className="text-[9px] font-medium line-clamp-2 leading-snug">{p}</p>
                </div>
              ))}
            </div>
          </div>
        );

        return null;
      })}

      {/* ── FOOTER ── */}
      <footer className="px-4 py-3 text-white text-[9px] space-y-2" style={{ backgroundColor: "#08040F" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            {brandImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brandImage} alt="Logo" className="max-h-3 max-w-[50px] object-contain mb-1" />
            ) : (
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span className="font-semibold">{companyName}</span>
              </div>
            )}
            {footer?.creci && <p className="opacity-60">{footer.creci}</p>}
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 opacity-60">
              {footer?.email && <span>{footer.email}</span>}
              {footer?.phone && <span>{footer.phone}</span>}
            </div>
          </div>

          {showSocial && activeSocial.length > 0 && (
            <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
              {activeSocial.slice(0, 4).map((link) => {
                const Icon = PLATFORM_ICON[link.platform] ?? Globe;
                return (
                  <span
                    key={link.id}
                    className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center"
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
