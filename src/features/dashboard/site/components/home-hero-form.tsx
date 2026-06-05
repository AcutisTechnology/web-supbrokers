"use client";

import { useEffect } from "react";
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
import { ImageUpload } from "./image-upload";
import type { SiteSetting, UpdateSiteSettingPayload } from "../services/site-service";

const schema = z.object({
  site_subtitle: z.string().max(500).optional().nullable().or(z.literal("")),
  hero_eyebrow: z.string().max(80).optional().nullable().or(z.literal("")),
  hero_title_line_1: z.string().max(255).optional().nullable().or(z.literal("")),
  hero_title_line_2: z.string().max(255).optional().nullable().or(z.literal("")),
  hero_background_url: z.string().max(1000).optional().nullable().or(z.literal("")),
});

export type HomeHeroFormValues = z.infer<typeof schema>;

interface HomeHeroFormProps {
  initial?: SiteSetting | undefined;
  onSubmit: (payload: UpdateSiteSettingPayload) => Promise<unknown>;
  onChange?: (data: Partial<UpdateSiteSettingPayload>) => void;
  isSubmitting?: boolean;
}

function buildInitial(initial?: SiteSetting): HomeHeroFormValues {
  return {
    site_subtitle: initial?.site_subtitle ?? "Curadoria exclusiva de imóveis de alto padrão, com a discrição que sua história merece.",
    hero_eyebrow: initial?.hero_eyebrow ?? "Curadoria exclusiva",
    hero_title_line_1: initial?.hero_title_line_1 ?? "Onde o luxo encontra",
    hero_title_line_2: initial?.hero_title_line_2 ?? "o seu novo lar.",
    hero_background_url: initial?.hero_background_url ?? "",
  };
}

function toPayload(values: HomeHeroFormValues): UpdateSiteSettingPayload {
  const normalize = (v: string | null | undefined) =>
    v && v.trim() !== "" ? v.trim() : null;
  return {
    site_subtitle: normalize(values.site_subtitle),
    hero_eyebrow: normalize(values.hero_eyebrow),
    hero_title_line_1: normalize(values.hero_title_line_1),
    hero_title_line_2: normalize(values.hero_title_line_2),
    hero_background_url: normalize(values.hero_background_url),
  };
}

export function HomeHeroForm({ initial, onSubmit, onChange, isSubmitting }: HomeHeroFormProps) {
  const form = useForm<HomeHeroFormValues>({
    resolver: zodResolver(schema),
    defaultValues: buildInitial(initial),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(buildInitial(initial));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.id]);

  // Preview ao vivo: propaga as mudanças (com debounce leve) para o pai.
  const watched = form.watch();
  useEffect(() => {
    if (!onChange) return;
    const id = setTimeout(() => onChange(toPayload(watched)), 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched.site_subtitle, watched.hero_eyebrow, watched.hero_title_line_1, watched.hero_title_line_2, watched.hero_background_url]);

  const handleSubmit = async (values: HomeHeroFormValues) => {
    await onSubmit(toPayload(values));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* 1. Imagem de fundo */}
        <FormField
          control={form.control}
          name="hero_background_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Imagem de fundo do hero
              </FormLabel>
              <FormControl>
                <ImageUpload value={field.value ?? ""} onChange={field.onChange} />
              </FormControl>
              <FormDescription className="text-xs">
                Recomendado: 2400×1200px, paisagem. Sugestão: fachada do imóvel mais marcante do
                portfólio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. Eyebrow */}
        <FormField
          control={form.control}
          name="hero_eyebrow"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Eyebrow (texto pequeno acima do título)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Ex: Curadoria exclusiva"
                  className="border-gray-300 focus:border-[#9747FF] focus:ring-[#9747FF]"
                />
              </FormControl>
              <FormDescription className="text-xs">
                Aparece em maiúsculas com tracking espaçado acima do título principal. Deixe vazio
                para ocultar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 3. Título linha 1 + linha 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hero_title_line_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Título — linha 1
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Ex: Onde o luxo encontra"
                    className="border-gray-300 focus:border-[#9747FF] focus:ring-[#9747FF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hero_title_line_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Título — linha 2 (em itálico/destaque)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Ex: o seu novo lar."
                    className="border-gray-300 focus:border-[#9747FF] focus:ring-[#9747FF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 4. Subtítulo */}
        <FormField
          control={form.control}
          name="site_subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Subtítulo da Página</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Ex: Confira os melhores imóveis disponíveis"
                  className="border-gray-300 focus:border-[#9747FF] focus:ring-[#9747FF]"
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Aparece abaixo do título principal no hero.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!!isSubmitting}
            className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Salvando…" : "Salvar Hero"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
