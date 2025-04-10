import React, { useRef, useState } from 'react';
import { Button } from './button';
import { Upload, X, Image as ImageIcon, Film } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
}

export function FileUpload({
  value = [],
  onChange,
  multiple = true,
  accept = 'image/*,video/*',
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Array<{ url: string; type: 'image' | 'video' }>>([]);

  React.useEffect(() => {
    // Limpar URLs anteriores para evitar vazamentos de memória
    previews.forEach(preview => URL.revokeObjectURL(preview.url));

    // Criar URLs de preview apenas para novos arquivos
    if (value.length > 0) {
      // Verificar se os arquivos já têm previews
      if (value.length !== previews.length) {
        const newPreviews = value.map(file => ({
          url: URL.createObjectURL(file),
          type: file.type.startsWith('video/') ? ('video' as const) : ('image' as const),
        }));
        setPreviews(newPreviews);
      }
    } else {
      // Se não há arquivos, limpar previews
      setPreviews([]);
    }

    // Limpar URLs ao desmontar
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [value.length]); // Dependência apenas do comprimento do array de arquivos

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files);
    const updatedFiles = multiple ? [...value, ...newFiles] : newFiles;

    onChange(updatedFiles);

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
            {preview.type === 'image' ? (
              <Image
                src={preview.url}
                alt={`Preview ${index}`}
                fill
                className="rounded-md object-cover"
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center">
                <Film className="h-12 w-12 text-muted-foreground" />
                <video
                  src={preview.url}
                  className="absolute inset-0 h-full w-full rounded-md object-cover opacity-0"
                  onMouseOver={e => {
                    e.currentTarget.play();
                    e.currentTarget.classList.remove('opacity-0');
                  }}
                  onMouseOut={e => {
                    e.currentTarget.pause();
                    e.currentTarget.classList.add('opacity-0');
                  }}
                  muted
                  loop
                />
                <span className="mt-2 text-xs text-muted-foreground">Hover para preview</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => handleRemoveFile(index)}
              className="absolute right-1 top-1 rounded-full bg-foreground/10 p-1 text-foreground backdrop-blur-sm transition-opacity group-hover:opacity-100 sm:opacity-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs text-muted-foreground hover:bg-muted/50"
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="h-8 w-8" />
            <Film className="h-8 w-8" />
          </div>
          <span>Adicionar</span>
        </button>
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
        Selecionar arquivos
      </Button>
    </div>
  );
}
