import { PropertyDetailsClient } from "@/features/dashboard/imoveis/components/property-details-client";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PropertyDetailsClient slug={slug} />;
} 