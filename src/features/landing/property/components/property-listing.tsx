'use client'

import { Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PropertyGallery } from "./property-gallery";
import { PropertySpecs } from "./property-specs";
import { SimilarProperties } from "./similar-properties";
import { Property, User } from "@/features/landing/services/broker-service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { api } from "@/shared/configs/api";

interface PropertyListingProps {
  propertyData: Property;
  userData: User;
  allProperties?: Property[];
  corretor: string;
}

// Definir interface para o formulário de interesse
interface InterestFormData {
  name: string;
  email: string;
  phone: string;
  interested_property_slug: string;
}

export function PropertyListing({ propertyData, userData, allProperties = [], corretor }: PropertyListingProps) {
  const [showModal, setShowModal] = useState(false);
  
  // Configuração do React Hook Form
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<Omit<InterestFormData, 'interested_property_slug'>>({
    defaultValues: {
      name: '',
      email: '',
      phone: ''
    }
  });

  // Função para abrir o WhatsApp com a mensagem
  const handleContact = () => {
    const phoneNumber = userData.phone.replace(/\D/g, '');
    const message = `Olá, gostaria de mais informações sobre o imóvel: ${propertyData.title}`;
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Configurar a mutação do React Query
  const { mutate: createInterest, isPending } = useMutation({
    mutationFn: async (data: InterestFormData) => {
      return await api.post('customers', { json: data }).json();
    },
    onSuccess: () => {
      toast.success('Seu interesse foi registrado com sucesso! O corretor entrará em contato em breve.');
      setShowModal(false);
      handleContact()
      reset(); // Limpa o formulário
    },
    onError: (error) => {
      console.error('Erro ao registrar interesse:', error);
      toast.error('Ocorreu um erro ao registrar seu interesse. Por favor, tente novamente.');
    }
  });

  // Handler de submissão do formulário
  const onSubmit = (formData: Omit<InterestFormData, 'interested_property_slug'>) => {
    // Criar o objeto de dados para a requisição
    const interestData: InterestFormData = {
      ...formData,
      interested_property_slug: propertyData.slug || corretor
    };
    
    // Chamar a mutação
    createInterest(interestData);
  };

  return (
    <div className="grid gap-8">
      <div className="grid gap-6">
        <PropertyGallery images={propertyData.attachments} />
        <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold">
                {propertyData.title}
              </h1>
              <p className="text-muted-foreground">
                {propertyData.street}, {propertyData.neighborhood}, João Pessoa
              </p>
            </div>
            <p className="text-muted-foreground">
              {propertyData.description}
            </p>
            <PropertySpecs 
              size={propertyData.size} 
              bedrooms={propertyData.bedrooms} 
              garages={propertyData.garages} 
            />
            {propertyData.characteristics.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  Características do imóvel
                </h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {propertyData.characteristics.map((characteristic, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{characteristic.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-white">
              <div className="p-6 border-b border-gray-200">
                <div className="mb-4">
                  <div className="text-sm text-gray-500">
                    {propertyData.sale ? 'Valor à vista' : 'Valor do aluguel'}
                  </div>
                  <div className="text-2xl font-semibold text-primary">
                    R$ {propertyData.value}
                    {!propertyData.sale && <span className="text-sm font-normal">/mês</span>}
                  </div>
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90" 
                  size="lg" 
                  onClick={() => setShowModal(true)}
                >
                  Tenho interesse
                </Button>
              </div>
              <div className="space-y-3 px-6 py-4">
                {propertyData.iptu_value && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">IPTU</span>
                    <span className="font-medium">R$ {propertyData.iptu_value}/ano</span>
                  </div>
                )}
                {/* Valor do condomínio - pode ser um valor fixo ou vir da API */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Condomínio</span>
                  <span className="font-medium">
                    {propertyData.condominium_value 
                      ? `R$ ${propertyData.condominium_value}/mês` 
                      : "Não informado"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Código</span>
                  <span className="font-medium">{propertyData.code}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Corretor</span>
                  <span className="font-medium">{userData.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SimilarProperties 
        properties={allProperties} 
        userData={userData} 
        currentPropertySlug={propertyData.slug} 
        corretor={corretor}
      />

      {/* Modal de contato */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Tenho interesse neste imóvel</h2>
            <p className="text-gray-500 mb-4">Preencha seus dados para que o corretor entre em contato com você.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  id="name"
                  {...register("name", { 
                    required: "Nome é obrigatório" 
                  })}
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="Seu nome completo"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", { 
                    required: "E-mail é obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Formato de e-mail inválido"
                    }
                  })}
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone", { 
                    required: "Telefone é obrigatório",
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: "Formato de telefone inválido. Use apenas números (10-11 dígitos)"
                    }
                  })}
                  className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="(00) 00000-0000"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isPending}
                >
                  {isPending ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
