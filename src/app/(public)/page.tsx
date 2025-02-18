"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen md:min-h-screen bg-purple-50">
      <nav className="container mx-auto p-7 grid grid-cols-12 items-center md:px-12 lg:px-32">
        <div className="col-span-6 md:col-span-2 flex items-center">
          <Image
            src="/images/landing/logo-header.png"
            alt="Supbrokers logo"
            width={155}
            height={27}
          />
        </div>
        <div className="hidden md:flex col-span-6 md:col-span-8 justify-center space-x-4">
          {/* Links ocultos no mobile */}
        </div>
        <div className="hidden md:flex col-span-6 md:col-span-2 justify-end space-x-4">
          <button
            onClick={() => router.push("/login")}
            className="bg-white w-[68px] h-[35px] rounded-[3px] text-[#362D3E] px-[10px] text-[16px] shadow-xl"
          >
            Entrar
          </button>
          <a
            href={"#"}
            className="flex items-center justify-center bg-[#9747FF] min-w-[193px] h-[35px] rounded-[3px] text-white px-[10px] hover:bg-purple-700 text-[16px]"
          >
            Falar com nossa equipe
          </a>
        </div>
        <button className="md:hidden col-span-2 text-gray-600">
          {/* Ícone do menu para mobile */}
        </button>
      </nav>

      <main className="container flex flex-col-reverse text-center mx-auto mb-12 md:py-7 md:p-12 md:text-left md:grid md:grid-cols-12 gap-4 px-7 md:px-12 lg:px-32">
        <div className="md:flex md:flex-col justify-center col-span-12 md:col-span-6">
          <h1 className="text-4xl md:text-7xl md:leading-tight lg:leading-tight font-medium text-[#362D3E] mb-6 md:mb-[48px]">
            automatize,
            <br />
            simplifique e<br />
            <span className="font-semibold">venda mais</span>
          </h1>
          <p className="text-lg mx-auto md:mx-0 md:text-xl text-[#81769A] mb-9 md:mb-12">
            <span className="font-semibold">Supbrokers</span> é uma plataforma
            onde
            <br /> corretores e imobiliárias tradicionais
            <br /> se tornam digitais.
          </p>
          <div className="flex space-y-4 mb-12 justify-center md:justify-start sm:space-y-0 sm:space-x-4">
            <a
              href={"#"}
              className="flex items-center justify-center bg-[#9747FF] w-[270px] h-[35px] rounded-[3px] text-white  hover:bg-purple-700 text-[16px] shadow-lg"
            >
              Entre no nosso grupo no Whatsapp
            </a>
          </div>
        </div>

        <div className="flex justify-center mb-6 md:col-span-6 relative">
          <Image
            src="/images/landing/brand.png"
            alt="Man using phone"
            width={730}
            height={672}
            className="w-auto h-auto"
          />
        </div>
      </main>
    </div>
  );
}
