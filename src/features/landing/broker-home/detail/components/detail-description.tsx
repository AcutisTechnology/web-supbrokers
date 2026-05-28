'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface DetailDescriptionProps {
  text: string;
}

const COLLAPSED_HEIGHT = 220;

export function DetailDescription({ text }: DetailDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    setNeedsToggle(contentRef.current.scrollHeight > COLLAPSED_HEIGHT + 20);
  }, [text]);

  return (
    <section>
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#9747FF] mb-3">
        Sobre o imóvel
      </p>
      <h2 className="font-display text-2xl md:text-3xl text-[#0F0820] tracking-tight mb-5">
        Descrição
      </h2>

      <div className="relative">
        <motion.div
          animate={{
            height: expanded ? 'auto' : Math.min(COLLAPSED_HEIGHT, 800),
          }}
          initial={false}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <p
            ref={contentRef}
            className="text-[#0F0820]/75 text-base md:text-lg leading-relaxed whitespace-pre-line"
          >
            {text}
          </p>
        </motion.div>

        {/* Fade no fim quando colapsado */}
        <AnimatePresence>
          {!expanded && needsToggle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/80 to-transparent"
            />
          )}
        </AnimatePresence>
      </div>

      {needsToggle && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#9747FF] hover:text-[#0F0820] transition-colors"
        >
          {expanded ? 'Ler menos' : 'Ler mais'}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </section>
  );
}
