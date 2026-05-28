'use client';

import { useQuery } from '@tanstack/react-query';
import {
  useBrokerProperties,
  type BrokerPropertiesResponse,
} from '@/features/landing/services/broker-service';
import {
  fetchPublicSiteMenu,
  type SitePage,
} from '@/features/dashboard/site/services/site-pages-service';
import { mockBrand } from '../data/mock';

export interface NeighborhoodSummary {
  name: string;
  city: string | null;
  count: number;
  averagePrice: number;
  image: string | null;
}

export interface HeroContent {
  eyebrow: string | null;
  titleLine1: string | null;
  titleLine2: string | null;
  subtitle: string | null;
  backgroundUrl: string | null;
}

export interface HomeStat {
  id: number;
  label: string;
  value: number;
  prefix: string | null;
  suffix: string | null;
  icon: string | null;
}

export interface BrokerHomeData {
  brokerSlug: string | null;
  loading: boolean;
  error: boolean;
  brandName: string;
  brandLogo: string | null;
  primaryColor: string;
  whatsappNumber: string;
  menu: { id: string; label: string; href: string }[];
  properties: BrokerPropertiesResponse['data'] | null;
  neighborhoodSuggestions: string[];
  citySuggestions: string[];
  topNeighborhoods: NeighborhoodSummary[];
  hero: HeroContent;
  stats: HomeStat[];
  whatsappTemplates: { key: string; message: string }[];
  institutional: BrokerPropertiesResponse['data']['institutional'] | null;
  testimonials: BrokerPropertiesResponse['data']['testimonials'];
  homeLayout: { key: string; enabled: boolean }[] | null;
}

function defaultMenuItems(brokerSlug: string | null) {
  // Preview enquanto a rota /[corretor]/equipe não existe em produção.
  const teamHref = brokerSlug
    ? `/preview-home/equipe?broker=${brokerSlug}`
    : '/preview-home/equipe';
  return [
    { id: 'comprar', label: 'Comprar', href: '#imoveis-venda' },
    { id: 'alugar', label: 'Alugar', href: '#imoveis-aluguel' },
    { id: 'regioes', label: 'Regiões', href: '#regioes' },
    { id: 'sobre', label: 'Sobre', href: '#institucional' },
    { id: 'equipe', label: 'Equipe', href: teamHref },
  ];
}

function buildMenuHref(brokerSlug: string, pageSlug: string): string {
  if (pageSlug === '/' || pageSlug === '') return `/${brokerSlug}`;
  const normalized = pageSlug.replace(/^\/+/, '');
  return `/${brokerSlug}/p/${normalized}`;
}

function digitsOnly(value: string | null | undefined): string {
  return (value ?? '').replace(/\D/g, '');
}

export function useBrokerHomeData(brokerSlug: string | null): BrokerHomeData {
  const propertiesQuery = useBrokerProperties(brokerSlug ?? '');

  const menuQuery = useQuery({
    queryKey: ['public-site-menu', brokerSlug],
    queryFn: () => fetchPublicSiteMenu(brokerSlug!),
    enabled: !!brokerSlug,
  });

  // Sem broker: retorna mocks
  if (!brokerSlug) {
    return {
      brokerSlug: null,
      loading: false,
      error: false,
      brandName: mockBrand.name,
      brandLogo: null,
      primaryColor: mockBrand.primaryColor,
      whatsappNumber: mockBrand.whatsapp,
      menu: defaultMenuItems(brokerSlug),
      properties: null,
      neighborhoodSuggestions: [],
      citySuggestions: [],
      topNeighborhoods: [],
      hero: {
        eyebrow: null,
        titleLine1: null,
        titleLine2: null,
        subtitle: null,
        backgroundUrl: null,
      },
      stats: [],
      whatsappTemplates: [],
      institutional: null,
      testimonials: [],
      homeLayout: null,
    };
  }

  const loading = propertiesQuery.isLoading || menuQuery.isLoading;
  const error = !!propertiesQuery.error;
  const data = propertiesQuery.data?.data ?? null;
  const site = data?.user.site ?? null;
  const footer = site?.footer ?? null;

  // WhatsApp: prioridade footer > user.phone
  const rawWhatsapp = footer?.whatsapp || data?.user.phone || '';
  const whatsDigits = digitsOnly(rawWhatsapp);
  const whatsappNumber = whatsDigits
    ? whatsDigits.length <= 11
      ? `55${whatsDigits}`
      : whatsDigits
    : mockBrand.whatsapp;

  const pages: SitePage[] = (menuQuery.data ?? []).filter(
    p => p.is_published && p.show_in_menu
  );

  const menu = pages.length
    ? pages
        .sort((a, b) => a.menu_order - b.menu_order)
        .map(p => ({
          id: String(p.id),
          label: p.title,
          href: buildMenuHref(brokerSlug, p.slug),
        }))
    : defaultMenuItems(brokerSlug);

  // Sugestões para o autocomplete derivadas do conjunto real de imóveis ativos
  const all = data?.all ?? [];
  const neighborhoodSuggestions = Array.from(
    new Set(all.map(p => p.neighborhood).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const citySuggestions = Array.from(
    new Set(all.map(p => p.city).filter((c): c is string => !!c))
  ).sort((a, b) => a.localeCompare(b));

  // Top 4 bairros com mais imóveis (com média de preço e imagem representativa)
  const byNeighborhood = new Map<
    string,
    { city: string | null; values: number[]; image: string | null }
  >();
  for (const p of all) {
    if (!p.neighborhood) continue;
    const existing = byNeighborhood.get(p.neighborhood) ?? {
      city: p.city,
      values: [],
      image: null,
    };
    const valueNumber =
      p.value_raw ??
      parseFloat(p.value.replace(/[^\d,]/g, '').replace(',', '.'));
    if (!Number.isNaN(valueNumber) && valueNumber > 0) {
      existing.values.push(valueNumber);
    }
    if (!existing.image && p.attachments[0]?.url) {
      existing.image = p.attachments[0].url;
    }
    if (!existing.city && p.city) existing.city = p.city;
    byNeighborhood.set(p.neighborhood, existing);
  }

  const topNeighborhoods: NeighborhoodSummary[] = Array.from(
    byNeighborhood.entries()
  )
    .map(([name, info]) => ({
      name,
      city: info.city,
      count: info.values.length,
      averagePrice:
        info.values.length > 0
          ? info.values.reduce((sum, v) => sum + v, 0) / info.values.length
          : 0,
      image: info.image,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const hero: HeroContent = {
    eyebrow: site?.hero_eyebrow ?? null,
    titleLine1: site?.hero_title_line_1 ?? site?.site_title ?? null,
    titleLine2: site?.hero_title_line_2 ?? null,
    subtitle: site?.site_subtitle ?? null,
    backgroundUrl: site?.hero_background_url ?? null,
  };

  const stats: HomeStat[] = (data?.stats ?? []).map(s => ({
    id: s.id,
    label: s.label,
    value: s.value,
    prefix: s.prefix,
    suffix: s.suffix,
    icon: s.icon,
  }));

  const whatsappTemplates = (data?.whatsapp_templates ?? []).map(t => ({
    key: t.key,
    message: t.message,
  }));

  return {
    brokerSlug,
    loading,
    error,
    brandName: footer?.company_name || data?.user.name || mockBrand.name,
    brandLogo: site?.brand_image ?? null,
    primaryColor: site?.primary_color || mockBrand.primaryColor,
    whatsappNumber,
    menu,
    properties: data,
    neighborhoodSuggestions,
    citySuggestions,
    topNeighborhoods,
    hero,
    stats,
    whatsappTemplates,
    institutional: data?.institutional ?? null,
    testimonials: data?.testimonials ?? [],
    homeLayout: site?.home_layout ?? null,
  };
}

/**
 * Helpers para abrir o WhatsApp com mensagens padronizadas.
 */
export function buildWhatsappUrl(number: string, message: string): string {
  const digits = digitsOnly(number);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Helper centralizado: aplica template + abre WhatsApp.
 * Substitui as N variações de "buildWhatsappUrl + mensagem manual" espalhadas
 * pelos componentes da home/detalhe/equipe.
 */
export function whatsappUrlFor(
  number: string,
  templates: { key: string; message: string }[] | undefined,
  key: WhatsappTemplateKey,
  vars: Record<string, Record<string, string | number | null | undefined>> = {}
): string {
  return buildWhatsappUrl(number, resolveWhatsappMessage(templates, key, vars));
}

/**
 * @deprecated Use resolveWhatsappMessage(templates, key, vars) com os templates vindos
 * de useBrokerHomeData().templates — esses constants são apenas fallbacks finais.
 */
export const WHATSAPP_MESSAGES = {
  default: 'Olá! Gostaria de mais informações sobre os imóveis disponíveis.',
  anunciar:
    'Olá! Tenho um imóvel que gostaria de anunciar com vocês. Podemos conversar?',
  visita:
    'Olá! Gostaria de agendar uma visita a um imóvel. Podem me ajudar com os horários?',
} as const;

/**
 * Chaves de template conhecidas, alinhadas ao catálogo do backend
 * (App\Models\Site\WhatsappTemplate::CATALOG).
 */
export type WhatsappTemplateKey =
  | 'default'
  | 'announce'
  | 'interest_property'
  | 'visit_property'
  | 'interest_agent'
  | 'work_with_us'
  | 'send_resume';

/**
 * Substitui placeholders {{a.b}} pelos valores de `vars`.
 * Aceita até 2 níveis (`property.title`, `agent.name`, etc).
 */
export function resolveWhatsappMessage(
  templates: { key: string; message: string }[] | undefined,
  key: WhatsappTemplateKey,
  vars: Record<string, Record<string, string | number | null | undefined>> = {}
): string {
  const template = templates?.find(t => t.key === key);
  // Fallback: usa o constante hard-coded equivalente (compat)
  const fallbackMap: Record<WhatsappTemplateKey, string> = {
    default: WHATSAPP_MESSAGES.default,
    announce: WHATSAPP_MESSAGES.anunciar,
    interest_property:
      'Olá! Tenho interesse no imóvel "{{property.title}}". Pode me passar mais informações?',
    visit_property:
      'Olá! Gostaria de agendar uma visita ao imóvel "{{property.title}}". Quais os horários disponíveis?',
    interest_agent:
      'Olá {{agent.name}}! Vim do site e gostaria de conversar.',
    work_with_us:
      'Olá! Vi a página da equipe e gostaria de saber sobre as vagas abertas.',
    send_resume:
      'Olá! Gostaria de enviar meu currículo para ser considerado em futuras oportunidades.',
  };
  const raw = template?.message || fallbackMap[key];

  return raw.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path: string) => {
    const [a, b] = path.split('.');
    const value = b ? vars[a]?.[b] : (vars[a] as unknown);
    return value != null ? String(value) : '';
  });
}
