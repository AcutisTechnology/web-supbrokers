'use client';

import { motion } from 'framer-motion';
import { Calendar, MessageCircle, Sparkles } from 'lucide-react';
import { Reveal } from './primitives/reveal';

export function FinalCta() {
  return (
    <section className="relative py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <Reveal>
          <div className="relative rounded-[2rem] overflow-hidden bg-[#0F0820] p-10 md:p-20 text-white">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-60">
              <motion.div
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 30%, rgba(151,71,255,0.4) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 70%, rgba(151,71,255,0.4) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 30%, rgba(151,71,255,0.4) 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0"
              />
              <motion.div
                animate={{
                  background: [
                    'radial-gradient(circle at 80% 20%, rgba(251,191,36,0.25) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 80%, rgba(251,191,36,0.25) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 20%, rgba(251,191,36,0.25) 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0"
              />
            </div>

            {/* Decorative grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-xs uppercase tracking-[0.2em] text-amber-100">
                  Pronto para o próximo nível?
                </span>
              </div>

              <h2 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight">
                A casa dos seus sonhos
                <br />
                está a uma{' '}
                <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent italic">
                  conversa
                </span>{' '}
                de distância.
              </h2>

              <p className="mt-6 text-white/70 text-lg max-w-xl leading-relaxed">
                Seja para encontrar, vender ou investir. Nosso time de
                consultores está pronto para acompanhar você.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button className="group flex items-center justify-center gap-2 bg-amber-300 text-[#0F0820] font-medium px-7 py-3.5 rounded-full hover:bg-amber-200 transition-all hover:shadow-[0_0_40px_-5px_rgba(251,191,36,0.7)]">
                  <MessageCircle className="w-4 h-4" />
                  Falar no WhatsApp
                </button>
                <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/15 backdrop-blur text-white px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors">
                  <Calendar className="w-4 h-4" />
                  Agendar visita
                </button>
                <button className="text-white/70 hover:text-white text-sm px-4 py-3 transition-colors">
                  Trabalhe conosco →
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
