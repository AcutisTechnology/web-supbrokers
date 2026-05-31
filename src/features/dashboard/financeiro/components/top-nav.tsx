"use client";

import { TopNav as SharedTopNav } from "@/shared/components/top-nav";

interface TopNavProps {
  title_secondary: string;
}

export function TopNav({ title_secondary }: TopNavProps) {
  return (
    <SharedTopNav
      title_secondary={title_secondary}
      breadcrumbs={[
        { label: "Home", href: "/dashboard" },
        { label: "Financeiro", href: "/dashboard/financeiro" },
        { label: title_secondary },
      ]}
    />
  );
}
