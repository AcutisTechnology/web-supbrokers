const SearchForm = () => {
  return (
    <div className="w-full md:w-1/2 bg-white p-3 md:rounded-full rounded-3xl mt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
      <div className="flex items-center space-x-4">
        <button className="bg-primary p-4 rounded-full h-12 flex justify-center items-center text-white px-7">
          Comprar
        </button>
        <button className="bg-secondary p-4 rounded-full h-12 flex justify-center items-center text-text-primary px-7 font-medium">
          Alugar
        </button>
      </div>

      <div className="flex flex-col justify-center space-y-1">
        <p className="text-black font-medium">Tipo do imóvel</p>
        <select
          className="bg-transparent outline-none text-text-description"
          name=""
          id=""
        >
          <option value="">Escolher tipo</option>
        </select>
      </div>

      <div className="h-10 w-[1px] bg-border hidden md:block" />

      <div className="flex flex-col justify-center space-y-1">
        <p className="text-black font-medium">Localização</p>
        <select
          className="bg-transparent outline-none text-text-description"
          name=""
          id=""
        >
          <option value="">Todas</option>
        </select>
      </div>

      <button className="bg-primary text-white p-4 rounded-full px-7 flex justify-center items-center">
        Buscar
      </button>
    </div>
  );
};

export { SearchForm };
