"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Home, 
  DollarSign, 
  Image, 
  CheckCircle,
  Bed,
  Car,
  Ruler,
  Star,
  Building2
} from "lucide-react";
import { PropertyFormValues } from "../../schemas/property-schema";
import { formatCurrency } from "@/lib/utils";

interface ReviewStepProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function ReviewStep({ form }: ReviewStepProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const formData = form.getValues();
  const isRent = formData.purpose === "rent";
  const characteristics = formData.characteristics || [];
  const imageCount = formData.attachments?.length || 0;

  // Mapeamento de IDs para labels legíveis
  const characteristicLabels: Record<string, string> = {
    aquecimento: "Aquecimento",
    arCondicionado: "Ar condicionado",
    areaServico: "Área de serviço",
    armariosCozinha: "Armários na cozinha",
    armariosQuarto: "Armários no quarto",
    banheiroQuarto: "Banheiro no quarto",
    churrasqueira: "Churrasqueira",
    internet: "Internet",
    mobiliado: "Mobiliado",
    piscina: "Piscina",
    porteiro24h: "Porteiro 24h",
    quartoServico: "Quarto de serviço",
    tvCabo: "TV a cabo",
    varanda: "Varanda",
    academiaCondominio: "Academia do condomínio",
    areaMurada: "Área murada",
    condominioFechado: "Condomínio fechado",
    elevador: "Elevador",
    permitidoAnimais: "Permitido animais",
    piscinaCondominio: "Piscina do condomínio",
    portaoEletronico: "Portão eletrônico",
    portaria: "Portaria",
    salaoFestasCondominio: "Salão de festas",
    seguranca24h: "Segurança 24h",
  };

  // Separar características por categoria
  const propertyCharacteristics = characteristics.filter(char => 
    ['aquecimento', 'arCondicionado', 'areaServico', 'armariosCozinha', 'armariosQuarto', 
     'banheiroQuarto', 'churrasqueira', 'internet', 'mobiliado', 'piscina', 'porteiro24h', 
     'quartoServico', 'tvCabo', 'varanda'].includes(char)
  );
  
  const condominiumCharacteristics = characteristics.filter(char => 
    ['academiaCondominio', 'areaMurada', 'condominioFechado', 'elevador', 'permitidoAnimais', 
     'piscinaCondominio', 'portaoEletronico', 'portaria', 'salaoFestasCondominio', 'seguranca24h'].includes(char)
  );

  const tabs = [
    { id: "basic", label: "Básico", icon: Home },
    { id: "location", label: "Localização", icon: MapPin },
    { id: "details", label: "Detalhes", icon: Ruler },
    { id: "features", label: "Características", icon: Star },
    { id: "condominium", label: "Condomínio", icon: Building2 },
    { id: "values", label: "Valores", icon: DollarSign },
    { id: "images", label: "Imagens", icon: Image },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Nome:</span>
                <p className="font-medium text-lg">{formData.title || "Não informado"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Código:</span>
                <p className="font-medium">{formData.code || "Não informado"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Finalidade:</span>
                <Badge variant={isRent ? "secondary" : "default"} className="ml-2">
                  {isRent ? "Aluguel" : "Venda"}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Descrição:</span>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  {formData.description || "Não informado"}
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case "location":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Endereço:</span>
                <p className="font-medium text-lg">{formData.street || "Não informado"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Bairro:</span>
                <p className="font-medium">{formData.neighborhood || "Não informado"}</p>
              </div>

            </CardContent>
          </Card>
        );

      case "details":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="w-5 h-5" />
                Detalhes do Imóvel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bed className="w-5 h-5 text-purple-600" />
                    <span className="text-3xl font-bold text-purple-600">{formData.bedrooms || 0}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Quartos</span>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Ruler className="w-5 h-5 text-purple-600" />
                    <span className="text-3xl font-bold text-purple-600">{formData.size || 0}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">m²</span>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Car className="w-5 h-5 text-purple-600" />
                    <span className="text-3xl font-bold text-purple-600">{formData.garages || 0}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Vagas</span>
                </div>

              </div>
            </CardContent>
          </Card>
        );

      case "features":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Características do Imóvel
              </CardTitle>
            </CardHeader>
            <CardContent>
              {propertyCharacteristics.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {propertyCharacteristics.map((char) => (
                    <Badge key={char} variant="outline" className="justify-start p-3 text-sm">
                      {characteristicLabels[char] || char}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhuma característica selecionada</p>
              )}
            </CardContent>
          </Card>
        );

      case "condominium":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Características do Condomínio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {condominiumCharacteristics.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {condominiumCharacteristics.map((char) => (
                    <Badge key={char} variant="outline" className="justify-start p-3 text-sm">
                      {characteristicLabels[char] || char}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhuma característica de condomínio selecionada</p>
              )}
            </CardContent>
          </Card>
        );

      case "values":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Valores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-green-700 block mb-2">
                  {isRent ? "Valor do Aluguel" : "Valor de Venda"}
                </span>
                <p className="text-4xl font-bold text-green-600">
                  {formatCurrency(formData.value || 0)}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.iptu_value > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 block mb-1">IPTU:</span>
                    <p className="text-xl font-bold">{formatCurrency(formData.iptu_value)}</p>
                  </div>
                )}
                {formData.condo_value > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Condomínio:</span>
                    <p className="text-xl font-bold">{formatCurrency(formData.condo_value)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case "images":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Imagens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Image className="w-8 h-8 text-purple-600" />
                  <span className="text-4xl font-bold text-purple-600">{imageCount}</span>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {imageCount === 1 ? 'imagem adicionada' : 'imagens adicionadas'}
                </p>
                {imageCount === 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-amber-700">
                      ⚠️ Recomendamos adicionar pelo menos 3 imagens para melhor visualização do imóvel
                    </p>
                  </div>
                )}
                {imageCount >= 3 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-green-700">
                      ✅ Ótimo! Você adicionou uma boa quantidade de imagens
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-medium">Revise os dados do seu imóvel</h3>
        </div>
        <p className="text-gray-600">
          Confira se todas as informações estão corretas antes de publicar
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-1 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors hover:bg-gray-50 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600 bg-purple-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>

      {/* Footer */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">🎉 Quase pronto!</h4>
        <p className="text-sm text-green-800">
                  Revise todas as informações nas abas acima. Após clicar em &quot;Criar Imóvel&quot;, 
                  seu anúncio será publicado e ficará disponível para interessados.
                </p>
      </div>
    </div>
  );
}