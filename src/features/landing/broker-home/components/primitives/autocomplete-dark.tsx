'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface AutocompleteDarkProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Autocomplete leve para inputs sobre fundo escuro/glass.
 * Sem deps extras: filtra in-memory por prefixo case-insensitive.
 */
export function AutocompleteDark({
  value,
  onChange,
  suggestions,
  placeholder,
  icon,
  className,
}: AutocompleteDarkProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const query = value.trim().toLowerCase();
  const filtered = query
    ? suggestions
        .filter(s => s.toLowerCase().includes(query) && s.toLowerCase() !== query)
        .slice(0, 8)
    : suggestions.slice(0, 8);

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <div className="flex items-center gap-2">
        {icon}
        <input
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setFocused(true);
            setOpen(true);
          }}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent text-white placeholder:text-white/50 outline-none text-sm"
        />
      </div>

      <AnimatePresence>
        {open && filtered.length > 0 && (focused || value.length > 0) && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#0F0820]/95 backdrop-blur-xl border border-white/15 rounded-xl overflow-hidden shadow-2xl py-1 max-h-64 overflow-y-auto"
          >
            {filtered.map(item => (
              <li key={item}>
                <button
                  type="button"
                  onMouseDown={e => {
                    e.preventDefault();
                    onChange(item);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {item}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
