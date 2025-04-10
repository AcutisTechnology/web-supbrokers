import React, { useRef, useState } from 'react';
import { Button } from './button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
}

export function FileUpload({
  value = [],
  onChange,
  multiple = true,
  accept = 'image/*',
  maxFiles = 10,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  React.useEffect(() => {
    // Limpar URLs anteriores para evitar vazamentos de memória
    previews.forEach(url => URL.revokeObjectURL(url));

    // Criar URLs de preview apenas para novos arquivos
    if (value.length > 0) {
      // Verificar se os arquivos já têm previews
      if (value.length !== previews.length) {
        const urls = value.map(file => URL.createObjectURL(file));
        setPreviews(urls);
      }
    } else {
      // Se não há arquivos, limpar previews
      setPreviews([]);
    }

    // Limpar URLs ao desmontar
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [value.length]); // Dependência apenas do comprimento do array de arquivos

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files);
    const updatedFiles = multiple ? [...value, ...newFiles] : newFiles;

    // Limitar o número de arquivos
    const limitedFiles = updatedFiles.slice(0, maxFiles);
    onChange(limitedFiles);

    // Resetar o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...value];
    updatedFiles.splice(index, 1);
    onChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {previews.map((preview, index) => (
          <div key={index} className="group relative aspect-square rounded-md border bg-muted">
            <Image
              src={preview}
              alt={`Preview ${index}`}
              fill
              className="rounded-md object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveFile(index)}
              className="absolute right-1 top-1 rounded-full bg-foreground/10 p-1 text-foreground backdrop-blur-sm transition-opacity group-hover:opacity-100 sm:opacity-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
          <ImageIcon className="h-8 w-8" />
          <span>Adicionar</span>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Selecionar imagens
      </Button>
    </div>
  );
}
