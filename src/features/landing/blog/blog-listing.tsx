'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PremiumHeader } from '@/features/landing/broker-home/components/premium-header';
import { PremiumFooter } from '@/features/landing/broker-home/components/premium-footer';
import { FloatingWhatsapp } from '@/features/landing/broker-home/components/floating-whatsapp';
import { WhatsappProvider } from '@/features/landing/broker-home/hooks/whatsapp-context';
import {
  buildWhatsappUrl,
  resolveWhatsappMessage,
  useBrokerHomeData,
} from '@/features/landing/broker-home/hooks/use-broker-home-data';
import {
  Reveal,
  Stagger,
  StaggerItem,
} from '@/features/landing/broker-home/components/primitives/reveal';
import {
  usePostsMeta,
  usePublicPosts,
  type BlogSort,
} from './services/blog-service';
import { BlogHero } from './components/blog-hero';
import { BlogFilters } from './components/blog-filters';
import { BlogSidebar } from './components/blog-sidebar';
import { FeaturedArticle } from './components/featured-article';
import { ArticleCard } from './components/article-card';
import {
  ArticleGridSkeleton,
  BlogEmptyState,
  BlogErrorState,
} from './components/blog-states';

interface BlogListingProps {
  brokerSlug: string;
}

const VALID_SORTS: BlogSort[] = ['recent', 'most_read', 'featured'];

export function BlogListing({ brokerSlug }: BlogListingProps) {
  const meta = useBrokerHomeData(brokerSlug);
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const q = searchParams.get('q') ?? '';
  const sortParam = searchParams.get('sort') as BlogSort | null;
  const sort: BlogSort = sortParam && VALID_SORTS.includes(sortParam) ? sortParam : 'recent';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const [searchInput, setSearchInput] = useState(q);

  const updateParams = useCallback(
    (changes: Record<string, string | null>, resetPage = true) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === '') next.delete(key);
        else next.set(key, value);
      });
      if (resetPage) next.delete('page');
      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Debounce da busca textual → URL
  useEffect(() => {
    if (searchInput === q) return;
    const id = setTimeout(() => updateParams({ q: searchInput || null }), 400);
    return () => clearTimeout(id);
  }, [searchInput, q, updateParams]);

  const filters = useMemo(
    () => ({
      category: category ?? undefined,
      tag: tag ?? undefined,
      q: q || undefined,
      sort,
      page,
      per_page: 9,
    }),
    [category, tag, q, sort, page]
  );

  const postsQuery = usePublicPosts(brokerSlug, filters);
  const metaQuery = usePostsMeta(brokerSlug);
  const recentQuery = usePublicPosts(brokerSlug, { sort: 'recent', per_page: 4 });

  const posts = postsQuery.data?.data ?? [];
  const pagination = postsQuery.data?.meta;

  const noFilters = !category && !tag && !q;
  const showFeatured = noFilters && page === 1 && posts.length > 0;
  const featured = showFeatured ? posts[0] : null;
  const gridPosts = showFeatured ? posts.slice(1) : posts;

  const whatsappUrl = meta.whatsappNumber
    ? buildWhatsappUrl(
        meta.whatsappNumber,
        resolveWhatsappMessage(meta.whatsappTemplates, 'default')
      )
    : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `Blog ${meta.brandName}`,
    description: 'Insights e tendências do mercado imobiliário premium.',
    blogPost: posts.map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      datePublished: p.published_at,
      author: p.author_name ?? meta.brandName,
    })),
  };

  return (
    <WhatsappProvider number={meta.whatsappNumber} templates={meta.whatsappTemplates}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#FAFAF7] text-[#0F0820]">
        <PremiumHeader
          brandName={meta.brandName}
          brandLogo={meta.brandLogo}
          brokerSlug={meta.brokerSlug}
          whatsappNumber={meta.whatsappNumber}
          menu={meta.menu}
          theme="dark"
        />

        <BlogHero brokerSlug={brokerSlug} brandName={meta.brandName} />

        <main className="container mx-auto px-4 md:px-8 py-12 md:py-16">
          <Reveal>
            <BlogFilters
              meta={metaQuery.data}
              search={searchInput}
              category={category}
              tag={tag}
              sort={sort}
              onSearch={setSearchInput}
              onCategory={value => updateParams({ category: value })}
              onTag={value => updateParams({ tag: value })}
              onSort={value => updateParams({ sort: value })}
            />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 mt-10">
            <div>
              {featured && (
                <Reveal className="mb-10">
                  <FeaturedArticle post={featured} brokerSlug={brokerSlug} />
                </Reveal>
              )}

              {postsQuery.isLoading ? (
                <ArticleGridSkeleton count={6} />
              ) : postsQuery.isError ? (
                <BlogErrorState onRetry={() => postsQuery.refetch()} />
              ) : gridPosts.length === 0 && !featured ? (
                <BlogEmptyState />
              ) : (
                <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gridPosts.map(post => (
                    <StaggerItem key={post.id}>
                      <ArticleCard post={post} brokerSlug={brokerSlug} />
                    </StaggerItem>
                  ))}
                </Stagger>
              )}

              {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => updateParams({ page: String(page - 1) }, false)}
                    className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-[#0F0820]/10 text-[#555] hover:border-[#9747FF] hover:text-[#9747FF] disabled:opacity-30 disabled:hover:border-[#0F0820]/10 transition-colors"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: pagination.last_page }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => updateParams({ page: String(p) }, false)}
                        className={`w-10 h-10 inline-flex items-center justify-center rounded-full text-sm transition-colors ${
                          p === page
                            ? 'bg-[#0F0820] text-white'
                            : 'border border-[#0F0820]/10 text-[#555] hover:border-[#9747FF]'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    disabled={page >= pagination.last_page}
                    onClick={() => updateParams({ page: String(page + 1) }, false)}
                    className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-[#0F0820]/10 text-[#555] hover:border-[#9747FF] hover:text-[#9747FF] disabled:opacity-30 disabled:hover:border-[#0F0820]/10 transition-colors"
                    aria-label="Próxima página"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <BlogSidebar
              brokerSlug={brokerSlug}
              brandName={meta.brandName}
              meta={metaQuery.data}
              recent={recentQuery.data?.data ?? []}
              category={category}
              tag={tag}
              whatsappUrl={whatsappUrl}
              onCategory={value => updateParams({ category: value })}
              onTag={value => updateParams({ tag: value })}
            />
          </div>
        </main>

        <PremiumFooter data={meta.footer} />
        <FloatingWhatsapp />
      </div>
    </WhatsappProvider>
  );
}
