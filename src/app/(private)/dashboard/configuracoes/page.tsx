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
import { PageSettingsForm } from "@/features/dashboard/page-settings/components/page-settings-form";
import { PageSettingsPreview } from "@/features/dashboard/page-settings/components/page-settings-preview";
import { useBrokerProperties } from "@/features/landing/services/broker-service";
import { usePageSettings } from "@/features/dashboard/page-settings/hooks/use-page-settings";
import type { PageSettings } from "@/features/dashboard/page-settings/services/page-settings-service";
import { cn } from "@/lib/utils";
import { Building2, Calendar, CreditCard, PlugZap, Settings2, Shield, Users, UserCircle2 } from "lucide-react";

type SectionKey = "profile" | "company" | "team" | "billing" | "integrations" | "automations";

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
    description: "Dados, contato e aparência",
    icon: Building2,
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
          {active.key === "team" && <TeamAccessSection />}
          {active.key === "billing" && <BillingSection />}
          {active.key === "integrations" && <IntegrationsSection />}
          {active.key === "automations" && <AutomationsSection />}
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

  const profile = data?.data;

  const [draft, setDraft] = useState({
    name: user?.user?.name ?? "",
    role: "Corretor",
    email: user?.user?.email ?? "",
    phone: "",
  });
  const [didInit, setDidInit] = useState(false);

  const [twoFaEnabled, setTwoFaEnabled] = useState(false);

  useEffect(() => {
    if (!profile || didInit) return;
    setDraft({
      name: profile.name ?? user?.user?.name ?? "",
      role: "Corretor",
      email: profile.email ?? user?.user?.email ?? "",
      phone: profile.phone ?? "",
    });
    setDidInit(true);
  }, [didInit, profile, user?.user?.email, user?.user?.name]);

  const onSave = async () => {
    try {
      await updateProfile.mutateAsync({
        name: draft.name.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
      });
      toast({ title: "Perfil salvo", description: "Seus dados foram atualizados." });
      refetch();
    } catch {
      toast({
        title: "Erro ao salvar perfil",
        description: "Verifique os campos e tente novamente.",
        variant: "destructive",
      });
    }
  };

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

      <LoadingState isLoading={isLoading} isError={isError} error={error as Error} onRetry={() => refetch()} />

      {!isLoading && !isError && (
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
                  <div className="text-sm text-[#777777]">{draft.role}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome completo</Label>
                <Input value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input value={draft.role} onChange={(e) => setDraft((p) => ({ ...p, role: e.target.value }))} />
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
                onClick={() => toast({ title: "Em breve", description: "Configurações avançadas de segurança serão adicionadas." })}
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
  const { toast } = useToast();

  const save = () => {
    toast({
      title: "Em breve",
      description: "Persistência das configurações da imobiliária será conectada na próxima etapa.",
    });
  };

  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Imobiliária"
        description="Organize os dados da empresa e personalize sua presença."
        action={
          <Button className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90" onClick={save}>
            Salvar
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SettingsCard title="Dados da empresa" description="Informações principais da imobiliária.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome fantasia</Label>
              <Input placeholder="Ex: Imobiliária Exemplo" />
            </div>
            <div className="space-y-2">
              <Label>Razão social</Label>
              <Input placeholder="Ex: Exemplo LTDA" />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input placeholder="00.000.000/0000-00" />
            </div>
            <div className="space-y-2">
              <Label>CRECI</Label>
              <Input placeholder="00000-J" />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Contato" description="Canais oficiais de contato.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="contato@imobiliaria.com" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="(00) 00000-0000" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Website</Label>
              <Input placeholder="https://seusite.com.br" />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Área de atuação" description="Descreva regiões e perfis de imóveis que você atende.">
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea placeholder="Ex: Atendemos João Pessoa e região metropolitana, com foco em imóveis residenciais e lançamentos." className="min-h-[140px]" />
          </div>
        </SettingsCard>

        <SettingsCard title="Endereço" description="Endereço administrativo e fiscal.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Logradouro</Label>
              <Input placeholder="Rua/Av..." />
            </div>
            <div className="space-y-2">
              <Label>Número</Label>
              <Input placeholder="000" />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input placeholder="Centro" />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input placeholder="João Pessoa" />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Input placeholder="PB" />
            </div>
            <div className="space-y-2">
              <Label>CEP</Label>
              <Input placeholder="00000-000" />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Financeiro" description="Dados para recebimento e caução.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Conta de recebimento</Label>
              <Input placeholder="Banco / Agência / Conta" />
            </div>
            <div className="space-y-2">
              <Label>Conta de caução</Label>
              <Input placeholder="Banco / Agência / Conta" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>PIX</Label>
              <Input placeholder="Chave PIX" />
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
      </div>

      <AppearanceSettingsSection />
    </div>
  );
}

function AppearanceSettingsSection() {
  const { user } = useAuth();
  const slug = user?.user?.slug ?? "";
  const { data: properties, isLoading, isError, error, refetch } = useBrokerProperties(slug);
  const { updateSettings } = usePageSettings();

  const settings = properties?.data?.user?.page_settings;
  const defaultSettings = useMemo<PageSettings>(
    () => ({
      primary_color: "#9747FF",
      title: "Encontre o imóvel perfeito para você",
      subtitle: "Confira os melhores imóveis disponíveis",
      brand_image: "/logo-extendida-roxo.svg",
    }),
    []
  );

  const [previewSettings, setPreviewSettings] = useState<PageSettings>(() => settings || defaultSettings);

  useEffect(() => {
    if (!settings) return;
    setPreviewSettings(settings);
  }, [settings]);

  const handleFormChange = (data: Partial<PageSettings>) => {
    setPreviewSettings((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async (data: PageSettings) => {
    await updateSettings(data);
    await refetch();
  };

  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Aparência da Página"
        description="Personalize como sua página de imóveis será exibida."
      />

      <LoadingState isLoading={isLoading} isError={isError} error={error as Error} onRetry={() => refetch()} />

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6">
            <SettingsCard title="Configuração" description="Ajuste cor, logo e textos do cabeçalho.">
              <PageSettingsForm initialData={settings || defaultSettings} onSubmit={handleSubmit} onChange={handleFormChange} />
            </SettingsCard>
          </div>
          <div className="lg:col-span-6">
            <SettingsCard title="Preview" description="Pré-visualização em tempo real.">
              <PageSettingsPreview settings={previewSettings} />
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

  const [invite, setInvite] = useState({ email: "", role: "corretor" });

  const members = useMemo(
    () => [
      {
        id: 1,
        name: user?.user?.name ?? "Usuário",
        email: user?.user?.email ?? "email@exemplo.com",
        role: "Corretor",
        status: "Ativo",
      },
    ],
    [user?.user?.email, user?.user?.name]
  );

  return (
    <div className="space-y-6">
      <SettingsHeader title="Equipe & Acesso" description="Convide membros e gerencie permissões." />

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
              onClick={() => toast({ title: "Em breve", description: "Convites serão conectados ao backend." })}
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
              {members.map((m) => (
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
                    <Badge className="bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">{m.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => toast({ title: "Em breve", description: "Remoção de membros será conectada ao backend." })}
                    >
                      Remover
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>
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
  const { toast } = useToast();

  const integrations = useMemo(
    () => [
      {
        id: "canal-pro",
        name: "Canal PRO",
        description: "Conecte seu canal de conteúdo e captação.",
        status: "Em breve",
        icon: <UserCircle2 className="h-5 w-5 text-[#141414]" />,
      },
      {
        id: "asaas",
        name: "Asaas",
        description: "Pagamentos, cobranças e assinaturas.",
        status: "Em breve",
        icon: <CreditCard className="h-5 w-5 text-[#141414]" />,
      },
      {
        id: "whatsapp",
        name: "WhatsApp",
        description: "Sessão via QR Code (WhatsApp Web).",
        status: "Ativo (mock)",
        icon: <PlugZap className="h-5 w-5 text-[#141414]" />,
      },
      {
        id: "google-calendar",
        name: "Google Calendar",
        description: "Sincronize agenda e compromissos.",
        status: "Em breve",
        icon: <Calendar className="h-5 w-5 text-[#141414]" />,
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <SettingsHeader title="Integrações" description="Conecte serviços para automatizar rotinas e dados." />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {integrations.map((i) => (
          <Card key={i.id} className="border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">{i.icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-[#141414]">{i.name}</div>
                    <div className="text-xs text-[#777777] mt-0.5">{i.description}</div>
                  </div>
                </div>
                <Badge className="bg-gray-100 text-[#777777] border border-gray-200">{i.status}</Badge>
              </div>

              <Button
                className="w-full mt-4 bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
                onClick={() => toast({ title: "Em breve", description: "Conexão será disponibilizada na próxima etapa." })}
              >
                Conectar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AutomationsSection() {
  const { toast } = useToast();
  const [sendOnDue, setSendOnDue] = useState(true);
  const [autoCharge, setAutoCharge] = useState(false);
  const [daysNotice, setDaysNotice] = useState("3");
  const [daysExtrajudicial, setDaysExtrajudicial] = useState("10");
  const [requireApproval, setRequireApproval] = useState(true);

  return (
    <div className="space-y-6">
      <SettingsHeader title="Automações de Cobrança" description="Controle regras e automações para cobrança (mock)." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
              <Input value={daysNotice} onChange={(e) => setDaysNotice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Dias para extrajudicial</Label>
              <Input value={daysExtrajudicial} onChange={(e) => setDaysExtrajudicial(e.target.value)} />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Aprovação" description="Controle antes de disparos automáticos.">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-[#777777]">Exigir aprovação</div>
            <Switch checked={requireApproval} onCheckedChange={setRequireApproval} />
          </div>
        </SettingsCard>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
          onClick={() => toast({ title: "Salvo", description: "Configurações (mock) atualizadas." })}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
