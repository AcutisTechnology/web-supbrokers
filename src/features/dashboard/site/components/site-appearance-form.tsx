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
  brand_image: "/logo-extendida-roxo.svg",
};

function buildInitialValues(initial: SiteSetting | undefined): SiteAppearanceFormData {
  return {
    primary_color: initial?.primary_color ?? DEFAULTS.primary_color,
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
