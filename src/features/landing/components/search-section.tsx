import { useState } from "react";

interface SearchFormProps {
  onFilterChange?: (filter: 'sale' | 'rent') => void;
}

const SearchForm = ({ onFilterChange }: SearchFormProps) => {
  const [activeFilter, setActiveFilter] = useState<'sale' | 'rent'>('sale');

  const handleFilterChange = (filter: 'sale' | 'rent') => {
    setActiveFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <div className="inline-flex bg-white p-2 md:rounded-full rounded-3xl mt-8 shadow-md">
      <div className="flex items-center space-x-4">
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
    </div>
  );
};

export { SearchForm };
