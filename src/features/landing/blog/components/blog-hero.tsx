'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Reveal } from '@/features/landing/broker-home/components/primitives/reveal';

interface BlogHeroProps {
  brokerSlug: string;
  brandName: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function BlogHero({
  brokerSlug,
  brandName,
  eyebrow = 'Market Insights',
  title = 'Insights do Mercado Imobiliário',
  description = 'Tendências, investimentos e conteúdos exclusivos do mercado premium.',
}: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#0F0820] text-white pt-28 md:pt-36 pb-16 md:pb-20">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#9747FF]/30 blur-[120px]" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <Reveal>
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-8">
            <Link href={`/${brokerSlug}`} className="hover:text-white transition-colors">
              {brandName}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">Blog</span>
          </nav>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="text-xs tracking-[0.3em] uppercase text-amber-300 mb-4">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display text-4xl md:text-6xl xl:text-7xl tracking-tight leading-[1.05] max-w-4xl">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
