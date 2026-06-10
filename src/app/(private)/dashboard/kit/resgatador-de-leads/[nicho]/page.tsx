"use client";

import { useParams, notFound } from "next/navigation";
import { TopNav } from "@/shared/components/top-nav";
import { getNicho } from "@/features/kit/data/resgatador-de-leads";
import { DayCard } from "@/features/kit/components/day-card";

export default function NichoSequencePage() {
  const params = useParams();
  const nichoId = params.nicho as string;

  const nicho = getNicho(nichoId);
  if (!nicho) notFound();

  return (
    <>
      <TopNav title_secondary={nicho.title} />

      <p className="text-sm text-[#777777] mb-8 leading-relaxed">
        {nicho.subtitle} — reative o interesse de compra com mensagens estratégicas, uma por dia.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {nicho.days.map((day) => (
          <DayCard key={day.dia} card={day} />
        ))}
      </div>
    </>
  );
}
