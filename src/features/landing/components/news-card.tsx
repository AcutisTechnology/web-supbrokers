import Image from "next/image";

interface NewsCardProps {
  title: string;
  author: string;
  imageUrl: string;
}

export function NewsCard({ title, author, imageUrl }: NewsCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-border">
      <div className="aspect-video relative">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg leading-tight mb-4">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#9747FF] flex items-center justify-center">
            <span className="text-white text-xs">S</span>
          </div>
          <span className="text-sm text-[#777777]">por {author}</span>
        </div>
      </div>
    </div>
  );
}
