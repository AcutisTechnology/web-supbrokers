'use client';

import { NewsCard } from '@/features/landing/components/news-card';
import { PropertyCard } from '@/features/landing/components/property-card';
import { SearchForm } from '@/features/landing/components/search-section';
import { useBrokerProperties } from '@/features/landing/services/broker-service';
import { BrokerFooter } from '@/features/landing/components/broker-footer';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { use, useRef } from 'react';

export default function Home({ params }: { params: Promise<{ corretor: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { corretor } = use(params);

  const { data: properties, isLoading, error } = useBrokerProperties(corretor);

  // Função para abrir o WhatsApp com a mensagem
  const openWhatsApp = () => {
    if (!properties) return;

    const phoneNumber = properties.data.user.phone.replace(/\D/g, '');
    const message = 'Olá, gostaria de mais informações sobre os imóveis';
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Função para lidar com a mudança de filtro do SearchForm
  const handleSearchFilterChange = (filter: 'sale' | 'rent') => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set('type', filter);
    router.push(`/${corretor}?${queryParams.toString()}`);
  };

  // Função para lidar com a busca
  const handleSearch = (params: {
    type: 'sale' | 'rent';
    neighborhood?: string;
    code?: string;
  }) => {
    // Atualizar URL com os parâmetros
    const queryParams = new URLSearchParams();
    queryParams.set('type', params.type);
    if (params.neighborhood) queryParams.set('neighborhood', params.neighborhood);
    if (params.code) queryParams.set('code', params.code);

    router.push(`/${corretor}?${queryParams.toString()}`);
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

  const SectionCarousel = ({
    title,
    description,
    items,
    viewAllHref,
  }: {
    title: string;
    description?: string;
    items: typeof properties.data.all;
    viewAllHref: string;
  }) => {
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    const scrollByCards = (direction: 'left' | 'right') => {
      const el = scrollerRef.current;
      if (!el) return;
      const amount = Math.max(240, Math.floor(el.clientWidth * 0.9));
      el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-medium">{title}</h2>
              {description ? <p className="text-[#777777] mt-1">{description}</p> : null}
            </div>
            <Link
              href={viewAllHref}
              className="text-sm text-[#9747FF] hover:underline whitespace-nowrap"
            >
              Ver todos
            </Link>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => scrollByCards('left')}
              className="hidden md:flex items-center justify-center absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white border border-gray-200 shadow hover:shadow-md"
              aria-label="Scroll para esquerda"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              ref={scrollerRef}
              className="flex gap-6 overflow-x-auto scroll-smooth pb-2"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {items.map((property, i) => (
                <div key={i} className="min-w-[280px] md:min-w-[320px]">
                  <PropertyCard
                    primary_color={properties.data.user.site?.primary_color ?? undefined}
                    title={property.title}
                    location={`${property.neighborhood}, João Pessoa`}
                    price={property.sale ? property.value.split(',')[0] : property.value}
                    type={property.sale ? 'sale' : 'rent'}
                    details={{
                      area: `${property.size}m²`,
                      bedrooms: `${property.bedrooms} quartos`,
                      hasElevator: property.characteristics.some(c =>
                        c.text.toLowerCase().includes('elevador')
                      ),
                    }}
                    imageUrl={
                      property.attachments[0]?.url ||
                      'https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg'
                    }
                    slug={property.slug}
                    propertyData={property}
                    userData={properties.data.user}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollByCards('right')}
              className="hidden md:flex items-center justify-center absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white border border-gray-200 shadow hover:shadow-md"
              aria-label="Scroll para direita"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="rounded-xl m-4 md:m-8 p-6 md:px-20 md:py-9" style={{ backgroundColor: properties.data.user.site?.primary_color || '#9747FF' }}>
        {/* Botões de ação */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-4 md:space-y-0">
          <Image 
            src={properties.data.user.site?.brand_image || '/logo-extendida-roxo.svg'}
            width={142} 
            alt="logo do corretor" 
            height={42} 
          />
          <div className="flex space-x-2 md:space-x-4">
            <button
              onClick={() => router.push('/login')}
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
          {properties.data.user.site?.site_title || 'Encontre o imóvel perfeito para você.'}
        </p>
        <p className="text-white text-lg md:text-xl mt-2">
          {properties.data.user.site?.site_subtitle || 'Confira os melhores imóveis disponíveis para você.'}
        </p>

        {/* Localizar imóvel */}
        <SearchForm 
          onFilterChange={handleSearchFilterChange} 
          onSearch={handleSearch} 
          primaryColor={properties.data.user.site?.primary_color || '#9747FF'}
        />
      </div>

      {properties.data.highlighted.length > 0 ? (
        <SectionCarousel
          title="Lançamentos / Destaques"
          description="Confira os imóveis em destaque."
          items={properties.data.highlighted}
          viewAllHref={`/${corretor}/imoveis/destaques`}
        />
      ) : null}

      {properties.data.sale.length > 0 ? (
        <SectionCarousel
          title="Imóveis à venda"
          description="Confira os imóveis disponíveis para compra."
          items={properties.data.sale}
          viewAllHref={`/${corretor}/imoveis/venda`}
        />
      ) : null}

      {properties.data.rent.length > 0 ? (
        <SectionCarousel
          title="Imóveis para aluguel"
          description="Confira os imóveis disponíveis para locação."
          items={properties.data.rent}
          viewAllHref={`/${corretor}/imoveis/aluguel`}
        />
      ) : null}

      {/* <section className="py-12">
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
      </section> */}

      <BrokerFooter site={properties.data.user.site} />
    </div>
  );
}
