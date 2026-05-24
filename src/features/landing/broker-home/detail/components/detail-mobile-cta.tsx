'use client';

import { Calendar, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { buildWhatsappUrl } from '../../hooks/use-broker-home-data';

interface DetailMobileCtaProps {
  propertyTitle: string;
  value: string;
  type: 'sale' | 'rent';
  whatsappNumber: string;
}

/**
 * Barra fixa inferior visível apenas no mobile depois que o usuário
 * passa do hero. Garante CTA sempre acessível.
 */
export function DetailMobileCta({
  propertyTitle,
  value,
  type,
  whatsappNumber,
}: DetailMobileCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openWhats = () => {
    const m = `Olá! Tenho interesse no imóvel "${propertyTitle}".`;
    window.open(buildWhatsappUrl(whatsappNumber, m), '_blank');
  };

  const openSchedule = () => {
    const m = `Olá! Gostaria de agendar uma visita ao imóvel "${propertyTitle}".`;
    window.open(buildWhatsappUrl(whatsappNumber, m), '_blank');
  };

  return (
    <div
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white border-t border-black/[0.06] shadow-[0_-10px_30px_-10px_rgba(15,8,32,0.15)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-[#0F0820]/50">
              {type === 'sale' ? 'À venda' : 'Aluguel'}
            </p>
            <p className="font-display text-lg text-[#0F0820] truncate">
              R$ {value}
              {type === 'rent' && (
                <span className="text-xs text-[#0F0820]/50 font-sans">
                  {' '}
                  /mês
                </span>
              )}
            </p>
          </div>
          <button
            onClick={openSchedule}
            aria-label="Agendar visita"
            className="w-11 h-11 rounded-full border border-black/10 flex items-center justify-center text-[#0F0820]"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={openWhats}
            className="inline-flex items-center justify-center gap-1.5 bg-emerald-500 text-white font-medium text-sm px-5 h-11 rounded-full"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
