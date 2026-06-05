import dynamic from "next/dynamic";

// Desativa SSR para evitar hydration mismatch com Select (Radix) + React Query cache.
// Esta é uma página autenticada/dinâmica — não há benefício em renderizar no servidor.
const DemandasPage = dynamic(
  () => import("@/features/dashboard/demandas/components/demandas-page"),
  { ssr: false }
);

export default DemandasPage;
