import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchFormProps {
  onFilterChange?: (filter: 'sale' | 'rent') => void;
  onSearch?: (params: { type: 'sale' | 'rent'; neighborhood?: string; code?: string }) => void;
}

const SearchForm = ({ onFilterChange, onSearch }: SearchFormProps) => {
  const [activeFilter, setActiveFilter] = useState<'sale' | 'rent'>('sale');
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [code, setCode] = useState<string>('');

  const handleFilterChange = (filter: 'sale' | 'rent') => {
    setActiveFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        type: activeFilter,
        neighborhood: neighborhood || undefined,
        code: code || undefined,
      });
    }
  };

  return (
    <div className="bg-white p-2 md:rounded-3xl rounded-3xl mt-8 shadow-md flex flex-col md:flex-row w-full max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <button
          onClick={() => handleFilterChange('sale')}
          className={`${activeFilter === 'sale' ? 'bg-primary text-white' : 'bg-secondary text-text-primary'} p-4 rounded-full h-12 flex justify-center items-center px-7 transition-colors`}
        >
          Comprar
        </button>
        <button
          onClick={() => handleFilterChange('rent')}
          className={`${activeFilter === 'rent' ? 'bg-primary text-white' : 'bg-secondary text-text-primary'} p-4 rounded-full h-12 flex justify-center items-center px-7 font-medium transition-colors`}
        >
          Alugar
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-3 ml-3 flex-grow">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Bairro"
            value={neighborhood}
            onChange={e => setNeighborhood(e.target.value)}
            className="p-3 bg-gray-100 rounded-full w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="relative w-full">
          <input
            type="text"
            placeholder="Código do imóvel"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="p-3 bg-gray-100 rounded-full w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-primary text-white rounded-full min-w-20 h-12 flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export { SearchForm };
