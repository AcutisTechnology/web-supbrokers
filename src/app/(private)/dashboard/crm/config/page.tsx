"use client";

import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPicker } from "@/features/dashboard/page-settings/components/color-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Plus, Tag, Trash2, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CrmPipelineStage,
  CrmTag,
  useCreateCrmPipelineStage,
  useCreateCrmTag,
  useCrmPipelineStages,
  useCrmTags,
  useDeleteCrmPipelineStage,
  useDeleteCrmTag,
  useReorderCrmPipelineStages,
  useUpdateCrmPipelineStage,
  useUpdateCrmTag,
} from "@/features/dashboard/crm/services/crm-service";

const stageSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  color: z.string().optional(),
});

type StageFormValues = z.infer<typeof stageSchema>;

const tagSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  color: z.string().optional(),
});

type TagFormValues = z.infer<typeof tagSchema>;

export default function CrmConfigPage() {
  const { data: stagesData, isLoading: isLoadingStages } = useCrmPipelineStages();
  const { data: tagsData, isLoading: isLoadingTags } = useCrmTags();

  const stages = useMemo(() => (stagesData ?? []).slice().sort((a, b) => a.order - b.order), [stagesData]);
  const tags = useMemo(() => (tagsData ?? []).slice().sort((a, b) => a.name.localeCompare(b.name)), [tagsData]);

  const createStageMutation = useCreateCrmPipelineStage();
  const updateStageMutation = useUpdateCrmPipelineStage();
  const deleteStageMutation = useDeleteCrmPipelineStage();
  const reorderStagesMutation = useReorderCrmPipelineStages();

  const createTagMutation = useCreateCrmTag();
  const updateTagMutation = useUpdateCrmTag();
  const deleteTagMutation = useDeleteCrmTag();

  const [stageDialog, setStageDialog] = useState<CrmPipelineStage | null>(null);
  const [tagDialog, setTagDialog] = useState<CrmTag | null>(null);

  const stageForm = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
    defaultValues: { name: "", color: "#9747FF" },
  });

  const tagForm = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: "", color: "#9747FF" },
  });

  useEffect(() => {
    if (!stageDialog) return;
    stageForm.reset({ name: stageDialog.name ?? "", color: stageDialog.color ?? "#9747FF" });
  }, [stageDialog, stageForm]);

  useEffect(() => {
    if (!tagDialog) return;
    tagForm.reset({ name: tagDialog.name ?? "", color: tagDialog.color ?? "#9747FF" });
  }, [tagDialog, tagForm]);

  const handleMoveStage = (stageId: number, direction: "up" | "down") => {
    const index = stages.findIndex((s) => s.id === stageId);
    if (index < 0) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= stages.length) return;

    const next = stages.slice();
    const temp = next[index];
    next[index] = next[swapIndex];
    next[swapIndex] = temp;

    const payload = next.map((s, idx) => ({ id: s.id, order: idx + 1 }));
    reorderStagesMutation.mutate(payload);
  };

  return (
    <>
      <TopNav title_secondary="CRM" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center mt-0.5">
            <Wand2 className="w-5 h-5 text-[#141414]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#141414]">Configurações do CRM</h1>
            <p className="text-[#777777]">Personalize etapas e tags do seu pipeline.</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="stages">
        <TabsList>
          <TabsTrigger value="stages">Etapas</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="stages" className="mt-6">
          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Etapas do pipeline</CardTitle>
              <Dialog open={!!stageDialog} onOpenChange={(open) => (!open ? setStageDialog(null) : null)}>
                <DialogTrigger asChild>
                  <Button
                    className="gap-2"
                    onClick={() =>
                      setStageDialog({
                        id: 0,
                        name: "",
                        order: stages.length + 1,
                        color: "#9747FF",
                        is_default: false,
                      })
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Nova etapa
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{stageDialog?.id ? "Editar etapa" : "Nova etapa"}</DialogTitle>
                  </DialogHeader>

                  <form
                    className="space-y-4"
                    onSubmit={stageForm.handleSubmit((values) => {
                      if (!stageDialog) return;
                      const payload = { name: values.name.trim(), color: values.color?.trim() || null };

                      if (stageDialog.id) {
                        updateStageMutation.mutate({ id: stageDialog.id, ...payload });
                      } else {
                        createStageMutation.mutate(payload);
                      }

                      setStageDialog(null);
                    })}
                  >
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input {...stageForm.register("name")} placeholder="Nome da etapa" />
                      {stageForm.formState.errors.name?.message && (
                        <div className="text-sm text-red-600">{stageForm.formState.errors.name.message}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Cor</Label>
                      <ColorPicker
                        value={stageForm.watch("color") || "#9747FF"}
                        onChange={(c) => stageForm.setValue("color", c, { shouldValidate: true })}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setStageDialog(null)}>
                        Cancelar
                      </Button>
                      <Button type="submit">Salvar</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stages.map((stage) => (
                  <div key={stage.id} className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: stage.color ?? "#e5e7eb" }} />
                      <div className="min-w-0">
                        <div className="font-semibold text-[#141414] truncate">{stage.name}</div>
                        <div className="text-xs text-[#777777] flex items-center gap-2 mt-0.5">
                          <span>Ordem: {stage.order}</span>
                          {typeof stage.leads_count === "number" && <Badge variant="secondary">{stage.leads_count} leads</Badge>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleMoveStage(stage.id, "up")}>
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleMoveStage(stage.id, "down")}>
                        <ChevronDown className="h-4 w-4" />
                      </Button>

                      <Button variant="outline" className="h-9" onClick={() => setStageDialog(stage)}>
                        Editar
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteStageMutation.mutate(stage.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {!isLoadingStages && stages.length === 0 && <div className="text-sm text-[#777777] py-6 text-center">Nenhuma etapa encontrada.</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="mt-6">
          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Tags</CardTitle>
              <Dialog open={!!tagDialog} onOpenChange={(open) => (!open ? setTagDialog(null) : null)}>
                <DialogTrigger asChild>
                  <Button className="gap-2" onClick={() => setTagDialog({ id: 0, name: "", color: "#9747FF" })}>
                    <Plus className="h-4 w-4" />
                    Nova tag
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{tagDialog?.id ? "Editar tag" : "Nova tag"}</DialogTitle>
                  </DialogHeader>

                  <form
                    className="space-y-4"
                    onSubmit={tagForm.handleSubmit((values) => {
                      if (!tagDialog) return;
                      const payload = { name: values.name.trim(), color: values.color?.trim() || null };

                      if (tagDialog.id) {
                        updateTagMutation.mutate({ id: tagDialog.id, ...payload });
                      } else {
                        createTagMutation.mutate(payload);
                      }

                      setTagDialog(null);
                    })}
                  >
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input {...tagForm.register("name")} placeholder="Nome da tag" />
                      {tagForm.formState.errors.name?.message && (
                        <div className="text-sm text-red-600">{tagForm.formState.errors.name.message}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Cor</Label>
                      <ColorPicker value={tagForm.watch("color") || "#9747FF"} onChange={(c) => tagForm.setValue("color", c)} />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setTagDialog(null)}>
                        Cancelar
                      </Button>
                      <Button type="submit">Salvar</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tags.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Tag className="h-4 w-4 text-[#141414]" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#141414] truncate">{t.name}</div>
                        <div className="text-xs text-[#777777] mt-0.5 flex items-center gap-2">
                          <span className="inline-flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color ?? "#e5e7eb" }} />
                            <span>{t.color ?? "Sem cor"}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="h-9" onClick={() => setTagDialog(t)}>
                        Editar
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteTagMutation.mutate(t.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {!isLoadingTags && tags.length === 0 && <div className="text-sm text-[#777777] py-6 text-center">Nenhuma tag encontrada.</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
