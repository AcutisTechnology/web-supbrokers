'use client';

import { buildWhatsappUrl } from '@/features/landing/broker-home/hooks/use-broker-home-data';
import type { PublicAgent } from '@/features/landing/services/agents-service';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Mail, MapPin, MessageCircle, Share2, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TeamAgentCardProps {
  agent: PublicAgent;
  detailHref: string;
}

const SPECIALTY_LABEL: Record<string, string> = {
  luxo: 'Luxo',
  lancamentos: 'Lançamentos',
  investimento: 'Investimento',
  destaque: 'Destaque',
};

const PHOTO_FALLBACK =
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=800&q=80';

function badgeStyle(slug: string): string {
  switch (slug) {
    case 'luxo':
      return 'bg-gradient-to-r from-amber-300 to-amber-500 text-[#0F0820]';
    case 'lancamentos':
      return 'bg-rose-400 text-[#0F0820]';
    case 'investimento':
      return 'bg-emerald-400 text-[#0F0820]';
    default:
      return 'bg-amber-400 text-[#0F0820]';
  }
}

export function TeamAgentCard({ agent, detailHref }: TeamAgentCardProps) {
  const photo = agent.photo_url || PHOTO_FALLBACK;
  const handleWhatsapp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!agent.whatsapp) return;
    const message = `Olá ${agent.name}! Encontrei seu perfil e gostaria de conversar.`;
    window.open(buildWhatsappUrl(agent.whatsapp, message), '_blank');
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!agent.email) return;
    window.location.href = `mailto:${agent.email}?subject=${encodeURIComponent('Contato via site')}`;
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}${detailHref}`;
    const text = `${agent.name} — ${agent.role_title ?? 'Corretor'}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: agent.name, text, url });
      } catch {
        // cancelled
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-black/[0.05] shadow-[0_4px_24px_-16px_rgba(15,8,32,0.15)] hover:shadow-[0_30px_60px_-20px_rgba(15,8,32,0.25)] transition-shadow duration-500 flex flex-col"
    >
      <Link
        href={detailHref}
        aria-label={`Ver perfil de ${agent.name}`}
        className="absolute inset-0 z-[1]"
      />

      {/* Photo */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0F0820]">
        <Image
          src={photo}
          alt={agent.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[1500ms] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0820]/30 via-transparent to-transparent" />

        {/* Detail link icon (visual cue) */}
        <div className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur text-[#0F0820] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl md:text-2xl text-[#0F0820] tracking-tight leading-tight">
            {agent.name}
          </h3>
          {agent.role_title && (
            <span className="inline-block shrink-0 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-200 mt-1">
              {agent.role_title}
            </span>
          )}
        </div>

        {agent.specialty && (
          <p className="text-sm text-[#0F0820]/65 mt-1">{agent.specialty}</p>
        )}

        {agent.mini_bio && (
          <p className="text-sm text-[#0F0820]/70 mt-4 leading-relaxed line-clamp-3">
            {agent.mini_bio}
          </p>
        )}

        {/* Meta linha */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#0F0820]/55">
          {agent.city && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {agent.city}
            </span>
          )}
          {agent.languages.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {agent.languages.slice(0, 2).join(', ')}
              {agent.languages.length > 2 && ` +${agent.languages.length - 2}`}
            </span>
          )}
          {agent.years_experience && (
            <span className="inline-flex items-center gap-1">
              <Users className="w-3 h-3" />
              {agent.years_experience} anos
            </span>
          )}
        </div>

        {/* Specialties */}
        {agent.specialties.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {agent.specialties.slice(0, 3).map(s => (
              <span
                key={s}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase ${badgeStyle(s)}`}
              >
                {SPECIALTY_LABEL[s] ?? s}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-5 flex items-center gap-2 border-t border-black/[0.05]">
          <button
            onClick={handleShare}
            aria-label="Compartilhar"
            className="relative z-10 w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-[#0F0820]/70 hover:text-[#0F0820] hover:border-[#0F0820]/30 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          {agent.email && (
            <button
              onClick={handleEmail}
              aria-label="Enviar email"
              className="relative z-10 w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-[#0F0820]/70 hover:text-[#0F0820] hover:border-[#0F0820]/30 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
            </button>
          )}
          {agent.whatsapp && (
            <button
              onClick={handleWhatsapp}
              className="relative z-10 ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-600 transition-colors"
            >
              WhatsApp
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
