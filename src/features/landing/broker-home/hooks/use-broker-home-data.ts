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
  };
}

/**
 * Helpers para abrir o WhatsApp com mensagens padronizadas.
 */
export function buildWhatsappUrl(number: string, message: string): string {
  const digits = digitsOnly(number);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_MESSAGES = {
  default: 'Olá! Gostaria de mais informações sobre os imóveis disponíveis.',
  anunciar:
    'Olá! Tenho um imóvel que gostaria de anunciar com vocês. Podemos conversar?',
  visita:
    'Olá! Gostaria de agendar uma visita a um imóvel. Podem me ajudar com os horários?',
} as const;
