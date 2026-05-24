'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { mockTestimonials } from '../data/mock';
import { Reveal } from './primitives/reveal';

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const total = mockTestimonials.length;

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % total), 7000);
    return () => clearInterval(id);
  }, [total]);

  const current = mockTestimonials[index];

  return (
    <section className="relative py-24 md:py-32 bg-[#0F0820] text-white overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-purple-600/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative container mx-auto px-4 md:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs tracking-[0.25em] uppercase text-amber-300 mb-3">
            Confiança & resultado
          </p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight leading-tight">
            O que nossos <span className="italic">clientes</span> dizem.
          </h2>
        </Reveal>

        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-14">
              <Quote className="absolute top-8 left-8 w-12 h-12 text-amber-300/30" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10"
                >
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                    ))}
                  </div>
                  <p className="font-display text-2xl md:text-3xl leading-relaxed text-white/95">
                    “{current.message}”
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-300/50">
                      <Image
                        src={current.avatar}
                        alt={current.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{current.name}</p>
                      <p className="text-sm text-white/60">{current.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={() => setIndex(i => (i - 1 + total) % total)}
              aria-label="Anterior"
              className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {mockTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-8 bg-amber-300' : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setIndex(i => (i + 1) % total)}
              aria-label="Próximo"
              className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
