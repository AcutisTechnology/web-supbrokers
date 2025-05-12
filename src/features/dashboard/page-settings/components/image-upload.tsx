'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { uploadBrandImage } from '../services/page-settings-service';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setUploadProgress(0);
      
      // Verificar o tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('O arquivo é muito grande. O tamanho máximo é 5MB.');
        return;
      }
      
      // Verificar o tipo do arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida.');
        return;
      }

      // Simular progresso durante o upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
      
      // Fazer o upload da imagem
      const imageUrl = await uploadBrandImage(file);
      
      // Completar o progresso
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Atualizar o valor com a URL da imagem
      onChange(imageUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Erro ao enviar a imagem. Tente novamente.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative">
          <div className="relative w-32 h-32">
            <Image
              src={value}
              alt="Logo da marca"
              fill
              className="object-contain rounded-lg"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            aria-label="Remover imagem"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Arraste uma imagem ou clique para selecionar</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG ou GIF (máx. 5MB)</p>
        </div>
      )}

      <div>
        <input
          type="file"
          id="brand-image"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="brand-image">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isLoading ? 'Enviando...' : value ? 'Trocar imagem' : 'Escolher imagem'}
          </Button>
        </label>
      </div>
    </div>
  );
} 