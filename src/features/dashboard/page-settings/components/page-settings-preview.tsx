'use client';

import { Search } from 'lucide-react';
import Image from 'next/image';
import { PageSettings } from '../services/page-settings-service';

interface PageSettingsPreviewProps {
  settings: PageSettings;
}

export function PageSettingsPreview({ settings }: PageSettingsPreviewProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm scale-[0.9] origin-top-left">
      {/* Header com cor personalizada */}
      <div 
        className="p-4 rounded-t-lg"
        style={{ backgroundColor: settings.primary_color }}
      >
        {/* Logo e botões */}
        <div className="flex justify-between items-center mb-4">
          <div className="bg-white p-1 rounded-md w-24 h-10 flex items-center justify-center">
            <img 
              src={settings.brand_image} 
              alt="Logo" 
              className="max-h-8 max-w-full object-contain"
            />
          </div>
          
          <div className="flex gap-2">
            <button className="bg-white text-xs text-black rounded-full px-2 py-1">
              Área do Corretor
            </button>
            <button className="bg-white text-xs text-black rounded-full px-2 py-1">
              Falar com o Corretor
            </button>
          </div>
        </div>
        
        {/* Título e subtítulo */}
        <div className="text-white mb-4">
          <h3 className="text-lg font-medium">{settings.title}</h3>
          <p className="text-xs">{settings.subtitle}</p>
        </div>
        
        {/* Barra de busca simplificada */}
        <div className="bg-white p-2 rounded-full flex items-center gap-2">
          <div className="flex gap-2 bg-gray-100 rounded-full p-1">
            <button className="bg-white text-xs rounded-full px-2 py-1 shadow-sm">
              Comprar
            </button>
            <button className="text-xs rounded-full px-2 py-1">
              Alugar
            </button>
          </div>
          <div className="flex-grow flex gap-2">
            <input 
              type="text" 
              placeholder="Bairro" 
              className="text-xs bg-gray-100 rounded-full px-2 py-1 w-full"
            />
            <button className="bg-[#9747FF] text-white rounded-full p-1">
              <Search className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Conteúdo */}
      <div className="p-4 bg-white">
        <h4 className="text-sm font-medium">Imóveis à venda</h4>
        <p className="text-xs text-gray-500 mb-3">Confira os imóveis disponíveis para compra</p>
        
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-200 h-16 w-full" />
              <div className="p-2">
                <p className="text-xs font-medium truncate">Apartamento Manaíra</p>
                <p className="text-[10px] text-gray-500">Manaíra, João Pessoa</p>
                <p className="text-xs font-bold mt-1">R$ 450.000</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 