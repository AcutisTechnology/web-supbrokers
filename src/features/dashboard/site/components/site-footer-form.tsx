"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { SiteFooter, UpdateSiteFooterPayload } from "../services/site-service";
import { ImageUpload } from "@/features/dashboard/site/components/image-upload";

const schema = z.object({
  company_name: z.string().max(255).optional().or(z.literal("")),
  footer_logo: z.string().max(1000).optional().nullable(),
  email: z.string().email("E-mail inválido").max(255).optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  whatsapp: z.string().max(50).optional().or(z.literal("")),
  address: z.string().max(255).optional().or(z.literal("")),
  address_number: z.string().max(50).optional().or(z.literal("")),
  district: z.string().max(150).optional().or(z.literal("")),
  city: z.string().max(150).optional().or(z.literal("")),
  state: z.string().max(50).optional().or(z.literal("")),
  zipcode: z.string().max(20).optional().or(z.literal("")),
  creci: z.string().max(50).optional().or(z.literal("")),
  footer_text: z.string().max(2000).optional().or(z.literal("")),
  show_social_links: z.boolean(),
});

export type SiteFooterFormData = z.infer<typeof schema>;

interface SiteFooterFormProps {
  initial: SiteFooter | undefined;
  onSubmit: (payload: UpdateSiteFooterPayload) => Promise<unknown>;
  onChange?: (data: Partial<SiteFooterFormData>) => void;
  isSubmitting?: boolean;
}

function buildInitial(initial: SiteFooter | undefined): SiteFooterFormData {
  return {
    company_name: initial?.company_name ?? "",
    footer_logo: initial?.footer_logo ?? null,
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    whatsapp: initial?.whatsapp ?? "",
    address: initial?.address ?? "",
    address_number: initial?.address_number ?? "",
    district: initial?.district ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    zipcode: initial?.zipcode ?? "",
    creci: initial?.creci ?? "",
    footer_text: initial?.footer_text ?? "",
    show_social_links: initial?.show_social_links ?? true,
  };
}

function emptyToNull<T extends Record<string, unknown>>(values: T): UpdateSiteFooterPayload {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string") {
      result[key] = value.trim() === "" ? null : value;
    } else {
      result[key] = value;
    }
  }
  return result as UpdateSiteFooterPayload;
}

export function SiteFooterForm({ initial, onSubmit, onChange, isSubmitting }: SiteFooterFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SiteFooterFormData>({
    resolver: zodResolver(schema),
    defaultValues: buildInitial(initial),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(buildInitial(initial));
  }, [initial, form]);

  const watchAllFields = form.watch();
  useEffect(() => {
    if (!onChange) return;
    const t = setTimeout(() => onChange(watchAllFields), 300);
    return () => clearTimeout(t);
  }, [watchAllFields, onChange]);

  const handleFormSubmit = async (data: SiteFooterFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(emptyToNull(data));
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
          name="footer_logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Logo do rodapé</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value ?? ""}
                  onChange={(url) => field.onChange(url || null)}
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Logo exibida no rodapé do site público. Se não definida, usa a logo principal da Aparência.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Nome da Empresa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Imobiliária XYZ" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="creci"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">CRECI</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="CRECI 12345-J" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">E-mail</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="contato@empresa.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Telefone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(00) 0000-0000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">WhatsApp</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(00) 00000-0000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <FormField
            control={form.control}
            name="zipcode"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-medium text-gray-700">CEP</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="00000-000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel className="text-sm font-medium text-gray-700">Endereço</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Rua, Avenida..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Número</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-medium text-gray-700">Bairro</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Centro" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel className="text-sm font-medium text-gray-700">Cidade</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="São Paulo" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">UF</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="SP" maxLength={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="footer_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Texto do rodapé</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} placeholder="Texto livre exibido no rodapé do site público." />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Use este espaço para mensagens institucionais, copyright ou avisos legais.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="show_social_links"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm font-medium text-gray-700">Exibir redes sociais no rodapé</FormLabel>
                <FormDescription className="text-xs text-gray-500">
                  Quando ativado, os links cadastrados em &quot;Redes Sociais&quot; aparecem no rodapé.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
          disabled={submitting}
        >
          <span className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {submitting ? "Salvando..." : "Salvar alterações"}
          </span>
        </Button>
      </form>
    </Form>
  );
}
