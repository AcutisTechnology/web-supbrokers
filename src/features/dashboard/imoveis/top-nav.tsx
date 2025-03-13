import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface TopNavProps {
  title_secondary: string;
}

export function TopNav({ title_secondary }: TopNavProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-[#9747FF]/10 to-white p-6 rounded-xl mb-7">
      <div>
        <h1 className="text-2xl font-bold text-[#141414]">{title_secondary}</h1>
        <div className="flex items-center gap-2 text-sm text-[#777777] mt-1">
          <Link href="/dashboard" className="hover:text-[#9747FF] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#9747FF]">{title_secondary}</span>
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex items-center gap-3">
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium">Bem-vindo(a)</p>
          <p className="text-xs text-[#777777]">Corretor Imobiliário</p>
        </div>
        <Avatar className="h-10 w-10 border-2 border-[#9747FF]/20">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="bg-[#9747FF]/10 text-[#9747FF]">CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
