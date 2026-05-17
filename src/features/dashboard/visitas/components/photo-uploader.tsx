"use client";

import { ImagePlus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { VisitFileItem } from "../types/visit";

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  existingFiles?: VisitFileItem[];
  removedIds?: number[];
  onRemoveExisting?: (id: number) => void;
  maxFiles?: number;
};

const ACCEPTED_MIME = "image/jpeg,image/jpg,image/png,image/webp";

export function PhotoUploader({
  files,
  onChange,
  existingFiles = [],
  removedIds = [],
  onRemoveExisting,
  maxFiles = 20,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const remainingExisting = useMemo(
    () => existingFiles.filter((file) => !removedIds.includes(file.id)),
    [existingFiles, removedIds],
  );

  const totalCount = remainingExisting.length + files.length;
  const canAddMore = totalCount < maxFiles;

  const handlePick = () => {
    inputRef.current?.click();
  };

  const handleFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const list = Array.from(incoming).filter((file) => ACCEPTED_MIME.includes(file.type));
      if (list.length === 0) return;

      const slots = Math.max(0, maxFiles - totalCount);
      const next = [...files, ...list.slice(0, slots)];
      onChange(next);
    },
    [files, maxFiles, onChange, totalCount],
  );

  const handleRemoveNew = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_MIME}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {remainingExisting.map((file) => (
          <div
            key={`existing-${file.id}`}
            className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
          >
            {file.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={file.url}
                alt={file.name ?? "Foto da visita"}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            {onRemoveExisting ? (
              <button
                type="button"
                onClick={() => onRemoveExisting(file.id)}
                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                aria-label="Remover foto"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ))}

        {previews.map((src, idx) => (
          <div
            key={`new-${idx}`}
            className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Foto ${idx + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveNew(idx)}
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
              aria-label="Remover foto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {canAddMore ? (
          <button
            type="button"
            onClick={handlePick}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#9747ff] transition-colors"
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs font-medium">Adicionar fotos</span>
          </button>
        ) : null}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>
          {totalCount}/{maxFiles} fotos
        </span>
        <Button type="button" variant="ghost" size="sm" onClick={handlePick} disabled={!canAddMore}>
          Selecionar arquivos
        </Button>
      </div>
    </div>
  );
}
