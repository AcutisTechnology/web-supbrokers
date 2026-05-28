'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Grid3x3,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface DetailHeroGalleryProps {
  images: { name: string; url: string }[];
  title: string;
  badges?: { label: string; tone: 'dark' | 'light' | 'gold' | 'rose' }[];
}

const FALLBACK =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=2000&q=80';

const TONES: Record<string, string> = {
  dark: 'bg-[#0F0820] text-white',
  light: 'bg-white text-[#0F0820]',
  gold: 'bg-amber-300 text-[#0F0820]',
  rose: 'bg-rose-400 text-[#0F0820]',
};

export function DetailHeroGallery({
  images,
  title,
  badges = [],
}: DetailHeroGalleryProps) {
  const safe = images.length > 0 ? images : [{ name: 'fallback', url: FALLBACK }];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const main = safe[active];
  const sideImages = safe.slice(0, 4); // pra grid lateral
  const padding = sideImages.length < 4 ? 4 - sideImages.length : 0;

  useEffect(() => {
    if (!lightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowLeft') setActive(i => (i - 1 + safe.length) % safe.length);
      if (e.key === 'ArrowRight') setActive(i => (i + 1) % safe.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, safe.length]);

  return (
    <>
      {/* Layout principal: imagem grande + grid de 4 thumbs */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-2 md:gap-3 rounded-3xl overflow-hidden relative">
        {/* Main */}
        <motion.button
          onClick={() => setLightbox(true)}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="group relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden bg-gray-100"
        >
          <Image
            src={main.url}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-[1500ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F0820]/30" />

          {/* Badges */}
          {badges.length > 0 && (
            <div className="absolute top-5 left-5 flex flex-wrap gap-2">
              {badges.map(b => (
                <span
                  key={b.label}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wider uppercase ${TONES[b.tone]}`}
                >
                  {b.label}
                </span>
              ))}
            </div>
          )}

          {/* Open lightbox hint */}
          <div className="absolute bottom-5 right-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur text-[#0F0820] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <Expand className="w-3.5 h-3.5" />
            Ampliar
          </div>
        </motion.button>

        {/* Grid lateral */}
        <div className="hidden lg:grid grid-rows-2 grid-cols-2 gap-2 md:gap-3">
          {sideImages.slice(0, 4).map((img, i) => {
            const isLastSlotWithMore = i === 3 && safe.length > 4;
            return (
              <motion.button
                key={img.name + i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                onClick={() => {
                  setActive(i);
                  setLightbox(true);
                }}
                className="group relative overflow-hidden bg-gray-100"
              >
                <Image
                  src={img.url}
                  alt={`${title} ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                />
                {isLastSlotWithMore && (
                  <div className="absolute inset-0 bg-[#0F0820]/75 flex items-center justify-center text-white">
                    <div className="text-center">
                      <Grid3x3 className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm font-medium">
                        +{safe.length - 4} fotos
                      </p>
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
          {Array.from({ length: padding }).map((_, i) => (
            <div
              key={`pad-${i}`}
              className="bg-gradient-to-br from-[#FAFAF7] to-[#f0ece8]"
            />
          ))}
        </div>

        {/* Mobile: botão "ver todas" */}
        <button
          onClick={() => setLightbox(true)}
          className="lg:hidden absolute bottom-3 right-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur text-[#0F0820] text-xs font-medium shadow-md"
        >
          <Grid3x3 className="w-3.5 h-3.5" />
          {safe.length} fotos
        </button>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-[#0F0820]/95 backdrop-blur-sm flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 md:px-8 py-4 text-white">
              <div className="text-xs md:text-sm tracking-wider">
                {active + 1} / {safe.length}
              </div>
              <button
                onClick={() => setLightbox(false)}
                aria-label="Fechar"
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main image */}
            <div className="flex-1 relative px-4 md:px-12 pb-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full max-w-6xl mx-auto"
                >
                  <Image
                    src={safe[active].url}
                    alt={title}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() =>
                  setActive(i => (i - 1 + safe.length) % safe.length)
                }
                aria-label="Anterior"
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/15 text-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActive(i => (i + 1) % safe.length)}
                aria-label="Próxima"
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/15 text-white flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbs */}
            <div className="px-4 md:px-8 py-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-2 justify-center min-w-min">
                {safe.map((img, i) => (
                  <button
                    key={img.name + i}
                    onClick={() => setActive(i)}
                    className={`relative w-20 h-14 md:w-24 md:h-16 shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      active === i
                        ? 'border-amber-300 opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`thumb ${i + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
