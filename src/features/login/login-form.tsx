"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/shared/hooks/auth/use-auth";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { signin, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSignin(data: { email: string; password: string }) {
    await signin(data);
  }

  return (
    <form onSubmit={handleSubmit(handleSignin)} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#141414]"
        >
          E-mail
        </label>
        <Input
          {...register("email")}
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
        <div className="relative">
          <Input
            {...register("password")}
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            required
            className="w-full px-3 py-2 pr-10 border border-[#d8d8d8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9747ff]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#989898] hover:text-[#141414] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#9747ff] hover:bg-[#9747ff]/90 text-white py-3 rounded-lg font-medium"
      >
        {loading ? "Entrando..." : "Entrar na conta"}
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
