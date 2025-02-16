import Image from "next/image";

export function SimilarProperties() {
  const properties = Array(4).fill({
    price: "R$ 330.000",
    location: "Bessa, João Pessoa",
    address: "Rua Randal Cavalcanti Pimentel",
    size: "55m²",
    bedrooms: "3 quartos",
    hasPool: true,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Mais imóveis para você</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {properties.map((property, i) => (
          <div key={i} className="group cursor-pointer space-y-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg"
                alt="Property"
                className="object-cover transition-transform group-hover:scale-105"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="space-y-1">
              <div className="font-medium">{property.price}</div>
              <div className="text-sm text-muted-foreground">
                {property.location}
              </div>
              <div className="text-sm text-muted-foreground">
                {property.address}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{property.size}</span>
                <span>•</span>
                <span>{property.bedrooms}</span>
                <span>•</span>
                <span>Piscina</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
