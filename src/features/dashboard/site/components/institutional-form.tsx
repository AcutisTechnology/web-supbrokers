"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingState } from "@/components/ui/loading-state";
import { Plus, Save, Trash2, X } from "lucide-react";
import { ImageUpload } from "./image-upload";
import {
  type InstitutionalDifferential,
  useInstitutional,
} from "../services/institutional-service";

interface Draft {
  eyebrow: string;
  title: string;
  body: string;
  image_url: string;
  values: string[];
  differentials: InstitutionalDifferential[];
  is_active: boolean;
}

const EMPTY: Draft = {
  eyebrow: "",
  title: "",
  body: "",
  image_url: "",
  values: [],
  differentials: [],
  is_active: true,
};

export function InstitutionalForm() {
  const { institutional, isLoading, isError, error, refetch, save, isSaving } =
    useInstitutional();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [didInit, setDidInit] = useState(false);
  const [valueInput, setValueInput] = useState("");

  useEffect(() => {
    if (!institutional || didInit) return;
    setDraft({
      eyebrow: institutional.eyebrow ?? "",
      title: institutional.title ?? "",
      body: institutional.body ?? "",
      image_url: institutional.image_url ?? "",
      values: institutional.values ?? [],
      differentials: institutional.differentials ?? [],
      is_active: institutional.is_active,
    });
    setDidInit(true);
  }, [institutional, didInit]);

  const handleSave = async () => {
    await save({
      eyebrow: draft.eyebrow.trim() || null,
      title: draft.title.trim() || null,
      body: draft.body.trim() || null,
      image_url: draft.image_url.trim() || null,
      values: draft.values,
      differentials: draft.differentials.filter(d => d.title.trim() !== ""),
      is_active: draft.is_active,
    });
  };

  const addValue = () => {
    const v = valueInput.trim();
    if (!v || draft.values.includes(v)) {
      setValueInput("");
      return;
    }
    setDraft(d => ({ ...d, values: [...d.values, v] }));
    setValueInput("");
  };

  const addDifferential = () => {
    if (draft.differentials.length >= 6) return;
    setDraft(d => ({
      ...d,
      differentials: [...d.differentials, { icon: "Sparkles", title: "", text: "" }],
    }));
  };

  const updateDifferential = (
    index: number,
    field: keyof InstitutionalDifferential,
    value: string
  ) => {
    setDraft(d => ({
      ...d,
      differentials: d.differentials.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  return (
    <>
      <LoadingState isLoading={isLoading} isError={isError} error={error ?? undefined} onRetry={() => refetch()} />

      {!isLoading && !isError && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5">
            <div className="space-y-1">
              <Label className="text-xs">Imagem</Label>
              <ImageUpload
                value={draft.image_url}
                onChange={url => setDraft(d => ({ ...d, image_url: url }))}
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">Eyebrow (texto pequeno acima do título)</Label>
                <Input
                  value={draft.eyebrow}
                  onChange={e => setDraft(d => ({ ...d, eyebrow: e.target.value }))}
                  placeholder="Ex: Sobre nós"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Título</Label>
                <Input
                  value={draft.title}
                  onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                  placeholder="Ex: Tecnologia, paixão e tradição a serviço do alto padrão."
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Texto descritivo</Label>
                <Textarea
                  value={draft.body}
                  onChange={e => setDraft(d => ({ ...d, body: e.target.value }))}
                  rows={4}
                  placeholder="Conte a história e os valores da imobiliária."
                />
              </div>
            </div>
          </div>

          {/* Lista de valores */}
          <div className="space-y-2">
            <Label className="text-xs">Valores (bullets exibidos ao lado da imagem)</Label>
            <div className="flex gap-2">
              <Input
                value={valueInput}
                onChange={e => setValueInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addValue();
                  }
                }}
                placeholder="Adicionar valor e dar Enter"
              />
              <Button type="button" variant="outline" onClick={addValue}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {draft.values.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {draft.values.map(v => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#9747FF]/10 text-[#9747FF] text-xs"
                  >
                    {v}
                    <button
                      type="button"
                      onClick={() =>
                        setDraft(d => ({ ...d, values: d.values.filter(x => x !== v) }))
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Diferenciais */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Diferenciais (até 6 cards com ícone)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDifferential}
                disabled={draft.differentials.length >= 6}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {draft.differentials.map((d, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-[120px_1fr_1.5fr_auto] gap-2 items-start bg-gray-50 rounded-xl p-2"
                >
                  <Input
                    value={d.icon}
                    onChange={e => updateDifferential(i, "icon", e.target.value)}
                    placeholder="Ícone (Shield)"
                  />
                  <Input
                    value={d.title}
                    onChange={e => updateDifferential(i, "title", e.target.value)}
                    placeholder="Título"
                  />
                  <Input
                    value={d.text}
                    onChange={e => updateDifferential(i, "text", e.target.value)}
                    placeholder="Descrição"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setDraft(prev => ({
                        ...prev,
                        differentials: prev.differentials.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {draft.differentials.length === 0 && (
                <p className="text-xs text-[#777777]">Nenhum diferencial adicionado.</p>
              )}
            </div>
            <p className="text-[10px] text-[#777777]">
              Nomes de ícone seguem a biblioteca Lucide (ex: Shield, Award, Sparkles, Home, Star).
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Salvando…" : "Salvar institucional"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
