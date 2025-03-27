'use client';

import { useEffect, useState } from "react";
import { Sidebar } from "@/shared/components/sidebar";
import { useAuth } from "@/shared/hooks/auth/use-auth";
import { SubscriptionModal } from "@/shared/components/subscription-modal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.user?.subscription?.status === "NO_SUBSCRIPTION") {
      setShowModal(true);
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-[#f6f6f6]">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 md:py-6 mt-16 md:mt-0">{children}</main>
      <SubscriptionModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
}
