import { Search } from 'lucide-react';

const FilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search bar */}
      <div className="relative w-full max-w-md">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Cari menu..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-cream-200 rounded-lg 
                     focus:border-primary-500 focus:outline-none"
        />
      </div>

      {/* Kategori buttons */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary-500 text-white'
                : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
            }`}
          >
            {category === 'all' ? 'Semua' : category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
