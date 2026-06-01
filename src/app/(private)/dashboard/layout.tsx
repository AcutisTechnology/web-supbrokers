'use client';

import { Building2, LayoutDashboard, Settings, Users, Wallet } from "lucide-react";
import { Sidebar } from "@/shared/components/sidebar";
// import { SubscriptionModal } from "@/shared/components/subscription-modal";
import { MobileBottomNav, type BottomNavItem } from "@/shared/pwa/mobile-bottom-nav";

const ADMIN_NAV: BottomNavItem[] = [
  { label: "Início", icon: LayoutDashboard, to: "/dashboard", exact: true },
  { label: "Imóveis", icon: Building2, to: "/dashboard/imoveis" },
  { label: "CRM", icon: Users, to: "/dashboard/crm" },
  { label: "Financeiro", icon: Wallet, to: "/dashboard/financeiro" },
  { label: "Config", icon: Settings, to: "/dashboard/configuracoes" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: reativar modal de planos após período de teste
  // const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   if (user?.user?.subscription?.status === "NO_SUBSCRIPTION") {
  //     setShowModal(true);
  //   }
  // }, [user]);

  return (
    <div className="flex min-h-screen bg-[#f6f6f6]">
      <Sidebar />
      <main className="flex-1 min-w-0 p-4 md:p-8 md:py-6 mt-16 md:mt-0 pb-[calc(env(safe-area-inset-bottom)+4.75rem)] lg:pb-6">
        {children}
      </main>
      <MobileBottomNav items={ADMIN_NAV} theme="light" />
      {/* <SubscriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      /> */}
    </div>
  );
}
