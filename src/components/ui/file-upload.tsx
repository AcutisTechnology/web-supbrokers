import React, { useRef, useState } from 'react';
import { Button } from './button';
import { Upload, X, Image as ImageIcon, Film } from 'lucide-react';
import Image from 'next/image';

// Anexo já existente no servidor (imóvel em edição)
export interface ExistingAttachment {
  url: string;
  name?: string;
  original_name?: string;
}

export type UploadItem = File | ExistingAttachment;

interface FileUploadProps {
  value: UploadItem[];
  onChange: (files: UploadItem[]) => void;
  multiple?: boolean;
  accept?: string;
}

const isFile = (item: UploadItem): item is File =>
  typeof File !== 'undefined' && item instanceof File;

const resolveType = (name: string | undefined): 'image' | 'video' =>
  /\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(name ?? '') ? 'video' : 'image';

export function FileUpload({
  value = [],
  onChange,
  multiple = true,
  accept = 'image/*,video/*',
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Array<{ url: string; type: 'image' | 'video' }>>([]);

  React.useEffect(() => {
    // URLs de objeto criadas nesta execução (apenas para arquivos novos)
    const objectUrls: string[] = [];

    const newPreviews = value.map(item => {
      if (isFile(item)) {
        const url = URL.createObjectURL(item);
        objectUrls.push(url);
        return {
          url,
          type: item.type.startsWith('video/') ? ('video' as const) : ('image' as const),
        };
      }

      // Anexo existente: usa a URL do servidor diretamente
      return {
        url: item.url,
        type: resolveType(item.original_name ?? item.name ?? item.url),
      };
    });

    setPreviews(newPreviews);

    // Revogar somente as URLs de objeto criadas para arquivos novos
    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [value]);

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
