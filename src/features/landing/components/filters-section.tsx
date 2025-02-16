export function FilterSection() {
  const filters = [
    { label: "Coberturas", active: true },
    { label: "Imóveis com piscina" },
    { label: "Com elevador" },
    { label: "Para alugar" },
    { label: "Para comprar" },
    { label: "Perfeitos para investir" },
    { label: "Minhas escolhas" },
    { label: "70m²" },
    { label: "Permite animais" },
    { label: "3 quartos" },
    { label: "4 quartos" },
    { label: "Casas" },
    { label: "Terrenos" },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-medium mb-2 text-center">
          Selecione o que você deseja
        </h2>
        <p className="text-[#777777] mb-6 text-center">
          Mais opções para você achar o seu imóvel
        </p>
        <div className="flex flex-wrap gap-2 justify-center w-1/2 mx-auto">
          {filters.map((filter) => (
            <button
              key={filter.label}
              className={`px-4 h-12 shadow-md rounded-full text-sm border-[1px] border-border ${
                filter.active
                  ? "bg-[#9747FF] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
