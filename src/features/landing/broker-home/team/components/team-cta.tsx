'use client';

import { useWhatsapp } from '@/features/landing/broker-home/hooks/whatsapp-context';
import { Reveal } from '@/features/landing/broker-home/components/primitives/reveal';
import { Send, Sparkles } from 'lucide-react';

interface TeamCtaProps {
  whatsappNumber: string;
}

export function TeamCta({}: TeamCtaProps) {
  const { url: vagasUrl } = useWhatsapp('work_with_us');
  const { url: curriculoUrl } = useWhatsapp('send_resume');

  const handleVagas = () => window.open(vagasUrl, '_blank');
  const handleCurriculo = () => window.open(curriculoUrl, '_blank');

  return (
    <Reveal>
      <section className="relative rounded-[2rem] overflow-hidden bg-[#0F0820] p-8 md:p-14 text-white text-center">
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

        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs uppercase tracking-[0.2em] text-amber-100">
              Trabalhe conosco
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl leading-[1.1] tracking-tight">
            Interessado em se juntar ao nosso time?
          </h2>

          <p className="mt-5 text-white/65 text-base md:text-lg">
            Estamos sempre em busca de talentos excepcionais que compartilham
            nossa paixão pelo luxo e pela excelência no atendimento.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleVagas}
              className="inline-flex items-center justify-center gap-2 bg-amber-400 text-[#0F0820] font-medium px-7 py-3 rounded-full hover:bg-amber-300 hover:shadow-[0_0_40px_-5px_rgba(251,191,36,0.6)] transition-all"
            >
              Ver Vagas Abertas
            </button>
            <button
              onClick={handleCurriculo}
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white/90 hover:text-white hover:border-white/40 px-7 py-3 rounded-full transition-all"
            >
              <Send className="w-4 h-4" />
              Enviar Currículo
            </button>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
