import Image from "next/image";

export function PropertyGallery() {
  return (
    <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          src="https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg"
          alt="Property exterior"
          className="object-cover"
          fill
          sizes="(min-width: 768px) 66vw, 100vw"
          priority
        />
      </div>
      <div className="grid gap-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src="https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg"
            alt="Property interior"
            className="object-cover"
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src="https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg"
            alt="Property interior"
            className="object-cover"
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        </div>
      </div>
    </div>
  );
}
