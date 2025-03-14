'use client'

import { Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PropertyGallery } from "./property-gallery";
import { PropertySpecs } from "./property-specs";
import { SimilarProperties } from "./similar-properties";
import { Property, User } from "@/features/landing/services/broker-service";

interface PropertyListingProps {
  propertyData: Property;
  userData: User;
  allProperties?: Property[];
  corretor: string;
}

export function PropertyListing({ propertyData, userData, allProperties = [], corretor }: PropertyListingProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Função para abrir o WhatsApp com a mensagem
  const handleContact = () => {
    const phoneNumber = userData.phone.replace(/\D/g, '');
    const message = `Olá, gostaria de mais informações sobre o imóvel: ${propertyData.title}`;
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você poderia enviar os dados para um backend
    // Por enquanto, vamos apenas abrir o WhatsApp com os dados do formulário
    const phoneNumber = userData.phone.replace(/\D/g, '');
    const message = `Olá, me chamo ${formData.name} e gostaria de mais informações sobre o imóvel: ${propertyData.title}. Meu email é ${formData.email} e meu telefone é ${formData.phone}.`;
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowModal(false);
  };

  return (
    <div className="grid gap-8">
      <div className="grid gap-6">
        <PropertyGallery images={propertyData.images} />
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
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Enviar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
