"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Building, Users, Calendar, BarChart } from "lucide-react";

export default function Home() {
  const router = useRouter();

  // Função para abrir o WhatsApp com a mensagem
  const openWhatsApp = () => {
    const phoneNumber = "+5583993293512";
    const message = "Quero conhecer a plataforma";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Recursos principais da plataforma
  const features = [
    {
      icon: <Building className="h-6 w-6 text-[#9747FF]" />,
      title: "Gerenciamento de Imóveis",
      description: "Cadastre e gerencie todos os seus imóveis em uma interface intuitiva e profissional."
    },
    {
      icon: <Users className="h-6 w-6 text-[#9747FF]" />,
      title: "Leads Qualificados",
      description: "Receba e gerencie leads qualificados diretamente na plataforma, aumentando suas chances de conversão."
    },
    {
      icon: <Calendar className="h-6 w-6 text-[#9747FF]" />,
      title: "Gestão de Contratos e Aluguéis",
      description: "Controle contratos, pagamentos e manutenções de forma simples e eficiente."
    },
    {
      icon: <BarChart className="h-6 w-6 text-[#9747FF]" />,
      title: "Site Único com Seus Imóveis",
      description: "Tenha seu próprio site personalizado para mostrar apenas seus imóveis e destacar seu trabalho."
    }
  ];

  // Benefícios da plataforma
  const benefits = [
    "Aumente suas vendas em até 40%",
    "Economize tempo com processos automatizados",
    "Centralize toda sua operação em um só lugar",
    "Destaque-se da concorrência com ferramentas digitais",
    "Acesso via desktop e dispositivos móveis"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/images/landing/logo-header.png"
              alt="Supbrokers logo"
              width={155}
              height={27}
              className="h-8 w-auto"
            />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#recursos" className="text-gray-600 hover:text-[#9747FF] transition-colors">Recursos</a>
            <a href="#dashboard" className="text-gray-600 hover:text-[#9747FF] transition-colors">Dashboard</a>
            <a href="#depoimentos" className="text-gray-600 hover:text-[#9747FF] transition-colors">Depoimentos</a>
            <a href="#contato" className="text-gray-600 hover:text-[#9747FF] transition-colors">Contato</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="bg-white border border-[#9747FF] text-[#9747FF] px-5 py-2 rounded-md hover:bg-[#9747FF]/5 transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="bg-[#9747FF] text-white px-5 py-2 rounded-md hover:bg-[#9747FF]/90 transition-colors"
            >
              Começar Grátis
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#9747FF]/10 to-white py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#362D3E] leading-tight">
              <span className="text-[#9747FF]">Automatize</span>, simplifique e <span className="text-[#9747FF]">venda mais</span>
            </h1>
            <p className="text-xl text-gray-600">
              <span className="font-semibold">Supbrokers</span> é a plataforma completa onde corretores e imobiliárias tradicionais se transformam em negócios digitais de alto desempenho.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => router.push("/signup")}
                className="bg-[#9747FF] text-white px-6 py-3 rounded-md hover:bg-[#9747FF]/90 transition-colors flex items-center justify-center"
              >
                Começar agora <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={openWhatsApp}
                className="bg-white border border-[#9747FF] text-[#9747FF] px-6 py-3 rounded-md hover:bg-[#9747FF]/5 transition-colors"
              >
                Agendar demonstração
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 rounded-lg shadow-xl overflow-hidden">
              <Image
                src="/images/landing/dashboard.png"
                alt="Dashboard Supbrokers"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-[#9747FF]/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-64 h-64 bg-[#9747FF]/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-[#9747FF]">1500+</p>
              <p className="text-gray-600">Corretores ativos</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-[#9747FF]">25.000+</p>
              <p className="text-gray-600">Imóveis cadastrados</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-[#9747FF]">40%</p>
              <p className="text-gray-600">Aumento em vendas</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-[#9747FF]">98%</p>
              <p className="text-gray-600">Satisfação dos clientes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#362D3E] mb-4">Recursos Principais</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tudo o que você precisa para gerenciar seu negócio imobiliário em um só lugar
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#9747FF]/10 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#362D3E] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#362D3E] mb-4">Dashboard Intuitivo</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Interface moderna e fácil de usar, projetada para maximizar sua produtividade
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#362D3E]">Tudo o que você precisa em um só lugar</h3>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push("/signup")}
                  className="bg-[#9747FF] text-white px-6 py-3 rounded-md hover:bg-[#9747FF]/90 transition-colors mt-4 inline-flex items-center"
                >
                  Experimentar agora <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="relative z-10 rounded-lg shadow-xl overflow-hidden">
                <Image
                  src="/images/landing/dashboard-imoveis.png"
                  alt="Dashboard Features"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-[#9747FF]/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#362D3E] mb-4">O que dizem nossos clientes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Histórias de sucesso de corretores e imobiliárias que transformaram seus negócios com o Supbrokers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#9747FF] rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Carlos Silva</h4>
                  <p className="text-sm text-gray-500">Corretor há 8 anos</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                &ldquo;Desde que comecei a usar o Supbrokers, minhas vendas aumentaram em 40%. A plataforma é intuitiva e me ajuda a organizar todo meu trabalho.&rdquo;
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#9747FF] rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Ana Oliveira</h4>
                  <p className="text-sm text-gray-500">Imobiliária Horizonte</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                &ldquo;A gestão de aluguéis ficou muito mais simples. Consigo controlar tudo em um só lugar e meus clientes adoram a experiência.&rdquo;
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#9747FF] rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Roberto Mendes</h4>
                  <p className="text-sm text-gray-500">Corretor autônomo</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                &ldquo;O link personalizado foi um diferencial para meu marketing. Agora tenho uma presença online profissional sem precisar investir em um site próprio.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contato" className="py-16 bg-[#9747FF]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para transformar seu negócio imobiliário?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/80">
            Junte-se a milhares de corretores que já estão aumentando suas vendas com o Supbrokers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/signup")}
              className="bg-white text-[#9747FF] px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              Criar minha conta agora
            </button>
            <button
              onClick={openWhatsApp}
              className="bg-transparent border border-white text-white px-6 py-3 rounded-md hover:bg-white/10 transition-colors"
            >
              Falar com nossa equipe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/images/landing/logo-header.png"
                alt="Supbrokers logo"
                width={155}
                height={27}
                className="h-8 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-gray-400">
                Seu ecossistema imobiliário completo para corretores e imobiliárias.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#recursos" className="text-gray-400 hover:text-white">Recursos</a></li>
                <li><a href="#dashboard" className="text-gray-400 hover:text-white">Dashboard</a></li>
                <li><a href="#depoimentos" className="text-gray-400 hover:text-white">Depoimentos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contato@supbrokers.com.br</li>
                <li>(11) 9999-9999</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Redes Sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Supbrokers. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
