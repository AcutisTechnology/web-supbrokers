"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CreditCard, Landmark, QrCode, ArrowRight, CheckCircle2 } from "lucide-react";
import { usePlan, useUpgradePlan, PaymentData } from "@/features/dashboard/planos/services/plans-service";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

// Schema de validação para o formulário de cartão de crédito
const creditCardSchema = z.object({
  card_number: z.string().min(16, "Número do cartão inválido").max(19, "Número do cartão inválido"),
  card_holder_name: z.string().min(3, "Nome do titular inválido"),
  card_expiry_month: z.string().min(2, "Mês inválido").max(2, "Mês inválido"),
  card_expiry_year: z.string().min(2, "Ano inválido").max(2, "Ano inválido"),
  card_cvv: z.string().min(3, "CVV inválido").max(4, "CVV inválido"),
});

type CreditCardFormValues = z.infer<typeof creditCardSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: number | null;
}

export function PaymentModal({ isOpen, onClose, planId }: PaymentModalProps) {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "pix" | "boleto">("credit_card");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  
  // Buscar detalhes do plano selecionado
  const { 
    data: planData, 
    isLoading: isLoadingPlan 
  } = usePlan(planId || 0);
  
  // Mutation para processar o pagamento
  const upgradePlanMutation = useUpgradePlan();
  
  // Configurar o formulário de cartão de crédito
  const form = useForm<CreditCardFormValues>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      card_number: "",
      card_holder_name: "",
      card_expiry_month: "",
      card_expiry_year: "",
      card_cvv: "",
    },
  });
  
  // Função para processar o pagamento com cartão de crédito
  const onSubmitCreditCard = async (values: CreditCardFormValues) => {
    if (!planId) return;
    
    try {
      setPaymentStatus("processing");
      
      const paymentData: PaymentData = {
        plan_id: planId,
        payment_method: "credit_card",
        ...values,
      };
      
      const response = await upgradePlanMutation.mutateAsync(paymentData);
      
      if (response.success) {
        setPaymentStatus("success");
        toast({
          title: "Pagamento processado com sucesso",
          description: "Seu plano foi atualizado.",
          variant: "default",
        });
      } else {
        setPaymentStatus("error");
        toast({
          title: "Erro ao processar pagamento",
          description: "Verifique os dados do cartão e tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setPaymentStatus("error");
      toast({
        title: "Erro ao processar pagamento",
        description: "Ocorreu um erro ao processar o pagamento. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  // Função para processar o pagamento com PIX ou boleto
  const handleAlternativePayment = async (method: "pix" | "boleto") => {
    if (!planId) return;
    
    try {
      setPaymentStatus("processing");
      
      const paymentData: PaymentData = {
        plan_id: planId,
        payment_method: method,
      };
      
      const response = await upgradePlanMutation.mutateAsync(paymentData);
      
      if (response.success) {
        setPaymentUrl(response.data.payment_url || null);
        setPaymentStatus("success");
        toast({
          title: method === "pix" ? "QR Code PIX gerado" : "Boleto gerado",
          description: method === "pix" ? "Escaneie o QR Code para concluir o pagamento." : "O boleto foi gerado com sucesso.",
          variant: "default",
        });
      } else {
        setPaymentStatus("error");
        toast({
          title: "Erro ao gerar pagamento",
          description: "Ocorreu um erro ao gerar o pagamento. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setPaymentStatus("error");
      toast({
        title: "Erro ao gerar pagamento",
        description: "Ocorreu um erro ao gerar o pagamento. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  // Função para fechar o modal e resetar o estado
  const handleClose = () => {
    setPaymentStatus("idle");
    setPaymentUrl(null);
    form.reset();
    onClose();
  };
  
  // Renderizar conteúdo com base no status do pagamento
  const renderContent = () => {
    if (paymentStatus === "success") {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-xl font-medium mb-2">Pagamento Processado!</h3>
          
          {paymentMethod === "credit_card" ? (
            <p className="text-center text-[#969696] mb-6">
              Seu pagamento foi processado com sucesso e seu plano foi atualizado.
            </p>
          ) : paymentUrl ? (
            <div className="text-center">
              <p className="text-[#969696] mb-4">
                {paymentMethod === "pix" 
                  ? "Escaneie o QR Code abaixo para concluir o pagamento:" 
                  : "Seu boleto foi gerado com sucesso:"}
              </p>
              
              {paymentMethod === "pix" ? (
                <div className="bg-white p-4 border rounded-lg inline-block mb-4">
                  <Image 
                    src={paymentUrl} 
                    alt="QR Code PIX" 
                    width={200} 
                    height={200} 
                    className="mx-auto"
                  />
                </div>
              ) : (
                <Button 
                  className="mb-4" 
                  onClick={() => window.open(paymentUrl, "_blank")}
                >
                  Visualizar Boleto
                </Button>
              )}
              
              <p className="text-sm text-[#969696]">
                Após a confirmação do pagamento, seu plano será atualizado automaticamente.
              </p>
            </div>
          ) : (
            <p className="text-center text-[#969696] mb-6">
              Houve um problema ao gerar o link de pagamento. Entre em contato com o suporte.
            </p>
          )}
          
          <Button onClick={handleClose} className="mt-6">
            Concluir
          </Button>
        </div>
      );
    }
    
    return (
      <>
        <DialogHeader>
          <DialogTitle>Upgrade de Plano</DialogTitle>
          <DialogDescription>
            {planData?.data ? (
              <>
                Você está fazendo upgrade para o plano <strong>{planData.data.name}</strong> por{" "}
                <strong>{formatCurrency(planData.data.price)}</strong>/{planData.data.interval === "monthly" ? "mês" : "ano"}.
              </>
            ) : (
              "Selecione a forma de pagamento para concluir o upgrade."
            )}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="credit_card" className="mt-4" onValueChange={(value) => setPaymentMethod(value as "credit_card" | "pix" | "boleto")}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="credit_card" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Cartão</span>
            </TabsTrigger>
            <TabsTrigger value="pix" className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">PIX</span>
            </TabsTrigger>
            <TabsTrigger value="boleto" className="flex items-center gap-2">
              <Landmark className="w-4 h-4" />
              <span className="hidden sm:inline">Boleto</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="credit_card">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitCreditCard)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="card_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Cartão</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0000 0000 0000 0000" 
                          {...field} 
                          maxLength={19}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="card_holder_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome no Cartão</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome como está no cartão" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="card_expiry_month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mês</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM" 
                            {...field} 
                            maxLength={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="card_expiry_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="AA" 
                            {...field} 
                            maxLength={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="card_cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123" 
                            {...field} 
                            maxLength={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter className="mt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#9747ff] hover:bg-[#9747ff]/90"
                    disabled={paymentStatus === "processing" || upgradePlanMutation.isPending}
                  >
                    {paymentStatus === "processing" || upgradePlanMutation.isPending ? (
                      "Processando..."
                    ) : (
                      <>
                        Finalizar Pagamento
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="pix">
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto bg-[#32BCAD]/10 rounded-full flex items-center justify-center mb-4">
                <QrCode className="w-8 h-8 text-[#32BCAD]" />
              </div>
              
              <h3 className="text-lg font-medium mb-2">Pagamento via PIX</h3>
              <p className="text-[#969696] mb-6">
                Ao clicar em &quot;Gerar QR Code&quot;, você receberá um QR Code para pagamento.
              </p>
              
              <Button 
                onClick={() => handleAlternativePayment("pix")}
                className="bg-[#32BCAD] hover:bg-[#32BCAD]/90"
                disabled={paymentStatus === "processing" || upgradePlanMutation.isPending}
              >
                {paymentStatus === "processing" || upgradePlanMutation.isPending ? (
                  "Gerando QR Code..."
                ) : (
                  <>
                    Gerar QR Code PIX
                    <QrCode className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="boleto">
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto bg-[#4A6FDC]/10 rounded-full flex items-center justify-center mb-4">
                <Landmark className="w-8 h-8 text-[#4A6FDC]" />
              </div>
              
              <h3 className="text-lg font-medium mb-2">Pagamento via Boleto</h3>
              <p className="text-[#969696] mb-6">
                Ao clicar em &quot;Gerar Boleto&quot;, você receberá um boleto para pagamento.
                O prazo de compensação é de até 3 dias úteis.
              </p>
              
              <Button 
                onClick={() => handleAlternativePayment("boleto")}
                className="bg-[#4A6FDC] hover:bg-[#4A6FDC]/90"
                disabled={paymentStatus === "processing" || upgradePlanMutation.isPending}
              >
                {paymentStatus === "processing" || upgradePlanMutation.isPending ? (
                  "Gerando Boleto..."
                ) : (
                  <>
                    Gerar Boleto
                    <Landmark className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
} 