'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface BottomNavItem {
  label: string;
  icon: LucideIcon;
  to?: string;
  href?: string;
  exact?: boolean;
}

interface MobileBottomNavProps {
  items: BottomNavItem[];
  theme?: 'light' | 'dark';
  /** Cor do fundo da página — usada pelo indicador para criar o efeito de "buraco" na barra. */
  bgColor?: string;
}

export function MobileBottomNav({ items, theme = 'light', bgColor = '#f6f6f6' }: MobileBottomNavProps) {
  const pathname = usePathname();
  const isDark = theme === 'dark';

  const isActive = (item: BottomNavItem) => {
    if (!item.to) return false;
    if (item.exact) return pathname === item.to;
    return pathname === item.to || pathname.startsWith(`${item.to}/`);
  };

  const activeIndex = items.findIndex(isActive);
  const itemWidthPct = 100 / items.length;

  return (
    <nav
      aria-label="Navegação principal"
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 px-3 pb-[max(env(safe-area-inset-bottom),10px)]"
    >
      <div
        className={`relative h-[70px] rounded-[10px] flex justify-center overflow-visible ${
          isDark ? 'bg-[#252432]' : 'bg-white'
        } shadow-[0_5px_15px_rgba(0,0,0,0.1)]`}
      >
        <ul className="flex w-full relative">
          {/* ── Indicador deslizante ── */}
          {activeIndex >= 0 && (
            <motion.div
              className="absolute h-[70px] z-0"
              style={{
                width: `${itemWidthPct}%`,
                top: '-10px',
                background: bgColor,
                border: `6px solid ${bgColor}`,
                borderBottomLeftRadius: '50%',
                borderBottomRightRadius: '50%',
              }}
              animate={{ left: `${activeIndex * itemWidthPct}%` }}
              initial={{ left: `${activeIndex * itemWidthPct}%` }}
              transition={{ type: 'spring', stiffness: 500, damping: 38, mass: 0.8 }}
            >
              {/* Asa esquerda — curva côncava */}
              <span
                className="absolute w-[20px] h-[20px] rounded-tr-[20px]"
                style={{ top: '4px', left: '-25.75px', boxShadow: `4px -6px 0 2px ${bgColor}` }}
              />
              {/* Asa direita */}
              <span
                className="absolute w-[20px] h-[20px] rounded-tl-[20px]"
                style={{ top: '4px', right: '-25.75px', boxShadow: `-4px -6px 0 2px ${bgColor}` }}
              />
              {/* Círculo decorativo interno */}
              <span
                className="absolute rounded-full bg-white border-[4px] border-[#9747ff] shadow-[0_5px_15px_rgba(0,0,0,0.15)]"
                style={{
                  bottom: '3px',
                  left: '50%',
                  transform: 'translateX(-50%) scale(0.85)',
                  transformOrigin: 'bottom',
                  width: '60px',
                  height: '60px',
                }}
              />
            </motion.div>
          )}

          {/* ── Itens de navegação ── */}
          {items.map((item, index) => {
            const active = index === activeIndex;
            const Icon = item.icon;

            const inner = (
              <span className="relative flex justify-center items-center flex-col w-full h-full text-center">
                {/* Ícone — levanta quando ativo */}
                <span
                  className="transition-all duration-500"
                  style={{
                    transform: active ? 'translateY(-28px)' : 'translateY(0)',
                    color: active
                      ? '#9747ff'
                      : isDark
                        ? 'rgba(255,255,255,0.65)'
                        : 'rgba(0,0,0,0.55)',
                  }}
                >
                  <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                </span>
                {/* Label — só aparece quando ativo, abaixo do ícone */}
                <span
                  className="absolute bottom-[8px] text-[10px] font-semibold leading-none tracking-wide transition-all duration-300"
                  style={{
                    color: '#9747ff',
                    opacity: active ? 1 : 0,
                    transform: active ? 'translateY(0)' : 'translateY(4px)',
                  }}
                >
                  {item.label}
                </span>
              </span>
            );

            return (
              <li
                key={item.label}
                style={{ width: `${itemWidthPct}%` }}
                className="relative list-none h-[70px] z-10"
              >
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="block w-full h-full">
                    {inner}
                  </a>
                ) : (
                  <Link
                    href={item.to ?? '#'}
                    className="block w-full h-full"
                    aria-current={active ? 'page' : undefined}
                  >
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
