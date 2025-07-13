'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube,
  ArrowRight,
  Shield,
  Award,
  Clock,
  Users
} from 'lucide-react';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <a 
      href={href} 
      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
    >
      {children}
    </a>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#9747FF] transition-all duration-300 group"
      aria-label={label}
    >
      {icon}
    </a>
  );
}

interface NewsletterFormProps {
  onSubmit: (email: string) => void;
}

function NewsletterForm({ onSubmit }: NewsletterFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    if (email) {
      onSubmit(email);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        name="email"
        placeholder="Seu melhor e-mail"
        required
        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent transition-all duration-300"
      />
      <button
        type="submit"
        className="bg-[#9747FF] text-white px-6 py-3 rounded-xl hover:bg-[#9747FF]/90 transition-all duration-300 font-semibold flex items-center justify-center whitespace-nowrap"
      >
        Inscrever-se
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </form>
  );
}

export function ModernFooter() {
  const handleNewsletterSubmit = (email: string) => {
    // Implementar integração com newsletter
    console.log('Newsletter signup:', email);
    // Aqui você pode integrar com seu serviço de email marketing
  };

  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h3 variants={itemVariants} className="text-2xl md:text-3xl font-bold mb-4">
              Fique por dentro das novidades
            </motion.h3>
            <motion.p variants={itemVariants} className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Receba dicas exclusivas, atualizações do produto e insights do mercado imobiliário diretamente no seu e-mail.
            </motion.p>
            <motion.div variants={itemVariants} className="max-w-md mx-auto">
              <NewsletterForm onSubmit={handleNewsletterSubmit} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Image
              src="/logo-extendida-roxo.svg"
              alt="iMoobile logo"
              width={155}
              height={27}
              className="h-8 w-auto mb-6"
            />
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              A plataforma completa para corretores de imóveis que querem vender mais e melhor. 
              Tecnologia, leads qualificados e suporte especializado.
            </p>
            
            {/* Trust Indicators */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Dados protegidos com SSL</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Award className="h-4 w-4 text-yellow-500" />
                <span>Certificado ISO 27001</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Users className="h-4 w-4 text-[#9747FF]" />
                <span>+1.500 corretores ativos</span>
              </div>
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-6">Produto</h4>
            <div className="space-y-3">
              <FooterLink href="#recursos">Recursos</FooterLink>
              <FooterLink href="#dashboard">Dashboard</FooterLink>
              <FooterLink href="#integracao">Integrações</FooterLink>
              <FooterLink href="#mobile">App Mobile</FooterLink>
              <FooterLink href="#api">API</FooterLink>
              <FooterLink href="#seguranca">Segurança</FooterLink>
            </div>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-6">Suporte</h4>
            <div className="space-y-3">
              <FooterLink href="/help">Central de Ajuda</FooterLink>
              <FooterLink href="/docs">Documentação</FooterLink>
              <FooterLink href="/tutorials">Tutoriais</FooterLink>
              <FooterLink href="/webinars">Webinars</FooterLink>
              <FooterLink href="/status">Status do Sistema</FooterLink>
              <FooterLink href="/contact">Fale Conosco</FooterLink>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-6">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-[#9747FF] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">E-mail</p>
                  <a href="mailto:acutistechnology@gmail.com" className="text-white hover:text-[#9747FF] transition-colors">
                    acutistechnology@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-[#9747FF] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Telefone</p>
                  <a href="tel:+5583999378382" className="text-white hover:text-[#9747FF] transition-colors">
                    +55 (83) 99937-8382
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-[#9747FF] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Horário</p>
                  <p className="text-white">Seg-Sex: 9h às 18h</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h5 className="font-medium mb-4">Siga-nos</h5>
              <div className="flex space-x-3">
                <SocialLink 
                  href="https://instagram.com/imoobile.com.br" 
                  icon={<Instagram className="h-5 w-5" />}
                  label="Instagram"
                />
                <SocialLink 
                  href="https://linkedin.com/company/imoobile" 
                  icon={<Linkedin className="h-5 w-5" />}
                  label="LinkedIn"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
          >
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <p>© {currentYear} iMoobile. Todos os direitos reservados.</p>
              <div className="flex items-center space-x-4">
                <FooterLink href="/privacy">Política de Privacidade</FooterLink>
                <FooterLink href="/terms">Termos de Uso</FooterLink>
                <FooterLink href="/cookies">Cookies</FooterLink>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Feito com</span>
              <span className="text-red-500">♥</span>
              <span>no Brasil</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}