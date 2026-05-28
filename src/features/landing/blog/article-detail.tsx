'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Clock, Loader2, UserCircle2 } from 'lucide-react';
import { PremiumHeader } from '@/features/landing/broker-home/components/premium-header';
import { PremiumFooter } from '@/features/landing/broker-home/components/premium-footer';
import { FloatingWhatsapp } from '@/features/landing/broker-home/components/floating-whatsapp';
import { WhatsappProvider } from '@/features/landing/broker-home/hooks/whatsapp-context';
import {
  buildWhatsappUrl,
  resolveWhatsappMessage,
  useBrokerHomeData,
} from '@/features/landing/broker-home/hooks/use-broker-home-data';
import { DynamicSeo } from '@/features/landing/broker-home/components/dynamic-seo';
import { brokerUrls } from '@/features/landing/broker-home/lib/broker-urls';
import { usePublicPost } from './services/blog-service';
import { ArticleContent } from './components/article-content';
import { AuthorCard } from './components/author-card';
import { ShareButtons } from './components/share-buttons';
import { RelatedArticles } from './components/related-articles';
import { POST_IMAGE_FALLBACK, formatPostDate } from './lib/format';

interface ArticleDetailProps {
  brokerSlug: string;
  postSlug: string;
}

export function ArticleDetail({ brokerSlug, postSlug }: ArticleDetailProps) {
  const meta = useBrokerHomeData(brokerSlug);
  const { data: post, isLoading, error } = usePublicPost(brokerSlug, postSlug);

  const whatsappUrl = meta.whatsappNumber
    ? buildWhatsappUrl(
        meta.whatsappNumber,
        resolveWhatsappMessage(meta.whatsappTemplates, 'default')
      )
    : undefined;

  const jsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt ?? post.subtitle ?? '',
        image: post.image_url ?? undefined,
        datePublished: post.published_at ?? undefined,
        author: {
          '@type': post.author ? 'Person' : 'Organization',
          name: post.author?.name ?? meta.brandName,
        },
        publisher: { '@type': 'Organization', name: meta.brandName },
        articleSection: post.category ?? undefined,
        keywords: (post.tags ?? []).join(', '),
      }
    : null;

  return (
    <WhatsappProvider number={meta.whatsappNumber} templates={meta.whatsappTemplates}>
      {post && (
        <>
          <DynamicSeo
            title={post.seo_title || `${post.title} — ${meta.brandName}`}
            description={post.seo_description || post.excerpt || post.subtitle}
            ogImage={post.og_image_url || post.image_url}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </>
      )}

      <div className="min-h-screen bg-[#FAFAF7] text-[#0F0820]">
        <PremiumHeader
          brandName={meta.brandName}
          brandLogo={meta.brandLogo}
          brokerSlug={meta.brokerSlug}
          whatsappNumber={meta.whatsappNumber}
          menu={meta.menu}
          theme="light"
        />

        {isLoading ? (
          <div className="min-h-[60vh] flex items-center justify-center text-[#0F0820]/60">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Carregando…
          </div>
        ) : error || !post ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4 pt-24">
            <p className="font-display text-2xl text-[#0F0820]">Artigo não encontrado.</p>
            <Link href={brokerUrls(brokerSlug).blog} className="text-[#9747FF] underline">
              Voltar para o blog
            </Link>
          </div>
        ) : (
          <>
            {/* Hero editorial */}
            <header className="pt-28 md:pt-36 pb-10 md:pb-14">
              <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                <nav className="flex items-center gap-2 text-xs text-[#999] mb-8 flex-wrap">
                  <Link href={`/${brokerSlug}`} className="hover:text-[#0F0820]">
                    {meta.brandName}
                  </Link>
                  <ChevronRight className="w-3 h-3" />
                  <Link href={brokerUrls(brokerSlug).blog} className="hover:text-[#0F0820]">
                    Blog
                  </Link>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-[#555] truncate max-w-[200px]">{post.title}</span>
                </nav>

                {post.category && (
                  <Link
                    href={`${brokerUrls(brokerSlug).blog}?category=${encodeURIComponent(post.category)}`}
                    className="inline-block px-3 py-1 rounded-full bg-[#9747FF]/10 text-[#9747FF] text-[11px] uppercase tracking-[0.18em] font-medium mb-6"
                  >
                    {post.category}
                  </Link>
                )}

                <h1 className="font-display text-4xl md:text-5xl xl:text-6xl text-[#0F0820] tracking-tight leading-[1.08]">
                  {post.title}
                </h1>

                {post.subtitle && (
                  <p className="mt-6 text-xl text-[#555] leading-relaxed">{post.subtitle}</p>
                )}

                <div className="mt-8 flex items-center justify-between gap-4 flex-wrap border-t border-[#0F0820]/5 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-[#0F0820]/10">
                      {post.author?.photo_url ? (
                        <Image
                          src={post.author.photo_url}
                          alt={post.author.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#9747FF]/50">
                          <UserCircle2 className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="text-sm">
                      <p className="text-[#0F0820] font-medium">
                        {post.author?.name ?? meta.brandName}
                      </p>
                      <div className="flex items-center gap-2 text-[#999]">
                        {post.published_at && <span>{formatPostDate(post.published_at)}</span>}
                        {post.reading_time && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.reading_time}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <ShareButtons title={post.title} />
                </div>
              </div>
            </header>

            {/* Imagem principal */}
            <div className="container mx-auto px-4 md:px-8 max-w-5xl">
              <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden bg-gray-100">
                <Image
                  src={post.image_url || POST_IMAGE_FALLBACK}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 1024px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Conteúdo + sidebar */}
            <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
                <div>
                  <ArticleContent html={post.body} />

                  {post.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-[#0F0820]/5 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-[#777] mr-1">Tags:</span>
                      {post.tags.map(t => (
                        <Link
                          key={t}
                          href={`${brokerUrls(brokerSlug).blog}?tag=${encodeURIComponent(t)}`}
                          className="px-3 py-1 rounded-full bg-white border border-[#0F0820]/10 text-xs text-[#555] hover:border-[#9747FF] hover:text-[#9747FF] transition-colors"
                        >
                          #{t}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="mt-10 flex items-center gap-3 lg:hidden">
                    <span className="text-sm text-[#777]">Compartilhar:</span>
                    <ShareButtons title={post.title} />
                  </div>
                </div>

                <aside className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-24 self-start">
                  {post.author && (
                    <AuthorCard author={post.author} brokerSlug={brokerSlug} />
                  )}

                  <div className="bg-white rounded-2xl border border-[#0F0820]/5 p-6">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#9747FF] mb-4">
                      Compartilhar
                    </p>
                    <ShareButtons title={post.title} variant="stack" />
                  </div>

                  <div className="bg-[#0F0820] text-white rounded-2xl p-6">
                    <h3 className="font-display text-lg mb-2">Vamos conversar?</h3>
                    <p className="text-sm text-white/60 mb-5">
                      Encontre o imóvel ideal com a {meta.brandName}.
                    </p>
                    {whatsappUrl ? (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-300 text-[#0F0820] text-sm font-medium hover:bg-amber-200 transition-colors"
                      >
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
              </div>
            </div>

            <RelatedArticles posts={post.related} brokerSlug={brokerSlug} />
          </>
        )}

        <PremiumFooter data={meta.footer} />
        <FloatingWhatsapp />
      </div>
    </WhatsappProvider>
  );
}
