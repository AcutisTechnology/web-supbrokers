import Image from "next/image";
import { useState } from "react";

interface PropertyGalleryProps {
  images: { name: string; url: string }[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  
  // Se não houver imagens, mostrar um placeholder
  if (!images || images.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">Sem imagens disponíveis</span>
        </div>
        <div className="grid gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Sem imagens</span>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Sem imagens</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          src={images[activeImage].url}
          alt="Imagem principal do imóvel"
          className="object-cover"
          fill
          sizes="(min-width: 768px) 66vw, 100vw"
          priority
        />
      </div>
      <div className="grid gap-4">
        {images.length > 1 && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={images[1].url}
              alt="Imagem secundária do imóvel"
              className="object-cover"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              onClick={() => setActiveImage(1)}
            />
          </div>
        )}
        {images.length > 2 && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={images[2].url}
              alt="Imagem secundária do imóvel"
              className="object-cover"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              onClick={() => setActiveImage(2)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
