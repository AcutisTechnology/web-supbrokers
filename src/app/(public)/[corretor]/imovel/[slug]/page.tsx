import type { Metadata } from 'next';
import { PropertyDetail } from '@/features/landing/broker-home/detail/property-detail';

interface PageParams {
  corretor: string;
  slug: string;
}

interface OgProperty {
  slug: string;
  title: string;
  description?: string | null;
  attachments?: { url: string }[];
}

// Busca o imóvel a partir do endpoint público do corretor (sem auth).
// Não há endpoint individual público, então derivamos do bucket "all".
async function fetchProperty(
  corretor: string,
  slug: string
): Promise<OgProperty | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${corretor}/properties`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const all: OgProperty[] = json?.data?.all ?? [];
    return all.find(p => p.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { corretor, slug } = await params;
  const property = await fetchProperty(corretor, slug);

  if (!property) {
    return { title: 'Imóvel não encontrado' };
  }

  const title = property.title;
  const description = (property.description ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
  const image = property.attachments?.[0]?.url;
  const url = `/${corretor}/imovel/${slug}`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Imoobile',
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function CorretorImovel({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { corretor, slug } = await params;
  return <PropertyDetail brokerSlug={corretor} propertySlug={slug} />;
}
