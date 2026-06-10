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
import { ColorPicker } from "./color-picker";
import type { SiteSetting, UpdateSiteSettingPayload } from "../services/site-service";

const schema = z.object({
  site_subtitle: z.string().max(500).optional().nullable().or(z.literal("")),
  hero_eyebrow: z.string().max(80).optional().nullable().or(z.literal("")),
  hero_title_line_1: z.string().max(255).optional().nullable().or(z.literal("")),
  hero_title_line_2: z.string().max(255).optional().nullable().or(z.literal("")),
  hero_background_url: z.string().max(1000).optional().nullable().or(z.literal("")),
  hero_overlay_color: z.string().max(20).optional().nullable().or(z.literal("")),
  hero_overlay_opacity: z.number().min(0).max(100).optional().nullable(),
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
    hero_overlay_color: initial?.hero_overlay_color ?? "#0F0820",
    hero_overlay_opacity: initial?.hero_overlay_opacity ?? 75,
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
    hero_overlay_color: normalize(values.hero_overlay_color),
    hero_overlay_opacity: values.hero_overlay_opacity ?? null,
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
  }, [watched.site_subtitle, watched.hero_eyebrow, watched.hero_title_line_1, watched.hero_title_line_2, watched.hero_background_url, watched.hero_overlay_color, watched.hero_overlay_opacity]);

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

        {/* 2. Cor e transparência do overlay */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hero_overlay_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Cor do overlay
                </FormLabel>
                <FormControl>
                  <ColorPicker value={field.value ?? "#0F0820"} onChange={field.onChange} />
                </FormControl>
                <FormDescription className="text-xs">
                  Cor da camada escura sobre a imagem de fundo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hero_overlay_opacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Transparência do overlay — {field.value ?? 75}%
                </FormLabel>
                <FormControl>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={field.value ?? 75}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full accent-[#4A316A]"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  0% = totalmente transparente · 100% = totalmente opaco.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 3. Eyebrow */}
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

        {/* 4. Título linha 1 + linha 2 */}
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

        {/* 5. Subtítulo */}
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
