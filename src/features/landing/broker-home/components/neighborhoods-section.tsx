'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { mockNeighborhoods } from '../data/mock';
import type { NeighborhoodSummary } from '../hooks/use-broker-home-data';
import { brokerUrls } from '../lib/broker-urls';
import { Reveal, Stagger, StaggerItem } from './primitives/reveal';

interface NeighborhoodsSectionProps {
  brokerSlug: string | null;
  neighborhoods: NeighborhoodSummary[];
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1542317854-3c9b3a5dac17?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
];

function formatAveragePrice(value: number): string {
  if (value >= 1_000_000) {
    const v = (value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1);
    return `R$ ${v}M médio`;
  }
  if (value >= 1_000) {
    return `R$ ${Math.round(value / 1_000)}k médio`;
  }
  if (value > 0) return `R$ ${Math.round(value)} médio`;
  return '';
}

function buildSearchHref(brokerSlug: string | null, neighborhood: string): string {
  const params = new URLSearchParams();
  params.set('neighborhood', neighborhood);
  const base = brokerSlug ? brokerUrls(brokerSlug).listing : '/imoveis';
  return `${base}?${params.toString()}`;
}

export function NeighborhoodsSection({
  brokerSlug,
  neighborhoods,
}: NeighborhoodsSectionProps) {
  // Sem broker: mostra mocks pra demonstração visual
  const items =
    neighborhoods.length > 0
      ? neighborhoods.map((n, i) => ({
          id: n.name,
          name: n.name,
          city: n.city ?? '',
          image: n.image ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
          propertiesCount: n.count,
          priceLabel: formatAveragePrice(n.averagePrice),
          href: buildSearchHref(brokerSlug, n.name),
        }))
      : !brokerSlug
        ? mockNeighborhoods.map(n => ({
            id: n.id,
            name: n.name,
            city: n.city,
            image: n.image,
            propertiesCount: n.propertiesCount,
            priceLabel: `R$ ${n.averagePrice} médio`,
            href: buildSearchHref(null, n.name),
          }))
        : [];

  // Com broker real e sem dados → oculta a seção
  if (items.length === 0) return null;

  return (
    <section id="regioes" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs tracking-[0.25em] uppercase text-[#9747FF] mb-3">
              Onde viver
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-[#0F0820] tracking-tight leading-tight">
              Os melhores <span className="italic">endereços</span>.
            </h2>
            <p className="mt-4 text-[#777] text-base md:text-lg">
              Regiões selecionadas com base nos imóveis mais procurados.
            </p>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {items.map(n => (
            <StaggerItem key={n.id}>
              <motion.div
                whileHover="hover"
                initial="rest"
                animate="rest"
                className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#0F0820]"
              >
                <Link
                  href={n.href}
                  className="group absolute inset-0 block"
                  aria-label={`Ver imóveis em ${n.name}`}
                >
                  <motion.div
                    variants={{
                      rest: { scale: 1 },
                      hover: { scale: 1.12 },
                    }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={n.image}
                      alt={n.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </motion.div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0820] via-[#0F0820]/30 to-transparent" />
                  <motion.div
                    variants={{
                      rest: { opacity: 0 },
                      hover: { opacity: 1 },
                    }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-gradient-to-t from-[#9747FF]/30 to-transparent"
                  />

                  {/* Top right arrow */}
                  <motion.div
                    variants={{
                      rest: { y: -6, opacity: 0 },
                      hover: { y: 0, opacity: 1 },
                    }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-[#0F0820] flex items-center justify-center"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </motion.div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                    {n.city && (
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/70 mb-1">
                        {n.city}
                      </p>
                    )}
                    <h3 className="font-display text-2xl tracking-tight mb-3">
                      {n.name}
                    </h3>
                    <motion.div
                      variants={{
                        rest: { opacity: 0, y: 6 },
                        hover: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center gap-4 text-xs text-white/80 pt-3 border-t border-white/15"
                    >
                      <span>
                        {n.propertiesCount}{' '}
                        {n.propertiesCount === 1 ? 'imóvel' : 'imóveis'}
                      </span>
                      {n.priceLabel && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-white/40" />
                          <span>{n.priceLabel}</span>
                        </>
                      )}
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
