"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { ImageUpload } from "./image-upload";
import type { SiteSetting, UpdateSiteSettingPayload } from "../services/site-service";

interface SeoListingFormProps {
  initial: SiteSetting | undefined;
  onSubmit: (payload: UpdateSiteSettingPayload) => Promise<unknown>;
  isSubmitting?: boolean;
}

interface Draft {
  seo_title: string;
  seo_description: string;
  og_image_url: string;
}

function build(initial?: SiteSetting): Draft {
  return {
    seo_title: initial?.seo_title ?? "",
    seo_description: initial?.seo_description ?? "",
    og_image_url: initial?.og_image_url ?? "",
  };
}

export function SeoListingForm({ initial, onSubmit, isSubmitting }: SeoListingFormProps) {
  const [draft, setDraft] = useState<Draft>(build(initial));
  const [didInit, setDidInit] = useState(false);

  useEffect(() => {
    if (!initial || didInit) return;
    setDraft(build(initial));
    setDidInit(true);
  }, [initial, didInit]);

  const handleSubmit = async () => {
    await onSubmit({
      seo_title: draft.seo_title.trim() || null,
      seo_description: draft.seo_description.trim() || null,
      og_image_url: draft.og_image_url.trim() || null,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-[#141414] mb-3">SEO</h4>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs">Título (meta title)</Label>
            <Input
              value={draft.seo_title}
              maxLength={160}
              onChange={e => setDraft(d => ({ ...d, seo_title: e.target.value }))}
              placeholder="Ex: LuxuryEstate — Imóveis de alto padrão em São Paulo"
            />
            <p className="text-[10px] text-[#777777]">{draft.seo_title.length}/160 caracteres</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Descrição (meta description)</Label>
            <Textarea
              value={draft.seo_description}
              maxLength={320}
              rows={2}
              onChange={e => setDraft(d => ({ ...d, seo_description: e.target.value }))}
              placeholder="Resumo que aparece nos resultados de busca e ao compartilhar o link."
            />
            <p className="text-[10px] text-[#777777]">{draft.seo_description.length}/320 caracteres</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Imagem de compartilhamento (OpenGraph)</Label>
            <ImageUpload
              value={draft.og_image_url}
              onChange={url => setDraft(d => ({ ...d, og_image_url: url }))}
            />
            <p className="text-[10px] text-[#777777]">
              Recomendado 1200×630px. Exibida ao compartilhar o link no WhatsApp/redes.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!!isSubmitting}
          className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? "Salvando…" : "Salvar SEO"}
        </Button>
      </div>
    </div>
  );
}
