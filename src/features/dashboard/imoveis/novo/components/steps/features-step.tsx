"use client";

import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Building2 } from "lucide-react";
import { PropertyFormValues } from "../../schemas/property-schema";

interface FeaturesStepProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function FeaturesStep({ form }: FeaturesStepProps) {
  // Lista de características do imóvel
  const propertyCharacteristics = [
    { id: "aquecimento", label: "Aquecimento", icon: "🔥" },
    { id: "arCondicionado", label: "Ar condicionado", icon: "❄️" },
    { id: "areaServico", label: "Área de serviço", icon: "🧺" },
    { id: "armariosCozinha", label: "Armários na cozinha", icon: "🗄️" },
    { id: "armariosQuarto", label: "Armários no quarto", icon: "👔" },
    { id: "banheiroQuarto", label: "Banheiro no quarto", icon: "🚿" },
    { id: "churrasqueira", label: "Churrasqueira", icon: "🍖" },
    { id: "closet", label: "Closet", icon: "👗" },
    { id: "cozinha", label: "Cozinha", icon: "🍳" },
    { id: "entradaCaminhoes", label: "Entrada para caminhões", icon: "🚛" },
    { id: "frenteParaOLeste", label: "Frente para o leste", icon: "🧭" },
    { id: "internet", label: "Internet", icon: "📶" },
    { id: "jardim", label: "Jardim", icon: "🌿" },
    { id: "mobiliado", label: "Mobiliado", icon: "🛋️" },
    { id: "piscina", label: "Piscina", icon: "🏊" },
    { id: "plano", label: "Plano", icon: "📐" },
    { id: "porteiro24h", label: "Porteiro 24h", icon: "👨‍💼" },
    { id: "quartoServico", label: "Quarto de serviço", icon: "🛏️" },
    { id: "redeAguaEsgoto", label: "Rede de água e esgoto", icon: "💧" },
    { id: "refeitorio", label: "Refeitório", icon: "🍽️" },
    { id: "ruaAsfaltada", label: "Rua asfaltada", icon: "🛣️" },
    { id: "tvCabo", label: "TV a cabo", icon: "📺" },
    { id: "varanda", label: "Varanda", icon: "🌅" },
  ];

  // Lista de características do condomínio
  const condominiumCharacteristics = [
    { id: "academiaCondominio", label: "Academia", icon: "💪" },
    { id: "acessoDeficientes", label: "Acesso para deficientes", icon: "♿" },
    { id: "areaMurada", label: "Área murada", icon: "🧱" },
    { id: "bicicletario", label: "Bicicletário", icon: "🚲" },
    { id: "cinema", label: "Cinema", icon: "🎬" },
    { id: "condominioFechado", label: "Condomínio fechado", icon: "🏘️" },
    { id: "coworking", label: "Coworking", icon: "💻" },
    { id: "elevador", label: "Elevador", icon: "🛗" },
    { id: "espacoGourmet", label: "Espaço gourmet", icon: "👨‍🍳" },
    { id: "estacionamento", label: "Estacionamento", icon: "🅿️" },
    { id: "lavanderia", label: "Lavanderia", icon: "👕" },
    { id: "permitidoAnimais", label: "Permitido animais", icon: "🐕" },
    { id: "piscinaCondominio", label: "Piscina", icon: "🏊" },
    { id: "playground", label: "Playground", icon: "🛝" },
    { id: "portaoEletronico", label: "Portão eletrônico", icon: "🚪" },
    { id: "portaria", label: "Portaria", icon: "🏢" },
    { id: "quadraSquash", label: "Quadra de squash", icon: "🏸" },
    { id: "quadraTenis", label: "Quadra de tênis", icon: "🎾" },
    { id: "quadraPoliesportiva", label: "Quadra poliesportiva", icon: "⛹️" },
    { id: "restaurante", label: "Restaurante", icon: "🍴" },
    { id: "salaoFestasCondominio", label: "Salão de festas", icon: "🎉" },
    { id: "salaoJogos", label: "Salão de jogos", icon: "🎮" },
    { id: "sauna", label: "Sauna", icon: "🧖" },
    { id: "seguranca24h", label: "Segurança 24h", icon: "🛡️" },
    { id: "spa", label: "Spa", icon: "💆" },
    { id: "vestiario", label: "Vestiário", icon: "🚿" },
  ];

  // Função para lidar com a seleção de características
  const handleCharacteristicChange = (checked: boolean, id: string) => {
    const currentCharacteristics = form.getValues("characteristics") || [];
    
    if (checked) {
      form.setValue("characteristics", [...currentCharacteristics, id]);
    } else {
      form.setValue(
        "characteristics",
        currentCharacteristics.filter((item) => item !== id)
      );
    }
  };

  // Observa mudanças nas características selecionadas
  const selectedCharacteristics = form.watch("characteristics") || [];
  
  // Função para verificar se uma característica está selecionada
  const isCharacteristicSelected = (id: string) => {
    return selectedCharacteristics.includes(id);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Quais são os diferenciais do seu imóvel?</h3>
        <p className="text-gray-600">Selecione as características que tornam seu imóvel especial</p>
      </div>

      {/* Características do imóvel */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-blue-500" />
          <h4 className="text-base font-medium">Características do imóvel</h4>
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {propertyCharacteristics.map((characteristic) => (
            <div 
              key={characteristic.id} 
              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Checkbox
                id={characteristic.id}
                checked={isCharacteristicSelected(characteristic.id)}
                onCheckedChange={(checked) => 
                  handleCharacteristicChange(checked as boolean, characteristic.id)
                }
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <label
                htmlFor={characteristic.id}
                className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer flex-1"
              >
                <span className="text-lg">{characteristic.icon}</span>
                {characteristic.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Características do condomínio */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-green-500" />
          <h4 className="text-base font-medium">Características do condomínio</h4>
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {condominiumCharacteristics.map((characteristic) => (
            <div 
              key={characteristic.id} 
              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <Checkbox
                id={characteristic.id}
                checked={isCharacteristicSelected(characteristic.id)}
                onCheckedChange={(checked) => 
                  handleCharacteristicChange(checked as boolean, characteristic.id)
                }
                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <label
                htmlFor={characteristic.id}
                className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer flex-1"
              >
                <span className="text-lg">{characteristic.icon}</span>
                {characteristic.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h3 className="font-medium text-indigo-900 mb-2">✨ Dica importante:</h3>
        <p className="text-sm text-indigo-800">
          Quanto mais características você selecionar (que realmente existem no imóvel), 
          mais atrativo ele ficará para os interessados. Seja honesto e preciso!
        </p>
      </div>
    </div>
  );
}