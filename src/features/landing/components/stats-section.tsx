'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { TrendingUp, Users, Building, Award } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  color: string;
}

function AnimatedCounter({ value, duration = 2000, suffix = '', prefix = '' }: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(value * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('pt-BR')}{suffix}
    </span>
  );
}

export function StatsSection() {
  const stats: StatItem[] = [
    {
      icon: <Users className="h-8 w-8" />,
      value: 1500,
      label: 'Corretores Ativos',
      suffix: '+',
      color: 'text-blue-600',
    },
    {
      icon: <Building className="h-8 w-8" />,
      value: 25000,
      label: 'Imóveis Cadastrados',
      suffix: '+',
      color: 'text-green-600',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      value: 40,
      label: 'Aumento em Vendas',
      suffix: '%',
      color: 'text-[#9747FF]',
    },
    {
      icon: <Award className="h-8 w-8" />,
      value: 98,
      label: 'Satisfação dos Clientes',
      suffix: '%',
      color: 'text-orange-600',
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
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-[#9747FF]/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#362D3E] mb-4">
            Números que Comprovam Nosso Sucesso
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Milhares de profissionais já transformaram seus negócios com nossa plataforma
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: 'easeOut',
                  },
                },
              }}
              className="group relative"
            >
              {/* Card */}
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>

                {/* Number */}
                <div className="mb-3">
                  <span className="text-4xl md:text-5xl font-bold text-[#362D3E] block">
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix} 
                      prefix={stat.prefix}
                    />
                  </span>
                </div>

                {/* Label */}
                <p className="text-gray-600 font-medium text-lg leading-tight">
                  {stat.label}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#9747FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Background Decoration */}
              <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${stat.color.replace('text-', 'from-')} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>
            </motion.div>
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
          <div className="inline-flex items-center bg-[#9747FF]/10 text-[#9747FF] px-6 py-3 rounded-full font-medium">
            <TrendingUp className="h-5 w-5 mr-2" />
            Junte-se aos profissionais que estão crescendo 40% mais rápido
          </div>
        </motion.div>
      </div>
    </section>
  );
}