import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { PropertyFormValues } from "../schemas/property-schema";

interface PropertyPreviewProps {
  data: Partial<PropertyFormValues>;
}

export function PropertyPreview({ data }: PropertyPreviewProps) {
  // Obter a primeira imagem para exibição, se disponível
  const previewImage = data.attachments && data.attachments.length > 0
    ? URL.createObjectURL(data.attachments[0] as File)
    : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Supbrokers__C_C3_B3pia_S_C3_A9rgio_-i5IjBZhamqbTXLQvYD1E6xOv8YJ5Vg.png";

  // Formatar o valor para exibição
  const formattedValue = data.value ? formatCurrency(data.value) : "R$ 0,00";
  
  // Verificar se é para alugar ou vender
  const propertyType = data.purpose === "rent" ? "Aluguel" : "Venda";

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={previewImage}
          alt="Pré-visualização do imóvel"
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-xs font-medium">
          {propertyType}
        </div>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <div className="mb-1 text-2xl font-semibold text-[#9747ff]">
            {formattedValue}
            {data.purpose === "rent" && <span className="text-sm font-normal ml-1">/mês</span>}
          </div>
          <div className="font-medium text-lg line-clamp-1">
            {data.title || "Título do imóvel"}
          </div>
          <div className="font-medium">
            {data.neighborhood || "Bairro"}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-1">
            {data.street || "Endereço não informado"}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {data.size ? <div>{data.size}m²</div> : null}
          {data.bedrooms ? (
            <div>
              {data.bedrooms} {data.bedrooms === 1 ? "quarto" : "quartos"}
            </div>
          ) : null}
          {data.garages ? (
            <div>
              {data.garages} {data.garages === 1 ? "vaga" : "vagas"}
            </div>
          ) : null}
        </div>
        {data.characteristics && data.characteristics.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {data.characteristics.slice(0, 3).map((characteristic, index) => (
              <span key={index} className="bg-muted px-2 py-1 rounded-md text-xs">
                {characteristic}
              </span>
            ))}
            {data.characteristics.length > 3 && (
              <span className="bg-muted px-2 py-1 rounded-md text-xs">
                +{data.characteristics.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
} 