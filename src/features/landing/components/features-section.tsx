'use client';

import { motion, Variants } from 'framer-motion';
import { 
  Building, 
  Users, 
  Calendar, 
  BarChart, 
  Smartphone, 
  Shield, 
  Zap, 
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  color: string;
  gradient: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
  isActive: boolean;
  onHover: (id: string | null) => void;
}

function FeatureCard({ feature, index, isActive, onHover }: FeatureCardProps) {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group relative"
      onMouseEnter={() => onHover(feature.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Main Card */}
      <div className={`
        relative bg-white rounded-2xl p-8 h-full
        border border-gray-100 shadow-lg
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:-translate-y-2
        ${isActive ? 'ring-2 ring-[#9747FF]/20 shadow-2xl -translate-y-2' : ''}
      `}>
        {/* Icon Container */}
        <div className={`
          relative w-16 h-16 rounded-2xl mb-6
          flex items-center justify-center
          transition-all duration-300
          ${feature.gradient}
          group-hover:scale-110
        `}>
          <div className="text-white">
            {feature.icon}
          </div>
          
          {/* Icon Glow Effect */}
          <div className={`
            absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20
            transition-opacity duration-300 blur-xl
            ${feature.gradient}
          `}></div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-[#362D3E] group-hover:text-[#9747FF] transition-colors duration-300">
            {feature.title}
          </h3>
          
          <p className="text-gray-600 leading-relaxed">
            {feature.description}
          </p>

          {/* Benefits List */}
          <div className="space-y-2 pt-2">
            {feature.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <div className="w-10 h-10 bg-[#9747FF] rounded-full flex items-center justify-center">
            <ArrowRight className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Background Gradient Overlay */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5
          transition-opacity duration-300 pointer-events-none
          ${feature.gradient}
        `}></div>
      </div>

      {/* Card Shadow */}
      <div className={`
        absolute inset-0 rounded-2xl -z-10
        transition-all duration-300
        ${isActive ? feature.gradient + ' opacity-20 blur-xl' : 'opacity-0'}
      `}></div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features: Feature[] = [
    {
      id: 'properties',
      icon: <Building className="h-8 w-8" />,
      title: 'Gestão Completa de Imóveis',
      description: 'Cadastre, organize e gerencie todo seu portfólio imobiliário com ferramentas profissionais e interface intuitiva.',
      benefits: [
        'Cadastro rápido com fotos e detalhes',
        'Organização por categorias e filtros',
        'Sincronização automática com seu site'
      ],
      color: 'text-blue-600',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      id: 'leads',
      icon: <Users className="h-8 w-8" />,
      title: 'Leads Qualificados',
      description: 'Receba e gerencie leads de alta qualidade diretamente na plataforma, com sistema de pontuação e follow-up automático.',
      benefits: [
        'Leads pré-qualificados automaticamente',
        'Sistema de pontuação inteligente',
        'Follow-up automático por WhatsApp'
      ],
      color: 'text-green-600',
      gradient: 'bg-gradient-to-br from-green-500 to-green-600',
    },
    {
      id: 'contracts',
      icon: <Calendar className="h-8 w-8" />,
      title: 'Contratos e Aluguéis',
      description: 'Controle total sobre contratos, pagamentos e manutenções com lembretes automáticos e relatórios detalhados.',
      benefits: [
        'Contratos digitais com assinatura eletrônica',
        'Controle de pagamentos e inadimplência',
        'Lembretes automáticos de vencimentos'
      ],
      color: 'text-purple-600',
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
    {
      id: 'website',
      icon: <Globe className="h-8 w-8" />,
      title: 'Site Personalizado',
      description: 'Tenha seu próprio site profissional com seus imóveis, totalmente responsivo e otimizado para conversão.',
      benefits: [
        'Design profissional e responsivo',
        'SEO otimizado para Google',
        'Integração com redes sociais'
      ],
      color: 'text-[#9747FF]',
      gradient: 'bg-gradient-to-br from-[#9747FF] to-purple-600',
    },
    {
      id: 'mobile',
      icon: <Smartphone className="h-8 w-8" />,
      title: 'App Mobile Nativo',
      description: 'Acesse tudo pelo celular com nosso app nativo, trabalhe de qualquer lugar com sincronização em tempo real.',
      benefits: [
        'App nativo iOS e Android',
        'Sincronização em tempo real',
        'Notificações push de novos leads'
      ],
      color: 'text-orange-600',
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-600',
    },
    {
      id: 'analytics',
      icon: <BarChart className="h-8 w-8" />,
      title: 'Relatórios Inteligentes',
      description: 'Dashboards completos com métricas de performance, análise de leads e insights para otimizar suas vendas.',
      benefits: [
        'Métricas de performance em tempo real',
        'Análise de ROI por canal',
        'Relatórios personalizáveis'
      ],
      color: 'text-red-600',
      gradient: 'bg-gradient-to-br from-red-500 to-red-600',
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section id="recursos" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#9747FF]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-[#9747FF]/10 text-[#9747FF] px-4 py-2 rounded-full font-medium mb-4">
            <Zap className="h-4 w-4 mr-2" />
            Recursos Principais
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#362D3E] mb-6">
            Tudo que você precisa para
            <span className="text-[#9747FF]"> dominar o mercado</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Uma plataforma completa que reúne todas as ferramentas essenciais para 
            transformar seu negócio imobiliário em uma máquina de vendas.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={index}
              isActive={activeFeature === feature.id}
              onHover={setActiveFeature}
            />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-4 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-500" />
              <span className="font-medium text-gray-700">Setup em 5 minutos</span>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-[#9747FF]" />
              <span className="font-medium text-gray-700">Suporte 24/7</span>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-blue-500" />
              <span className="font-medium text-gray-700">Garantia de 30 dias</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}