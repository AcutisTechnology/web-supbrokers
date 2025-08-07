"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/shared/hooks/auth/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Step Components
import { UserTypeStep } from "./steps/user-type-step";

import { CredentialsStep } from "./steps/credentials-step";
import { DiscoveryStep } from "./steps/discovery-step";
import { PersonalDataStep } from "./steps/personal-data-step";
import { CompletionStep } from "./steps/completion-step";


export interface SignupFormData {
  userType: 'corretor' | 'imobiliaria' | 'construtora' | '';
  name: string;
  username: string;
  phone: string;
  cpf: string;
  email: string;
  password: string;
  password_confirmation: string;
  discoverySource: string;
}

const STEPS = [
  { id: 1, title: "Tipo de usuário", component: UserTypeStep },
  { id: 2, title: "Dados pessoais", component: PersonalDataStep },
  { id: 3, title: "Credenciais", component: CredentialsStep },
  { id: 4, title: "Como nos conheceu", component: DiscoveryStep },
  { id: 5, title: "Finalização", component: CompletionStep },
];

export function SignupWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const { signup, loading } = useAuth();
  const router = useRouter();

  const form = useForm<SignupFormData>({
    defaultValues: {
      userType: '',
      name: '',
      username: '',
      phone: '',
      cpf: '',
      email: '',
      password: '',
      password_confirmation: '',
      discoverySource: '',
    },
  });

  const progress = (currentStep / STEPS.length) * 100;
  const CurrentStepComponent = STEPS[currentStep - 1]?.component;

  const handleNext = async () => {
    if (currentStep === 4) {
      // Submit form on step 4 (DiscoveryStep)
      const data = form.getValues();
      const formattedData = {
        ...data,
        phone: data.phone.replace(/\D/g, ""),
        cpf: data.cpf.replace(/\D/g, ""),
        discovery_source: data.discoverySource,
        user_type: data.userType,
      };
      try {
        await signup(formattedData);
        setCurrentStep(currentStep + 1);
      } catch (error) {
        // Error is already handled by the signup function with toast
        // Don't advance to next step
        console.error('Signup failed:', error);
      }
    } else if (currentStep === STEPS.length) {
      // Redirect to dashboard on final step
      router.push("/login");
    } else if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    const data = form.getValues();
    switch (currentStep) {
      case 1:
        return data.userType !== '';
      case 2:
        return data.name && data.username && data.phone && data.cpf;
      case 3:
        return data.email && data.password && data.password_confirmation && data.password === data.password_confirmation;
      case 4:
        return data.discoverySource !== '';
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#F6F6F6] via-[#FAFAFA] to-[#F0F0F0] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#9747FF]/10 to-[#FF6B9D]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#4ECDC4]/8 to-[#9747FF]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#9747FF]/3 to-[#6C5CE7]/3 rounded-full blur-3xl" />
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 border-2 border-[#9747FF]/20 rotate-45 rounded-lg" />
        <div className="absolute top-32 right-20 w-8 h-8 bg-[#FF6B9D]/10 rounded-full" />
        <div className="absolute bottom-40 left-20 w-12 h-12 border border-[#4ECDC4]/30 rotate-12" />
        <div className="absolute bottom-20 right-32 w-6 h-6 bg-[#9747FF]/15 rotate-45" />
        
        {/* Property/building icons as subtle background */}
        <div className="absolute top-1/4 left-1/4 opacity-5">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="text-[#9747FF]">
            <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="1" fill="currentColor"/>
          </svg>
        </div>
        
        <div className="absolute top-3/4 right-1/4 opacity-5">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" className="text-[#4ECDC4]">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" stroke="currentColor" strokeWidth="1" fill="currentColor"/>
          </svg>
        </div>
        
        {/* Tech grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(90deg, #9747FF 1px, transparent 1px),
              linear-gradient(180deg, #9747FF 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#FF6B9D]/20 rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[#4ECDC4]/25 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-2/3 right-1/4 w-4 h-4 border border-[#9747FF]/15 rounded-full animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="w-full max-w-[500px] relative z-10">
        {/* Header with logo and progress */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-[#9747FF] p-3 rounded-2xl shadow-lg">
              <Image
                src="/logo.svg"
                alt="iMoobile Logo"
                width={32}
                height={32}
                className="filter brightness-0 invert"
              />
            </div>
          </div>
          
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-[#141414] mb-2 font-display">
              Bem-vindo ao Imoobile
            </h1>
            <p className="text-[#989898] text-sm mb-6">
              Passo {currentStep} de {STEPS.length}
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2 bg-gray-200" />
          </div>
        </div>

        {/* Main card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {CurrentStepComponent && (
                  <CurrentStepComponent form={form} onNext={handleNext} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-12 border-[#D8D8D8] text-[#989898] hover:bg-gray-50"
                >
                  Voltar
                </Button>
              )}
              
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className={`h-12 bg-[#9747FF] hover:bg-[#9747FF]/90 text-white font-medium ${
                  currentStep === 1 ? 'w-full' : 'flex-1'
                }`}
              >
                {loading
                  ? "Criando conta..."
                  : currentStep === 4
                  ? "Finalizar cadastro"
                  : currentStep === STEPS.length
                  ? "Ir para o painel"
                  : "Continuar"}
              </Button>
            </div>

            {/* Login link */}
            <div className="text-center mt-6">
              <p className="text-sm text-[#989898]">
                Já possui uma conta?{" "}
                <Link href="/login" className="text-[#9747FF] hover:underline font-medium">
                  Entrar
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-[#989898]">
          Copyright © iMoobile. Todos os direitos reservados
        </footer>
      </div>
    </div>
  );
}