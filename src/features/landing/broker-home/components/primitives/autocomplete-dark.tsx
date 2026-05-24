'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  theme?: 'dark' | 'light';
}

/**
 * Autocomplete tema-agnóstico (dark/light).
 * Sem deps extras: filtra in-memory por substring case-insensitive.
 */
export function AutocompleteDark({
  value,
  onChange,
  suggestions,
  placeholder,
  icon,
  className,
  theme = 'dark',
}: AutocompleteProps) {
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
    ? Array.from(new Set(suggestions))
        .filter(s => s.toLowerCase().includes(query) && s.toLowerCase() !== query)
        .slice(0, 8)
    : Array.from(new Set(suggestions)).slice(0, 8);

  const isDark = theme === 'dark';
  const inputClass = isDark
    ? 'text-white placeholder:text-white/50'
    : 'text-[#0F0820] placeholder:text-[#0F0820]/40';
  const dropdownClass = isDark
    ? 'bg-[#0F0820]/95 backdrop-blur-xl border border-white/15'
    : 'bg-white border border-black/10';
  const itemClass = isDark
    ? 'text-white/85 hover:bg-white/10 hover:text-white'
    : 'text-[#0F0820]/80 hover:bg-[#FAFAF7] hover:text-[#0F0820]';

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
          className={`w-full bg-transparent outline-none text-sm ${inputClass}`}
        />
      </div>

      <AnimatePresence>
        {open && filtered.length > 0 && (focused || value.length > 0) && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 right-0 top-full mt-2 z-50 rounded-xl overflow-hidden shadow-2xl py-1 max-h-64 overflow-y-auto ${dropdownClass}`}
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
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${itemClass}`}
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
