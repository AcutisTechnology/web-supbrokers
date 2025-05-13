import Image from "next/image";
import { useRouter } from "next/navigation";
import { Property, User, storeSelectedProperty } from "@/features/landing/services/broker-service";

interface SimilarPropertiesProps {
  properties?: Property[];
  userData?: User;
  currentPropertySlug?: string;
  corretor?: string;
}

export function SimilarProperties({ properties = [], userData, currentPropertySlug, corretor }: SimilarPropertiesProps) {
  const router = useRouter();
  
  // Filtra o imóvel atual da lista e pega os primeiros 5
  const filteredProperties = properties
    .filter(property => property.slug !== currentPropertySlug)
    .slice(0, 5);
  
  // Se não houver imóveis para mostrar, não renderiza o componente
  if (filteredProperties.length === 0) {
    return null;
  }

  const handlePropertyClick = (property: Property) => {
    if (userData) {
      storeSelectedProperty(property, userData);
    }
    router.push(`/${corretor}/imovel/${property.slug}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Mais imóveis para você</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProperties.map((property, i) => (
          <div 
            key={i} 
            className="group cursor-pointer space-y-3"
            onClick={() => handlePropertyClick(property)}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={property.attachments[0]?.url || "https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg"}
                alt={property.title}
                className="object-cover transition-transform group-hover:scale-105"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="space-y-1">
              <div className="font-medium">
                {property.sale ? `R$ ${property.value.split(',')[0]}` : `R$ ${property.value}/mês`}
              </div>
              <div className="text-sm text-muted-foreground">
                {property.neighborhood}, João Pessoa
              </div>
              <div className="text-sm text-muted-foreground">
                {property.street}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{property.size}m²</span>
                <span>•</span>
                <span>{property.bedrooms} quartos</span>
                {property.characteristics.some(c => c.text.toLowerCase().includes('piscina')) && (
                  <>
                    <span>•</span>
                    <span>Piscina</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
