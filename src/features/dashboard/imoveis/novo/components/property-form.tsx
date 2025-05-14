"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw, Film } from "lucide-react";
import { useState, useLayoutEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/ui/file-upload";
import { PropertyPreview } from "./property-preview";
import { useCreateProperty, useUpdateProperty } from "../../services/property-service";
import { PropertyFormValues, defaultValues, propertySchema } from "../schemas/property-schema";
import { formatCurrency } from "@/lib/utils";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useQueryClient } from "@tanstack/react-query";

interface PropertyFormProps {
  initialValues?: Partial<PropertyFormValues>;
  isEditing?: boolean;
  propertySlug?: string;
}

export function PropertyForm({ initialValues, isEditing = false, propertySlug }: PropertyFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialValues || defaultValues,
  });

  const watchedValues = form.watch();

  // Invalidar consultas quando o componente for montado para garantir dados atualizados ao retornar
  useLayoutEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    if (isEditing && propertySlug) {
      queryClient.invalidateQueries({ queryKey: ["property", propertySlug] });
    }
  }, [queryClient, isEditing, propertySlug]);

  // Lista de características disponíveis
  const characteristicOptions = [
    { id: "serviceArea", label: "Área de serviço" },
    { id: "bedroomCloset", label: "Armários no quarto" },
    { id: "kitchenCabinets", label: "Armários na cozinha" },
    { id: "furnished", label: "Mobiliado" },
    { id: "airConditioning", label: "Ar condicionado" },
    { id: "bbq", label: "Churrasqueira" },
    { id: "balcony", label: "Varanda" },
    { id: "gym", label: "Academia" },
    { id: "pool", label: "Piscina" },
    { id: "serviceRoom", label: "Quarto de serviço" },
  ];

  // Função para lidar com a seleção de características
  const handleCharacteristicChange = (checked: boolean, value: string) => {
    const currentCharacteristics = form.getValues("characteristics") || [];
    
    if (checked) {
      form.setValue("characteristics", [...currentCharacteristics, value]);
    } else {
      form.setValue(
        "characteristics",
        currentCharacteristics.filter((item) => item !== value)
      );
    }
  };

  // Função para verificar se uma característica está selecionada
  const isCharacteristicSelected = (value: string) => {
    return (form.getValues("characteristics") || []).includes(value);
  };

  // Função para gerar código aleatório com 2 letras e 3 números
  const generateRandomCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    let code = '';
    
    // Adicionar 2 letras
    for (let i = 0; i < 2; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Adicionar 3 números
    for (let i = 0; i < 3; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    // Atualizar o campo do formulário
    form.setValue('code', code);
  };

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      // Definir rent ou sale com base na seleção
      if (data.purpose === "rent") {
        data.rent = 1;
        data.sale = 0;
      } else {
        data.rent = 0;
        data.sale = 1;
      }
      
      // Já existe um processamento de FormData nas funções de mutação
      if (isEditing && propertySlug) {
        // Atualizar imóvel existente
        await updatePropertyMutation.mutateAsync({ slug: propertySlug, data }, {
          onSuccess: () => {
            // Invalidar consultas para atualizar a lista de imóveis
            queryClient.invalidateQueries({ queryKey: ["properties"] });
            queryClient.invalidateQueries({ queryKey: ["property", propertySlug] });
            
            toast({
              title: "Imóvel atualizado com sucesso!",
              description: "As alterações foram salvas.",
            });
            
            router.push(`/dashboard/imoveis/${propertySlug}`);
          },
          onError: (error) => {
            console.error("Erro ao atualizar imóvel:", error);
            toast({
              title: "Erro ao atualizar imóvel",
              description: "Ocorreu um erro ao atualizar o imóvel. Tente novamente.",
              variant: "destructive",
            });
          }
        });
      } else {
        // Criar novo imóvel
        await createPropertyMutation.mutateAsync(data, {
          onSuccess: (response) => {
            // Invalidar consultas para atualizar a lista de imóveis
            queryClient.invalidateQueries({ queryKey: ["properties"] });
            
            toast({
              title: "Imóvel criado com sucesso!",
              description: "O imóvel foi publicado e já está disponível.",
            });
            
            // Se temos o slug do imóvel na resposta, redirecionar para a página de detalhes
            if (response && response.data && response.data.slug) {
              router.push(`/dashboard/imoveis/${response.data.slug}`);
            } else {
              router.push("/dashboard/imoveis");
            }
          },
          onError: (error) => {
            console.error("Erro ao criar imóvel:", error);
            toast({
              title: "Erro ao criar imóvel",
              description: "Ocorreu um erro ao criar o imóvel. Tente novamente.",
              variant: "destructive",
            });
          }
        });
      }
    } catch (error) {
      console.error("Erro ao processar imóvel:", error);
      toast({
        title: `Erro ao ${isEditing ? 'atualizar' : 'criar'} imóvel`,
        description: `Ocorreu um erro ao ${isEditing ? 'atualizar' : 'criar'} o imóvel. Tente novamente.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div>
            <h1 className="mb-1 text-xl font-semibold">
              {isEditing ? 'Editar imóvel' : 'Dados do imóvel'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditing 
                ? 'Atualize os dados do seu imóvel'
                : 'Preencha os dados do seu imóvel, capriche :)'
              }
            </p>
          </div>
          <Card className="border-l-4 border-l-yellow-500 bg-yellow-50/50 p-4">
            <p className="text-sm">Os itens com (*) são obrigatórios</p>
          </Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome ou título do imóvel
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="Título ou nome do imóvel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Descrição<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o seu imóvel"
                        className="min-h-[120px] bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Endereço<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="Rua, número, complemento"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Bairro<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="Bairro"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Vender ou alugar?<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Escolha" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sell">Vender</SelectItem>
                          <SelectItem value="rent">Alugar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Código do imóvel<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Button 
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={generateRandomCode}
                            title="Gerar código aleatório"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Input
                            className="bg-white"
                            placeholder="Código do imóvel"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Valor<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="Valor do imóvel"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="iptu_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do IPTU</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="Valor do IPTU"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="condo_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do Condomínio</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="Valor do condomínio"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Número de quartos<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Escolha" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Área(m²)<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          type="number"
                          placeholder="m²"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="garages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vagas na garagem</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Escolha" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <h2 className="mb-4 text-lg font-medium">Características do imóvel</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {characteristicOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={isCharacteristicSelected(option.label)}
                        onCheckedChange={(checked) => 
                          handleCharacteristicChange(checked as boolean, option.label)
                        }
                      />
                      <label
                        htmlFor={option.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="mb-4 text-lg font-medium">Imagens do imóvel</h2>
                <FormField
                  control={form.control}
                  name="attachments"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          value={field.value as File[]}
                          onChange={field.onChange}
                          multiple={true}
                          accept="*"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => isEditing && propertySlug 
                    ? router.push(`/dashboard/imoveis/${propertySlug}`)
                    : router.push("/dashboard/imoveis")
                  }
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={createPropertyMutation.isPending || updatePropertyMutation.isPending}
                >
                  {(createPropertyMutation.isPending || updatePropertyMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? 'Salvando...' : 'Criando...'}
                    </>
                  ) : (
                    isEditing ? 'Salvar alterações' : 'Criar imóvel'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="mb-1 text-lg font-medium">Visualização</h2>
            <PropertyPreview data={watchedValues} />
          </div>
        </div>
      </div>
    </div>
  );
}
