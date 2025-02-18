"use client";

import { FilterSection } from "@/features/landing/components/filters-section";
import { NewsCard } from "@/features/landing/components/news-card";
import { PropertyCard } from "@/features/landing/components/property-card";
import { SearchForm } from "@/features/landing/components/search-section";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-primary rounded-xl m-4 md:m-8 p-6 md:px-20 md:py-9">
        {/* Botões de ação */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-4 md:space-y-0">
          <Image
            src="/images/logo-sm.png"
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
            <button className="rounded-full bg-white px-4 py-2 md:p-4 h-10 md:h-11 flex items-center justify-center text-black text-sm md:text-base">
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
        <SearchForm />
      </div>

      <FilterSection />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-medium mb-2">Lançamentos para você</h2>
          <p className="text-[#777777] mb-6">
            Confira os meus imóveis em destaque
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertyCard
                key={i}
                title="Olimpico Residence"
                location="Bessa, João Pessoa"
                price="245"
                type="sale"
                imageUrl="https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-medium mb-2">
            Meus imóveis disponíveis
          </h2>
          <p className="text-[#777777] mb-6">Confira os meus imóveis</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertyCard
                key={i}
                title="Apartamento para alugar"
                location="Bessa, João Pessoa"
                price="2.560"
                type="rent"
                details={{
                  area: "55m²",
                  bedrooms: "2 quartos",
                  hasElevator: true,
                }}
                imageUrl="https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg"
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="rounded-full">Ver mais imóveis</button>
          </div>
        </div>
      </section>

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
                author="Supbrokers"
                imageUrl="https://uploads.polemicaparaiba.com.br/2021/09/WhatsApp-Image-2021-09-09-at-09.28.51.jpeg"
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="rounded-full">Ver mais notícias</button>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-[#777777]">
        <div className="flex flex-row items-center gap-2 justify-center">
          <p>Esse site foi feito na</p>
          <Image
            src="/images/logo-footer.png"
            width={81}
            height={12}
            alt="logo pequena"
          />
        </div>
        <p className="mb-4">
          Copyright © Supbrokers. Todos os direitos reservados
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
