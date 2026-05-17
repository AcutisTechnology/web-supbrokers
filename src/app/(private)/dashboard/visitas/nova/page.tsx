"use client";

import { TopNav } from "@/features/dashboard/visitas/components/top-nav";
import { VisitForm } from "@/features/dashboard/visitas/components/visit-form";

export default function NewVisitPage() {
  return (
    <>
      <TopNav title_secondary="Nova visita" />
      <VisitForm mode="create" />
    </>
  );
}
