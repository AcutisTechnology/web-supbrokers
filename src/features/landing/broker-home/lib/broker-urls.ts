/**
 * URLs canônicas do site público do corretor.
 * O slug do corretor vem sempre do path (/[corretor]/...), não mais de query string.
 */
export function brokerUrls(slug: string) {
  const base = `/${slug}`;
  return {
    home: base,
    listing: `${base}/imoveis`,
    property: (propertySlug: string) => `${base}/imovel/${propertySlug}`,
    team: `${base}/equipe`,
    agent: (agentSlug: string) => `${base}/equipe/${agentSlug}`,
    blog: `${base}/blog`,
    article: (postSlug: string) => `${base}/blog/${postSlug}`,
    page: (pageSlug: string) => {
      const normalized = pageSlug.replace(/^\/+/, '');
      return normalized ? `${base}/p/${normalized}` : base;
    },
  };
}
