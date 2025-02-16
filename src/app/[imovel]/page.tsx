import { PropertyListing } from "@/features/landing/property/components/property-listing";
import { SiteHeader } from "@/features/landing/property/components/site-header";

export default function Imovel() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="px-8 md:container py-6 mx-auto">
        <PropertyListing />
      </main>
    </div>
  );
}
