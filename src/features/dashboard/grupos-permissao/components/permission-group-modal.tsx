"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useAvailablePermissions,
  useCreatePermissionGroup,
  useUpdatePermissionGroup,
} from "@/features/dashboard/grupos-permissao/hooks/use-permission-groups";
import { IPermissionGroup } from "@/types/permission-group";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  group?: IPermissionGroup | null;
}

export function PermissionGroupModal({ open, onClose, group }: Props) {
  const isEditing = !!group;
  const { data: availableData, isLoading: loadingPerms } = useAvailablePermissions();
  const createMutation = useCreatePermissionGroup();
  const updateMutation = useUpdatePermissionGroup();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [permSearch, setPermSearch] = useState("");

  useEffect(() => {
    if (open) {
      setName(group?.name ?? "");
      setDescription(group?.description ?? "");
      setActive(group?.active ?? true);
      setSelectedKeys(new Set(group?.permissions.map((p) => p.key) ?? []));
      setPermSearch("");
    }
  }, [open, group]);

  const toggleKey = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleModule = (keys: string[]) => {
    const allSelected = keys.every((k) => selectedKeys.has(k));
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => (allSelected ? next.delete(k) : next.add(k)));
      return next;
    });
  };

  const selectAll = () => {
    const allKeys =
      availableData?.data.flatMap((m) => m.permissions.map((p) => p.key)) ?? [];
    setSelectedKeys(new Set(allKeys));
  };

  const clearAll = () => setSelectedKeys(new Set());

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Informe o nome do grupo.");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      active,
      permissions: Array.from(selectedKeys),
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: group.id, data: payload });
        toast.success("Grupo atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Grupo criado com sucesso!");
      }
      onClose();
    } catch {
      toast.error("Erro ao salvar o grupo. Tente novamente.");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const filteredModules = availableData?.data
    .map((mod) => ({
      ...mod,
      permissions: mod.permissions.filter((p) =>
        p.name.toLowerCase().includes(permSearch.toLowerCase())
      ),
    }))
    .filter((mod) => mod.permissions.length > 0);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-semibold text-[#4A316A]">
            {isEditing ? "Editar Grupo" : "Novo Grupo de Permissão"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Nome */}
          <div className="space-y-1.5">
            <Label htmlFor="group-name" className="text-sm font-medium text-gray-700">
              Nome <span className="text-red-500">*</span>
            </Label>
            <Input
              id="group-name"
              placeholder="Ex: Administrador, Corretor..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-200 focus:border-[#9747ff] focus:ring-[#9747ff]/20"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <Label htmlFor="group-desc" className="text-sm font-medium text-gray-700">
              Descrição
            </Label>
            <textarea
              id="group-desc"
              rows={2}
              placeholder="Descreva brevemente o perfil de acesso deste grupo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-[#9747ff] focus:outline-none focus:ring-2 focus:ring-[#9747ff]/20"
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <Switch
              id="group-active"
              checked={active}
              onCheckedChange={setActive}
              className="data-[state=checked]:bg-[#9747ff]"
            />
            <Label htmlFor="group-active" className="text-sm font-medium text-gray-700 cursor-pointer">
              Grupo ativo
            </Label>
          </div>

          {/* Permissões */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Permissões{" "}
                <span className="text-[#9747ff] font-semibold">
                  ({selectedKeys.size} selecionadas)
                </span>
              </Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs text-[#9747ff] hover:underline font-medium"
                >
                  Selecionar todas
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:underline font-medium"
                >
                  Limpar
                </button>
              </div>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar permissão..."
                value={permSearch}
                onChange={(e) => setPermSearch(e.target.value)}
                className="pl-8 h-8 text-sm border-gray-200"
              />
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {loadingPerms ? (
                <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Carregando permissões...</span>
                </div>
              ) : filteredModules?.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400">
                  Nenhuma permissão encontrada.
                </div>
              ) : (
                filteredModules?.map((mod) => {
                  const modKeys = mod.permissions.map((p) => p.key);
                  const allModSelected = modKeys.every((k) => selectedKeys.has(k));
                  const someModSelected = modKeys.some((k) => selectedKeys.has(k));

                  return (
                    <div key={mod.module} className="border-b border-gray-100 last:border-0">
                      <div
                        className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 cursor-pointer hover:bg-purple-50 transition-colors"
                        onClick={() => toggleModule(modKeys)}
                      >
                        <Checkbox
                          checked={allModSelected}
                          className={
                            someModSelected && !allModSelected
                              ? "data-[state=checked]:bg-[#9747ff]/40 border-[#9747ff]"
                              : "data-[state=checked]:bg-[#9747ff] data-[state=checked]:border-[#9747ff]"
                          }
                          onCheckedChange={() => toggleModule(modKeys)}
                        />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {mod.module}
                        </span>
                        <span className="ml-auto text-xs text-gray-400">
                          {modKeys.filter((k) => selectedKeys.has(k)).length}/{modKeys.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-0 divide-y divide-gray-50">
                        {mod.permissions.map((perm) => (
                          <label
                            key={perm.key}
                            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-purple-50/50 transition-colors"
                          >
                            <Checkbox
                              checked={selectedKeys.has(perm.key)}
                              onCheckedChange={() => toggleKey(perm.key)}
                              className="data-[state=checked]:bg-[#9747ff] data-[state=checked]:border-[#9747ff]"
                            />
                            <span className="text-sm text-gray-700">{perm.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="border-gray-200"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-[#9747ff] hover:bg-[#7b35d4] text-white"
          >
            {isPending ? (
              <><Loader2 size={14} className="animate-spin mr-2" /> Salvando...</>
            ) : isEditing ? (
              "Salvar alterações"
            ) : (
              "Criar grupo"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
