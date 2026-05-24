'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  type PropertyType,
} from '@/features/dashboard/imoveis/novo/schemas/property-schema';
import type { BrokerSearchFilters } from '@/features/landing/services/broker-service';
import { motion } from 'framer-motion';
import { MapPin, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { useSearchFilters } from '../hooks/use-search-filters';
import { AutocompleteDark as Autocomplete } from './primitives/autocomplete-dark';
import { DualRangeSlider } from './primitives/dual-range-slider';

interface PropertySearchFormProps {
  theme: 'dark' | 'light';
  citySuggestions: string[];
  neighborhoodSuggestions: string[];
  /**
   * Callback chamado quando o usuário clica em "Buscar".
   * Recebe os filtros atuais para o pai decidir o que fazer
   * (navegar para /buscar no caso do Hero, ou apenas fechar drawers
   * e rolar para resultados no caso da Listing).
   */
  onSubmit?: (filters: BrokerSearchFilters) => void;
  submitLabel?: string;
}

const PURPOSE_TABS = [
  { value: undefined, label: 'Todos' },
  { value: 'sale' as const, label: 'Comprar' },
  { value: 'rent' as const, label: 'Alugar' },
];

const MIN_OPTIONS = [
  { value: undefined, label: 'Qualquer' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 5, label: '5+' },
];

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    const v = (value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1);
    return `R$ ${v}M`;
  }
  if (value >= 1_000) return `R$ ${Math.round(value / 1_000)}k`;
  return `R$ ${value}`;
}

/**
 * Formulário de busca de imóveis compartilhado entre o Hero (dark)
 * e a página de listagem (light). Mesmas regras de filtro, mesmo
 * estado (URL via useSearchFilters), apenas estética muda.
 */
export function PropertySearchForm({
  theme,
  citySuggestions,
  neighborhoodSuggestions,
  onSubmit,
  submitLabel = 'Encontrar Imóvel',
}: PropertySearchFormProps) {
  const { filters, setFilter, clearFilters, filtersCount } = useSearchFilters();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const isDark = theme === 'dark';

  /* -------- Localização (mescla city/neighborhood/q em um campo) -------- */
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

  /* -------- Classes condicionais por tema -------- */
  const tabsContainer = isDark
    ? 'bg-white/10 backdrop-blur-xl border border-white/15'
    : 'bg-[#0F0820]/[0.04] border border-black/[0.06]';
  const tabActive = isDark
    ? 'bg-white text-[#0F0820] shadow-lg'
    : 'bg-[#0F0820] text-white shadow';
  const tabIdle = isDark
    ? 'text-white/80 hover:text-white'
    : 'text-[#0F0820]/60 hover:text-[#0F0820]';

  const barContainer = isDark
    ? 'bg-white/10 backdrop-blur-2xl border border-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]'
    : 'bg-white border border-black/[0.06] shadow-[0_20px_50px_-15px_rgba(15,8,32,0.12)]';
  const divider = isDark ? 'bg-white/10' : 'bg-black/[0.06]';
  const selectClass = isDark
    ? 'bg-transparent text-white outline-none text-sm appearance-none cursor-pointer [&>option]:text-black'
    : 'bg-transparent text-[#0F0820] outline-none text-sm appearance-none cursor-pointer';
  const placeholderInput = isDark
    ? 'text-white placeholder:text-white/50'
    : 'text-[#0F0820] placeholder:text-[#0F0820]/40';
  const submitBtn = isDark
    ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-[#0F0820] hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.8)]'
    : 'bg-[#0F0820] text-white hover:bg-[#1f1240] hover:shadow-[0_10px_30px_-10px_rgba(15,8,32,0.5)]';
  const advancedTrigger = isDark
    ? 'text-white/60 hover:text-white'
    : 'text-[#0F0820]/60 hover:text-[#0F0820]';
  const clearBtn = isDark
    ? 'text-white/60 hover:text-amber-300'
    : 'text-[#0F0820]/50 hover:text-rose-500';
  const iconColor = isDark ? 'text-amber-300' : 'text-[#9747FF]';

  const handleSubmit = () => {
    setAdvancedOpen(false);
    onSubmit?.(filters);
  };

  return (
    <div>
      {/* Purpose tabs */}
      <div className={`inline-flex gap-1 p-1 rounded-full mb-3 ${tabsContainer}`}>
        {PURPOSE_TABS.map(tab => {
          const active = (filters.purpose ?? undefined) === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => setFilter('purpose', tab.value)}
              className={`px-5 py-2 text-sm rounded-full transition-all ${
                active ? tabActive : tabIdle
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search bar */}
      <div
        className={`rounded-2xl md:rounded-full p-2 ${barContainer}`}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex-1 px-4 py-2">
            <Autocomplete
              theme={theme}
              value={locationValue}
              onChange={setLocation}
              suggestions={[...citySuggestions, ...neighborhoodSuggestions]}
              placeholder="Cidade ou bairro"
              icon={<MapPin className={`w-4 h-4 shrink-0 ${iconColor}`} />}
            />
          </div>
          <div className={`hidden md:block w-px h-8 ${divider}`} />
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
              className={`w-full ${selectClass}`}
            >
              <option value="">Tipo de imóvel</option>
              {PROPERTY_TYPES.map(t => (
                <option key={t} value={t}>
                  {PROPERTY_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div className={`hidden md:block w-px h-8 ${divider}`} />
          <div className="flex-1 px-4 py-2">
            <input
              placeholder="Código do imóvel"
              value={filters.code ?? ''}
              onChange={e => setFilter('code', e.target.value || undefined)}
              className={`w-full bg-transparent outline-none text-sm ${placeholderInput}`}
            />
          </div>
          <button
            onClick={handleSubmit}
            className={`inline-flex items-center justify-center gap-2 font-medium px-6 py-3 rounded-full transition-all ${submitBtn}`}
          >
            <Search className="w-4 h-4" />
            {submitLabel}
          </button>
        </div>
      </div>

      {/* Advanced + clear */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          onClick={() => setAdvancedOpen(true)}
          className={`inline-flex items-center gap-2 text-xs transition-colors px-2 ${advancedTrigger}`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filtros avançados
          {filtersCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-amber-300 text-[#0F0820] text-[10px] font-bold">
              {filtersCount}
            </span>
          )}
        </button>
        {filtersCount > 0 && (
          <button
            onClick={clearFilters}
            className={`text-xs transition-colors inline-flex items-center gap-1 ${clearBtn}`}
          >
            <X className="w-3 h-3" />
            Limpar filtros
          </button>
        )}
      </div>

      {/* Advanced drawer (Dialog) */}
      <Dialog open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <DialogContent className="bg-[#0F0820] border-white/10 text-white max-w-2xl p-0">
          <DialogTitle className="sr-only">Filtros avançados</DialogTitle>
          <AdvancedPanel onClose={() => setAdvancedOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------- Advanced filters panel -------------------- */

function AdvancedPanel({ onClose }: { onClose: () => void }) {
  const { filters, setFilter, clearFilters, filtersCount } = useSearchFilters();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 md:p-8"
    >
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

        <div className="grid grid-cols-2 gap-5">
          <FilterSelect
            label="Quartos"
            value={filters.bedrooms_min}
            onChange={v => setFilter('bedrooms_min', v)}
          />
          <FilterSelect
            label="Suítes"
            value={filters.suites_min}
            onChange={v => setFilter('suites_min', v)}
          />
          <FilterSelect
            label="Banheiros"
            value={filters.bathrooms_min}
            onChange={v => setFilter('bathrooms_min', v)}
          />
          <FilterSelect
            label="Vagas"
            value={filters.garages_min}
            onChange={v => setFilter('garages_min', v)}
          />
        </div>

        <FilterBlock label="Ordenar por">
          <select
            value={filters.sort ?? 'newest'}
            onChange={e =>
              setFilter('sort', e.target.value as BrokerSearchFilters['sort'])
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
    </motion.div>
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
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}) {
  return (
    <FilterBlock label={label}>
      <div className="flex flex-wrap gap-1.5">
        {MIN_OPTIONS.map(opt => {
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
