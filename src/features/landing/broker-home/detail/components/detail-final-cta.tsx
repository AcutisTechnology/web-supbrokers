'use client';

import { Calendar, MessageCircle, Sparkles, User } from 'lucide-react';
import { buildWhatsappUrl } from '../../hooks/use-broker-home-data';
import { Reveal } from '../../components/primitives/reveal';

interface DetailFinalCtaProps {
  propertyTitle: string;
  whatsappNumber: string;
  onOpenForm?: () => void;
}

export function DetailFinalCta({
  propertyTitle,
  whatsappNumber,
  onOpenForm,
}: DetailFinalCtaProps) {
  const openWhats = () => {
    const m = `Olá! Tenho interesse no imóvel "${propertyTitle}". Pode me passar mais informações?`;
    window.open(buildWhatsappUrl(whatsappNumber, m), '_blank');
  };

  const openSchedule = () => {
    const m = `Olá! Gostaria de agendar uma visita ao imóvel "${propertyTitle}". Quais os horários disponíveis?`;
    window.open(buildWhatsappUrl(whatsappNumber, m), '_blank');
  };

  return (
    <Reveal>
      <section className="relative rounded-[2rem] overflow-hidden bg-[#0F0820] p-8 md:p-14 text-white">
        {/* Decorative glow */}
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-purple-600/25 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-amber-500/15 blur-3xl" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs uppercase tracking-[0.2em] text-amber-100">
              Esse imóvel é único
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-5xl leading-[1.1] tracking-tight">
            Pronto para conhecer{' '}
            <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent italic">
              ao vivo?
            </span>
          </h2>

          <p className="mt-5 text-white/70 text-base md:text-lg max-w-xl">
            Agende uma visita exclusiva ou converse agora com nosso consultor
            para tirar todas as suas dúvidas.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={openWhats}
              className="inline-flex items-center justify-center gap-2 bg-amber-300 text-[#0F0820] font-medium px-7 py-3.5 rounded-full hover:bg-amber-200 hover:shadow-[0_0_40px_-5px_rgba(251,191,36,0.7)] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Falar no WhatsApp
            </button>
            <button
              onClick={openSchedule}
              className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/15 backdrop-blur text-white px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Agendar visita
            </button>
            {onOpenForm && (
              <button
                onClick={onOpenForm}
                className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white text-sm px-4 py-3 transition-colors"
              >
                <User className="w-4 h-4" />
                Solicitar atendimento
              </button>
            )}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
