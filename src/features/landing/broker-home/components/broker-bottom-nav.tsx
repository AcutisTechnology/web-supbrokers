'use client';

import { Building2, Heart, Home, MessageCircle, Newspaper } from 'lucide-react';
import {
  MobileBottomNav,
  type BottomNavItem,
} from '@/shared/pwa/mobile-bottom-nav';
import {
  buildWhatsappUrl,
  resolveWhatsappMessage,
  useBrokerHomeData,
} from '../hooks/use-broker-home-data';
import { brokerUrls } from '../lib/broker-urls';

export function BrokerBottomNav({ slug }: { slug: string }) {
  const data = useBrokerHomeData(slug);
  const urls = brokerUrls(slug);

  const whatsappHref = data.whatsappNumber
    ? buildWhatsappUrl(
        data.whatsappNumber,
        resolveWhatsappMessage(data.whatsappTemplates, 'default')
      )
    : undefined;

  const items: BottomNavItem[] = [
    { label: 'Início', icon: Home, to: urls.home, exact: true },
    { label: 'Imóveis', icon: Building2, to: urls.listing },
    { label: 'Favoritos', icon: Heart, to: `${urls.home}/favoritos` },
    { label: 'Blog', icon: Newspaper, to: urls.blog },
    whatsappHref
      ? { label: 'Contato', icon: MessageCircle, href: whatsappHref }
      : { label: 'Equipe', icon: MessageCircle, to: urls.team },
  ];

  return <MobileBottomNav items={items} theme="light" />;
}
