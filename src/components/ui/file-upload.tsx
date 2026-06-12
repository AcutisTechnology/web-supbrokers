"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertTriangle, Film, GripVertical, Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";
import { cn } from "@/lib/utils";

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
  /** Limite total do envio em MB (o servidor corta acima disso). Padrão 100. */
  maxTotalSizeMb?: number;
}

const isFile = (item: UploadItem): item is File =>
  typeof File !== "undefined" && item instanceof File;

const resolveType = (name: string | undefined): "image" | "video" =>
  /\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(name ?? "") ? "video" : "image";

// Verifica se um arquivo casa com a lista de `accept` (ex.: "image/*,video/*,.pdf")
const matchesAccept = (file: File, accept: string) => {
  const rules = accept.split(",").map((r) => r.trim()).filter(Boolean);
  if (!rules.length) return true;
  return rules.some((rule) => {
    if (rule === "*" || rule === "*/*") return true;
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule.toLowerCase());
    if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
};

type Preview = { id: string; url: string; type: "image" | "video" };

export function FileUpload({
  value = [],
  onChange,
  multiple = true,
  accept = "image/*,video/*",
  maxTotalSizeMb = 100,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const dragDepth = useRef(0);

  // IDs estáveis por item: arquivos novos usam identidade do objeto (WeakMap),
  // anexos existentes usam a URL. Estável entre renders → o dnd-kit/sortable e
  // o cache de previews não "piscam" ao reordenar.
  const fileIds = useRef(new WeakMap<object, string>());
  const counter = useRef(0);
  const getId = (item: UploadItem) => {
    if (!isFile(item)) return `existing:${(item as ExistingAttachment).url}`;
    let id = fileIds.current.get(item);
    if (!id) {
      id = `file:${counter.current++}`;
      fileIds.current.set(item, id);
    }
    return id;
  };

  const ids = value.map(getId);

  // Cache de previews por id. Object URLs (de arquivos novos) são criadas uma
  // única vez e revogadas só quando o item sai da lista.
  const cache = useRef(new Map<string, { url: string; type: "image" | "video"; isObjectUrl: boolean }>());

  const previews: Preview[] = useMemo(() => {
    return value.map((item, index) => {
      const id = ids[index];
      const cached = cache.current.get(id);
      if (cached) return { id, url: cached.url, type: cached.type };

      if (isFile(item)) {
        const url = URL.createObjectURL(item);
        const type = item.type.startsWith("video/") ? "video" : "image";
        cache.current.set(id, { url, type, isObjectUrl: true });
        return { id, url, type };
      }

      const url = item.url;
      const type = resolveType(item.original_name ?? item.name ?? item.url);
      cache.current.set(id, { url, type, isObjectUrl: false });
      return { id, url, type };
    });
    // ids deriva de value; recomputa quando a lista muda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Limpa do cache os itens removidos, revogando as object URLs.
  useEffect(() => {
    const live = new Set(ids);
    for (const [id, entry] of cache.current.entries()) {
      if (!live.has(id)) {
        if (entry.isObjectUrl) URL.revokeObjectURL(entry.url);
        cache.current.delete(id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Revoga tudo ao desmontar.
  useEffect(() => {
    const map = cache.current;
    return () => {
      for (const entry of map.values()) {
        if (entry.isObjectUrl) URL.revokeObjectURL(entry.url);
      }
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const addFiles = (files: File[]) => {
    const filtered = files.filter((f) => matchesAccept(f, accept));
    if (!filtered.length) return;
    onChange(multiple ? [...value, ...filtered] : filtered.slice(0, 1));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    addFiles(Array.from(e.target.files));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (id: string) => {
    onChange(value.filter((item) => getId(item) !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(value, oldIndex, newIndex));
  };

  // Drag-and-drop de arquivos vindos de fora (SO). Usa os tipos do dataTransfer
  // para não confundir com o arraste de reordenação (que não carrega "Files").
  const hasFiles = (e: React.DragEvent) => Array.from(e.dataTransfer.types).includes("Files");

  const onDragEnter = (e: React.DragEvent) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth.current += 1;
    setIsDraggingFiles(true);
  };
  const onDragOver = (e: React.DragEvent) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const onDragLeave = (e: React.DragEvent) => {
    if (!hasFiles(e)) return;
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setIsDraggingFiles(false);
    }
  };
  const onDrop = (e: React.DragEvent) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth.current = 0;
    setIsDraggingFiles(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  // Soma o tamanho dos arquivos NOVOS (os existentes não são reenviados).
  // O servidor corta o envio acima de maxTotalSizeMb, então avisamos antes.
  const newFilesBytes = value.reduce(
    (sum, item) => sum + (item instanceof File ? item.size : 0),
    0,
  );
  const newFilesMb = newFilesBytes / (1024 * 1024);
  const overLimit = newFilesMb > maxTotalSizeMb;
  const nearLimit = newFilesMb >= maxTotalSizeMb * 0.85;

  return (
    <div className="space-y-3">
      <div
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative rounded-xl border border-dashed border-transparent transition-colors",
          isDraggingFiles && "border-[#9747FF] bg-[#9747FF]/5",
        )}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ids} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {previews.map((preview, index) => (
                <SortablePreview
                  key={preview.id}
                  preview={preview}
                  index={index}
                  onRemove={() => handleRemoveFile(preview.id)}
                />
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs text-muted-foreground transition-colors hover:border-[#9747FF] hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-8 w-8" />
                  <Film className="h-8 w-8" />
                </div>
                <span>Adicionar</span>
              </button>
            </div>
          </SortableContext>
        </DndContext>

        {isDraggingFiles && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-[#9747FF]/10">
            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#9747FF] shadow-sm">
              <Upload className="h-4 w-4" />
              Solte as imagens aqui
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Selecionar arquivos
        </Button>

        {previews.length > 1 && (
          <p className="text-xs text-muted-foreground">
            Arraste para reordenar — a 1ª foto é a capa do anúncio
          </p>
        )}
      </div>

      {nearLimit && (
        <div
          className={cn(
            "flex items-start gap-2 rounded-lg border p-3 text-xs",
            overLimit
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-amber-200 bg-amber-50 text-amber-700",
          )}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {overLimit ? (
              <>
                As novas fotos somam <strong>{newFilesMb.toFixed(1)} MB</strong>, acima do limite de{" "}
                <strong>{maxTotalSizeMb} MB</strong> por envio. O upload vai falhar — remova algumas fotos
                ou reduza o tamanho das imagens antes de salvar.
              </>
            ) : (
              <>
                As novas fotos somam <strong>{newFilesMb.toFixed(1)} MB</strong>, perto do limite de{" "}
                <strong>{maxTotalSizeMb} MB</strong> por envio. Se passar do limite, o upload pode falhar.
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

interface SortablePreviewProps {
  preview: Preview;
  index: number;
  onRemove: () => void;
}

function SortablePreview({ preview, index, onRemove }: SortablePreviewProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: preview.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative aspect-square cursor-grab touch-none overflow-hidden rounded-md border bg-muted active:cursor-grabbing",
        isDragging && "opacity-70 shadow-lg ring-2 ring-[#9747FF]",
      )}
    >
      {preview.type === "image" ? (
        <Image
          src={preview.url}
          alt={`Foto ${index + 1}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className="pointer-events-none object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Film className="h-12 w-12 text-muted-foreground" />
          <video
            src={preview.url}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
            muted
            loop
          />
          <span className="mt-2 text-xs text-muted-foreground">Vídeo</span>
        </div>
      )}

      {/* badge de ordem / capa */}
      <span
        className={cn(
          "absolute left-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-none shadow-sm",
          index === 0 ? "bg-[#9747FF] text-white" : "bg-black/55 text-white",
        )}
      >
        {index === 0 ? "Capa" : index + 1}
      </span>

      {/* alça visual de arraste (aparece no hover) */}
      <span className="absolute bottom-1.5 left-1.5 rounded bg-black/45 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
        <GripVertical className="h-3.5 w-3.5" />
      </span>

      <button
        type="button"
        aria-label="Remover imagem"
        onClick={onRemove}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute right-1 top-1 z-10 rounded-full bg-foreground/10 p-1 text-foreground backdrop-blur-sm transition-opacity hover:bg-foreground/20 group-hover:opacity-100 sm:opacity-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
