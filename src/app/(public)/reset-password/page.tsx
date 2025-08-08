import { ResetPasswordForm } from "@/features/reset-password/reset-password-form";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f6f6f6] px-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo-extendida.svg"
            alt="iMoobile"
            width={143}
            height={23}
            priority
          />
        </div>

        <div className="space-y-2 mb-8">
          <h1 className="text-[#141414] text-xl font-medium">Redefinir senha</h1>
          <p className="text-[#969696] text-sm">
            Digite sua nova senha para acessar sua conta
          </p>
        </div>

        <Suspense fallback={<div>Carregando...</div>}>
          <ResetPasswordForm />
        </Suspense>

        <div className="mt-4 text-center">
          <p className="text-sm text-[#969696]">
            Lembrou da senha?{" "}
            <Link href="/login" className="text-[#9747ff] hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>

      <footer className="mt-8 text-center text-sm text-[#969696]">
        <p className="mb-2">
          Ao usar nossa plataforma, você aceita e concorda com nossos{" "}
          <Link href="/terms" className="text-[#9747ff] hover:underline">
            Termos de uso
          </Link>{" "}
          e{" "}
          <Link href="/privacy" className="text-[#9747ff] hover:underline">
            Política de privacidade
          </Link>
        </p>
        <p>Copyright © iMoobile. Todos os direitos reservados</p>
      </footer>
    </main>
  );
}