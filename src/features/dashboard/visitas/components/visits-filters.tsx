"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { VISIT_STATUSES } from "../schemas/visit-schema";
import { VisitsFilters } from "../types/visit";
import { STATUS_LABELS } from "../utils/visit-labels";

type Props = {
  filters: VisitsFilters;
  onChange: (filters: VisitsFilters) => void;
};

const ALL_STATUSES = "__all__";

export function VisitsFiltersBar({ filters, onChange }: Props) {
  const [search, setSearch] = useState(filters.search ?? "");

  const handleApplySearch = () => {
    onChange({ ...filters, search: search.trim() || undefined, page: 1 });
  };

  const handleReset = () => {
    setSearch("");
    onChange({ page: 1, per_page: filters.per_page });
  };

  const isFiltered =
    !!filters.search || !!filters.status || !!filters.date_from || !!filters.date_to;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5">
          <Label htmlFor="filter-search" className="text-xs font-medium text-gray-500">
            Buscar
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="filter-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplySearch();
              }}
              placeholder="Cliente, telefone, imóvel..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <Label className="text-xs font-medium text-gray-500">Status</Label>
          <Select
            value={filters.status ?? ALL_STATUSES}
            onValueChange={(v) =>
              onChange({
                ...filters,
                status: v === ALL_STATUSES ? undefined : (v as VisitsFilters["status"]),
                page: 1,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES}>Todos</SelectItem>
              {VISIT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label className="text-xs font-medium text-gray-500">De</Label>
          <Input
            type="date"
            value={filters.date_from ?? ""}
            onChange={(e) =>
              onChange({ ...filters, date_from: e.target.value || undefined, page: 1 })
            }
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-xs font-medium text-gray-500">Até</Label>
          <Input
            type="date"
            value={filters.date_to ?? ""}
            onChange={(e) =>
              onChange({ ...filters, date_to: e.target.value || undefined, page: 1 })
            }
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="button" onClick={handleApplySearch} size="sm">
          Aplicar busca
        </Button>
        {isFiltered ? (
          <Button type="button" onClick={handleReset} size="sm" variant="ghost" className="gap-1">
            <X className="h-3.5 w-3.5" />
            Limpar filtros
          </Button>
        ) : null}
      </div>
    </div>
  );
}
