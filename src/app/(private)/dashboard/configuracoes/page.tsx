"use client";

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/shared/hooks/auth/use-auth";
import { useProfile, useUpdateProfile } from "@/features/dashboard/profile/services/profile-service";
import { SiteAppearanceForm, type SiteAppearanceFormData } from "@/features/dashboard/site/components/site-appearance-form";
import { SiteFooterForm, type SiteFooterFormData } from "@/features/dashboard/site/components/site-footer-form";
import { SiteSocialLinksManager } from "@/features/dashboard/site/components/site-social-links-manager";
import { AgentProfilesManager } from "@/features/dashboard/site/components/agent-profiles-manager";
import { HomeHeroForm } from "@/features/dashboard/site/components/home-hero-form";
import { SiteStatsManager } from "@/features/dashboard/site/components/site-stats-manager";
import { InstitutionalForm } from "@/features/dashboard/site/components/institutional-form";
import { TestimonialsManager } from "@/features/dashboard/site/components/testimonials-manager";
import { HomeLayoutManager } from "@/features/dashboard/site/components/home-layout-manager";
import { SeoListingForm } from "@/features/dashboard/site/components/seo-listing-form";
import { WhatsappTemplatesManager } from "@/features/dashboard/site/components/whatsapp-templates-manager";
import { SitePreview } from "@/features/dashboard/site/components/site-preview";
import { SitePagesManager } from "@/features/dashboard/site/components/site-pages-manager";
import { SitePagePreview } from "@/features/dashboard/site/components/site-page-preview";
import { useSiteFooter, useSiteSettings, useSiteSocialLinks } from "@/features/dashboard/site/hooks/use-site";
import { useSitePages } from "@/features/dashboard/site/hooks/use-site-pages";
import type { SitePage } from "@/features/dashboard/site/services/site-pages-service";
import type { SitePageFormValues } from "@/features/dashboard/site/components/site-pages-form";
import { useSettings } from "@/features/dashboard/settings/hooks/use-settings";
import type { TeamMemberSetting, UserSettingsData } from "@/features/dashboard/settings/services/settings-service";
import { cn } from "@/lib/utils";
import { Building2, Calendar, CreditCard, Globe, PlugZap, Settings2, Shield, ShieldCheck, Users, UserCircle2 } from "lucide-react";
import { GruposPermissaoFeature } from "@/features/dashboard/grupos-permissao";

type SectionKey = "profile" | "company" | "page" | "team" | "billing" | "integrations" | "automations" | "permissions";

const settingsSections: Array<{
  key: SectionKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    key: "profile",
    label: "Meu Perfil",
    description: "Dados pessoais e segurança",
    icon: UserCircle2,
  },
  {
    key: "company",
    label: "Imobiliária",
    description: "Dados, contato e endereço",
    icon: Building2,
  },
  {
    key: "page",
    label: "Página",
    description: "Aparência da sua página pública",
    icon: Globe,
  },
  {
    key: "team",
    label: "Equipe & Acesso",
    description: "Convidar e gerenciar membros",
    icon: Users,
  },
  {
    key: "billing",
    label: "Planos & Faturas",
    description: "Assinaturas e pagamentos",
    icon: CreditCard,
  },
  {
    key: "integrations",
    label: "Integrações",
    description: "Conectar serviços externos",
    icon: PlugZap,
  },
  {
    key: "automations",
    label: "Automações (Cobrança)",
    description: "Fluxos e regras de cobrança",
    icon: Settings2,
  },
  {
    key: "permissions",
    label: "Grupos de Permissão",
    description: "Gerenciar grupos e acessos",
    icon: ShieldCheck,
  },
];

const getInitials = (name: string | null | undefined) => {
  const safe = (name ?? "").trim();
  if (!safe) return "U";
  const parts = safe.split(/\s+/g).filter(Boolean);
  const first = parts[0]?.[0] ?? "U";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return `${first}${last}`.toUpperCase();
};

const getSubscriptionLabel = (status?: "NO_SUBSCRIPTION" | "FREE_TRIAL" | "ACTIVE") => {
  if (status === "ACTIVE") return "Plano ativo";
  if (status === "FREE_TRIAL") return "Teste grátis";
  return "Sem plano";
};

const createEmptyCompanyDraft = () => ({
  trade_name: "",
  legal_name: "",
  document: "",
  creci: "",
  email: "",
  phone: "",
  website: "",
  description: "",
  address: {
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zip_code: "",
  },
  financial: {
    receiving_account: "",
    escrow_account: "",
    pix_key: "",
  },
});

const normalizeCompanyDraft = (company?: UserSettingsData["company"]) => ({
  trade_name: company?.trade_name ?? "",
  legal_name: company?.legal_name ?? "",
  document: company?.document ?? "",
  creci: company?.creci ?? "",
  email: company?.email ?? "",
  phone: company?.phone ?? "",
  website: company?.website ?? "",
  description: company?.description ?? "",
  address: {
    street: company?.address.street ?? "",
    number: company?.address.number ?? "",
    neighborhood: company?.address.neighborhood ?? "",
    city: company?.address.city ?? "",
    state: company?.address.state ?? "",
    zip_code: company?.address.zip_code ?? "",
  },
  financial: {
    receiving_account: company?.financial.receiving_account ?? "",
    escrow_account: company?.financial.escrow_account ?? "",
    pix_key: company?.financial.pix_key ?? "",
  },
});

export default function ConfiguracoesPage() {
  return (
    <Suspense fallback={<SettingsPageSkeleton />}>
      <ConfiguracoesPageContent />
    </Suspense>
  );
}

function ConfiguracoesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sectionParam = (searchParams.get("sec") ?? "profile") as SectionKey;
  const section: SectionKey = settingsSections.some((s) => s.key === sectionParam) ? sectionParam : "profile";

  const setSection = (next: SectionKey) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("sec", next);
    router.replace(`/dashboard/configuracoes?${params.toString()}`);
  };

  const active = settingsSections.find((s) => s.key === section) ?? settingsSections[0];

  return (
    <>
      <TopNav title_secondary="Configurações" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 xl:col-span-3">
          <SettingsSidebar activeKey={section} onSelect={setSection} />
        </div>

        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {active.key === "profile" && <ProfileSection />}
          {active.key === "company" && <CompanySection />}
          {active.key === "page" && <PageSection />}
          {active.key === "team" && <TeamAccessSection />}
          {active.key === "billing" && <BillingSection />}
          {active.key === "integrations" && <IntegrationsSection />}
          {active.key === "automations" && <AutomationsSection />}
          {active.key === "permissions" && <PermissionGroupsSection />}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-[#777777]">Copyright © iMoobile. Todos os direitos reservados</div>
    </>
  );
}

function SettingsPageSkeleton() {
  return (
    <>
      <TopNav title_secondary="Configurações" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 xl:col-span-3">
          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="h-10 w-full bg-gray-100 rounded-xl" />
                <div className="h-10 w-full bg-gray-100 rounded-xl" />
                <div className="h-10 w-full bg-gray-100 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-8 xl:col-span-9">
          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-6 w-48 bg-gray-100 rounded" />
                <div className="h-4 w-80 bg-gray-100 rounded" />
                <div className="h-10 w-full bg-gray-100 rounded-xl" />
                <div className="h-10 w-full bg-gray-100 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function SettingsSidebar({
  activeKey,
  onSelect,
}: {
  activeKey: SectionKey;
  onSelect: (key: SectionKey) => void;
}) {
  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Configurações</CardTitle>
        <CardDescription>Gerencie preferências e dados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {settingsSections.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={cn(
                "w-full flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors border",
                isActive
                  ? "bg-[#9747FF]/10 border-[#9747FF]/20"
                  : "bg-white border-transparent hover:bg-gray-50"
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                  isActive ? "bg-[#9747FF]/15" : "bg-gray-100"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-[#9747FF]" : "text-[#141414]")} />
              </div>
              <div className="min-w-0">
                <div className={cn("text-sm font-semibold truncate", isActive ? "text-[#141414]" : "text-[#141414]")}>
                  {item.label}
                </div>
                <div className="text-xs text-[#777777] truncate">{item.description}</div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

function SettingsHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#141414]">{title}</h1>
        <p className="text-[#777777] mt-1">{description}</p>
      </div>
      {action ? <div className="flex items-center gap-3">{action}</div> : null}
    </div>
  );
}

function SettingsCard({
  title,
  description,
  children,
  right,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl">
      <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {right ? <div className="flex items-center gap-2">{right}</div> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ProfileSection() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch } = useProfile();
  const updateProfile = useUpdateProfile();
  const {
    data: settingsResponse,
    isLoading: isSettingsLoading,
    isError: isSettingsError,
    error: settingsError,
    refetch: refetchSettings,
    updateSettings,
    isUpdating: isUpdatingSettings,
  } = useSettings();

  const profile = data?.data;
  const settings = settingsResponse?.data;

  const groupName = user?.user?.permission_group?.name ?? null;

  const [draft, setDraft] = useState({
    name: user?.user?.name ?? "",
    email: user?.user?.email ?? "",
    phone: "",
  });
  const [didInit, setDidInit] = useState(false);

  const [twoFaEnabled, setTwoFaEnabled] = useState(false);

  useEffect(() => {
    if (didInit || (!profile && !settings)) return;
    setDraft({
      name: profile?.name ?? user?.user?.name ?? "",
      email: profile?.email ?? user?.user?.email ?? "",
      phone: profile?.phone ?? "",
    });
    setTwoFaEnabled(settings?.security.two_factor_enabled ?? false);
    setDidInit(true);
  }, [didInit, profile, settings, user?.user?.email, user?.user?.name]);

  const onSave = async () => {
    try {
      await updateProfile.mutateAsync({
        name: draft.name.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
      });

      await refetch();
    } catch {
      toast({
        title: "Erro ao salvar perfil",
        description: "Verifique os campos e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const onSaveSecurity = async () => {
    try {
      await updateSettings({
        security: {
          two_factor_enabled: twoFaEnabled,
        },
      });
      await refetchSettings();
    } catch {
      // Toast handled by the hook.
    }
  };

  const isSectionLoading = isLoading || isSettingsLoading;
  const sectionError = (error as Error) || (settingsError as Error);

  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Meu Perfil"
        description="Atualize seus dados pessoais e preferências de segurança."
        action={
          <Button
            className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
            onClick={onSave}
            disabled={updateProfile.isPending}
          >
            Salvar
          </Button>
        }
      />

      <LoadingState
        isLoading={isSectionLoading}
        isError={isError || isSettingsError}
        error={sectionError}
        onRetry={() => {
          refetch();
          refetchSettings();
        }}
      />

      {!isSectionLoading && !isError && !isSettingsError && (
        <>
          <SettingsCard
            title="Perfil"
            description="Informações básicas do seu usuário."
            right={
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-[#777777] border border-gray-200">
                  {getSubscriptionLabel(user?.user?.subscription?.status)}
                </Badge>
              </div>
            }
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-[#9747FF]/10 text-[#9747FF] font-semibold">
                    {getInitials(draft.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-base font-semibold text-[#141414]">{draft.name || "Usuário"}</div>
                  <div className="text-sm text-[#777777]">{groupName ?? "Sem grupo"}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome completo</Label>
                <Input value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label>Cargo (Grupo)</Label>
                <Input value={groupName ?? "Sem grupo"} disabled className="bg-gray-50 text-[#777777] cursor-not-allowed" />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={draft.email} onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={draft.phone} onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title="Segurança" description="Controle de segurança e autenticação.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-[#141414]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#141414]">2FA</div>
                    <div className="text-xs text-[#777777]">Exigir confirmação adicional no login</div>
                  </div>
                </div>
                <Switch checked={twoFaEnabled} onCheckedChange={setTwoFaEnabled} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={onSaveSecurity}
                disabled={isUpdatingSettings}
              >
                Salvar segurança
              </Button>
            </div>
          </SettingsCard>
        </>
      )}
    </div>
  );
}

function CompanySection() {
  const { data, isLoading, isError, error, refetch, updateSettings, isUpdating } = useSettings();
  const company = data?.data.company;
  const [draft, setDraft] = useState(createEmptyCompanyDraft);
  const [didInit, setDidInit] = useState(false);

  useEffect(() => {
    if (!company || didInit) return;
    setDraft(normalizeCompanyDraft(company));
    setDidInit(true);
  }, [company, didInit]);

  const save = async () => {
    try {
      await updateSettings({
        company: draft,
      });
      await refetch();
    } catch {
      // Toast handled by the hook.
    }
  };

  const updateAddress = (field: keyof ReturnType<typeof createEmptyCompanyDraft>["address"], value: string) => {
    setDraft((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const updateFinancial = (field: keyof ReturnType<typeof createEmptyCompanyDraft>["financial"], value: string) => {
    setDraft((prev) => ({
      ...prev,
      financial: {
        ...prev.financial,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Imobiliária"
        description="Organize os dados da empresa e personalize sua presença."
        action={
          <Button
            className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
            onClick={save}
            disabled={isUpdating}
          >
            Salvar
          </Button>
        }
      />

      <LoadingState isLoading={isLoading} isError={isError} error={error as Error} onRetry={() => refetch()} />

      {!isLoading && !isError && <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SettingsCard title="Dados da empresa" description="Informações principais da imobiliária.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome fantasia</Label>
              <Input value={draft.trade_name} onChange={(e) => setDraft((prev) => ({ ...prev, trade_name: e.target.value }))} placeholder="Ex: Imobiliária Exemplo" />
            </div>
            <div className="space-y-2">
              <Label>Razão social</Label>
              <Input value={draft.legal_name} onChange={(e) => setDraft((prev) => ({ ...prev, legal_name: e.target.value }))} placeholder="Ex: Exemplo LTDA" />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input value={draft.document} onChange={(e) => setDraft((prev) => ({ ...prev, document: e.target.value }))} placeholder="00.000.000/0000-00" />
            </div>
            <div className="space-y-2">
              <Label>CRECI</Label>
              <Input value={draft.creci} onChange={(e) => setDraft((prev) => ({ ...prev, creci: e.target.value }))} placeholder="00000-J" />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Contato" description="Canais oficiais de contato.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={draft.email} onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))} placeholder="contato@imobiliaria.com" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={draft.phone} onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))} placeholder="(00) 00000-0000" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Website</Label>
              <Input value={draft.website} onChange={(e) => setDraft((prev) => ({ ...prev, website: e.target.value }))} placeholder="https://seusite.com.br" />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Área de atuação" description="Descreva regiões e perfis de imóveis que você atende.">
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={draft.description}
              onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Ex: Atendemos João Pessoa e região metropolitana, com foco em imóveis residenciais e lançamentos."
              className="min-h-[140px]"
            />
          </div>
        </SettingsCard>

        <SettingsCard title="Endereço" description="Endereço administrativo e fiscal.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Logradouro</Label>
              <Input value={draft.address.street} onChange={(e) => updateAddress("street", e.target.value)} placeholder="Rua/Av..." />
            </div>
            <div className="space-y-2">
              <Label>Número</Label>
              <Input value={draft.address.number} onChange={(e) => updateAddress("number", e.target.value)} placeholder="000" />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input value={draft.address.neighborhood} onChange={(e) => updateAddress("neighborhood", e.target.value)} placeholder="Centro" />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input value={draft.address.city} onChange={(e) => updateAddress("city", e.target.value)} placeholder="João Pessoa" />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Input value={draft.address.state} onChange={(e) => updateAddress("state", e.target.value)} placeholder="PB" />
            </div>
            <div className="space-y-2">
              <Label>CEP</Label>
              <Input value={draft.address.zip_code} onChange={(e) => updateAddress("zip_code", e.target.value)} placeholder="00000-000" />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Financeiro" description="Dados para recebimento e caução.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Conta de recebimento</Label>
              <Input value={draft.financial.receiving_account} onChange={(e) => updateFinancial("receiving_account", e.target.value)} placeholder="Banco / Agência / Conta" />
            </div>
            <div className="space-y-2">
              <Label>Conta de caução</Label>
              <Input value={draft.financial.escrow_account} onChange={(e) => updateFinancial("escrow_account", e.target.value)} placeholder="Banco / Agência / Conta" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>PIX</Label>
              <Input value={draft.financial.pix_key} onChange={(e) => updateFinancial("pix_key", e.target.value)} placeholder="Chave PIX" />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Documentos" description="Arquivos padrão para seus atendimentos.">
          <div className="space-y-2">
            <Label>Rodapé PDF/DOCX</Label>
            <Input placeholder="Upload (em breve)" disabled />
            <div className="text-xs text-[#777777]">Este campo será conectado à área de uploads do sistema.</div>
          </div>
        </SettingsCard>
      </div>}
    </div>
  );
}

type PageSubTab =
  | "appearance"
  | "home"
  | "footer"
  | "social"
  | "pages"
  | "team"
  | "messages";

function PageSection() {
  const [tab, setTab] = useState<PageSubTab>("appearance");

  const {
    settings,
    isLoading: isLoadingSettings,
    isError: isErrorSettings,
    error: errorSettings,
    refetch: refetchSettings,
    update: updateSettings,
    isUpdating: isUpdatingSettings,
  } = useSiteSettings();

  const {
    footer,
    isLoading: isLoadingFooter,
    isError: isErrorFooter,
    error: errorFooter,
    refetch: refetchFooter,
    update: updateFooter,
    isUpdating: isUpdatingFooter,
  } = useSiteFooter();

  const {
    socialLinks,
    isLoading: isLoadingSocial,
    isError: isErrorSocial,
    error: errorSocial,
    refetch: refetchSocial,
    create: createSocial,
    update: updateSocial,
    remove: removeSocial,
    isCreating,
    isUpdating: isUpdatingSocial,
    isRemoving,
  } = useSiteSocialLinks();

  const isLoading = isLoadingSettings || isLoadingFooter || isLoadingSocial;
  const isError = isErrorSettings || isErrorFooter || isErrorSocial;
  const error = (errorSettings || errorFooter || errorSocial) as Error | null;

  const retryAll = () => {
    refetchSettings();
    refetchFooter();
    refetchSocial();
  };

  const [previewSettings, setPreviewSettings] = useState<Partial<SiteAppearanceFormData>>({});
  const [previewFooter, setPreviewFooter] = useState<Partial<SiteFooterFormData>>({});

  useEffect(() => {
    if (settings) {
      setPreviewSettings({
        primary_color: settings.primary_color ?? undefined,
        site_title: settings.site_title ?? undefined,
        site_subtitle: settings.site_subtitle ?? undefined,
        brand_image: settings.brand_image ?? undefined,
      });
    }
  }, [settings]);

  useEffect(() => {
    if (footer) {
      setPreviewFooter({
        company_name: footer.company_name ?? "",
        email: footer.email ?? "",
        phone: footer.phone ?? "",
        whatsapp: footer.whatsapp ?? "",
        address: footer.address ?? "",
        address_number: footer.address_number ?? "",
        district: footer.district ?? "",
        city: footer.city ?? "",
        state: footer.state ?? "",
        zipcode: footer.zipcode ?? "",
        creci: footer.creci ?? "",
        footer_text: footer.footer_text ?? "",
        show_social_links: footer.show_social_links,
      });
    }
  }, [footer]);

  const subTabs: Array<{ key: PageSubTab; label: string; description: string }> = [
    { key: "appearance", label: "Aparência", description: "Cores, logo e cabeçalho" },
    { key: "home", label: "Home", description: "Hero e estatísticas" },
    { key: "footer", label: "Rodapé", description: "Contato, endereço e CRECI" },
    { key: "social", label: "Redes Sociais", description: "Links exibidos no rodapé" },
    { key: "pages", label: "Páginas", description: "Páginas institucionais do site" },
    { key: "team", label: "Equipe", description: "Corretores da página /equipe" },
    { key: "messages", label: "Mensagens", description: "Templates de WhatsApp" },
  ];

  const { pages: sitePages } = useSitePages();
  const menuPages = sitePages.filter((p) => p.is_published && p.show_in_menu);
  const [activePage, setActivePage] = useState<SitePage | undefined>(undefined);
  const [pageDraft, setPageDraft] = useState<SitePageFormValues | null>(null);

  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Página"
        description="Configure como sua página pública é exibida para o cliente."
      />

      <LoadingState isLoading={isLoading} isError={isError} error={error ?? undefined} onRetry={retryAll} />

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
              {subTabs.map((item) => {
                const isActive = item.key === tab;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key)}
                    className={cn(
                      "flex-1 min-w-[120px] rounded-xl px-3 py-2 text-left transition-colors",
                      isActive ? "bg-[#9747FF]/10" : "hover:bg-gray-50"
                    )}
                  >
                    <div className={cn("text-sm font-semibold", isActive ? "text-[#9747FF]" : "text-[#141414]")}>
                      {item.label}
                    </div>
                    <div className="text-xs text-[#777777]">{item.description}</div>
                  </button>
                );
              })}
            </div>

            {tab === "appearance" && (
              <SettingsCard title="Aparência" description="Cor primária, logomarca e textos do cabeçalho.">
                <SiteAppearanceForm
                  initial={settings}
                  onSubmit={async (payload) => {
                    await updateSettings(payload);
                  }}
                  onChange={(data) => setPreviewSettings((prev) => ({ ...prev, ...data }))}
                  isSubmitting={isUpdatingSettings}
                />
              </SettingsCard>
            )}

            {tab === "appearance" && (
              <SettingsCard
                title="SEO & Listagem"
                description="Meta tags, imagem de compartilhamento e preferências da listagem de imóveis."
              >
                <SeoListingForm
                  initial={settings}
                  onSubmit={async payload => {
                    await updateSettings(payload);
                  }}
                  isSubmitting={isUpdatingSettings}
                />
              </SettingsCard>
            )}

            {tab === "footer" && (
              <SettingsCard title="Rodapé" description="Dados de contato e textos exibidos no rodapé do site público.">
                <SiteFooterForm
                  initial={footer}
                  onSubmit={async (payload) => {
                    await updateFooter(payload);
                  }}
                  onChange={(data) => setPreviewFooter((prev) => ({ ...prev, ...data }))}
                  isSubmitting={isUpdatingFooter}
                />
              </SettingsCard>
            )}

            {tab === "social" && (
              <SettingsCard
                title="Redes Sociais"
                description="Cadastre os perfis sociais que aparecerão no rodapé."
              >
                <SiteSocialLinksManager
                  socialLinks={socialLinks}
                  isLoading={isLoadingSocial}
                  onCreate={createSocial}
                  onUpdate={(id, payload) => updateSocial({ id, payload })}
                  onDelete={removeSocial}
                  isMutating={isCreating || isUpdatingSocial || isRemoving}
                />
              </SettingsCard>
            )}

            {tab === "pages" && (
              <SettingsCard
                title="Páginas"
                description="Gerencie as páginas institucionais do site público."
              >
                <SitePagesManager
                  onActivePageChange={setActivePage}
                  onDraftChange={setPageDraft}
                />
              </SettingsCard>
            )}

            {tab === "team" && (
              <SettingsCard
                title="Equipe / Corretores"
                description="Gerencie os corretores exibidos na página /equipe do site público."
              >
                <AgentProfilesManager />
              </SettingsCard>
            )}

            {tab === "messages" && (
              <SettingsCard
                title="Mensagens de WhatsApp"
                description="Personalize as mensagens pré-preenchidas dos botões de WhatsApp em todo o site."
              >
                <WhatsappTemplatesManager />
              </SettingsCard>
            )}

            {tab === "home" && (
              <div className="space-y-4">
                <SettingsCard
                  title="Seções da Home"
                  description="Ative, desative e reordene as seções exibidas na home pública."
                >
                  <HomeLayoutManager />
                </SettingsCard>
                <SettingsCard
                  title="Hero da Home"
                  description="Imagem de fundo, eyebrow, título em 2 linhas e subtítulo do hero principal."
                >
                  <HomeHeroForm
                    initial={settings}
                    onSubmit={async payload => {
                      await updateSettings(payload);
                      setPreviewSettings(prev => ({
                        ...prev,
                        site_subtitle: payload.site_subtitle ?? undefined,
                      }));
                    }}
                    isSubmitting={isUpdatingSettings}
                  />
                </SettingsCard>
                <SettingsCard
                  title="Estatísticas"
                  description="Cards numéricos exibidos abaixo do hero (anos de mercado, imóveis vendidos, etc.)."
                >
                  <SiteStatsManager />
                </SettingsCard>
                <SettingsCard
                  title="Institucional (Sobre)"
                  description="Seção 'Sobre' da home: imagem, textos, valores e diferenciais."
                >
                  <InstitutionalForm />
                </SettingsCard>
                <SettingsCard
                  title="Depoimentos"
                  description="Depoimentos de clientes exibidos no slider da home."
                >
                  <TestimonialsManager />
                </SettingsCard>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <SettingsCard title="Preview" description="Pré-visualização em tempo real.">
              {tab === "pages" ? (
                <SitePagePreview
                  settings={{ ...settings, ...previewSettings }}
                  footer={{ ...footer, ...previewFooter }}
                  socialLinks={socialLinks}
                  menuPages={menuPages}
                  page={activePage}
                  draft={pageDraft}
                />
              ) : (
                <SitePreview
                  settings={{ ...settings, ...previewSettings }}
                  footer={{ ...footer, ...previewFooter }}
                  socialLinks={socialLinks}
                />
              )}
            </SettingsCard>
          </div>
        </div>
      )}
    </div>
  );
}

function TeamAccessSection() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch, updateSettings, isUpdating } = useSettings();

  const [invite, setInvite] = useState({ email: "", role: "corretor" });
  const [members, setMembers] = useState<TeamMemberSetting[]>([]);
  const [didInit, setDidInit] = useState(false);

  useEffect(() => {
    if (!data?.data.team.members || didInit) return;
    setMembers(data.data.team.members);
    setDidInit(true);
  }, [data?.data.team.members, didInit]);

  const ownerMember = useMemo(
    () => ({
      id: `owner-${user?.user?.id ?? "current"}`,
      name: user?.user?.name ?? "Usuário",
      email: user?.user?.email ?? "email@exemplo.com",
      role: data?.data.profile.job_title ?? "Administrador",
      status: "Ativo" as const,
    }),
    [data?.data.profile.job_title, user?.user?.email, user?.user?.id, user?.user?.name]
  );

  const persistMembers = async (nextMembers: TeamMemberSetting[]) => {
    setMembers(nextMembers);

    try {
      await updateSettings({
        team: {
          members: nextMembers,
        },
      });
      await refetch();
    } catch {
      setMembers(members);
    }
  };

  const handleInvite = async () => {
    if (!invite.email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Informe o email do membro que deseja convidar.",
        variant: "destructive",
      });
      return;
    }

    const nextMembers = [
      ...members,
      {
        id: `member-${Date.now()}`,
        name: invite.email.split("@")[0] || "Novo membro",
        email: invite.email.trim(),
        role: invite.role.trim() || "corretor",
        status: "Convite pendente" as const,
      },
    ];

    await persistMembers(nextMembers);
    setInvite({ email: "", role: "corretor" });
  };

  const handleRemove = async (memberId: string) => {
    await persistMembers(members.filter((member) => member.id !== memberId));
  };

  const tableMembers = [ownerMember, ...members];

  return (
    <div className="space-y-6">
      <SettingsHeader title="Equipe & Acesso" description="Convide membros e gerencie permissões." />

      <LoadingState isLoading={isLoading} isError={isError} error={error as Error} onRetry={() => refetch()} />

      {!isLoading && !isError && <>
      <SettingsCard title="Convidar membro" description="Envie um convite por email para sua equipe.">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 space-y-2">
            <Label>Email</Label>
            <Input value={invite.email} onChange={(e) => setInvite((p) => ({ ...p, email: e.target.value }))} placeholder="email@exemplo.com" />
          </div>
          <div className="md:col-span-4 space-y-2">
            <Label>Cargo</Label>
            <Input value={invite.role} onChange={(e) => setInvite((p) => ({ ...p, role: e.target.value }))} placeholder="corretor" />
          </div>
          <div className="md:col-span-2 flex items-end">
            <Button
              className="w-full bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
              onClick={handleInvite}
              disabled={isUpdating}
            >
              Convidar
            </Button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Membros" description="Gerencie acesso e perfis da sua equipe.">
        <div className="bg-white rounded-xl border border-[#E2E2E2] overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E2E2E2]">
                <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">NOME</th>
                <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">EMAIL</th>
                <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">CARGO</th>
                <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">STATUS</th>
                <th className="text-right px-6 py-4 font-semibold text-[#4A316A]">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {tableMembers.map((m) => (
                <tr key={m.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-[#141414] font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-[#9747FF]/10 text-[#9747FF] font-semibold">
                          {getInitials(m.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{m.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#141414]">{m.email}</td>
                  <td className="px-6 py-4 text-[#141414]">{m.role}</td>
                  <td className="px-6 py-4">
                    <Badge className={m.status === "Ativo" ? "bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]" : "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]"}>
                      {m.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {m.id !== ownerMember.id ? (
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemove(m.id)}
                        disabled={isUpdating}
                      >
                        Remover
                      </Button>
                    ) : (
                      <span className="text-xs text-[#777777]">Proprietário</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>
      </>}
    </div>
  );
}

function BillingSection() {
  return (
    <div className="space-y-6">
      <SettingsHeader title="Planos & Faturas" description="Gerencie sua assinatura, faturas e upgrades." />

      <SettingsCard title="Plano atual" description="Resumo do plano e recursos inclusos.">
        <div className="p-6 rounded-2xl border border-gray-100 bg-gradient-to-r from-[#9747FF]/10 to-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm text-[#777777]">Plano</div>
              <div className="text-xl font-semibold text-[#141414]">Profissional</div>
              <div className="text-sm text-[#777777] mt-1">R$ 0,00 / mês (mock)</div>
            </div>
            <Button asChild className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90">
              <Link href="/dashboard/planos">Upgrade</Link>
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {["CRM de Leads", "Captações", "Disparo em massa", "Página de imóveis"].map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm text-[#141414]">
                <span className="w-2 h-2 rounded-full bg-[#9747FF]" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}

function IntegrationsSection() {
  const { data, isLoading, isError, error, refetch, updateSettings, isUpdating } = useSettings();

  const integrationsState = data?.data.integrations;

  const integrations = useMemo(
    () => [
      {
        id: "canal_pro",
        name: "Canal PRO",
        description: "Conecte seu canal de conteúdo e captação.",
        icon: <UserCircle2 className="h-5 w-5 text-[#141414]" />,
      },
      {
        id: "asaas",
        name: "Asaas",
        description: "Pagamentos, cobranças e assinaturas.",
        icon: <CreditCard className="h-5 w-5 text-[#141414]" />,
      },
      {
        id: "whatsapp",
        name: "WhatsApp",
        description: "Sessão via QR Code (WhatsApp Web).",
        icon: <PlugZap className="h-5 w-5 text-[#141414]" />,
      },
      {
        id: "google_calendar",
        name: "Google Calendar",
        description: "Sincronize agenda e compromissos.",
        icon: <Calendar className="h-5 w-5 text-[#141414]" />,
      },
    ],
    []
  );

  const toggleIntegration = async (integrationId: keyof NonNullable<typeof integrationsState>) => {
    if (!integrationsState) return;

    try {
      await updateSettings({
        integrations: {
          [integrationId]: {
            enabled: !integrationsState[integrationId].enabled,
          },
        },
      });
      await refetch();
    } catch {
      // Toast handled by the hook.
    }
  };

  return (
    <div className="space-y-6">
      <SettingsHeader title="Integrações" description="Conecte serviços para automatizar rotinas e dados." />

      <LoadingState isLoading={isLoading} isError={isError} error={error as Error} onRetry={() => refetch()} />

      {!isLoading && !isError && <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {integrations.map((i) => (
          <Card key={i.id} className="border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {(() => {
                const isEnabled = integrationsState?.[i.id as keyof NonNullable<typeof integrationsState>]?.enabled ?? false;

                return (
                  <>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">{i.icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-[#141414]">{i.name}</div>
                    <div className="text-xs text-[#777777] mt-0.5">{i.description}</div>
                  </div>
                </div>
                <Badge className={isEnabled ? "bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]" : "bg-gray-100 text-[#777777] border border-gray-200"}>
                  {isEnabled ? "Conectado" : "Desconectado"}
                </Badge>
              </div>

              <Button
                className="w-full mt-4 bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
                onClick={() => toggleIntegration(i.id as keyof NonNullable<typeof integrationsState>)}
                disabled={isUpdating}
              >
                {isEnabled ? "Desconectar" : "Conectar"}
              </Button>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        ))}
      </div>}
    </div>
  );
}

function PermissionGroupsSection() {
  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Grupos de Permissão"
        description="Crie e gerencie grupos com conjuntos de permissões para sua equipe."
      />
      <GruposPermissaoFeature />
    </div>
  );
}

function AutomationsSection() {
  const { data, isLoading, isError, error, refetch, updateSettings, isUpdating } = useSettings();
  const automations = data?.data.automations;
  const [sendOnDue, setSendOnDue] = useState(true);
  const [autoCharge, setAutoCharge] = useState(false);
  const [daysNotice, setDaysNotice] = useState("3");
  const [daysExtrajudicial, setDaysExtrajudicial] = useState("10");
  const [requireApproval, setRequireApproval] = useState(true);
  const [didInit, setDidInit] = useState(false);

  useEffect(() => {
    if (!automations || didInit) return;
    setSendOnDue(automations.send_on_due);
    setAutoCharge(automations.auto_charge);
    setDaysNotice(String(automations.days_notice));
    setDaysExtrajudicial(String(automations.days_extrajudicial));
    setRequireApproval(automations.require_approval);
    setDidInit(true);
  }, [automations, didInit]);

  const save = async () => {
    try {
      await updateSettings({
        automations: {
          send_on_due: sendOnDue,
          auto_charge: autoCharge,
          days_notice: Number(daysNotice) || 0,
          days_extrajudicial: Number(daysExtrajudicial) || 0,
          require_approval: requireApproval,
        },
      });
      await refetch();
    } catch {
      // Toast handled by the hook.
    }
  };

  return (
    <div className="space-y-6">
      <SettingsHeader title="Automações de Cobrança" description="Controle regras e automações para cobrança." />

      <LoadingState isLoading={isLoading} isError={isError} error={error as Error} onRetry={() => refetch()} />

      {!isLoading && !isError && <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SettingsCard title="Envio no vencimento" description="Notifique automaticamente no dia do vencimento.">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-[#777777]">Ativar envio automático</div>
            <Switch checked={sendOnDue} onCheckedChange={setSendOnDue} />
          </div>
        </SettingsCard>

        <SettingsCard title="Cobrança automática" description="Disparar cobrança sem intervenção.">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-[#777777]">Ativar cobrança automática</div>
            <Switch checked={autoCharge} onCheckedChange={setAutoCharge} />
          </div>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Dias para aviso</Label>
              <Input value={daysNotice} onChange={(e) => setDaysNotice(e.target.value)} type="number" min="0" />
            </div>
            <div className="space-y-2">
              <Label>Dias para extrajudicial</Label>
              <Input value={daysExtrajudicial} onChange={(e) => setDaysExtrajudicial(e.target.value)} type="number" min="0" />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Aprovação" description="Controle antes de disparos automáticos.">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-[#777777]">Exigir aprovação</div>
            <Switch checked={requireApproval} onCheckedChange={setRequireApproval} />
          </div>
        </SettingsCard>
      </div>}

      <div className="flex items-center justify-end gap-3">
        <Button
          className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
          onClick={save}
          disabled={isUpdating || isLoading}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
