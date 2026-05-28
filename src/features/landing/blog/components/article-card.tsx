'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { brokerUrls } from '@/features/landing/broker-home/lib/broker-urls';
import type { BlogPostCard } from '../services/blog-service';
import { POST_IMAGE_FALLBACK, formatPostDate } from '../lib/format';

interface ArticleCardProps {
  post: BlogPostCard;
  brokerSlug: string;
  priority?: boolean;
}

const isExternal = (href: string | null) => !!href && /^https?:\/\//.test(href);

export function ArticleCard({ post, brokerSlug, priority }: ArticleCardProps) {
  const external = isExternal(post.link_url);
  const href = post.link_url || brokerUrls(brokerSlug).article(post.slug);
  const image = post.thumbnail_url || post.image_url || POST_IMAGE_FALLBACK;

  const inner = (
    <motion.article
      whileHover="hover"
      initial="rest"
      className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-[#0F0820]/5 hover:shadow-[0_30px_60px_-25px_rgba(15,8,32,0.25)] transition-shadow"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.div
          variants={{ rest: { scale: 1 }, hover: { scale: 1.07 } }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={image}
            alt={post.title}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover"
            loading={priority ? 'eager' : 'lazy'}
          />
        </motion.div>
        {post.category && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] uppercase tracking-[0.18em] text-[#0F0820] font-medium">
            {post.category}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-display text-xl text-[#0F0820] leading-snug line-clamp-2 group-hover:text-[#9747FF] transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-3 text-sm text-[#555] leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto pt-5 flex items-center justify-between text-[12px] text-[#777]">
          <div className="flex items-center gap-2 min-w-0">
            {post.author_name && (
              <span className="truncate">{post.author_name}</span>
            )}
            {post.published_at && (
              <>
                <span className="text-[#ccc]">•</span>
                <span className="whitespace-nowrap">{formatPostDate(post.published_at)}</span>
              </>
            )}
          </div>
          {post.reading_time && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Clock className="w-3 h-3" />
              {post.reading_time}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[#9747FF] text-sm font-medium">
          Ler artigo
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </motion.article>
  );

  if (external) {
    return (
      <a href={post.link_url!} target="_blank" rel="noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  );
}
