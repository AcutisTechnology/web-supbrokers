"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/features/dashboard/site/components/image-upload";
import {
  PAGE_TYPES,
  PAGE_TYPE_LABELS,
  PAGE_TYPE_DEFAULT_SLUGS,
  PAGE_TYPE_SYSTEM_ROUTES,
  type SitePage,
  type SitePageType,
} from "../services/site-pages-service";

const slugRegex = /^[a-z0-9/\-]+$/;

const schema = z.object({
  title: z.string().min(1, "Informe um título"),
  slug: z
    .string()
    .min(1, "Informe um slug")
    .max(191)
    .regex(slugRegex, "Use apenas letras minúsculas, números, hífen e /"),
  page_type: z.enum(PAGE_TYPES),
  hero_title: z.string().max(255).optional().nullable(),
  hero_subtitle: z.string().max(500).optional().nullable(),
  content: z.string().optional().nullable(),
  featured_image: z.string().max(1000).optional().nullable(),
  is_published: z.boolean(),
  show_in_menu: z.boolean(),
  menu_order: z.coerce.number().int().min(0),
});

export type SitePageFormValues = z.infer<typeof schema>;

interface SitePageFormProps {
  initial?: SitePage | null;
  onSubmit: (values: SitePageFormValues) => Promise<unknown> | unknown;
  onCancel: () => void;
  onChange?: (values: SitePageFormValues) => void;
  isSubmitting?: boolean;
}

function normalizePageForForm(page?: SitePage | null): SitePageFormValues {
  return {
    title: page?.title ?? "",
    slug: page?.slug ?? "",
    page_type: (page?.page_type ?? "custom") as SitePageType,
    hero_title: page?.hero_title ?? "",
    hero_subtitle: page?.hero_subtitle ?? "",
    content: page?.content ?? "",
    featured_image: page?.featured_image ?? "",
    is_published: page?.is_published ?? true,
    show_in_menu: page?.show_in_menu ?? true,
    menu_order: page?.menu_order ?? 0,
  };
}

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function SitePageForm({
  initial,
  onSubmit,
  onCancel,
  onChange,
  isSubmitting,
}: SitePageFormProps) {
  const defaults = useMemo(() => normalizePageForForm(initial), [initial]);

  const form = useForm<SitePageFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    form.reset(defaults);
  }, [defaults, form]);

  useEffect(() => {
    if (!onChange) return;
    const subscription = form.watch((value) => {
      onChange(value as SitePageFormValues);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  const isHomeLocked = initial?.is_home === true;
  const watchedType = form.watch("page_type");
  const isSystemRoute = watchedType in PAGE_TYPE_SYSTEM_ROUTES;
  const systemRoute = PAGE_TYPE_SYSTEM_ROUTES[watchedType as keyof typeof PAGE_TYPE_SYSTEM_ROUTES];

  const handleTypeChange = (value: SitePageType) => {
    form.setValue("page_type", value);
    const defaultSlug = PAGE_TYPE_DEFAULT_SLUGS[value];
    if (defaultSlug) {
      form.setValue("slug", defaultSlug, { shouldValidate: true });
    }
  };

  const handleTitleBlur = () => {
    const title = form.getValues("title");
    const slug = form.getValues("slug");
    if (title && (!slug || slug === "")) {
      form.setValue("slug", slugify(title), { shouldValidate: true });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: Quem Somos"
                    onBlur={(e) => {
                      field.onBlur();
                      handleTitleBlur();
                      e.target.blur();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="quem-somos"
                    disabled={isHomeLocked}
                  />
                </FormControl>
                <FormDescription>
                  {isHomeLocked
                    ? "O slug da home é fixo (/)."
                    : "Apenas letras minúsculas, números, hífen e /"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="page_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo da página</FormLabel>
              <Select
                onValueChange={(v) => handleTypeChange(v as SitePageType)}
                value={field.value}
                disabled={isHomeLocked}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PAGE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {PAGE_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isSystemRoute && systemRoute && (
                <FormDescription className="text-[#9747FF]">
                  Redireciona para: <span className="font-mono">/{"{seu-slug}"}/<span>{systemRoute === "/" ? "" : systemRoute}</span></span>
                </FormDescription>
              )}
              {!isSystemRoute && watchedType === "about" && (
                <FormDescription>
                  Página de CMS — conteúdo editável pelo editor abaixo.
                </FormDescription>
              )}
              {!isSystemRoute && watchedType === "custom" && (
                <FormDescription>
                  Página totalmente personalizada — slug e conteúdo livres.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hero_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero title</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} placeholder="Título principal do hero" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hero_subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero subtitle</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} placeholder="Subtítulo do hero" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="featured_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem destacada</FormLabel>
              <FormControl>
                <ImageUpload value={field.value ?? ""} onChange={(url) => field.onChange(url)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo principal</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Você pode escrever texto ou HTML simples."
                  className="min-h-[260px] font-mono text-sm"
                />
              </FormControl>
              <FormDescription>
                Suporta HTML simples (parágrafos, listas, links). Builder visual será adicionado em uma fase futura.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="is_published"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
                <div>
                  <FormLabel>Publicada</FormLabel>
                  <FormDescription>Disponível no site público.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="show_in_menu"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
                <div>
                  <FormLabel>Mostrar no menu</FormLabel>
                  <FormDescription>Aparece no menu de navegação.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="menu_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordem no menu</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
          >
            <Save className="h-4 w-4 mr-1" />
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
}
