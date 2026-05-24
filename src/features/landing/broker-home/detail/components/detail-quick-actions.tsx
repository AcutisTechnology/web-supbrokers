'use client';

import { Calendar, Check, Copy, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useFavorites } from '../../hooks/use-favorites';
import { buildWhatsappUrl } from '../../hooks/use-broker-home-data';

interface DetailQuickActionsProps {
  propertyId: string;
  title: string;
  whatsappNumber: string;
  onScheduleVisit?: () => void;
}

export function DetailQuickActions({
  propertyId,
  title,
  whatsappNumber,
  onScheduleVisit,
}: DetailQuickActionsProps) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(propertyId);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsapp = () => {
    const message = `Olá! Tenho interesse no imóvel "${title}". Pode me passar mais informações?`;
    window.open(buildWhatsappUrl(whatsappNumber, message), '_blank');
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ActionPrimary
        icon={<MessageCircle className="w-4 h-4" />}
        label="Falar no WhatsApp"
        onClick={handleWhatsapp}
      />
      <ActionGhost
        icon={<Calendar className="w-4 h-4" />}
        label="Agendar visita"
        onClick={onScheduleVisit}
      />
      <div className="ml-auto flex items-center gap-1.5">
        <ActionIcon
          icon={
            <Heart
              className={`w-4 h-4 transition-colors ${
                fav ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          }
          label="Favoritar"
          onClick={() => toggle(propertyId)}
          active={fav}
        />
        <ActionIcon
          icon={
            copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />
          }
          label={copied ? 'Copiado!' : 'Copiar link'}
          onClick={handleCopyLink}
        />
        <ActionIcon
          icon={<Share2 className="w-4 h-4" />}
          label="Compartilhar"
          onClick={handleShare}
        />
      </div>
    </div>
  );
}

function ActionPrimary({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-emerald-500 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-emerald-400 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] transition-all"
    >
      {icon}
      {label}
    </button>
  );
}

function ActionGhost({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-white border border-black/10 text-[#0F0820]/80 text-sm font-medium px-5 py-2.5 rounded-full hover:border-[#0F0820]/30 hover:text-[#0F0820] transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}

function ActionIcon({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
        active
          ? 'border-rose-500/30 bg-rose-50 text-rose-500'
          : 'border-black/10 text-[#0F0820]/70 hover:border-[#0F0820]/30 hover:text-[#0F0820]'
      }`}
    >
      {icon}
    </button>
  );
}
