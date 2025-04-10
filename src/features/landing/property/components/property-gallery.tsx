import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PropertyGalleryProps {
  images: Array<{ name: string; url: string }>;
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use a fallback image if no images are provided
  const hasImages = images && images.length > 0;
  const fallbackImage = 'https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg';

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowModal(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    // Restore scrolling
    document.body.style.overflow = '';
  };

  const goToPrevious = () => {
    setCurrentImageIndex(prev => (prev === 0 ? (hasImages ? images.length - 1 : 0) : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex(prev => (prev === (hasImages ? images.length - 1 : 0) ? 0 : prev + 1));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  if (!hasImages) {
    return (
      <div className="relative rounded-lg overflow-hidden aspect-[16/9] bg-gray-100">
        <Image src={fallbackImage} alt="Imóvel sem imagem" fill className="object-cover" />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 md:grid-rows-2 h-[400px] md:h-[500px]">
        {/* Main image */}
        <div
          className="md:col-span-2 md:row-span-2 relative rounded-lg overflow-hidden cursor-pointer"
          onClick={() => openModal(0)}
        >
          <Image
            src={images[0].url}
            alt="Imagem principal do imóvel"
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Secondary images */}
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="hidden md:block relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openModal(index + 1)}
          >
            <Image
              src={image.url}
              alt={`Imagem ${index + 2} do imóvel`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}

        {/* Show "Ver mais fotos" only if there are more than 5 images */}
        {images.length > 5 && (
          <div
            className="hidden md:flex relative rounded-lg overflow-hidden cursor-pointer bg-black/50 items-center justify-center"
            onClick={() => openModal(5)}
          >
            <div className="text-white text-center z-10">
              <span className="font-medium">+{images.length - 5}</span>
              <p className="text-sm">Ver mais fotos</p>
            </div>
            <Image
              src={images[5].url}
              alt={`Imagem ${6} do imóvel`}
              fill
              className="object-cover opacity-60"
            />
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div
            className="relative max-w-6xl w-full max-h-[90vh] h-full"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-20 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
              onClick={closeModal}
            >
              <X size={24} />
            </button>

            {/* Navigation buttons */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
              onClick={e => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft size={32} />
            </button>

            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
              onClick={e => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight size={32} />
            </button>

            {/* Current image */}
            <div className="h-full w-full flex items-center justify-center">
              <div className="relative h-full max-h-[80vh] w-full">
                <Image
                  src={images[currentImageIndex].url}
                  alt={`Imagem ${currentImageIndex + 1} do imóvel`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
