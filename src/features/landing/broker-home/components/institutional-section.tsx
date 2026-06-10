'use client';

import { motion } from 'framer-motion';
import {
  Award,
  Building2,
  Check,
  Crown,
  Heart,
  Home,
  ShieldCheck,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import type { PublicInstitutional } from '@/features/landing/services/broker-service';
import { Reveal } from './primitives/reveal';

interface InstitutionalSectionProps {
  data?: PublicInstitutional | null;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Shield,
  ShieldCheck,
  Award,
  Sparkles,
  Crown,
  Users,
  Building2,
  Home,
  Star,
  Heart,
  TrendingUp,
};

const DEFAULT_DATA: PublicInstitutional = {
  eyebrow: 'Sobre nós',
  title: 'Tecnologia, paixão e tradição a serviço do alto padrão.',
  body:
    'Há quase duas décadas, conectamos famílias e investidores aos imóveis mais desejados do país. Aliamos um olhar humano e consultivo a uma plataforma proprietária de inteligência de mercado.',
  image_url:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  values: [
    'Atendimento personalizado e consultivo',
    'Equipe especializada em alto padrão',
    'Portfólio com exclusividades de mercado',
    'Tecnologia e dados na avaliação de cada imóvel',
    'Presença internacional para clientes globais',
  ],
  differentials: [
    { icon: 'Shield', title: 'Discrição absoluta', text: 'Curadoria e negociação com o mais alto padrão de sigilo.' },
    { icon: 'Award', title: 'Curadoria premiada', text: 'Time reconhecido por entregar imóveis únicos no mercado nacional.' },
    { icon: 'Sparkles', title: 'Experiência única', text: 'Atendimento sob medida — do primeiro contato à entrega das chaves.' },
  ],
};

export function InstitutionalSection({ data }: InstitutionalSectionProps) {
  // data === undefined → modo demo (sem broker): usa conteúdo de exemplo.
  // data === null → broker sem institucional configurado: oculta a seção.
  // data === objeto → conteúdo real.
  if (data === null) return null;
  const content = data ?? DEFAULT_DATA;

  if (!content.title && !content.body) return null;

  const title = content.title ?? DEFAULT_DATA.title!;

  return (
    <section id="institucional" className="py-24 md:py-32 bg-[#FAFAF7]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image */}
          <div className="lg:col-span-6 relative">
            <Reveal>
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                  className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(15,8,32,0.3)] bg-[#0F0820]"
                >
                  {content.image_url && (
                    <Image
                      src={content.image_url}
                      alt={content.title ?? 'Sobre'}
                      fill
                      className="object-cover"
                    />
                  )}
                </motion.div>

                <div className="absolute -top-6 -left-6 w-24 h-24 grid grid-cols-6 gap-1 opacity-20 hidden md:grid">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <span key={i} className="w-1 h-1 rounded-full bg-[#0F0820]" />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Content */}
          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              {content.eyebrow && (
                <p className="text-xs tracking-[0.25em] uppercase text-[#9747FF] mb-3">
                  {content.eyebrow}
                </p>
              )}
              <h2 className="font-display text-4xl md:text-5xl text-[#0F0820] tracking-tight leading-[1.1]">
                {title}
              </h2>
              {content.body && (
                <p className="mt-6 text-[#555] leading-relaxed text-base md:text-lg whitespace-pre-line">
                  {content.body}
                </p>
              )}
            </Reveal>

            {content.values.length > 0 && (
              <Reveal delay={0.2}>
                <ul className="mt-8 space-y-3">
                  {content.values.map(v => (
                    <li key={v} className="flex items-start gap-3 text-[#0F0820]">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-300/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-amber-500" strokeWidth={3} />
                      </span>
                      <span className="text-sm">{v}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {content.differentials.length > 0 && (
              <Reveal delay={0.3}>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {content.differentials.map(d => {
                    const Icon = ICON_MAP[d.icon] ?? Sparkles;
                    return (
                      <div
                        key={d.title}
                        className="p-4 rounded-2xl bg-white border border-black/5 hover:border-amber-300/40 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-[#9747FF] mb-3" />
                        <p className="font-medium text-sm text-[#0F0820]">{d.title}</p>
                        {d.text && (
                          <p className="text-xs text-[#777] mt-1 leading-relaxed">{d.text}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
