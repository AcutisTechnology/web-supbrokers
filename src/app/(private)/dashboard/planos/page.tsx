"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { usePlans, useCurrentPlan, Plan } from "@/features/dashboard/planos/services/plans-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/ui/loading-state";
import { formatCurrency } from "@/lib/utils";
import { Check, X, CreditCard, Zap, Building2, Star, Crown, ArrowRight, Sparkles } from "lucide-react";
import { PaymentModal } from "@/features/dashboard/planos/components/payment-modal";
import { PlanType } from '@/features/dashboard/planos/types/subscription';

function PlanosPageContent() {
  const searchParams = useSearchParams();
  const fromNoSubscription = searchParams.get('from') === 'no_subscription';
  
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  
  // Buscar planos disponíveis
  const { 
    data: plansData, 
    isLoading: isLoadingPlans, 
    isError: isErrorPlans, 
    error: errorPlans 
  } = usePlans();
  
  // Buscar plano atual do usuário
  const { 
    data: currentPlanData, 
    isLoading: isLoadingCurrentPlan, 
    isError: isErrorCurrentPlan, 
    error: errorCurrentPlan 
  } = useCurrentPlan();
  
  // Verificar se está carregando ou se houve erro
  const isLoading = isLoadingPlans || isLoadingCurrentPlan;
  const isError = isErrorPlans || isErrorCurrentPlan;
  const error = errorPlans || errorCurrentPlan;
  
  // Filtrar planos pelo intervalo de cobrança selecionado
  const filteredPlans = plansData?.data?.filter(
    (plan) => plan.interval === billingInterval
  ) || [];
  
  // Função para abrir o modal de pagamento
  const handleUpgrade = (planId: number, planType: PlanType) => {
    setSelectedPlanId(planId);
    setSelectedPlanType(planType);
    setIsPaymentModalOpen(true);
  };
  
  // Função para verificar se um plano é o atual
  const isCurrentPlan = (plan: Plan) => {
    if (fromNoSubscription) {
      return false; // Se vier de NO_SUBSCRIPTION, nenhum plano é considerado atual
    }
    return plan.is_current || (currentPlanData?.data?.id === plan.id);
  };

  // Efeito para selecionar automaticamente o plano recomendado quando vier de no_subscription
  useEffect(() => {
    if (fromNoSubscription && plansData?.data) {
      const recommendedPlan = plansData.data.find(plan => plan.highlight);
      if (recommendedPlan) {
        setSelectedPlanId(recommendedPlan.id);
        setIsPaymentModalOpen(true);
      }
    }
  }, [fromNoSubscription, plansData]);

  return (
    <div className="space-y-8">
      {/* Cabeçalho com mensagem personalizada */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-[#9747ff]/10 to-white p-6 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold text-[#141414]">
            {fromNoSubscription ? 'Comece Agora Mesmo!' : 'Planos e Assinaturas'}
          </h1>
          <p className="text-[#969696] mt-1">
            {fromNoSubscription 
              ? 'Escolha o plano ideal e comece a cadastrar seus imóveis'
              : 'Escolha o plano ideal para o seu negócio'}
          </p>
        </div>
        
        {currentPlanData?.data && (
          <div className="mt-4 md:mt-0 bg-white p-3 rounded-lg shadow-sm border">
            <p className="text-sm text-[#969696]">Seu plano atual</p>
            <div className="flex items-center gap-2">
              <span className="font-medium">{currentPlanData.data.name}</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Ativo
              </Badge>
            </div>
          </div>
        )}
      </div>

      {fromNoSubscription && (
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-purple-800">
          <p className="text-sm">
            <strong>Dica:</strong> Recomendamos o plano Profissional para começar. 
            Ele oferece o melhor custo-benefício e todos os recursos essenciais para seu negócio crescer.
          </p>
        </div>
      )}

      {/* Estado de carregamento e erro */}
      <LoadingState 
        isLoading={isLoading} 
        isError={isError} 
        error={error as Error} 
      />

      {!isLoading && !isError && (
        <>
          {/* Seletor de intervalo de cobrança */}
          <div className="flex justify-center">
            <Tabs 
              defaultValue="monthly" 
              value={billingInterval}
              onValueChange={(value) => setBillingInterval(value as "monthly" | "yearly")}
              className="w-full max-w-md"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Mensal</TabsTrigger>
                <TabsTrigger value="yearly">
                  Anual
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                    -20%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Cards de planos com destaque especial quando vem de no_subscription */}
          <div className="grid gap-6 md:grid-cols-3">
            {filteredPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`overflow-hidden transition-all ${
                  plan.highlight ? `border-[#9747ff] shadow-lg ${fromNoSubscription ? 'scale-105 ring-2 ring-purple-400 ring-opacity-50' : ''}` : ''
                }`}
              >
                {plan.highlight && (
                  <div className="bg-[#9747ff] text-white text-center py-1 text-xs font-medium">
                    MAIS POPULAR
                  </div>
                )}
                
                <CardHeader className={`${
                  plan.highlight ? 'bg-gradient-to-r from-[#9747ff]/10 to-transparent' : 'bg-gray-50'
                } p-6`}>
                  <div className="flex items-center gap-2">
                    {plan.highlight ? (
                      <Crown className="w-5 h-5 text-[#9747ff]" />
                    ) : (
                      <Building2 className="w-5 h-5 text-gray-500" />
                    )}
                    <CardTitle className="text-lg font-medium">{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                    <span className="text-[#969696] ml-1">/{billingInterval === "monthly" ? "mês" : "ano"}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Até <strong>{plan.properties_limit}</strong> imóveis</span>
                    </div>
                    
                    {plan.features.map((feature) => (
                      <div key={feature.id} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300 mt-0.5" />
                        )}
                        <div>
                          <span className="text-sm">{feature.name}</span>
                          {feature.description && (
                            <p className="text-xs text-[#969696]">{feature.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  {isCurrentPlan(plan) ? (
                    <Button className="w-full" variant="outline" disabled>
                      Plano Atual
                    </Button>
                  ) : (
                    <Button 
                      className={`w-full ${
                        plan.highlight ? 'bg-[#9747ff] hover:bg-[#9747ff]/90' : ''
                      }`}
                      onClick={() => handleUpgrade(plan.id, plan.type)}
                    >
                      {fromNoSubscription && plan.is_current ? (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Renovar Assinatura
                        </>
                      ) : plan.highlight ? (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Fazer Upgrade
                        </>
                      ) : (
                        <>
                          Assinar Plano
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Seção de perguntas frequentes */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-xl">Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Como funciona a cobrança?</h3>
                <p className="text-sm text-[#969696]">
                  A cobrança é feita automaticamente a cada período (mensal ou anual) através do método de pagamento cadastrado.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Posso mudar de plano a qualquer momento?</h3>
                <p className="text-sm text-[#969696]">
                  Sim, você pode fazer upgrade do seu plano a qualquer momento. O valor será calculado proporcionalmente ao tempo restante da sua assinatura atual.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Como cancelar minha assinatura?</h3>
                <p className="text-sm text-[#969696]">
                  Você pode cancelar sua assinatura a qualquer momento através da página de perfil. O acesso aos recursos continuará disponível até o final do período pago.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      {/* Modal de pagamento */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        planId={selectedPlanId}
        planType={selectedPlanType as PlanType}
        cycle={billingInterval === "monthly" ? "monthly" : "yearly"}
      />
    </div>
  );
}

export default function PlanosPage() {
  return (
    <Suspense fallback={<LoadingState isLoading={true} isError={false} error={null} />}>
      <PlanosPageContent />
    </Suspense>
  );
} 