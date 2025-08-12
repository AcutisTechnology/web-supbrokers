"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FileUpload } from "@/components/ui/file-upload";
import { Camera, Image } from "lucide-react";
import { PropertyFormValues } from "../../schemas/property-schema";

interface ImagesStepProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function ImagesStep({ form }: ImagesStepProps) {
  const attachments = form.watch("attachments") || [];
  const imageCount = Array.isArray(attachments) ? attachments.length : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Camera className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-medium">Adicione fotos do seu imóvel</h3>
        </div>
        <p className="text-gray-600">
          Imóveis com fotos recebem até 5x mais visualizações
        </p>
      </div>

      <div className="space-y-4">
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
                  accept="image/*"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {imageCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            <Image className="w-4 h-4" />
            <span>
              {imageCount} {imageCount === 1 ? 'imagem adicionada' : 'imagens adicionadas'}
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">📸 Dicas para boas fotos:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use luz natural sempre que possível</li>
            <li>• Fotografe todos os cômodos principais</li>
            <li>• Inclua a fachada do prédio/casa</li>
            <li>• Mostre detalhes especiais (vista, acabamentos)</li>
          </ul>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-medium text-orange-900 mb-2">⚠️ Evite:</h4>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• Fotos escuras ou desfocadas</li>
            <li>• Ambientes muito bagunçados</li>
            <li>• Ângulos que distorcem o espaço</li>
            <li>• Fotos com pessoas ou informações pessoais</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-medium text-purple-900 mb-2">💡 Sugestão de ordem das fotos:</h4>
        <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
          <li>Fachada do imóvel</li>
          <li>Sala de estar</li>
          <li>Cozinha</li>
          <li>Quartos (do maior para o menor)</li>
          <li>Banheiros</li>
          <li>Área de serviço</li>
          <li>Varanda/área externa</li>
          <li>Vista da janela (se for especial)</li>
        </ol>
      </div>
    </div>
  );
}