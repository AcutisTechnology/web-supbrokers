"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { use } from "react";
import { Property, User, storeSelectedProperty } from "../services/broker-service";

interface PropertyCardProps {
  title: string;
  location: string;
  price: string;
  type: "rent" | "sale";
  details?: {
    area?: string;
    bedrooms?: string;
    hasElevator?: boolean;
  };
  imageUrl: string;
  slug?: string;
  propertyData?: Property;
  userData?: User;
}

export function PropertyCard({
  title,
  location,
  price,
  type,
  details,
  imageUrl,
  slug,
  propertyData,
  userData,
}: PropertyCardProps) {
  const router = useRouter();
  const params = useParams();
  const corretor = params.corretor as string;

  const handleClick = () => {
    if (slug && corretor) {
      if (propertyData && userData) {
        storeSelectedProperty(propertyData, userData);
      }
      
      router.push(`/${corretor}/imovel/${slug}`);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
          {type === "rent" ? "Aluguel" : "Venda"}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 line-clamp-1">{title}</h3>
        <p className="text-[#777777] text-sm mb-2">{location}</p>
        <div className="flex justify-between items-center">
          <p className="font-bold text-primary">
            {type === "rent" ? `R$ ${price}/mês` : `R$ ${price}`}
          </p>
        </div>
        {details && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-[#777777]">
            {details.area && <span>{details.area}</span>}
            {details.bedrooms && <span>{details.bedrooms}</span>}
            {details.hasElevator && <span>Com elevador</span>}
          </div>
        )}
      </div>
    </div>
  );
}
