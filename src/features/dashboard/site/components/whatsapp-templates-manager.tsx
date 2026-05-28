"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LoadingState } from "@/components/ui/loading-state";
import { MessageCircle, RotateCcw, Save } from "lucide-react";
import {
  type WhatsappTemplateItem,
  useWhatsappTemplates,
} from "../services/whatsapp-templates-service";

interface DraftItem {
  message: string;
  is_active: boolean;
}

export function WhatsappTemplatesManager() {
  const { templates, isLoading, isError, error, refetch, save, reset, isSaving } =
    useWhatsappTemplates();

  const [drafts, setDrafts] = useState<Record<string, DraftItem>>({});
  const [didInit, setDidInit] = useState(false);

  useEffect(() => {
    if (templates.length === 0 || didInit) return;
    const initial: Record<string, DraftItem> = {};
    for (const t of templates) {
      initial[t.key] = { message: t.message, is_active: t.is_active };
    }
    setDrafts(initial);
    setDidInit(true);
  }, [templates, didInit]);

  const handleSave = async () => {
    const items = Object.entries(drafts).map(([key, d]) => ({
      key,
      message: d.message,
      is_active: d.is_active,
    }));
    await save(items);
  };

  const handleReset = async (t: WhatsappTemplateItem) => {
    await reset(t.key);
    setDrafts(prev => ({
      ...prev,
      [t.key]: { message: t.default_message, is_active: true },
    }));
  };

  const insertPlaceholder = (key: string, placeholder: string) => {
    setDrafts(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        message: `${prev[key]?.message ?? ""}${placeholder}`,
      },
    }));
  };

  return (
    <>
      <LoadingState isLoading={isLoading} isError={isError} error={error ?? undefined} onRetry={() => refetch()} />

      {!isLoading && !isError && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900 font-medium mb-1">
              💬 Como funcionam os placeholders
            </p>
            <p className="text-xs text-blue-800 leading-relaxed">
              Trechos entre chaves duplas são substituídos automaticamente ao abrir o WhatsApp.
              Ex: <code className="bg-white px-1 rounded">{"{{property.title}}"}</code> vira o nome do
              imóvel. Clique nas tags abaixo de cada campo para inserir.
            </p>
          </div>

          <div className="space-y-3">
            {templates.map(t => {
              const draft = drafts[t.key] ?? {
                message: t.message,
                is_active: t.is_active,
              };
              return (
                <div
                  key={t.key}
                  className="bg-white border border-gray-100 rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#141414]">{t.label}</p>
                        <p className="text-[11px] text-[#777777]">chave: {t.key}</p>
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-2 text-xs text-[#777777]">
                      Ativo
                      <Switch
                        checked={draft.is_active}
                        onCheckedChange={v =>
                          setDrafts(prev => ({
                            ...prev,
                            [t.key]: { ...draft, is_active: v },
                          }))
                        }
                      />
                    </label>
                  </div>

                  <Textarea
                    value={draft.message}
                    onChange={e =>
                      setDrafts(prev => ({
                        ...prev,
                        [t.key]: { ...draft, message: e.target.value },
                      }))
                    }
                    rows={2}
                    maxLength={1000}
                    className="resize-none"
                  />

                  <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {t.placeholders.length > 0 ? (
                        t.placeholders.map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => insertPlaceholder(t.key, p)}
                            className="px-2 py-0.5 rounded-md bg-[#9747FF]/10 text-[#9747FF] text-[11px] hover:bg-[#9747FF]/20 transition-colors font-mono"
                          >
                            {p}
                          </button>
                        ))
                      ) : (
                        <span className="text-[11px] text-[#777777]">Sem variáveis</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleReset(t)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#777777] hover:text-[#141414] transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restaurar padrão
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Salvando…" : "Salvar mensagens"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
