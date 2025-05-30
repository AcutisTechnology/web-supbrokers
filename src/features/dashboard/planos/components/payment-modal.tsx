"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CreditCard, Landmark, QrCode, ArrowRight, CheckCircle2, Copy } from "lucide-react";
import { usePlan, useUpgradePlan, PaymentData } from "@/features/dashboard/planos/services/plans-service";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { useCreateSubscription, useCreatePixPayment } from '../services/subscription-service';
import { BillingType, CycleType, PlanType } from '../types/subscription';

// Schema para informações do cliente (comum para todos os métodos de pagamento)
const customerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  phone: z.string().min(10, 'Telefone inválido').optional(),
});

// Schema para cartão de crédito
const creditCardSchema = customerSchema.extend({
  holderName: z.string().min(1, 'Nome é obrigatório'),
  number: z.string().min(16, 'Número do cartão inválido'),
  expiryMonth: z.string().min(1, 'Mês é obrigatório'),
  expiryYear: z.string().min(4, 'Ano é obrigatório'),
  ccv: z.string().min(3, 'CVV inválido'),
  postalCode: z.string().min(8, 'CEP inválido'),
  addressNumber: z.string().min(1, 'Número é obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  mobilePhone: z.string().min(10, 'Celular inválido'),
});

type CreditCardFormData = z.infer<typeof creditCardSchema>;
type CustomerFormData = z.infer<typeof customerSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: number | null;
  planType: PlanType;
  cycle: CycleType;
}

export function PaymentModal({ isOpen, onClose, planId, planType, cycle }: PaymentModalProps) {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<BillingType>("credit_card");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{ qrCode: string; payload: string } | null>(null);
  
  // Buscar detalhes do plano selecionado
  const { 
    data: planData, 
    isLoading: isLoadingPlan 
  } = usePlan(planId || 0);
  
  // Mutation para processar o pagamento
  const upgradePlanMutation = useUpgradePlan();
  
  // Configurar o formulário de cartão de crédito
  const creditCardForm = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      holderName: '',
      number: '',
      expiryMonth: '',
      expiryYear: '',
      ccv: '',
      name: '',
      email: '',
      cpfCnpj: '',
      postalCode: '',
      addressNumber: '',
      phone: '',
      mobilePhone: '',
    },
  });
  
  const pixForm = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });
  
  const createSubscription = useCreateSubscription();
  const createPixPayment = useCreatePixPayment();
  
  // Função para processar o pagamento com cartão de crédito
  const onSubmitCreditCard = async (data: CreditCardFormData) => {
    try {
      await createSubscription.mutateAsync({
        plan: planType,
        billingType: 'credit_card',
        cycle,
        creditCard: {
          holderName: data.holderName,
          number: data.number,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          ccv: data.ccv,
        },
        creditCardHolderInfo: {
          name: data.name,
          email: data.email,
          cpfCnpj: data.cpfCnpj,
          address: {
            postalCode: data.postalCode,
            number: data.addressNumber,
          },
          phone: data.phone,
          mobilePhone: data.mobilePhone,
        },
      });

      toast({
        title: 'Assinatura criada com sucesso!',
        description: 'Você já pode começar a usar os recursos do seu plano.',
      });
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: 'Erro ao criar assinatura',
        description: 'Ocorreu um erro ao processar seu pagamento. Tente novamente.',
        variant: 'destructive',
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
  
  const handleCopyPixCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: 'Código PIX copiado!',
        description: 'Cole o código no seu aplicativo de pagamento.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao copiar código',
        description: 'Tente copiar manualmente.',
        variant: 'destructive',
      });
    }
  };
  
  // Função para fechar o modal e resetar o estado
  const handleClose = () => {
    setPaymentStatus("idle");
    setPaymentUrl(null);
    creditCardForm.reset();
    pixForm.reset();
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
        
        <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as BillingType)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="credit_card">
              <CreditCard className="w-4 h-4 mr-2" />
              Cartão
            </TabsTrigger>
            <TabsTrigger value="pix">
              <QrCode className="w-4 h-4 mr-2" />
              PIX
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="credit_card">
            <Form {...creditCardForm}>
              <form onSubmit={creditCardForm.handleSubmit(onSubmitCreditCard)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={creditCardForm.control}
                    name="holderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome no Cartão</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={creditCardForm.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número do Cartão</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={creditCardForm.control}
                      name="expiryMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mês</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={2} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={creditCardForm.control}
                      name="expiryYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ano</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={creditCardForm.control}
                      name="ccv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={4} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={creditCardForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={creditCardForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={creditCardForm.control}
                    name="cpfCnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF/CNPJ</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={creditCardForm.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={creditCardForm.control}
                      name="addressNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={creditCardForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={creditCardForm.control}
                      name="mobilePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Celular</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createSubscription.isPending}
                >
                  {createSubscription.isPending ? 'Processando...' : 'Finalizar Pagamento'}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="pix">
            {!pixData ? (
              <Form {...pixForm}>
                <form onSubmit={pixForm.handleSubmit(onSubmitPix)} className="space-y-4">
                  <FormField
                    control={pixForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={pixForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={pixForm.control}
                    name="cpfCnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF/CNPJ</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={pixForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createPixPayment.isPending}
                  >
                    {createPixPayment.isPending ? 'Gerando PIX...' : 'Gerar PIX'}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-4 py-4">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <Image
                      src={`data:image/png;base64,${pixData.qrCode}`}
                      alt="QR Code PIX"
                      width={200}
                      height={200}
                      className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]"
                      priority
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-center text-muted-foreground">
                    Escaneie o QR Code acima ou use o código PIX abaixo
                  </p>

                  <div className="flex flex-col gap-2 bg-muted p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Código PIX</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyPixCode(pixData.payload)}
                        className="h-8"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </Button>
                    </div>
                    <code className="text-xs break-all bg-background p-2 rounded">{pixData.payload}</code>
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    Após o pagamento, seu plano será atualizado automaticamente
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setPixData(null)}
                  >
                    Gerar Novo PIX
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </>
    );
  };

  const onSubmitPix = async (data: CustomerFormData) => {
    try {
      const response = await createPixPayment.mutateAsync({
        plan: planType,
        billingType: 'pix',
        cycle,
        customerInfo: {
          name: data.name,
          email: data.email,
          cpfCnpj: data.cpfCnpj,
          phone: data.phone,
        },
      });

      setPixData({
        qrCode: response.qrCode,
        payload: response.payload,
      });

      toast({
        title: 'PIX gerado com sucesso!',
        description: 'Escaneie o QR Code ou copie o código para pagar.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao gerar PIX',
        description: 'Ocorreu um erro ao gerar o pagamento. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] w-[95%] max-h-[90vh] overflow-y-auto">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
} 