"use client";

import { NewsCard } from "@/features/landing/components/news-card";
import { PropertyCard } from "@/features/landing/components/property-card";
import { SearchForm } from "@/features/landing/components/search-section";
import { useBrokerProperties } from "@/features/landing/services/broker-service";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

export default function Home({ params }: { params: Promise<{ corretor: string }> }) {
  const router = useRouter();
  const { corretor } = use(params);
  const { data: properties, isLoading, error } = useBrokerProperties(corretor);
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [propertyFilter, setPropertyFilter] = useState<'all' | 'sale' | 'rent'>('all');

  // Função para abrir o WhatsApp com a mensagem
  const openWhatsApp = () => {
    if (!properties) return;
    
    const phoneNumber = properties.data.user.phone.replace(/\D/g, '');
    const message = "Olá, gostaria de mais informações sobre os imóveis";
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Função para lidar com a mudança de filtro do SearchForm
  const handleSearchFilterChange = (filter: 'sale' | 'rent') => {
    setPropertyFilter(filter);
    setShowAllProperties(false); // Reset para mostrar apenas 3 imóveis quando mudar o filtro
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  if (error || !properties) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Não foi possível carregar os imóveis.</p>
      </div>
    );
  }

  // Filtrar os imóveis com base no filtro selecionado
  const filteredProperties = properties.data.all.filter(property => {
    if (propertyFilter === 'all') return true;
    if (propertyFilter === 'sale') return property.sale;
    if (propertyFilter === 'rent') return property.rent;
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-primary rounded-xl m-4 md:m-8 p-6 md:px-20 md:py-9">
        {/* Botões de ação */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-4 md:space-y-0">
          <Image
            src="/logo-extendida-roxo.svg"
            width={142}
            alt="logo pequena"
            height={42}
          />
          <div className="flex space-x-2 md:space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="rounded-full border border-white px-4 py-2 md:p-4 h-10 md:h-11 flex items-center justify-center text-white text-sm md:text-base hover:bg-white hover:text-black"
            >
              Área do Corretor
            </button>
            <button 
              onClick={openWhatsApp}
              className="rounded-full bg-white px-4 py-2 md:p-4 h-10 md:h-11 flex items-center justify-center text-black text-sm md:text-base"
            >
              Falar com o Corretor
            </button>
          </div>
        </div>

        {/* Título */}
        <p className="font-medium text-3xl md:text-5xl text-white mt-6 md:mt-8 leading-snug text-center md:text-left">
          Encontre o<br />
          imóvel perfeito
          <br />
          para você.
        </p>

        {/* Localizar imóvel */}
        <SearchForm onFilterChange={handleSearchFilterChange} />
      </div>

      {/* Todos os imóveis */}
      {filteredProperties.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-medium mb-2">
              {propertyFilter === 'all' && 'Meus imóveis disponíveis'}
              {propertyFilter === 'sale' && 'Imóveis à venda'}
              {propertyFilter === 'rent' && 'Imóveis para alugar'}
            </h2>
            <p className="text-[#777777] mb-6">
              {propertyFilter === 'all' && 'Confira os meus imóveis'}
              {propertyFilter === 'sale' && 'Confira os imóveis disponíveis para compra'}
              {propertyFilter === 'rent' && 'Confira os imóveis disponíveis para locação'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProperties
                .slice(0, showAllProperties ? filteredProperties.length : 3)
                .map((property, i) => (
                  <PropertyCard
                    key={i}
                    title={property.title}
                    location={`${property.neighborhood}, João Pessoa`}
                    price={property.sale ? property.value.split(',')[0] : property.value}
                    type={property.sale ? "sale" : "rent"}
                    details={{
                      area: `${property.size}m²`,
                      bedrooms: `${property.bedrooms} quartos`,
                      hasElevator: property.characteristics.some(c => c.text.toLowerCase().includes('elevador')),
                    }}
                    imageUrl={property.images[0]?.url || "https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg"}
                    slug={property.slug}
                    propertyData={property}
                    userData={properties.data.user}
                  />
                ))}
            </div>
            {!showAllProperties && filteredProperties.length > 3 && (
              <div className="text-center mt-8">
                <button 
                  onClick={() => setShowAllProperties(true)}
                  className="rounded-full bg-primary text-white px-6 py-3 hover:bg-primary/90 transition-colors"
                >
                  Ver mais imóveis
                </button>
              </div>
            )}
            {showAllProperties && filteredProperties.length > 3 && (
              <div className="text-center mt-8">
                <button 
                  onClick={() => setShowAllProperties(false)}
                  className="rounded-full bg-gray-200 text-gray-700 px-6 py-3 hover:bg-gray-300 transition-colors"
                >
                  Ver menos imóveis
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lançamentos */}
      {properties.data.releases.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-medium mb-2">Lançamentos para você</h2>
            <p className="text-[#777777] mb-6">
              Confira os meus imóveis em destaque
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.data.releases.slice(0, 3).map((property, i) => (
                <PropertyCard
                  key={i}
                  title={property.title}
                  location={`${property.neighborhood}, João Pessoa`}
                  price={property.sale ? property.value.split(',')[0] : property.value}
                  type={property.sale ? "sale" : "rent"}
                  details={{
                    area: `${property.size}m²`,
                    bedrooms: `${property.bedrooms} quartos`,
                    hasElevator: property.characteristics.some(c => c.text.toLowerCase().includes('elevador')),
                  }}
                  imageUrl={property.images[0]?.url || "https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg"}
                  slug={property.slug}
                  propertyData={property}
                  userData={properties.data.user}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-medium mb-2">
            Confira as notícias do setor imobiliário
          </h2>
          <p className="text-[#777777] mb-6">
            Acompanhe o nosso blog e fique por dentro das novidades
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <NewsCard
                key={i}
                title="Arte e Cultura: João Pessoa oferece cursos gratuitos de música, dança, arte e circo."
                author="iMoobile"
                imageUrl="https://uploads.polemicaparaiba.com.br/2021/09/WhatsApp-Image-2021-09-09-at-09.28.51.jpeg"
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="rounded-full bg-primary text-white px-6 py-3 hover:bg-primary/90 transition-colors">Ver mais notícias</button>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-[#777777]">
        <div className="flex flex-row items-center gap-2 justify-center">
          <p>Esse site foi feito na</p>
          <Image
            src="/logo-extendida.svg"
            width={81}
            height={12}
            alt="logo pequena"
          />
        </div>
        <p className="mb-4">
          Copyright © iMoobile. Todos os direitos reservados
        </p>
        <div className="flex justify-center gap-4">
          <a href="#" className="hover:text-[#9747FF]">
            Política de privacidade
          </a>
          <a href="#" className="hover:text-[#9747FF]">
            Termos de uso
          </a>
        </div>
      </footer>
    </div>
  );
}