'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  type PropertyType,
} from '@/features/dashboard/imoveis/novo/schemas/property-schema';
import type { BrokerSearchFilters } from '@/features/landing/services/broker-service';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { mockBrand } from '../data/mock';
import { useSearchFilters } from '../hooks/use-search-filters';
import { AutocompleteDark } from './primitives/autocomplete-dark';
import { DualRangeSlider } from './primitives/dual-range-slider';

interface PremiumHeroProps {
  brokerSlug: string | null;
  brandTagline?: string;
  brandSubtitle?: string;
  neighborhoodSuggestions: string[];
  citySuggestions: string[];
}

const PURPOSE_TABS = [
  { value: 'sale' as const, label: 'Comprar' },
  { value: 'rent' as const, label: 'Alugar' },
  { value: 'both' as const, label: 'Todos' },
];

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    const v = (value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1);
    return `R$ ${v}M`;
  }
  if (value >= 1_000) {
    return `R$ ${Math.round(value / 1_000)}k`;
  }
  return `R$ ${value}`;
}

export function PremiumHero({
  brokerSlug,
  brandTagline,
  brandSubtitle,
  neighborhoodSuggestions,
  citySuggestions,
}: PremiumHeroProps) {
  const router = useRouter();
  const { filters, setFilter, buildSearchPath, clearFilters, filtersCount } =
    useSearchFilters();

  const [moreOpen, setMoreOpen] = useState(false);

  // Sugestões mescladas (cidade + bairro) para o campo "Onde"
  const locationSuggestions = useMemo(() => {
    const all = [...citySuggestions, ...neighborhoodSuggestions];
    return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
  }, [citySuggestions, neighborhoodSuggestions]);

  // Campo "Onde" combina city e neighborhood — guardamos no campo `q`
  // (busca textual). Quando o usuário escolhe uma sugestão exata,
  // tentamos rotear pra cidade ou bairro.
  const locationValue =
    (filters.city as string | undefined) ||
    (filters.neighborhood as string | undefined) ||
    (filters.q as string | undefined) ||
    '';

  const setLocation = (value: string) => {
    if (!value) {
      setFilter('q', undefined);
      setFilter('city', undefined);
      setFilter('neighborhood', undefined);
      return;
    }
    const matchesCity = citySuggestions.some(
      c => c.toLowerCase() === value.toLowerCase()
    );
    const matchesNeighborhood = neighborhoodSuggestions.some(
      n => n.toLowerCase() === value.toLowerCase()
    );
    if (matchesCity) {
      setFilter('city', value);
      setFilter('neighborhood', undefined);
      setFilter('q', undefined);
    } else if (matchesNeighborhood) {
      setFilter('neighborhood', value);
      setFilter('city', undefined);
      setFilter('q', undefined);
    } else {
      setFilter('q', value);
      setFilter('city', undefined);
      setFilter('neighborhood', undefined);
    }
  };

  const handleSubmit = () => {
    const basePath = brokerSlug
      ? `/${brokerSlug}/imoveis/buscar`
      : `/preview-home/buscar`;
    const url = buildSearchPath(basePath, filters);
    router.push(url);
  };

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=80"
          alt="Imóvel de luxo"
          fill
          priority
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0820]/85 via-[#0F0820]/55 to-[#0F0820]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0820]/70 via-transparent to-transparent" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-500/15 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 pt-32 pb-20">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-white text-5xl md:text-7xl leading-[1.05] tracking-tight"
          >
            {brandTagline ? (
              brandTagline
            ) : (
              <>
                Onde o luxo encontra
                <br />
                <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent">
                  o seu novo lar.
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed"
          >
            {brandSubtitle ?? mockBrand.subtitle}
          </motion.p>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-12 max-w-5xl"
        >
          {/* Purpose tabs */}
          <div className="inline-flex gap-1 p-1 bg-white/10 backdrop-blur-xl rounded-full border border-white/15 mb-3">
            {PURPOSE_TABS.map(tab => {
              const active = (filters.purpose ?? 'sale') === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() =>
                    setFilter(
                      'purpose',
                      tab.value === 'both' ? undefined : tab.value
                    )
                  }
                  className={`px-5 py-2 text-sm rounded-full transition-all ${
                    active
                      ? 'bg-white text-[#0F0820] shadow-lg'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl md:rounded-full p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex-1 px-4 py-2">
                <AutocompleteDark
                  value={locationValue}
                  onChange={setLocation}
                  suggestions={locationSuggestions}
                  placeholder="Cidade ou bairro"
                  icon={<MapPin className="w-4 h-4 text-amber-300 shrink-0" />}
                />
              </div>
              <div className="hidden md:block w-px h-8 bg-white/10" />
              <div className="flex-1 px-4 py-2">
                <select
                  value={
                    Array.isArray(filters.property_type)
                      ? filters.property_type[0]
                      : (filters.property_type as string | undefined) ?? ''
                  }
                  onChange={e =>
                    setFilter(
                      'property_type',
                      e.target.value === ''
                        ? undefined
                        : (e.target.value as PropertyType)
                    )
                  }
                  className="w-full bg-transparent text-white outline-none text-sm appearance-none cursor-pointer [&>option]:text-black"
                >
                  <option value="">Tipo de imóvel</option>
                  {PROPERTY_TYPES.map(t => (
                    <option key={t} value={t}>
                      {PROPERTY_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="hidden md:block w-px h-8 bg-white/10" />
              <div className="flex-1 px-4 py-2">
                <input
                  placeholder="Código do imóvel"
                  value={filters.code ?? ''}
                  onChange={e =>
                    setFilter('code', e.target.value || undefined)
                  }
                  className="w-full bg-transparent text-white placeholder:text-white/50 outline-none text-sm"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-amber-300 to-amber-400 text-[#0F0820] font-medium px-6 py-3 rounded-full hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.8)] transition-all"
              >
                <Search className="w-4 h-4" />
                Encontrar Imóvel
              </button>
            </div>
          </div>

          {/* Advanced toggle row */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              onClick={() => setMoreOpen(true)}
              className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors px-2 md:hidden"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtros avançados
              {filtersCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-amber-300 text-[#0F0820] text-[10px] font-bold">
                  {filtersCount}
                </span>
              )}
            </button>

            {/* Desktop: inline toggle */}
            <DesktopAdvancedToggle filtersCount={filtersCount} />

            {filtersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-white/60 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Limpar filtros
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Mobile drawer (using Dialog as a bottom sheet) */}
      <Dialog open={moreOpen} onOpenChange={setMoreOpen}>
        <DialogContent className="bg-[#0F0820] border-white/10 text-white max-w-md p-0">
          <DialogTitle className="sr-only">Filtros avançados</DialogTitle>
          <AdvancedFiltersPanel onClose={() => setMoreOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/40"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* -------------------- Subcomponents -------------------- */

function DesktopAdvancedToggle({ filtersCount }: { filtersCount: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="hidden md:flex flex-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors px-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filtros avançados
            {filtersCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-amber-300 text-[#0F0820] text-[10px] font-bold">
                {filtersCount}
              </span>
            )}
          </button>
        </DialogTrigger>
        <DialogContent className="bg-[#0F0820] border-white/10 text-white max-w-2xl p-0">
          <DialogTitle className="sr-only">Filtros avançados</DialogTitle>
          <AdvancedFiltersPanel onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdvancedFiltersPanel({ onClose }: { onClose: () => void }) {
  const { filters, setFilter, clearFilters, filtersCount } = useSearchFilters();

  const minOptions = [
    { value: undefined, label: 'Qualquer' },
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' },
    { value: 5, label: '5+' },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-2xl tracking-tight">
          Filtros avançados
        </h3>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-7">
        {/* Faixa de preço */}
        <FilterBlock label="Faixa de preço">
          <DualRangeSlider
            min={0}
            max={20_000_000}
            step={50_000}
            value={[filters.price_min, filters.price_max]}
            onChange={([min, max]) => {
              setFilter('price_min', min);
              setFilter('price_max', max);
            }}
            formatValue={v => (v === 20_000_000 ? 'R$ 20M+' : formatCurrency(v))}
            ariaLabel="Preço"
          />
        </FilterBlock>

        {/* Área */}
        <FilterBlock label="Área (m²)">
          <DualRangeSlider
            min={0}
            max={2000}
            step={20}
            value={[filters.size_min, filters.size_max]}
            onChange={([min, max]) => {
              setFilter('size_min', min);
              setFilter('size_max', max);
            }}
            formatValue={v => (v === 2000 ? '2000+ m²' : `${v} m²`)}
            ariaLabel="Área"
          />
        </FilterBlock>

        {/* Quartos / suítes / banheiros / vagas */}
        <div className="grid grid-cols-2 gap-5">
          <FilterSelect
            label="Quartos"
            value={filters.bedrooms_min}
            onChange={v => setFilter('bedrooms_min', v)}
            options={minOptions}
          />
          <FilterSelect
            label="Suítes"
            value={filters.suites_min}
            onChange={v => setFilter('suites_min', v)}
            options={minOptions}
          />
          <FilterSelect
            label="Banheiros"
            value={filters.bathrooms_min}
            onChange={v => setFilter('bathrooms_min', v)}
            options={minOptions}
          />
          <FilterSelect
            label="Vagas"
            value={filters.garages_min}
            onChange={v => setFilter('garages_min', v)}
            options={minOptions}
          />
        </div>

        {/* Ordenação */}
        <FilterBlock label="Ordenar por">
          <select
            value={filters.sort ?? 'newest'}
            onChange={e =>
              setFilter('sort', (e.target.value as BrokerSearchFilters['sort']))
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-300/50 [&>option]:text-black"
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
            <option value="size_desc">Maior área</option>
          </select>
        </FilterBlock>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 pt-6 border-t border-white/10">
        <button
          onClick={clearFilters}
          className="text-sm text-white/60 hover:text-amber-300 transition-colors"
        >
          Limpar tudo
        </button>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-amber-300 to-amber-400 text-[#0F0820] font-medium px-6 py-2.5 rounded-full hover:shadow-[0_0_25px_-5px_rgba(251,191,36,0.7)] transition-all"
        >
          Aplicar
          {filtersCount > 0 && (
            <span className="ml-2 text-xs opacity-70">({filtersCount})</span>
          )}
        </button>
      </div>
    </div>
  );
}

function FilterBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">
        {label}
      </label>
      {children}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  options: { value: number | undefined; label: string }[];
}) {
  return (
    <FilterBlock label={label}>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => {
          const active = (value ?? undefined) === opt.value;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onChange(active ? undefined : opt.value)}
              className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                active
                  ? 'border-amber-300 bg-amber-300 text-[#0F0820]'
                  : 'border-white/10 text-white/80 hover:border-amber-300/50 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </FilterBlock>
  );
}
