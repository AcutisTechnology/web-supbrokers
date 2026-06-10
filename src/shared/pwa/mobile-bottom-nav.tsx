'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface BottomNavItem {
  label: string;
  icon: LucideIcon;
  /** Rota interna. Omitir quando for ação externa (href). */
  to?: string;
  /** Link externo (ex.: WhatsApp). */
  href?: string;
  /** Match exato (ex.: home). Por padrão usa startsWith. */
  exact?: boolean;
}

interface MobileBottomNavProps {
  items: BottomNavItem[];
  theme?: 'light' | 'dark';
}

export function MobileBottomNav({ items, theme = 'light' }: MobileBottomNavProps) {
  const pathname = usePathname();
  const isDark = theme === 'dark';
  const barBg = isDark ? '#0F0820' : '#ffffff';

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
        className={`relative h-[60px] rounded-2xl overflow-visible ${
          isDark
            ? 'bg-[#0F0820] shadow-[0_-4px_24px_rgba(0,0,0,0.55)]'
            : 'bg-white shadow-[0_-2px_16px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]'
        }`}
      >
        {/* Indicador animado que desliza entre itens */}
        {activeIndex >= 0 && (
          <motion.div
            className="absolute top-0 h-full pointer-events-none z-10"
            style={{ width: `${itemWidthPct}%` }}
            animate={{ left: `${activeIndex * itemWidthPct}%` }}
            initial={{ left: `${activeIndex * itemWidthPct}%` }}
            transition={{ type: 'spring', stiffness: 520, damping: 40, mass: 0.8 }}
          >
            {/* Asa esquerda — cria a curva côncava no lado esquerdo da bolha */}
            <span
              className="absolute top-0 w-[18px] h-[18px] rounded-full"
              style={{ left: 'calc(50% - 40px)', boxShadow: `9px -9px 0 3px ${barBg}` }}
            />
            {/* Asa direita */}
            <span
              className="absolute top-0 w-[18px] h-[18px] rounded-full"
              style={{ left: 'calc(50% + 22px)', boxShadow: `-9px -9px 0 3px ${barBg}` }}
            />

            {/* Círculo elevado com ícone ativo */}
            <span
              className={`absolute left-1/2 -translate-x-1/2 -top-[26px] flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#9747ff] shadow-[0_8px_22px_rgba(151,71,255,0.45)] ${
                isDark ? 'ring-[5px] ring-[#0F0820]' : 'ring-[5px] ring-white'
              }`}
            >
              {(() => {
                const Icon = items[activeIndex]?.icon;
                return Icon ? <Icon size={22} className="text-white" strokeWidth={2.2} /> : null;
              })()}
            </span>
          </motion.div>
        )}

        {/* Lista de itens */}
        <ul className="flex h-full relative z-20">
          {items.map((item, index) => {
            const active = index === activeIndex;
            const Icon = item.icon;

            const content = active ? (
              /* Ativo: ícone está na bolha acima; exibe apenas o label */
              <span className="flex flex-col items-center justify-end h-full pb-[6px]">
                <span className="text-[10px] font-semibold text-[#9747ff] leading-none tracking-wide">
                  {item.label}
                </span>
              </span>
            ) : (
              /* Inativo: ícone + label centralizados */
              <span className="flex flex-col items-center justify-center h-full gap-[3px]">
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className={isDark ? 'text-white/55' : 'text-[#aaa]'}
                />
                <span
                  className={`text-[10px] font-medium leading-none ${
                    isDark ? 'text-white/45' : 'text-[#aaa]'
                  }`}
                >
                  {item.label}
                </span>
              </span>
            );

            return (
              <li key={item.label} style={{ width: `${itemWidthPct}%` }} className="relative">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block h-full active:opacity-70 transition-opacity"
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={item.to ?? '#'}
                    className="block h-full active:opacity-70 transition-opacity"
                    aria-current={active ? 'page' : undefined}
                  >
                    {content}
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
