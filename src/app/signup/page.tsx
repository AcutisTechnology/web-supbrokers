"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F6F6F6]">
      <div className="w-full max-w-[460px] bg-white rounded-lg p-6 space-y-6 border-[1px] border-border">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <Image
            src="/images/logo-login.png"
            alt="Supbrokers Logo"
            width={143}
            height={23}
          />
        </div>

        {/* Form Header */}
        <div className="space-y-1">
          <h1 className="text-[#141414] text-xl font-medium">Crie sua conta</h1>
          <p className="text-[#989898] text-sm">
            Informe seus dados para continuar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[#141414] text-sm">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seuemail@voce.com"
              className="border-[#D8D8D8]"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-[#141414] text-sm">
              Telefone
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="DDD + Telefone"
              className="border-[#D8D8D8]"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-[#141414] text-sm">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              className="border-[#D8D8D8]"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-[#141414] text-sm">
              Confirmar sua senha
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="********"
              className="border-[#D8D8D8]"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          {/* Password Requirements */}
          <Alert className="bg-[#FFF5E5] border-none text-[#453214]">
            <AlertDescription>
              <p className="font-medium mb-2">Sua senha deve conter</p>
              <ul className="text-sm space-y-1">
                <li>• 8 ou mais caracteres</li>
                <li>• No mínimo uma letra minúscula (a-z)</li>
                <li>• No mínimo uma letra maiúscula (A-Z)</li>
                <li>• No mínimo um número (0-9)</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#9747FF] hover:bg-[#9747FF]/90 text-white"
          >
            Criar conta gratuitamente
          </Button>

          {/* Login Link */}
          <Link href="/login" passHref>
            <Button
              variant="ghost"
              className="w-full text-[#9747FF] hover:bg-[#9747FF]/10 mt-2"
            >
              Já tenho uma conta
            </Button>
          </Link>
        </form>

        {/* Terms */}
        <p className="text-center text-sm text-[#989898]">
          Ao iniciar a sessão, você aceita e concorda com nossos{" "}
          <Link href="#" className="text-[#9747FF] hover:underline">
            Termos de uso
          </Link>{" "}
          e{" "}
          <Link href="#" className="text-[#9747FF] hover:underline">
            Política de privacidade
          </Link>
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-sm text-[#989898]">
        Copyright © Supbrokers. Todos os direitos reservados
      </footer>
    </div>
  );
}
