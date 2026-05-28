'use client';

import type { PublicAgent } from '@/features/landing/services/agents-service';
import { Search, X } from 'lucide-react';
import { useMemo } from 'react';

export interface TeamFiltersState {
  q: string;
  city: string;
  specialty: string;
  language: string;
}

interface TeamFiltersProps {
  agents: PublicAgent[];
  filters: TeamFiltersState;
  onChange: (next: TeamFiltersState) => void;
}

const SPECIALTY_LABEL: Record<string, string> = {
  luxo: 'Luxo',
  lancamentos: 'Lançamentos',
  investimento: 'Investimento',
  destaque: 'Destaque',
};

export const EMPTY_FILTERS: TeamFiltersState = {
  q: '',
  city: '',
  specialty: '',
  language: '',
};

export function hasActiveFilters(filters: TeamFiltersState): boolean {
  return !!(filters.q || filters.city || filters.specialty || filters.language);
}

export function TeamFilters({ agents, filters, onChange }: TeamFiltersProps) {
  const cities = useMemo(
    () =>
      Array.from(new Set(agents.map(a => a.city).filter((c): c is string => !!c))).sort(),
    [agents]
  );
  const specialties = useMemo(
    () => Array.from(new Set(agents.flatMap(a => a.specialties))).sort(),
    [agents]
  );
  const languages = useMemo(
    () => Array.from(new Set(agents.flatMap(a => a.languages))).sort(),
    [agents]
  );

  const update = <K extends keyof TeamFiltersState>(
    key: K,
    value: TeamFiltersState[K]
  ) => onChange({ ...filters, [key]: value });

  const clear = () => onChange(EMPTY_FILTERS);

  return (
    <div className="bg-white rounded-2xl border border-black/[0.05] shadow-[0_10px_30px_-15px_rgba(15,8,32,0.1)] p-4 md:p-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Busca */}
        <div className="md:col-span-2 flex items-center gap-2 px-3 py-2 border border-black/10 rounded-lg hover:border-[#9747FF]/40 transition-colors">
          <Search className="w-4 h-4 text-[#9747FF] shrink-0" />
          <input
            value={filters.q}
            onChange={e => update('q', e.target.value)}
            placeholder="Buscar por nome, bairro ou especialidade"
            className="w-full bg-transparent outline-none text-sm text-[#0F0820] placeholder:text-[#0F0820]/40"
          />
        </div>

        <SelectLight
          value={filters.city}
          onChange={v => update('city', v)}
          placeholder="Cidade"
          options={cities}
        />

        <SelectLight
          value={filters.specialty}
          onChange={v => update('specialty', v)}
          placeholder="Especialidade"
          options={specialties}
          renderLabel={s => SPECIALTY_LABEL[s] ?? s}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <SelectChips
          value={filters.language}
          onChange={v => update('language', v)}
          options={languages}
        />
        {hasActiveFilters(filters) && (
          <button
            onClick={clear}
            className="inline-flex items-center gap-1 text-xs text-[#0F0820]/50 hover:text-rose-500 transition-colors"
          >
            <X className="w-3 h-3" />
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}

function SelectLight({
  value,
  onChange,
  placeholder,
  options,
  renderLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
  renderLabel?: (v: string) => string;
}) {
  return (
    <div className="border border-black/10 rounded-lg px-3 py-2 hover:border-[#9747FF]/40 transition-colors">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent text-sm text-[#0F0820] outline-none appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o} value={o}>
            {renderLabel ? renderLabel(o) : o}
          </option>
        ))}
      </select>
    </div>
  );
}

function SelectChips({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  if (options.length === 0) return <span />;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[10px] uppercase tracking-wider text-[#0F0820]/45 font-medium mr-1">
        Idioma:
      </span>
      <button
        onClick={() => onChange('')}
        className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors ${
          value === ''
            ? 'border-[#0F0820] bg-[#0F0820] text-white'
            : 'border-black/10 text-[#0F0820]/70 hover:border-[#9747FF]/40'
        }`}
      >
        Todos
      </button>
      {options.map(o => (
        <button
          key={o}
          onClick={() => onChange(value === o ? '' : o)}
          className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors ${
            value === o
              ? 'border-[#0F0820] bg-[#0F0820] text-white'
              : 'border-black/10 text-[#0F0820]/70 hover:border-[#9747FF]/40'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
