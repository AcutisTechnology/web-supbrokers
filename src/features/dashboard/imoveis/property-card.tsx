import { Users, Bath, Home, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Property } from "./services/property-service";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  // Obter a primeira imagem ou usar um placeholder
  const imageUrl = property.images && property.images.length > 0
    ? property.images[0].url
    : "/placeholder.svg";

  // Formatar o valor para exibição
  const formattedValue = property.value 
    ? `R$ ${property.value}`
    : "Preço sob consulta";

  // Determinar se é aluguel ou venda
  const propertyType = property.rent ? "Aluguel" : "Venda";

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-[#d9d9d9] shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-xs font-medium">
          {propertyType}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Código: {property.code}</span>
        </div>
        <h3 className="font-medium text-[#141414] text-lg mb-1 line-clamp-1">{property.title}</h3>
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-[#777777] line-clamp-1">{property.neighborhood}, {property.street}</p>
        </div>
        <div className="text-xl font-semibold text-[#9747ff] mb-3">
          {formattedValue}
          {property.rent && <span className="text-sm font-normal ml-1">/mês</span>}
        </div>
        <div className="flex items-center gap-4 text-sm mb-3">
          <div className="flex items-center gap-1">
            <Home className="h-4 w-4 text-muted-foreground" />
            <span>{property.size}m²</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span>{property.bedrooms} {property.bedrooms === 1 ? "quarto" : "quartos"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{property.garages} {property.garages === 1 ? "vaga" : "vagas"}</span>
          </div>
        </div>
        {property.characteristics && property.characteristics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {property.characteristics.slice(0, 3).map((characteristic, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {characteristic.text}
              </Badge>
            ))}
            {property.characteristics.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{property.characteristics.length - 3}
              </Badge>
            )}
          </div>
        )}
        <div className="flex gap-2 mt-3">
          <Link href={`/dashboard/imoveis/${property.slug}/editar`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Editar
            </Button>
          </Link>
          <Link href={`/dashboard/imoveis/${property.slug}`} className="flex-1">
            <Button size="sm" className="w-full">
              Ver detalhes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
