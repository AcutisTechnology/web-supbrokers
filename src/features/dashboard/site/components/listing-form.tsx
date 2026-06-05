"use client";

import { useEffect, useState } from "react";
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
import { Save } from "lucide-react";
import type { SiteSetting, UpdateSiteSettingPayload } from "../services/site-service";

interface ListingFormProps {
  initial: SiteSetting | undefined;
  onSubmit: (payload: UpdateSiteSettingPayload) => Promise<unknown>;
  isSubmitting?: boolean;
}

interface Draft {
  listing_page_size: string;
  listing_default_sort: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Mais recentes" },
  { value: "oldest", label: "Mais antigos" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "size_desc", label: "Maior área" },
];

function build(initial?: SiteSetting): Draft {
  return {
    listing_page_size: initial?.listing_page_size ? String(initial.listing_page_size) : "12",
    listing_default_sort: initial?.listing_default_sort ?? "newest",
  };
}

export function ListingForm({ initial, onSubmit, isSubmitting }: ListingFormProps) {
  const [draft, setDraft] = useState<Draft>(build(initial));
  const [didInit, setDidInit] = useState(false);

  useEffect(() => {
    if (!initial || didInit) return;
    setDraft(build(initial));
    setDidInit(true);
  }, [initial, didInit]);

  const handleSubmit = async () => {
    await onSubmit({
      listing_page_size: draft.listing_page_size ? Number(draft.listing_page_size) : null,
      listing_default_sort: draft.listing_default_sort || null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs">Imóveis por página</Label>
          <Input
            type="number"
            min={4}
            max={48}
            value={draft.listing_page_size}
            onChange={e => setDraft(d => ({ ...d, listing_page_size: e.target.value }))}
          />
          <p className="text-[10px] text-[#777777]">Entre 4 e 48. Padrão: 12.</p>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Ordenação padrão</Label>
          <Select
            value={draft.listing_default_sort}
            onValueChange={v => setDraft(d => ({ ...d, listing_default_sort: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!!isSubmitting}
          className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? "Salvando…" : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
