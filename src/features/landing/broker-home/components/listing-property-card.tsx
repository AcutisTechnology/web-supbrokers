'use client';

import { motion } from 'framer-motion';
import { Bath, BedDouble, Car, Heart, Maximize2, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Badge, MockProperty } from '../data/mock';
import { useFavorites } from '../hooks/use-favorites';
import { useWhatsapp } from '../hooks/whatsapp-context';
import { brokerUrls } from '../lib/broker-urls';

interface ListingPropertyCardProps {
  property: MockProperty;
  whatsappNumber?: string;
  brokerSlug?: string | null;
}

const BADGE_LABEL: Record<Badge, string> = {
  destaque: 'Destaque',
  luxo: 'Luxo',
  oportunidade: 'Oportunidade',
  lancamento: 'Lançamento',
  exclusivo: 'Exclusivo',
};

const BADGE_STYLES: Record<Badge, string> = {
  destaque: 'bg-amber-400 text-[#0F0820]',
  luxo: 'bg-gradient-to-r from-amber-300 to-amber-500 text-[#0F0820]',
  oportunidade: 'bg-emerald-400 text-[#0F0820]',
  lancamento: 'bg-rose-400 text-[#0F0820]',
  exclusivo: 'bg-[#0F0820] text-amber-300 border border-amber-300/40',
};

export function ListingPropertyCard({
  property,
  whatsappNumber,
  brokerSlug,
}: ListingPropertyCardProps) {
  const { isFavorite, toggle } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const fav = isFavorite(property.id);
  const { url: whatsappUrl } = useWhatsapp('interest_property', {
    property: { title: property.title },
  });

  const detailHref = brokerSlug
    ? brokerUrls(brokerSlug).property(property.id)
    : '#';

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `${property.title} — ${property.neighborhood}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: property.title, text, url });
      } catch {
        // user cancelled
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleWhatsapp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!whatsappNumber) return;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-black/[0.05] shadow-[0_2px_20px_-12px_rgba(15,8,32,0.1)] hover:shadow-[0_30px_50px_-20px_rgba(15,8,32,0.25)] transition-shadow duration-500 flex flex-col"
    >
      <Link
        href={detailHref}
        aria-label={`Ver detalhes de ${property.title}`}
        className="absolute inset-0 z-[1]"
      />
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
        )}
        <Image
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
          className={`object-cover transition-all duration-700 group-hover:scale-[1.06] ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[70%]">
          <span
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase ${
              property.type === 'sale'
                ? 'bg-[#0F0820] text-white'
                : 'bg-white text-[#0F0820] shadow-sm'
            }`}
          >
            {property.type === 'sale' ? 'Venda' : 'Aluguel'}
          </span>
          {property.badges.slice(0, 1).map(b => (
            <span
              key={b}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase ${BADGE_STYLES[b]}`}
            >
              {BADGE_LABEL[b]}
            </span>
          ))}
        </div>

        {/* Heart top-right */}
        <button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            toggle(property.id);
          }}
          aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center hover:bg-white shadow-md transition-transform hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              fav ? 'fill-rose-500 text-rose-500' : 'text-[#0F0820]'
            }`}
          />
        </button>

        {/* Hover actions bottom */}
        <div className="absolute bottom-3 right-3 z-10 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {whatsappNumber && (
            <button
              onClick={handleWhatsapp}
              aria-label="WhatsApp rápido"
              className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-400 shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleShare}
            aria-label="Compartilhar"
            className="w-9 h-9 rounded-full bg-white/95 backdrop-blur text-[#0F0820] flex items-center justify-center hover:bg-white shadow-md"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-4 md:p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#0F0820]/50 font-medium">
          {property.neighborhood}
          {property.city && `, ${shortState(property.city)}`}
        </p>
        <h3 className="font-display text-lg md:text-xl text-[#0F0820] mt-1 leading-snug line-clamp-2">
          {property.title}
        </h3>

        {/* Specs */}
        <div className="mt-3 flex items-center gap-4 text-xs text-[#0F0820]/65">
          {property.bedrooms > 0 && (
            <Spec icon={<BedDouble className="w-3.5 h-3.5" />} value={property.bedrooms} />
          )}
          {property.bathrooms > 0 && (
            <Spec icon={<Bath className="w-3.5 h-3.5" />} value={property.bathrooms} />
          )}
          {property.garages > 0 && (
            <Spec icon={<Car className="w-3.5 h-3.5" />} value={property.garages} />
          )}
          {property.size > 0 && (
            <Spec
              icon={<Maximize2 className="w-3.5 h-3.5" />}
              value={`${property.size}m²`}
            />
          )}
        </div>

        {/* Price */}
        <div className="mt-4 pt-4 border-t border-black/[0.06]">
          <p className="font-display text-xl md:text-2xl text-[#0F0820] tracking-tight">
            R$ {property.price}
            {property.type === 'rent' && (
              <span className="text-sm text-[#0F0820]/50 font-sans"> /mês</span>
            )}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function Spec({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string | number;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-[#9747FF]">{icon}</span>
      <span className="font-medium text-[#0F0820]/80">{value}</span>
    </span>
  );
}

/**
 * Heurística: se vier uma cidade, exibe só a UF (após a vírgula) quando
 * encaixar; senão a cidade inteira. Mantém o card limpo na listagem.
 */
function shortState(city: string): string {
  // Já está em formato "São Paulo" → tenta abreviar conhecidas
  const map: Record<string, string> = {
    'São Paulo': 'SP',
    'Rio de Janeiro': 'RJ',
    'Belo Horizonte': 'MG',
    Brasília: 'DF',
    Salvador: 'BA',
    Fortaleza: 'CE',
    'Porto Alegre': 'RS',
    Curitiba: 'PR',
    Recife: 'PE',
  };
  return map[city] ?? city;
}
