import type React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f6f6f6]">
      <main className="flex-1">
        <div>{children}</div>
      </main>
    </div>
  );
}
