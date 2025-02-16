import { Users, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  stats: {
    area: number;
    rooms: number;
  };
}

export function PropertyCard({
  image,
  title,
  location,
  stats,
}: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-[#d9d9d9]">
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="absolute top-2 right-2 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm">
          <span>{stats.area}</span>
          <Bath className="h-4 w-4" />
          <span>{stats.rooms}</span>
          <Users className="h-4 w-4" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-[#141414]">{title}</h3>
        <p className="text-sm text-[#777777]">{location}</p>
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            Editar
          </Button>
        </div>
      </div>
    </div>
  );
}
