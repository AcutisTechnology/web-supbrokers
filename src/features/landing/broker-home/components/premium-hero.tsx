'use client';

import type { BrokerSearchFilters } from '@/features/landing/services/broker-service';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSearchFilters } from '../hooks/use-search-filters';
import { brokerUrls } from '../lib/broker-urls';
import { PropertySearchForm } from './property-search-form';

interface PremiumHeroProps {
  brokerSlug: string | null;
  brandTagline?: string;
  brandSubtitle?: string;
  neighborhoodSuggestions: string[];
  citySuggestions: string[];
  hero?: {
    eyebrow: string | null;
    titleLine1: string | null;
    titleLine2: string | null;
    subtitle: string | null;
    backgroundUrl: string | null;
    overlayColor?: string | null;
    overlayOpacity?: number | null;
  };
}

const DEFAULT_HERO_BG =
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=80';

export function PremiumHero({
  brokerSlug,
  brandTagline,
  brandSubtitle,
  neighborhoodSuggestions,
  citySuggestions,
  hero,
}: PremiumHeroProps) {
  const router = useRouter();
  const { buildSearchPath } = useSearchFilters();

  const handleSubmit = (filters: BrokerSearchFilters) => {
    const basePath = brokerSlug ? brokerUrls(brokerSlug).listing : '/imoveis';
    router.push(buildSearchPath(basePath, filters));
  };

  const bgUrl = hero?.backgroundUrl || DEFAULT_HERO_BG;
  const titleLine1 = hero?.titleLine1 || brandTagline || null;
  const titleLine2 = hero?.titleLine2 || null;
  const subtitle = hero?.subtitle || brandSubtitle || null;
  const eyebrow = hero?.eyebrow || null;

  const overlayColor = hero?.overlayColor || '#0F0820';
  const overlayOpacity = hero?.overlayOpacity ?? 75;
  // Convert 0-100 opacity to hex suffixes: 85%, 55%, 100%, 70%
  const toHex = (pct: number) => Math.round(Math.min(100, Math.max(0, pct)) * 2.55).toString(16).padStart(2, '0');
  const op85 = toHex(overlayOpacity * 0.85);
  const op55 = toHex(overlayOpacity * 0.55);
  const op100 = toHex(overlayOpacity);
  const op70 = toHex(overlayOpacity * 0.70);

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={bgUrl}
          alt="Hero"
          fill
          priority
          className="object-cover scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, ${overlayColor}${op85}, ${overlayColor}${op55}, ${overlayColor}${op100})` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to right, ${overlayColor}${op70}, transparent)` }}
        />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-500/15 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 pt-32 pb-20">
        <div className="max-w-4xl">
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs md:text-sm tracking-[0.3em] uppercase text-amber-200/85 mb-5 font-medium"
            >
              {eyebrow}
            </motion.p>
          )}
          {(titleLine1 || titleLine2) && (
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-white text-5xl md:text-7xl leading-[1.05] tracking-tight"
            >
              {titleLine1}
              {titleLine2 && (
                <>
                  {titleLine1 && <br />}
                  <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent italic">
                    {titleLine2}
                  </span>
                </>
              )}
            </motion.h1>
          )}

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-12 max-w-5xl"
        >
          <PropertySearchForm
            theme="dark"
            citySuggestions={citySuggestions}
            neighborhoodSuggestions={neighborhoodSuggestions}
            onSubmit={handleSubmit}
            submitLabel="Encontrar Imóvel"
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/40"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
