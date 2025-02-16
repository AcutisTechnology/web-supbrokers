"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.replace("/dashboard");

    setIsLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#141414]"
        >
          E-mail
        </label>
        <Input
          id="email"
          type="email"
          placeholder="seuemail@voce.com"
          required
          className="w-full px-3 py-2 border border-[#d8d8d8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9747ff]"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[#141414]"
        >
          Senha
        </label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          required
          className="w-full px-3 py-2 border border-[#d8d8d8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9747ff]"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#9747ff] hover:bg-[#9747ff]/90 text-white py-3 rounded-lg font-medium"
      >
        {isLoading ? "Entrando..." : "Entrar na conta"}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full bg-[#f2e8ff] hover:bg-[#f2e8ff]/80 text-[#4a316a] py-3 rounded-lg font-medium"
        asChild
      >
        <Link href="/forgot-password">Esqueci minha senha</Link>
      </Button>
    </form>
  );
}
