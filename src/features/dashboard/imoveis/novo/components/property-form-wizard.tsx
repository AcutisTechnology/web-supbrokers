"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Check, Loader2, Home, MapPin, Ruler, DollarSign, Star, Camera, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

import { PropertyFormValues, defaultValues, propertySchema } from "../schemas/property-schema";
import { useCreateProperty, useUpdateProperty } from "../../services/property-service";

// Importar os steps
import { BasicInfoStep } from "./steps/basic-info-step";
import { LocationStep } from "./steps/location-step";
import { PropertyDetailsStep } from "./steps/property-details-step";
import { ValuesStep } from "./steps/values-step";
import { FeaturesStep } from "./steps/features-step";
import { ImagesStep } from "./steps/images-step";
import { ReviewStep } from "./steps/review-step";

interface PropertyFormWizardProps {
  initialValues?: Partial<PropertyFormValues>;
  isEditing?: boolean;
  propertySlug?: string;
}

const STEPS = [
  { 
    id: 1, 
    title: "Informações Básicas", 
    description: "Nome e descrição do imóvel",
    icon: Home,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600"
  },
  { 
    id: 2, 
    title: "Localização", 
    description: "Endereço e bairro",
    icon: MapPin,
    color: "from-purple-400 to-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-500"
  },
  { 
    id: 3, 
    title: "Características", 
    description: "Quartos, área e vagas",
    icon: Ruler,
    color: "from-purple-600 to-purple-700",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600"
  },
  { 
    id: 4, 
    title: "Valores", 
    description: "Preço e custos adicionais",
    icon: DollarSign,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600"
  },
  { 
    id: 5, 
    title: "Detalhes", 
    description: "Características do imóvel",
    icon: Star,
    color: "from-purple-400 to-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-500"
  },
  { 
    id: 6, 
    title: "Imagens", 
    description: "Fotos do imóvel",
    icon: Camera,
    color: "from-purple-600 to-purple-700",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600"
  },
  { 
    id: 7, 
    title: "Revisão", 
    description: "Confirme os dados",
    icon: Eye,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600"
  },
];

export function PropertyFormWizard({ initialValues, isEditing = false, propertySlug }: PropertyFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialValues || defaultValues,
    mode: "onChange",
  });

  const currentStepData = STEPS.find(step => step.id === currentStep);
  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
      
      if (isEditing && propertySlug) {
        await updatePropertyMutation.mutateAsync({ slug: propertySlug, data }, {
          onSuccess: () => {
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
        await createPropertyMutation.mutateAsync(data, {
          onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["properties"] });
            
            toast({
              title: "Imóvel criado com sucesso!",
              description: "O imóvel foi publicado e já está disponível.",
            });
            
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep form={form} />;
      case 2:
        return <LocationStep form={form} />;
      case 3:
        return <PropertyDetailsStep form={form} />;
      case 4:
        return <ValuesStep form={form} />;
      case 5:
        return <FeaturesStep form={form} />;
      case 6:
        return <ImagesStep form={form} />;
      case 7:
        return <ReviewStep form={form} />;
      default:
        return <BasicInfoStep form={form} />;
    }
  };

  const isLastStep = currentStep === STEPS.length;
  const isFirstStep = currentStep === 1;

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">

        {/* Progress Section Minimalista */}
        <div className="mb-8">
          {/* Header com título e progresso */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {currentStepData?.title}
                </h2>
                <p className="text-gray-600">
                  {currentStepData?.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
                  Etapa {currentStep} de {STEPS.length}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {Math.round(progress)}% concluído
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Steps indicator minimalista */}
          <div className="relative">
            {/* Linha conectora */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200" />
            <div 
              className="absolute top-6 left-0 h-0.5 bg-purple-500 transition-all duration-700 ease-out"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
            
            <div className="flex justify-between">
              {STEPS.map((step) => {
                const StepIcon = step.icon;
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                
                return (
                  <div key={step.id} className="flex flex-col items-center relative">
                    <div className={`
                      relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 border-2
                      ${isCompleted 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
                        : isCurrent 
                          ? 'bg-white text-purple-600 border-purple-600 shadow-lg' 
                          : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                      }
                    `}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="mt-3 text-center">
                      <span className={`
                        text-xs font-semibold transition-colors duration-300
                        ${isCurrent ? 'text-purple-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}
                      `}>
                        {step.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conteúdo do step minimalista */}
        <Card className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="min-h-[500px]">
                  {renderStep()}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Botões de navegação minimalistas */}
        <div className="flex justify-between items-center mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="flex items-center gap-2 px-6 py-3 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-lg font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          <Button
            type="button"
            onClick={isLastStep ? form.handleSubmit(onSubmit) : handleNext}
            disabled={createPropertyMutation.isPending || updatePropertyMutation.isPending}
            className={`flex items-center gap-2 px-8 py-3 font-semibold transition-all duration-200 rounded-lg ${
              isLastStep 
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md' 
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {createPropertyMutation.isPending || updatePropertyMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEditing ? 'Atualizando...' : 'Criando...'}
              </>
            ) : (
              <>
                {isLastStep ? (
                  <>
                    <Check className="w-4 h-4" />
                    {isEditing ? 'Atualizar Imóvel' : 'Criar Imóvel'}
                  </>
                ) : (
                  <>
                    Próximo
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}