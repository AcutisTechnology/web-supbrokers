'use client';

interface ArticleContentProps {
  html: string | null;
}

/**
 * Renderiza o corpo do artigo (HTML autorado no admin), seguindo o mesmo
 * padrão de SitePageContent (prose). Tipografia editorial premium.
 */
export function ArticleContent({ html }: ArticleContentProps) {
  if (!html) {
    return (
      <p className="text-[#777]">Conteúdo em breve.</p>
    );
  }

  return (
    <article
      className="prose prose-lg prose-neutral max-w-none
        prose-headings:font-display prose-headings:text-[#0F0820] prose-headings:tracking-tight
        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
        prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-3
        prose-p:text-[#333] prose-p:leading-[1.85]
        prose-a:text-[#9747FF] prose-a:no-underline hover:prose-a:underline
        prose-strong:text-[#0F0820]
        prose-blockquote:border-l-4 prose-blockquote:border-amber-300 prose-blockquote:bg-[#FAFAF7]
        prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-6
        prose-blockquote:not-italic prose-blockquote:font-display prose-blockquote:text-xl prose-blockquote:text-[#0F0820]
        prose-img:rounded-2xl prose-img:shadow-lg
        prose-li:text-[#333] prose-li:marker:text-[#9747FF]
        [&_.lead]:text-xl [&_.lead]:text-[#555] [&_.lead]:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
