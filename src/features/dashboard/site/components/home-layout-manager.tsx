"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LoadingState } from "@/components/ui/loading-state";
import { ArrowDown, ArrowUp, GripVertical, Save } from "lucide-react";
import {
  type HomeSection,
  HOME_SECTION_LABELS,
  useHomeLayout,
} from "../services/home-layout-service";

interface HomeLayoutManagerProps {
  onChange?: (sections: HomeSection[]) => void;
}

export function HomeLayoutManager({ onChange }: HomeLayoutManagerProps) {
  const { sections, isLoading, isError, error, refetch, save, isSaving } = useHomeLayout();
  const [draft, setDraft] = useState<HomeSection[]>([]);
  const [didInit, setDidInit] = useState(false);

  useEffect(() => {
    if (sections.length === 0 || didInit) return;
    setDraft(sections);
    setDidInit(true);
  }, [sections, didInit]);

  useEffect(() => {
    if (draft.length === 0) return;
    onChange?.(draft);
  }, [draft, onChange]);

  const move = (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= draft.length) return;
    setDraft(prev => {
      const next = [...prev];
      const tmp = next[target];
      next[target] = next[index];
      next[index] = tmp;
      return next;
    });
  };

  const toggle = (key: string) => {
    setDraft(prev =>
      prev.map(s => (s.key === key ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <>
      <LoadingState isLoading={isLoading} isError={isError} error={error ?? undefined} onRetry={() => refetch()} />

      {!isLoading && !isError && (
        <div className="space-y-4">
          <p className="text-xs text-[#777777]">
            Arraste com as setas para reordenar e use o switch para mostrar/ocultar cada seção.
            O Hero e o CTA final são fixos e sempre aparecem.
          </p>

          <div className="space-y-2">
            {draft.map((section, i) => {
              const meta = HOME_SECTION_LABELS[section.key] ?? {
                label: section.key,
                description: "",
              };
              return (
                <div
                  key={section.key}
                  className={`flex items-center gap-3 bg-white border rounded-2xl p-3 transition-colors ${
                    section.enabled ? "border-gray-100" : "border-gray-100 opacity-60"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, "up")}
                      disabled={i === 0}
                      aria-label="Subir"
                      className="w-6 h-6 rounded border border-gray-200 text-[#777777] hover:text-[#9747FF] disabled:opacity-30 inline-flex items-center justify-center"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, "down")}
                      disabled={i === draft.length - 1}
                      aria-label="Descer"
                      className="w-6 h-6 rounded border border-gray-200 text-[#777777] hover:text-[#9747FF] disabled:opacity-30 inline-flex items-center justify-center"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#141414]">{meta.label}</p>
                    {meta.description && (
                      <p className="text-xs text-[#777777]">{meta.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#777777]">
                    {section.enabled ? "Visível" : "Oculto"}
                    <Switch checked={section.enabled} onCheckedChange={() => toggle(section.key)} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => save(draft)}
              disabled={isSaving}
              className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Salvando…" : "Salvar ordem"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
