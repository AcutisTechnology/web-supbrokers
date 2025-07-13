'use client';

import { motion } from 'framer-motion';
import { Star, Quote, TrendingUp, Award, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  testimonial: string;
  rating: number;
  results: {
    metric: string;
    value: string;
    improvement: string;
  };
  avatar: string;
  verified: boolean;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  isActive: boolean;
}

function TestimonialCard({ testimonial, index, isActive }: TestimonialCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { 
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "tween",
            duration: 0.6,
            delay: index * 0.1,
            ease: "easeOut"
          }
        }
      }}
      className={`
        group relative bg-white rounded-2xl p-8 h-full
        border border-gray-100 shadow-lg
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:-translate-y-2
        ${isActive ? 'ring-2 ring-[#9747FF]/20 shadow-2xl -translate-y-2' : ''}
      `}
    >
      {/* Quote Icon */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#9747FF] rounded-full flex items-center justify-center">
        <Quote className="h-4 w-4 text-white" />
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < testimonial.rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        {testimonial.verified && (
          <div className="ml-2 flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            <Award className="h-3 w-3" />
            <span>Verificado</span>
          </div>
        )}
      </div>

      {/* Testimonial Text */}
      <blockquote className="text-gray-700 leading-relaxed mb-6 text-lg">
        {`"${testimonial.testimonial}"`}
      </blockquote>

      {/* Results Box */}
      <div className="bg-gradient-to-r from-[#9747FF]/5 to-blue-500/5 rounded-xl p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="h-4 w-4 text-[#9747FF]" />
          <span className="text-sm font-medium text-gray-600">Resultado Obtido:</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-[#9747FF]">{testimonial.results.value}</span>
          <span className="text-sm text-gray-600">{testimonial.results.metric}</span>
        </div>
        <p className="text-sm text-green-600 font-medium mt-1">
          {testimonial.results.improvement}
        </p>
      </div>

      {/* Author Info */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-[#9747FF] to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {testimonial.name.split(' ').map(n => n[0]).join('')}
          </div>
          {testimonial.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Award className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-[#362D3E]">{testimonial.name}</h4>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
          <p className="text-xs text-[#9747FF] font-medium">{testimonial.company}</p>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#9747FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState<string | null>(null);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Luis Antonio Silva',
      role: 'Corretor Sênior',
      company: 'Silva Imóveis',
      testimonial: 'Em 6 meses usando o iMoobile, minhas vendas aumentaram 45%. A plataforma é intuitiva e o suporte é excepcional. Meus clientes adoram o site personalizado e eu consigo gerenciar tudo em um só lugar.',
      rating: 5,
      results: {
        metric: 'aumento em vendas',
        value: '+45%',
        improvement: 'em apenas 6 meses'
      },
      avatar: '/avatars/luis.jpg',
      verified: true,
    },
    {
      id: '2',
      name: 'Sergio Filho',
      role: 'Diretor Comercial',
      company: 'Filho Negócios Imobiliários',
      testimonial: 'Como empresário, preciso de resultados. O iMoobile entregou além das expectativas. Automatizamos 80% dos processos e nossa equipe agora foca no que realmente importa: vender mais.',
      rating: 5,
      results: {
        metric: 'processos automatizados',
        value: '80%',
        improvement: 'economia de 15h/semana'
      },
      avatar: '/avatars/sergio.jpg',
      verified: true,
    },
    {
      id: '3',
      name: 'Hercules Dutra',
      role: 'Corretor Autônomo',
      company: 'Dutra Consultoria',
      testimonial: 'Trabalho sozinho e precisava de uma solução completa. O iMoobile me deu um site profissional, gestão de leads e ainda economizo tempo com a automação. Recomendo para qualquer corretor.',
      rating: 5,
      results: {
        metric: 'leads qualificados',
        value: '+120%',
        improvement: 'conversão 3x maior'
      },
      avatar: '/avatars/hercules.jpg',
      verified: true,
    },
    {
      id: '4',
      name: 'Marina Costa',
      role: 'Corretora',
      company: 'Costa Imóveis Premium',
      testimonial: 'A diferença é notável! Meus clientes me encontram mais facilmente pelo site, os leads chegam pré-qualificados e consigo acompanhar tudo pelo app. Minha produtividade triplicou.',
      rating: 5,
      results: {
        metric: 'produtividade',
        value: '+200%',
        improvement: 'mais tempo para vendas'
      },
      avatar: '/avatars/marina.jpg',
      verified: true,
    },
    {
      id: '5',
      name: 'Roberto Mendes',
      role: 'Sócio-Diretor',
      company: 'Mendes & Associados',
      testimonial: 'Implementamos o iMoobile em nossa imobiliária e os resultados foram imediatos. Reduzimos custos operacionais em 30% e aumentamos o faturamento em 60%. ROI fantástico!',
      rating: 5,
      results: {
        metric: 'ROI',
        value: '+60%',
        improvement: 'payback em 2 meses'
      },
      avatar: '/avatars/roberto.jpg',
      verified: true,
    },
    {
      id: '6',
      name: 'Ana Paula Santos',
      role: 'Corretora Especialista',
      company: 'Santos Luxury Homes',
      testimonial: 'Especializada em imóveis de alto padrão, preciso de uma apresentação impecável. O iMoobile me deu isso e muito mais. Meus clientes ficam impressionados com a qualidade da plataforma.',
      rating: 5,
      results: {
        metric: 'ticket médio',
        value: '+35%',
        improvement: 'clientes mais qualificados'
      },
      avatar: '/avatars/ana.jpg',
      verified: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section id="depoimentos" className="py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#9747FF]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      
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
            <Users className="h-4 w-4 mr-2" />
            Depoimentos Reais
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#362D3E] mb-6">
            Histórias de
            <span className="text-[#9747FF]"> sucesso comprovado</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Mais de 1.500 profissionais já transformaram seus negócios. 
            Veja os resultados reais que nossos clientes estão alcançando.
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-8 mb-16"
        >
          <div className="flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="font-semibold text-gray-700">4.9/5</span>
            <span className="text-gray-500">(324 avaliações)</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md">
            <Award className="h-5 w-5 text-[#9747FF]" />
            <span className="font-semibold text-gray-700">100% Verificados</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="font-semibold text-gray-700">+40% Vendas Médias</span>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          onMouseLeave={() => setActiveTestimonial(null)}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              onMouseEnter={() => setActiveTestimonial(testimonial.id)}
            >
              <TestimonialCard
                testimonial={testimonial}
                index={index}
                isActive={activeTestimonial === testimonial.id}
              />
            </div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#9747FF]">1.500+</div>
              <div className="text-sm text-gray-600">Clientes Ativos</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">40%</div>
              <div className="text-sm text-gray-600">Aumento Médio</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4.9/5</div>
              <div className="text-sm text-gray-600">Satisfação</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}