'use client';

import { motion } from 'framer-motion';
import { Award, ShieldCheck, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { DetailContactForm } from './detail-contact-form';

interface DetailSidebarProps {
  propertyTitle: string;
  propertySlug: string;
  type: 'sale' | 'rent';
  value: string;
  condominiumValue?: string | null;
  iptuValue?: string | null;
  brokerName: string;
  whatsappNumber: string;
  creci?: string | null;
  brokerPhoto?: string | null;
}

function isMeaningfulMoney(value?: string | null): boolean {
  if (!value) return false;
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return !Number.isNaN(num) && num > 0;
}

export function DetailSidebar({
  propertyTitle,
  propertySlug,
  type,
  value,
  condominiumValue,
  iptuValue,
  brokerName,
  whatsappNumber,
  creci,
  brokerPhoto,
}: DetailSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Card de preço */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl border border-black/[0.05] shadow-[0_20px_50px_-15px_rgba(15,8,32,0.12)] overflow-hidden"
      >
        <div className="p-6 border-b border-black/[0.05]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#0F0820]/50 font-medium">
            {type === 'sale' ? 'Valor à vista' : 'Aluguel mensal'}
          </p>
          <p className="font-display text-3xl md:text-4xl text-[#0F0820] tracking-tight mt-1">
            R$ {value}
            {type === 'rent' && (
              <span className="text-base font-sans text-[#0F0820]/50"> /mês</span>
            )}
          </p>

          {(isMeaningfulMoney(condominiumValue) || isMeaningfulMoney(iptuValue)) && (
            <div className="mt-4 pt-4 border-t border-black/[0.04] space-y-2">
              {isMeaningfulMoney(condominiumValue) && (
                <Row label="Condomínio" value={`R$ ${condominiumValue}/mês`} />
              )}
              {isMeaningfulMoney(iptuValue) && (
                <Row
                  label="IPTU"
                  value={
                    type === 'rent'
                      ? `R$ ${iptuValue}/mês`
                      : `R$ ${iptuValue}/ano`
                  }
                />
              )}
            </div>
          )}
        </div>

        {/* Broker compact */}
        <div className="p-6 bg-[#FAFAF7]">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-12 h-12 rounded-full bg-white overflow-hidden border border-black/5 flex items-center justify-center text-[#9747FF]">
              {brokerPhoto ? (
                <Image
                  src={brokerPhoto}
                  alt={brokerName}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#0F0820] truncate">{brokerName}</p>
              {creci && (
                <p className="text-xs text-[#0F0820]/55 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {creci}
                </p>
              )}
            </div>
          </div>

          <DetailContactForm
            propertyTitle={propertyTitle}
            propertySlug={propertySlug}
            whatsappNumber={whatsappNumber}
            variant="sidebar"
          />
        </div>
      </motion.div>

      {/* Selos de confiança */}
      <div className="bg-white rounded-2xl border border-black/[0.05] p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#0F0820]">
              Atendimento exclusivo
            </p>
            <p className="text-xs text-[#0F0820]/55 mt-0.5 leading-relaxed">
              Consultor dedicado, agenda flexível e total discrição em toda
              negociação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline text-sm">
      <span className="text-[#0F0820]/60">{label}</span>
      <span className="font-medium text-[#0F0820]">{value}</span>
    </div>
  );
}
