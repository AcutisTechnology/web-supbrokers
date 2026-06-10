'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { brokerUrls } from '@/features/landing/broker-home/lib/broker-urls';
import type { BlogPostCard } from '../services/blog-service';
import { POST_IMAGE_FALLBACK, formatPostDate } from '../lib/format';

interface FeaturedArticleProps {
  post: BlogPostCard;
  brokerSlug: string;
}

const isExternal = (href: string | null) => !!href && /^https?:\/\//.test(href);

export function FeaturedArticle({ post, brokerSlug }: FeaturedArticleProps) {
  const external = isExternal(post.link_url);
  const href = post.link_url || brokerUrls(brokerSlug).article(post.slug);
  const image = post.image_url || post.thumbnail_url || POST_IMAGE_FALLBACK;

  const inner = (
    <motion.article
      whileHover="hover"
      initial="rest"
      className="group grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] overflow-hidden bg-[#0F0820] text-white"
    >
      <div className="relative aspect-[16/11] lg:aspect-auto lg:min-h-[440px] overflow-hidden order-1 lg:order-2">
        <motion.div
          variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={image}
            alt={post.title}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0820]/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0F0820] lg:via-[#0F0820]/20 lg:to-transparent" />
      </div>

      <div className="order-2 lg:order-1 p-8 md:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] mb-5">
          <span className="px-3 py-1 rounded-full bg-amber-300 text-[#0F0820] font-medium">
            Em destaque
          </span>
          {post.category && <span className="text-white/60">{post.category}</span>}
        </div>

        <h2 className="font-display text-3xl md:text-4xl xl:text-5xl leading-[1.1] tracking-tight">
          {post.title}
        </h2>

        {(post.subtitle || post.excerpt) && (
          <p className="mt-5 text-white/70 text-base md:text-lg leading-relaxed max-w-xl">
            {post.subtitle || post.excerpt}
          </p>
        )}

        <div className="mt-8 flex items-center gap-4 text-sm text-white/60">
          {post.author_name && <span>{post.author_name}</span>}
          {post.published_at && (
            <>
              <span className="text-white/30">•</span>
              <span>{formatPostDate(post.published_at)}</span>
            </>
          )}
          {post.reading_time && (
            <>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.reading_time}
              </span>
            </>
          )}
        </div>

        <div className="mt-8">
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0F0820] text-sm font-medium group-hover:bg-amber-300 transition-colors">
            Ler artigo
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </motion.article>
  );

  if (external) {
    return (
      <a href={post.link_url!} target="_blank" rel="noreferrer" className="block">
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className="block">
      {inner}
    </Link>
  );
}
