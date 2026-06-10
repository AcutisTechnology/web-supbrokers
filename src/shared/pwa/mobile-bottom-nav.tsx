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
  /** Tema do container. */
  theme?: 'light' | 'dark';
}

export function MobileBottomNav({ items, theme = 'light' }: MobileBottomNavProps) {
  const pathname = usePathname();
  const isDark = theme === 'dark';

  const isActive = (item: BottomNavItem) => {
    if (!item.to) return false;
    if (item.exact) return pathname === item.to;
    return pathname === item.to || pathname.startsWith(`${item.to}/`);
  };

  return (
    <nav
      aria-label="Navegação principal"
      className={`lg:hidden fixed bottom-0 inset-x-0 z-50 border-t pb-safe ${
        isDark
          ? 'bg-[#0F0820]/90 border-white/10'
          : 'bg-white/85 border-black/5'
      } backdrop-blur-xl`}
    >
      <ul className="flex items-stretch justify-around px-1">
        {items.map(item => {
          const active = isActive(item);
          const Icon = item.icon;
          const content = (
            <>
              <span className="relative flex items-center justify-center">
                {active && (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute -inset-x-3 -inset-y-1.5 rounded-full bg-[#9747FF]/12"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  className={`relative w-[22px] h-[22px] transition-colors ${
                    active
                      ? 'text-[#9747FF]'
                      : isDark
                        ? 'text-white/70'
                        : 'text-[#777]'
                  }`}
                  strokeWidth={active ? 2.4 : 1.8}
                />
              </span>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active
                    ? 'text-[#9747FF]'
                    : isDark
                      ? 'text-white/60'
                      : 'text-[#777]'
                }`}
              >
                {item.label}
              </span>
            </>
          );

          const className =
            'flex flex-col items-center justify-center gap-1 py-2.5 px-2 min-w-0 flex-1 active:scale-95 transition-transform';

          return (
            <li key={item.label} className="flex-1">
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                >
                  {content}
                </a>
              ) : (
                <Link
                  href={item.to ?? '#'}
                  className={className}
                  aria-current={active ? 'page' : undefined}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
