'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import Image from 'next/image';
import { mockPosts } from '../data/mock';
import { Reveal, Stagger, StaggerItem } from './primitives/reveal';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

export function BlogSection() {
  const [featured, ...rest] = mockPosts;
  return (
    <section id="blog" className="py-24 md:py-28 bg-[#FAFAF7]">
      <div className="container mx-auto px-4 md:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.25em] uppercase text-[#9747FF] mb-3">
                Trends & Insights
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#0F0820] tracking-tight leading-tight">
                Conteúdo para quem <span className="italic">vive</span> o luxo.
              </h2>
            </div>
            <a
              href="#"
              className="text-sm text-[#9747FF] hover:underline underline-offset-4 whitespace-nowrap"
            >
              Ver todos os artigos →
            </a>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
          {/* Featured */}
          <StaggerItem className="lg:col-span-7">
            <motion.a
              href="#"
              whileHover="hover"
              className="group relative block aspect-[4/3] lg:aspect-auto lg:h-full rounded-3xl overflow-hidden"
            >
              <motion.div
                variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                initial="rest"
                className="absolute inset-0"
              >
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(max-width:1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0820] via-[#0F0820]/40 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-300 text-[#0F0820] font-medium">
                    {featured.category}
                  </span>
                  <span className="text-white/70">{formatDate(featured.publishedAt)}</span>
                </div>
                <h3 className="font-display text-3xl md:text-4xl leading-tight max-w-2xl">
                  {featured.title}
                </h3>
                <p className="mt-4 text-white/80 max-w-xl leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-2 text-amber-300">
                  <span className="text-sm font-medium">Ler artigo</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </motion.a>
          </StaggerItem>

          {/* Side posts */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-5 md:gap-6">
            {rest.map(p => (
              <StaggerItem key={p.id}>
                <motion.a
                  href="#"
                  whileHover={{ x: 4 }}
                  className="group flex gap-5 bg-white rounded-2xl p-4 hover:shadow-[0_20px_40px_-15px_rgba(15,8,32,0.15)] transition-shadow"
                >
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="128px"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1 py-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#9747FF] mb-2">
                      {p.category}
                    </p>
                    <h4 className="font-display text-base text-[#0F0820] leading-snug line-clamp-3 group-hover:text-[#9747FF] transition-colors">
                      {p.title}
                    </h4>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-[#777]">
                      <Clock className="w-3 h-3" />
                      {p.readingTime}
                    </div>
                  </div>
                </motion.a>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </div>
    </section>
  );
}
