"use client";

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X, Plus } from "lucide-react";
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
import { ImageUpload } from "./image-upload";
import {
  AGENT_SPECIALTY_OPTIONS,
  type AgentProfile,
  type AgentProfilePayload,
} from "../services/agent-profiles-service";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  role_title: z.string().max(120).optional().nullable().or(z.literal("")),
  creci: z.string().max(50).optional().nullable().or(z.literal("")),
  specialty: z.string().max(255).optional().nullable().or(z.literal("")),
  mini_bio: z.string().max(500, "Máximo de 500 caracteres").optional().nullable().or(z.literal("")),
  full_bio: z.string().optional().nullable().or(z.literal("")),
  photo_url: z.string().optional().nullable().or(z.literal("")),
  banner_url: z.string().optional().nullable().or(z.literal("")),
  whatsapp: z.string().max(30).optional().nullable().or(z.literal("")),
  phone: z.string().max(30).optional().nullable().or(z.literal("")),
  email: z.string().email("E-mail inválido").max(200).optional().nullable().or(z.literal("")),
  instagram: z.string().max(200).optional().nullable().or(z.literal("")),
  facebook: z.string().max(200).optional().nullable().or(z.literal("")),
  linkedin: z.string().max(200).optional().nullable().or(z.literal("")),
  city: z.string().max(150).optional().nullable().or(z.literal("")),
  neighborhoods: z.array(z.string()).default([]),
  specialties: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  years_experience: z.coerce.number().min(0).max(99).optional().nullable(),
  is_featured: z.boolean().default(false),
  is_public: z.boolean().default(true),
});

export type AgentProfileFormValues = z.infer<typeof schema>;

interface AgentProfileFormProps {
  initial?: AgentProfile | null;
  onSubmit: (payload: AgentProfilePayload) => Promise<unknown> | unknown;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const EMPTY: AgentProfileFormValues = {
  name: "",
  role_title: "",
  creci: "",
  specialty: "",
  mini_bio: "",
  full_bio: "",
  photo_url: "",
  banner_url: "",
  whatsapp: "",
  phone: "",
  email: "",
  instagram: "",
  facebook: "",
  linkedin: "",
  city: "",
  neighborhoods: [],
  specialties: [],
  languages: [],
  years_experience: undefined as unknown as null,
  is_featured: false,
  is_public: true,
};

function buildInitial(initial: AgentProfile | null | undefined): AgentProfileFormValues {
  if (!initial) return EMPTY;
  return {
    name: initial.name ?? "",
    role_title: initial.role_title ?? "",
    creci: initial.creci ?? "",
    specialty: initial.specialty ?? "",
    mini_bio: initial.mini_bio ?? "",
    full_bio: initial.full_bio ?? "",
    photo_url: initial.photo_url ?? "",
    banner_url: initial.banner_url ?? "",
    whatsapp: initial.whatsapp ?? "",
    phone: initial.phone ?? "",
    email: initial.email ?? "",
    instagram: initial.instagram ?? "",
    facebook: initial.facebook ?? "",
    linkedin: initial.linkedin ?? "",
    city: initial.city ?? "",
    neighborhoods: initial.neighborhoods ?? [],
    specialties: initial.specialties ?? [],
    languages: initial.languages ?? [],
    years_experience: initial.years_experience,
    is_featured: !!initial.is_featured,
    is_public: !!initial.is_public,
  };
}

function toPayload(values: AgentProfileFormValues): AgentProfilePayload {
  const normalize = (v: string | null | undefined) => (v && v.trim() !== "" ? v.trim() : null);
  return {
    name: values.name.trim(),
    role_title: normalize(values.role_title),
    creci: normalize(values.creci),
    specialty: normalize(values.specialty),
    mini_bio: normalize(values.mini_bio),
    full_bio: normalize(values.full_bio),
    photo_url: normalize(values.photo_url),
    banner_url: normalize(values.banner_url),
    whatsapp: normalize(values.whatsapp),
    phone: normalize(values.phone),
    email: normalize(values.email),
    instagram: normalize(values.instagram),
    facebook: normalize(values.facebook),
    linkedin: normalize(values.linkedin),
    city: normalize(values.city),
    neighborhoods: values.neighborhoods,
    specialties: values.specialties,
    languages: values.languages,
    years_experience: values.years_experience ?? null,
    is_featured: values.is_featured,
    is_public: values.is_public,
  };
}

export function AgentProfileForm({
  initial,
  onSubmit,
  onCancel,
  isSubmitting,
}: AgentProfileFormProps) {
  const form = useForm<AgentProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: buildInitial(initial),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(buildInitial(initial));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.id]);

  const handleSubmit: SubmitHandler<AgentProfileFormValues> = async values => {
    await onSubmit(toPayload(values));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Identidade */}
        <section className="space-y-4">
          <Header title="Identidade" />

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5">
            <FormField
              control={form.control}
              name="photo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600">Foto de perfil</FormLabel>
                  <FormControl>
                    <ImageUpload value={field.value ?? ""} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription className="text-[10px]">Recomendado: 800×800px ou maior</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">Nome*</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Ricardo Almeida" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">Cargo</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} placeholder="Founder / Diretora Comercial / Broker Senior" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="creci"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">CRECI</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} placeholder="CRECI-SP 12.345-J" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">Especialidade (frase curta)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} placeholder="Especialista em mansões suspensas" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bio */}
        <section className="space-y-4">
          <Header title="Bio" />
          <FormField
            control={form.control}
            name="mini_bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-600">Mini bio (exibida no card da listagem)</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} rows={3} maxLength={500} />
                </FormControl>
                <FormDescription className="text-[10px]">Até 500 caracteres. Aparece nos cards da página de Equipe.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="full_bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-600">Bio completa (página individual)</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} rows={6} placeholder="História profissional, formação, conquistas…" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Contato */}
        <section className="space-y-4">
          <Header title="Contato" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600">WhatsApp</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="5511999990000" />
                  </FormControl>
                  <FormDescription className="text-[10px]">Apenas dígitos, com DDI+DDD</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600">Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="+55 11 99999-0000" />
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
                  <FormLabel className="text-xs font-medium text-gray-600">E-mail</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} type="email" placeholder="nome@empresa.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600">Instagram</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="@usuario ou URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600">LinkedIn</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="usuario-linkedin ou URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600">Facebook</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="usuario ou URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Atuação */}
        <section className="space-y-4">
          <Header title="Atuação" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600">Cidade base</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="São Paulo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="years_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600">Anos de mercado</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={99}
                      value={field.value ?? ""}
                      onChange={e =>
                        field.onChange(e.target.value === "" ? null : Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="neighborhoods"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-600">Bairros que atende</FormLabel>
                <FormControl>
                  <TagInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Adicionar bairro e dar Enter"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-600">Idiomas</FormLabel>
                <FormControl>
                  <TagInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Adicionar idioma e dar Enter"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialties"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-600">Tags de especialidade</FormLabel>
                <FormControl>
                  <SpecialtyToggles value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormDescription className="text-[10px]">
                  Aparecem como badges no card do corretor.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Visibilidade */}
        <section className="space-y-4">
          <Header title="Visibilidade" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleRow
              label="Publicado no site"
              description="Quando desativado, não aparece na página /equipe."
              value={form.watch("is_public")}
              onChange={v => form.setValue("is_public", v, { shouldDirty: true })}
            />
            <ToggleRow
              label="Em destaque"
              description="Aparece em primeiro lugar na ordenação."
              value={form.watch("is_featured")}
              onChange={v => form.setValue("is_featured", v, { shouldDirty: true })}
            />
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
            disabled={!!isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Salvando…" : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

/* -------------------- Subcomponents -------------------- */

function Header({ title }: { title: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#141414]">{title}</h3>
      <div className="h-px bg-gray-100 mt-2" />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-semibold text-[#141414]">{label}</div>
        <div className="text-xs text-[#777777]">{description}</div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState("");

  const add = () => {
    const v = text.trim();
    if (!v) return;
    if (value.includes(v)) {
      setText("");
      return;
    }
    onChange([...value, v]);
    setText("");
  };

  const remove = (tag: string) => onChange(value.filter(t => t !== tag));

  return (
    <div className="border border-gray-300 rounded-md px-2 py-1.5 focus-within:border-[#9747FF] focus-within:ring-2 focus-within:ring-[#9747FF]/20 bg-white">
      <div className="flex flex-wrap gap-1.5">
        {value.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#9747FF]/10 text-[#9747FF] text-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              aria-label={`Remover ${tag}`}
              className="hover:text-[#9747FF]/70"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <div className="flex items-center flex-1 min-w-[140px]">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                add();
              }
              if (e.key === "Backspace" && text === "" && value.length > 0) {
                onChange(value.slice(0, -1));
              }
            }}
            placeholder={placeholder}
            className="w-full text-sm outline-none px-1 py-0.5 bg-transparent"
          />
          {text && (
            <button
              type="button"
              onClick={add}
              className="text-[#9747FF] hover:text-[#7C3AED] text-xs inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Adicionar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SpecialtyToggles({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (s: string) => {
    if (value.includes(s)) onChange(value.filter(v => v !== s));
    else onChange([...value, s]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {AGENT_SPECIALTY_OPTIONS.map(opt => {
        const active = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
              active
                ? "border-[#9747FF] bg-[#9747FF] text-white"
                : "border-gray-200 text-[#141414] hover:border-[#9747FF]/50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
