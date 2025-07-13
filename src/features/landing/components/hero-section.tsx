'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Play, Star, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onOpenWhatsApp: () => void;
}

export function HeroSection({ onOpenWhatsApp }: HeroSectionProps) {
  const router = useRouter();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const trustBadges = [
    { icon: <Shield className="h-5 w-5" />, text: "100% Seguro" },
    { icon: <Zap className="h-5 w-5" />, text: "Setup em 5min" },
    { icon: <Star className="h-5 w-5" />, text: "4.9/5 Avaliação" },
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#9747FF]/5 via-white to-[#9747FF]/10 py-20 md:py-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#9747FF]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            {/* Trust Badge */}
            <motion.div variants={fadeInUp} className="flex items-center space-x-2">
              <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                +1.500 corretores ativos agora
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#362D3E] leading-tight">
                <span className="text-[#9747FF]">Automatize</span> seu
                <br />negócio e{' '}
                <span className="relative">
                  <span className="text-[#9747FF]">venda 40% mais</span>
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#9747FF]/30" viewBox="0 0 200 12" fill="currentColor">
                    <path d="M0,8 Q50,0 100,8 T200,8 L200,12 L0,12 Z" />
                  </svg>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                A única plataforma que transforma corretores tradicionais em 
                <span className="font-semibold text-[#9747FF]"> negócios digitais de alto desempenho</span>.
                Gestão completa + Site personalizado + Leads qualificados.
              </p>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-600">
                  <div className="text-[#9747FF]">{badge.icon}</div>
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => router.push('/signup')}
                className="group bg-[#9747FF] text-white px-8 py-4 rounded-xl hover:bg-[#9747FF]/90 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Começar Teste Grátis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onOpenWhatsApp}
                className="group bg-white border-2 border-[#9747FF] text-[#9747FF] px-8 py-4 rounded-xl hover:bg-[#9747FF]/5 transition-all duration-300 flex items-center justify-center font-semibold text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Demonstração
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={fadeInUp} className="pt-8">
              <p className="text-sm text-gray-500 mb-3">Confiado por mais de 1.500 profissionais:</p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm font-medium text-gray-700">4.9/5 (324 avaliações)</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Dashboard Image */}
            <div className="relative z-10 rounded-2xl shadow-2xl overflow-hidden bg-white p-2">
              <Image
                src="/images/landing/dashboard.png"
                alt="Dashboard iMoobile - Interface completa para gestão imobiliária"
                width={700}
                height={500}
                className="w-full h-auto rounded-xl"
                priority
              />
            </div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">+40% Vendas</p>
                  <p className="text-xs text-gray-500">Este mês</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#9747FF]/10 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5 text-[#9747FF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Setup Automático</p>
                  <p className="text-xs text-gray-500">Pronto em 5 minutos</p>
                </div>
              </div>
            </motion.div>

            {/* Background Decorations */}
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#9747FF]/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}