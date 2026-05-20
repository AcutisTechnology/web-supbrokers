"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SOCIAL_PLATFORMS,
  type SiteSocialLink,
  type SocialPlatform,
  type StoreSiteSocialLinkPayload,
  type UpdateSiteSocialLinkPayload,
} from "../services/site-service";

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
  twitter: "X / Twitter",
  custom: "Outro",
};

const schema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS),
  url: z.string().min(1, "Informe a URL"),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface SiteSocialLinksManagerProps {
  socialLinks: SiteSocialLink[];
  isLoading: boolean;
  onCreate: (payload: StoreSiteSocialLinkPayload) => Promise<unknown>;
  onUpdate: (id: number, payload: UpdateSiteSocialLinkPayload) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
  isMutating: boolean;
}

export function SiteSocialLinksManager({
  socialLinks,
  isLoading,
  onCreate,
  onUpdate,
  onDelete,
  isMutating,
}: SiteSocialLinksManagerProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-800">Redes sociais cadastradas</h3>
          <p className="text-xs text-gray-500">
            Links exibidos no rodapé quando &quot;Exibir redes sociais&quot; estiver ativo.
          </p>
        </div>
        {!isAdding && (
          <Button type="button" size="sm" onClick={() => setIsAdding(true)} disabled={isLoading}>
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        )}
      </div>

      {isAdding && (
        <SocialLinkForm
          mode="create"
          onCancel={() => setIsAdding(false)}
          onSubmit={async (data) => {
            await onCreate(data);
            setIsAdding(false);
          }}
          isSubmitting={isMutating}
        />
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : socialLinks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
          <p className="text-sm text-gray-600">Nenhuma rede social cadastrada ainda.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {socialLinks.map((link) => {
            const isEditing = editingId === link.id;
            return (
              <li key={link.id} className="rounded-lg border border-gray-200 p-3">
                {isEditing ? (
                  <SocialLinkForm
                    mode="edit"
                    defaultValues={{
                      platform: link.platform,
                      url: link.url,
                      is_active: link.is_active,
                    }}
                    onCancel={() => setEditingId(null)}
                    onSubmit={async (data) => {
                      await onUpdate(link.id, data);
                      setEditingId(null);
                    }}
                    isSubmitting={isMutating}
                  />
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">
                          {PLATFORM_LABELS[link.platform]}
                        </span>
                        {!link.is_active && (
                          <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                            Inativo
                          </span>
                        )}
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline truncate block"
                      >
                        {link.url}
                      </a>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(link.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDelete(link.id)}
                        disabled={isMutating}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

interface SocialLinkFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<FormValues>;
  onCancel: () => void;
  onSubmit: (data: FormValues) => Promise<void>;
  isSubmitting: boolean;
}

function SocialLinkForm({ mode, defaultValues, onCancel, onSubmit, isSubmitting }: SocialLinkFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      platform: defaultValues?.platform ?? "instagram",
      url: defaultValues?.url ?? "",
      is_active: defaultValues?.is_active ?? true,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          await onSubmit(data);
        })}
        className="space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel className="text-xs">Plataforma</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {PLATFORM_LABELS[platform]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="md:col-span-7">
                <FormLabel className="text-xs">URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="md:col-span-2 flex flex-col items-start gap-2">
                <FormLabel className="text-xs">Ativo</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" size="sm" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-1" />
            {mode === "create" ? "Adicionar" : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
