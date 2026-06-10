import type { Property as ApiProperty } from '@/features/landing/services/broker-service';
import type { Badge, MockProperty } from '../data/mock';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80';

function deriveBadges(p: ApiProperty): Badge[] {
  const out: Badge[] = [];
  if (p.highlighted) out.push('destaque');

  // Heurística simples — quando houver campos próprios no backend
  // (`is_luxury`, `is_launch`, etc.) substituímos por verificações reais.
  const valueNumber = p.value_raw ?? parseFloat(p.value.replace(/[^\d,]/g, '').replace(',', '.'));
  if (valueNumber >= 5_000_000 && p.sale) out.push('luxo');

  return out;
}

/**
 * Converte o formato retornado pela API pública (`Property`) para o
 * formato visual usado nos cards (`MockProperty`).
 */
export function apiToCardProperty(p: ApiProperty): MockProperty {
  return {
    id: p.slug,
    title: p.title,
    neighborhood: p.neighborhood,
    city: p.city ?? '',
    price: p.value,
    type: p.sale ? 'sale' : 'rent',
    badges: deriveBadges(p),
    bedrooms: p.bedrooms,
    suites: p.suites,
    bathrooms: p.bathrooms,
    garages: p.garages,
    size: p.size,
    image: p.attachments[0]?.url ?? FALLBACK_IMAGE,
  };
}
