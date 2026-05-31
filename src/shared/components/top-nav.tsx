"use client";

import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from "@/shared/hooks/auth/use-auth";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TopNavProps {
  title_secondary: string;
  breadcrumbs?: BreadcrumbItem[];
}

function getInitials(name: string | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function TopNav({ title_secondary, breadcrumbs }: TopNavProps) {
  const { user } = useAuth();
  const name = user?.user?.name ?? "";
  const firstName = name.split(" ")[0] || "Corretor";
  const initials = getInitials(name);

  const crumbs: BreadcrumbItem[] = breadcrumbs ?? [
    { label: "Home", href: "/dashboard" },
    { label: title_secondary },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-[#9747FF]/10 to-white p-6 rounded-xl mb-7">
      <div>
        <h1 className="text-2xl font-bold text-[#141414]">{title_secondary}</h1>
        <div className="flex items-center gap-2 text-sm text-[#777777] mt-1">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-[#9747FF] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#9747FF]">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex items-center gap-3">
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium">Bem-vindo(a), {firstName}</p>
          <p className="text-xs text-[#777777]">Corretor Imobiliário</p>
        </div>
        <Avatar className="h-10 w-10 border-2 border-[#9747FF]/20">
          <AvatarFallback className="bg-[#9747FF]/10 text-[#9747FF] font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
