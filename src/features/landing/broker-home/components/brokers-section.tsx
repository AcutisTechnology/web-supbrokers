'use client';

import { useBrokerAgents } from '@/features/landing/services/agents-service';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { mockBrokers } from '../data/mock';
import { brokerUrls } from '../lib/broker-urls';
import { Reveal, Stagger, StaggerItem } from './primitives/reveal';

interface BrokersSectionProps {
  brokerSlug?: string | null;
}

interface BrokerCardItem {
  id: string | number;
  name: string;
  role: string;
  specialty: string;
  photo: string;
  whatsapp: string | null;
  instagram: string | null;
  href: string | null;
}

const PHOTO_FALLBACK =
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=800&q=80';

export function BrokersSection({ brokerSlug }: BrokersSectionProps) {
  const agentsQuery = useBrokerAgents(brokerSlug ?? '');

  // Com broker: corretores reais (até 4). Sem broker (demo): mock.
  let items: BrokerCardItem[];
  if (brokerSlug) {
    const agents = agentsQuery.data ?? [];
    if (agents.length === 0) return null; // sem equipe cadastrada → oculta a seção
    items = agents.slice(0, 4).map(a => ({
      id: a.id,
      name: a.name,
      role: a.role_title ?? '',
      specialty: a.specialty ?? '',
      photo: a.photo_url || PHOTO_FALLBACK,
      whatsapp: a.whatsapp,
      instagram: a.instagram,
      href: brokerUrls(brokerSlug).agent(a.slug),
    }));
  } else {
    items = mockBrokers.map(b => ({
      id: b.id,
      name: b.name,
      role: b.role,
      specialty: b.specialty,
      photo: b.photo,
      whatsapp: b.whatsapp,
      instagram: b.instagram,
      href: null,
    }));
  }

  return (
    <section id="corretores" className="py-24 md:py-28 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs tracking-[0.25em] uppercase text-[#9747FF] mb-3">
              Nossa equipe
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-[#0F0820] tracking-tight leading-tight">
              Especialistas que <span className="italic">entendem</span> você.
            </h2>
            <p className="mt-4 text-[#777] text-base md:text-lg">
              Um time selecionado a dedo para garantir uma experiência impecável.
            </p>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {items.map(b => (
            <StaggerItem key={b.id}>
              <motion.div
                whileHover="hover"
                initial="rest"
                className="group relative bg-[#FAFAF7] rounded-3xl overflow-hidden"
              >
                {b.href && (
                  <Link
                    href={b.href}
                    aria-label={`Ver perfil de ${b.name}`}
                    className="absolute inset-0 z-[1]"
                  />
                )}

                <div className="relative aspect-[3/4] overflow-hidden bg-[#0F0820]">
                  <motion.div
                    variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={b.photo}
                      alt={b.name}
                      fill
                      sizes="(max-width:768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0820] via-transparent to-transparent opacity-90" />

                  {/* Social hover */}
                  <motion.div
                    variants={{
                      rest: { y: 20, opacity: 0 },
                      hover: { y: 0, opacity: 1 },
                    }}
                    transition={{ duration: 0.4 }}
                    className="absolute bottom-4 right-4 z-10 flex gap-2"
                  >
                    {b.whatsapp && (
                      <a
                        href={`https://wa.me/${b.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="w-10 h-10 rounded-full bg-emerald-400 text-[#0F0820] flex items-center justify-center hover:scale-110 transition-transform"
                        aria-label="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    {b.instagram && (
                      <a
                        href={
                          b.instagram.startsWith('http')
                            ? b.instagram
                            : `https://instagram.com/${b.instagram.replace('@', '')}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="w-10 h-10 rounded-full bg-white text-[#0F0820] flex items-center justify-center hover:scale-110 transition-transform"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                  </motion.div>
                </div>

                <div className="p-5">
                  {b.role && (
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#9747FF]">
                      {b.role}
                    </p>
                  )}
                  <h3 className="font-display text-xl text-[#0F0820] mt-1">{b.name}</h3>
                  {b.specialty && (
                    <p className="text-xs text-[#777] mt-1">{b.specialty}</p>
                  )}
                  <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-end text-xs">
                    <span className="inline-flex items-center gap-1 text-[#9747FF] font-medium">
                      Ver perfil
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
