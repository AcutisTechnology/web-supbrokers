"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ColorPicker } from "./color-picker";
import { ImageUpload } from "./image-upload";
import type { SiteSetting, UpdateSiteSettingPayload } from "../services/site-service";

const schema = z.object({
  primary_color: z.string().min(1, "A cor primária é obrigatória"),
  site_title: z.string().min(1, "O título é obrigatório"),
  site_subtitle: z.string().min(1, "O subtítulo é obrigatório"),
  brand_image: z.string().min(1, "A logomarca é obrigatória"),
});

export type SiteAppearanceFormData = z.infer<typeof schema>;

interface SiteAppearanceFormProps {
  initial: SiteSetting | undefined;
  onSubmit: (payload: UpdateSiteSettingPayload) => Promise<unknown>;
  onChange?: (data: Partial<SiteAppearanceFormData>) => void;
  isSubmitting?: boolean;
}

const DEFAULTS: SiteAppearanceFormData = {
  primary_color: "#9747FF",
  site_title: "Encontre o imóvel perfeito para você",
  site_subtitle: "Confira os melhores imóveis disponíveis",
  brand_image: "/logo-extendida-roxo.svg",
};

function buildInitialValues(initial: SiteSetting | undefined): SiteAppearanceFormData {
  return {
    primary_color: initial?.primary_color ?? DEFAULTS.primary_color,
    site_title: initial?.site_title ?? DEFAULTS.site_title,
    site_subtitle: initial?.site_subtitle ?? DEFAULTS.site_subtitle,
    brand_image: initial?.brand_image ?? DEFAULTS.brand_image,
  };
}

export function SiteAppearanceForm({ initial, onSubmit, onChange, isSubmitting }: SiteAppearanceFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SiteAppearanceFormData>({
    resolver: zodResolver(schema),
    defaultValues: buildInitialValues(initial),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(buildInitialValues(initial));
  }, [initial, form]);

  const watchAllFields = form.watch();

  useEffect(() => {
    if (!onChange) return;
    const timeoutId = setTimeout(() => onChange(watchAllFields), 300);
    return () => clearTimeout(timeoutId);
  }, [watchAllFields, onChange]);

  const handleFormSubmit = async (data: SiteAppearanceFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  const submitting = isLoading || !!isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="primary_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Cor Primária</FormLabel>
              <FormControl>
                <ColorPicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Esta cor será usada como tema principal da sua página.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Logo da Marca</FormLabel>
              <FormControl>
                <ImageUpload value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Recomendamos uma imagem de pelo menos 150x50 pixels.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="site_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Título da Página</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Encontre o imóvel perfeito para você"
                  className="border-gray-300 focus:border-[#9747FF] focus:ring-[#9747FF]"
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Este título será exibido em destaque na sua página.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="site_subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Subtítulo da Página</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Confira os melhores imóveis disponíveis"
                  className="border-gray-300 focus:border-[#9747FF] focus:ring-[#9747FF]"
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Uma breve descrição que aparecerá abaixo do título.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
          disabled={submitting}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Salvando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar alterações
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
