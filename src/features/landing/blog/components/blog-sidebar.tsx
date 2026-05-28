'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { brokerUrls } from '@/features/landing/broker-home/lib/broker-urls';
import type { BlogPostCard, PostsMeta } from '../services/blog-service';
import { POST_IMAGE_FALLBACK, formatPostDate } from '../lib/format';

interface BlogSidebarProps {
  brokerSlug: string;
  brandName: string;
  meta?: PostsMeta;
  recent: BlogPostCard[];
  category: string | null;
  tag: string | null;
  whatsappUrl?: string;
  onCategory: (value: string | null) => void;
  onTag: (value: string | null) => void;
}

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#0F0820]/5 p-6">
      <h3 className="font-display text-lg text-[#0F0820] mb-4">{title}</h3>
      {children}
    </div>
  );
}

export function BlogSidebar({
  brokerSlug,
  brandName,
  meta,
  recent,
  category,
  tag,
  whatsappUrl,
  onCategory,
  onTag,
}: BlogSidebarProps) {
  const categories = meta?.categories ?? [];
  const tags = meta?.popular_tags ?? [];

  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
      {categories.length > 0 && (
        <SidebarCard title="Categorias">
          <ul className="space-y-1">
            {categories.map(c => (
              <li key={c.name}>
                <button
                  type="button"
                  onClick={() => {
                    onTag(null);
                    onCategory(category === c.name ? null : c.name);
                  }}
                  className={`w-full flex items-center justify-between py-2 text-sm border-b border-[#0F0820]/5 last:border-0 transition-colors ${
                    category === c.name
                      ? 'text-[#9747FF] font-medium'
                      : 'text-[#555] hover:text-[#0F0820]'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-xs text-[#999]">{c.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </SidebarCard>
      )}

      {recent.length > 0 && (
        <SidebarCard title="Artigos recentes">
          <div className="space-y-4">
            {recent.slice(0, 4).map(p => (
              <Link
                key={p.id}
                href={brokerUrls(brokerSlug).article(p.slug)}
                className="group flex gap-3"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <Image
                    src={p.thumbnail_url || p.image_url || POST_IMAGE_FALLBACK}
                    alt={p.title}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[#0F0820] leading-snug line-clamp-2 group-hover:text-[#9747FF] transition-colors">
                    {p.title}
                  </p>
                  {p.published_at && (
                    <p className="mt-1 text-[11px] text-[#999]">
                      {formatPostDate(p.published_at)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </SidebarCard>
      )}

      {tags.length > 0 && (
        <SidebarCard title="Tags populares">
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <button
                key={t.name}
                type="button"
                onClick={() => {
                  onCategory(null);
                  onTag(tag === t.name ? null : t.name);
                }}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  tag === t.name
                    ? 'bg-[#9747FF] text-white'
                    : 'bg-[#FAFAF7] text-[#555] hover:bg-[#9747FF]/10 hover:text-[#9747FF]'
                }`}
              >
                #{t.name}
              </button>
            ))}
          </div>
        </SidebarCard>
      )}

      <div className="bg-[#0F0820] text-white rounded-2xl p-6">
        <h3 className="font-display text-lg mb-2">Fale com a {brandName}</h3>
        <p className="text-sm text-white/60 mb-5">
          Pronto para encontrar seu próximo imóvel? Nossa equipe está à disposição.
        </p>
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-300 text-[#0F0820] text-sm font-medium hover:bg-amber-200 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Falar no WhatsApp
          </a>
        ) : (
          <Link
            href={brokerUrls(brokerSlug).listing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-300 text-[#0F0820] text-sm font-medium hover:bg-amber-200 transition-colors"
          >
            Ver imóveis
          </Link>
        )}
      </div>
    </aside>
  );
}
