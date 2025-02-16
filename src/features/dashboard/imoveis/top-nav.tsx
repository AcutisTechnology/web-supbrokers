import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface TopNavProps {
  title_secondary: string;
}

export function TopNav({ title_secondary }: TopNavProps) {
  return (
    <div className="h-16 border-[1px] border-border rounded-2xl bg-white px-8 mb-7 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="#" className="text-[#777777] hover:text-[#141414]">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-[#777777]" />
        <span className="text-[#141414]">{title_secondary}</span>
      </div>

      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
