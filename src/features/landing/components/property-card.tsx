import Image from "next/image";
import { useRouter } from "next/navigation";

interface PropertyCardProps {
  title: string;
  location: string;
  price: string;
  type: "sale" | "rent";
  details?: {
    area?: string;
    bedrooms?: string;
    hasElevator?: boolean;
  };
  imageUrl: string;
}

export function PropertyCard({
  title,
  location,
  price,
  type,
  details,
  imageUrl,
}: PropertyCardProps) {
  const router = useRouter();

  return (
    <div
      className="bg-white rounded-lg overflow-hidden border cursor-pointer"
      // TODO: Alterar rota para dinamicamente para a página do imóvel
      onClick={() => router.push("/218312/123-imovel-123")}
    >
      <div className="aspect-[4/3] relative">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-[#777777] text-sm">{location}</p>
        {details && (
          <div className="flex gap-2 text-sm text-[#777777] mt-2">
            {details.area && <span>{details.area}</span>}
            {details.bedrooms && (
              <>
                <span>•</span>
                <span>{details.bedrooms}</span>
              </>
            )}
            {details.hasElevator && (
              <>
                <span>•</span>
                <span>Elevador</span>
              </>
            )}
          </div>
        )}
        <div className="mt-4">
          {type === "rent" && <p className="text-sm text-[#777777]">Aluguel</p>}
          <p className="font-medium text-lg">
            R$ {price}
            {type === "sale" && ".000"}
          </p>
        </div>
      </div>
    </div>
  );
}
