'use client';

import { useEffect } from 'react';

interface DynamicSeoProps {
  title?: string | null;
  description?: string | null;
  ogImage?: string | null;
}

/**
 * Aplica title + meta description + OG tags no client.
 * Interim para as rotas client-side de preview — quando migrarmos as
 * páginas para server components, trocamos por generateMetadata (SSR real
 * indexável). Aqui garante título/preview corretos ao navegar e compartilhar.
 */
export function DynamicSeo({ title, description, ogImage }: DynamicSeoProps) {
  useEffect(() => {
    if (title) document.title = title;

    const ensureMeta = (selector: string, attr: 'name' | 'property', key: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      return el;
    };

    if (description) {
      ensureMeta('meta[name="description"]', 'name', 'description').setAttribute(
        'content',
        description
      );
      ensureMeta('meta[property="og:description"]', 'property', 'og:description').setAttribute(
        'content',
        description
      );
    }
    if (title) {
      ensureMeta('meta[property="og:title"]', 'property', 'og:title').setAttribute(
        'content',
        title
      );
    }
    if (ogImage) {
      ensureMeta('meta[property="og:image"]', 'property', 'og:image').setAttribute(
        'content',
        ogImage
      );
    }
  }, [title, description, ogImage]);

  return null;
}
