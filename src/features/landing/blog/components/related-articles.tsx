'use client';

import { Reveal, Stagger, StaggerItem } from '@/features/landing/broker-home/components/primitives/reveal';
import type { BlogPostCard } from '../services/blog-service';
import { ArticleCard } from './article-card';

interface RelatedArticlesProps {
  posts: BlogPostCard[];
  brokerSlug: string;
}

export function RelatedArticles({ posts, brokerSlug }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-[#FAFAF7] border-t border-[#0F0820]/5">
      <div className="container mx-auto px-4 md:px-8">
        <Reveal>
          <h2 className="font-display text-3xl md:text-4xl text-[#0F0820] tracking-tight mb-10">
            Artigos relacionados
          </h2>
        </Reveal>
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map(post => (
            <StaggerItem key={post.id}>
              <ArticleCard post={post} brokerSlug={brokerSlug} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
