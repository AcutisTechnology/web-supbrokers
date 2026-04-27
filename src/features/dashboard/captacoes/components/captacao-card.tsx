"use client";

import Link from "next/link";
import { Building2, ExternalLink, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Captacao } from "../services/captacoes-service";

interface CaptacaoCardProps {
  captacao: Captacao;
  onDelete?: (id: number) => void;
}

export function CaptacaoCard({ captacao, onDelete }: CaptacaoCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(captacao.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const builderName = captacao.builder?.name ?? "Construtora não informada";
  const neighborhoodName = captacao.neighborhood_ref?.name ?? "";
  const locationLabel = neighborhoodName;

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-[#d9d9d9] shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center relative">
        <Building2 className="w-10 h-10 text-gray-400" />
        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-xs font-medium">
          {captacao.status?.trim() ? captacao.status : "Captação"}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="font-medium text-[#141414] text-lg line-clamp-1">{captacao.building_name}</h3>
          <Badge variant="outline" className="text-xs">
            {builderName}
          </Badge>
        </div>

        {locationLabel ? (
          <div className="flex items-center gap-1 mb-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-[#777777] line-clamp-1">{locationLabel}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-2">
          <Link
            href={captacao.drive_url?.trim() ? captacao.drive_url : "#"}
            target={captacao.drive_url?.trim() ? "_blank" : undefined}
            className={!captacao.drive_url?.trim() ? "pointer-events-none opacity-50" : ""}
          >
            <Button variant="outline" size="sm" className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />
              Abrir Drive
            </Button>
          </Link>
        </div>

        {onDelete ? (
          <div className="mt-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full" disabled={isDeleting}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir captação</AlertDialogTitle>
                  <AlertDialogDescription>Tem certeza que deseja excluir esta captação? Esta ação não pode ser desfeita.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : null}
      </div>
    </div>
  );
}
