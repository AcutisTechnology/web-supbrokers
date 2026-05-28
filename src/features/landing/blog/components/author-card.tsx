'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Facebook, Instagram, Linkedin, UserCircle2 } from 'lucide-react';
import { brokerUrls } from '@/features/landing/broker-home/lib/broker-urls';
import type { BlogAuthor } from '../services/blog-service';

interface AuthorCardProps {
  author: BlogAuthor;
  brokerSlug: string;
  compact?: boolean;
}

export function AuthorCard({ author, brokerSlug, compact }: AuthorCardProps) {
  const socials = [
    { key: 'instagram', url: author.instagram, icon: Instagram },
    { key: 'facebook', url: author.facebook, icon: Facebook },
    { key: 'linkedin', url: author.linkedin, icon: Linkedin },
  ].filter(s => !!s.url);

  return (
    <div className="bg-white rounded-2xl border border-[#0F0820]/5 p-6">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#9747FF] mb-4">
        Sobre o autor
      </p>
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-[#0F0820]/10">
          {author.photo_url ? (
            <Image
              src={author.photo_url}
              alt={author.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#9747FF]/50">
              <UserCircle2 className="w-8 h-8" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg text-[#0F0820] leading-tight">
            {author.name}
          </p>
          {(author.role_title || author.specialty) && (
            <p className="text-sm text-[#777]">
              {author.role_title || author.specialty}
            </p>
          )}
        </div>
      </div>

      {!compact && (author.mini_bio || author.full_bio) && (
        <p className="mt-4 text-sm text-[#555] leading-relaxed line-clamp-4">
          {author.mini_bio || author.full_bio}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between">
        <Link
          href={brokerUrls(brokerSlug).agent(author.slug)}
          className="inline-flex items-center gap-1.5 text-sm text-[#9747FF] font-medium hover:gap-2.5 transition-all"
        >
          Ver perfil
          <ArrowRight className="w-4 h-4" />
        </Link>
        {socials.length > 0 && (
          <div className="flex items-center gap-2">
            {socials.map(s => {
              const Icon = s.icon;
              return (
                <a
                  key={s.key}
                  href={s.url!}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.key}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-[#0F0820]/10 text-[#777] hover:border-[#9747FF] hover:text-[#9747FF] transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
