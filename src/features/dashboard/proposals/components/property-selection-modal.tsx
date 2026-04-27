"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { Property } from "@/features/dashboard/imoveis/services/property-service";
import { Search, MapPin, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PropertySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (property: Property) => void;
}

export function PropertySelectionModal({
  isOpen,
  onClose,
  onSelect,
}: PropertySelectionModalProps) {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["properties", "selection", search],
    queryFn: async () => {
      const response = await api
        .get(`properties?search=${search}`)
        .json<{ data: Property[] }>();
      return response.data;
    },
    enabled: isOpen,
  });

  const parseCurrencyToNumber = (value: string | number) => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    // Remove pontos de milhar e substitui vírgula por ponto
    const cleanedValue = value.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleanedValue) || 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-[#4A316A]">Selecionar Imóvel</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#969696]" />
          <Input
            placeholder="Buscar por título, código ou bairro..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A316A]"></div>
            </div>
          ) : data && data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.map((property) => (
                <div
                  key={property.id}
                  onClick={() => onSelect(property)}
                  className="flex gap-3 p-3 border rounded-lg hover:border-[#4A316A] hover:bg-purple-50 cursor-pointer transition-all group"
                >
                  <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={property.attachments?.[0]?.url || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <h4 className="font-semibold text-[#4A316A] line-clamp-1 group-hover:text-[#4A316A]">
                        {property.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-[#969696] mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{property.neighborhood}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#969696] mt-0.5">
                        <Tag className="w-3 h-3" />
                        <span>Cód: {property.code}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-[#4A316A]">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(parseCurrencyToNumber(property.value))}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {property.rent ? "Aluguel" : "Venda"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-[#969696]">
              Nenhum imóvel encontrado.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
