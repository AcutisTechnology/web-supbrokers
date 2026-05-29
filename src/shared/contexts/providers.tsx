"use client";

import { AuthProvider } from "@/shared/contexts/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { queryClient } from "../configs/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { InstallPrompt } from "@/shared/pwa/install-prompt";

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      <Toaster />
      <SonnerToaster position="top-right" richColors closeButton />
      <InstallPrompt />
      <Analytics />
    </QueryClientProvider>
  );
};

export { AppProviders };
