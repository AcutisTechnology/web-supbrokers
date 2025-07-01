'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react';
import { uploadBrandImage } from '../services/page-settings-service';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const uploadImage = async (file: File) => {
    if (!file) return;

    let progressInterval: NodeJS.Timeout | null = null;

    try {
      setIsLoading(true);
      setUploadProgress(0);

      if (file.size > 5 * 1024 * 1024) {
        toast.error('O arquivo é muito grande. O tamanho máximo é 5MB.');
        setIsLoading(false);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida.');
        setIsLoading(false);
        return;
      }

      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            return 90;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 300);

      const imageUrl = await uploadBrandImage(file);

      if (progressInterval) clearInterval(progressInterval);
      setUploadProgress(100);

      onChange(imageUrl);
      toast.success('Imagem enviada com sucesso! Clique em "Salvar Configurações" para aplicar as mudanças.');
    } catch (error) {
      if (progressInterval) clearInterval(progressInterval);
      
      console.error('Erro ao fazer upload da imagem:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('demorou muito')) {
          toast.error('O servidor está demorando para responder. Verifique sua conexão e tente novamente.');
        } else if (error.message.includes('conexão')) {
          toast.error('Problema de conexão. Verifique sua internet e tente novamente.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Erro ao fazer upload da imagem. Tente novamente mais tarde.');
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    toast.success('Imagem removida com sucesso!');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div 
        className={`
          border-2 rounded-lg overflow-hidden relative
          ${value ? 'border-solid border-gray-200' : 'border-dashed'} 
          ${isDragging ? 'border-blue-500 bg-blue-50' : value ? '' : 'border-gray-300'} 
          ${!value && !isLoading ? 'hover:border-gray-400 cursor-pointer' : ''}
          ${isLoading ? 'opacity-75 pointer-events-none' : ''}
          transition-all duration-200
        `}
        onDragOver={!isLoading ? handleDragOver : undefined}
        onDragLeave={!isLoading ? handleDragLeave : undefined}
        onDrop={!isLoading ? handleDrop : undefined}
        onClick={!isLoading && !value ? triggerFileInput : undefined}
      >
        {value ? (
          <div className="relative group">
            <div className="relative w-full h-48 bg-gray-50 flex items-center justify-center p-4">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={value}
                  alt="Logo da marca"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-gray-100 bg-opacity-80 text-xs text-gray-500 px-2 py-1 rounded-md shadow-sm">
                Logomarca
              </div>
            </div>
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
              <div className="flex gap-2">
                <Button 
                  type="button"
                  size="sm" 
                  variant="secondary" 
                  className="bg-white hover:bg-gray-100 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                  disabled={isLoading}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Trocar
                </Button>
                <Button 
                  type="button"
                  size="sm" 
                  variant="destructive"
                  className="shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-1" />
                  Remover
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center justify-center h-48">
            <div className="bg-gray-50 rounded-full p-4 mb-3">
              <ImageIcon className={`w-8 h-8 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            <p className={`text-sm font-medium ${isDragging ? 'text-blue-500' : 'text-gray-700'}`}>
              {isDragging ? 'Solte a imagem aqui' : 'Adicionar logomarca'}
            </p>
            <p className={`text-xs ${isDragging ? 'text-blue-400' : 'text-gray-500'} mt-1 text-center`}>
              {isDragging ? 'Solte para enviar' : 'Arraste e solte ou clique para selecionar'}
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG ou GIF (máx. 5MB)</p>
          </div>
        )}
        
        {/* Overlay de carregamento */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="text-center p-4">
              <div className="animate-pulse mb-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <p className="text-sm font-medium text-blue-600">
                {uploadProgress < 90 ? 'Enviando imagem...' : 'Processando...'}
              </p>
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}% concluído</p>
            </div>
          </div>
        )}
      </div>

      {/* Input de arquivo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Barra de progresso */}
      {isLoading && (
        <div className="w-full">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
