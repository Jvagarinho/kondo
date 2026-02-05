import { useState } from 'react';

interface ModernSearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  value?: string;
}

const ModernSearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  value = ''
}: ModernSearchBarProps) => {
  const [query, setQuery] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onSearch(newValue);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div 
      className={`relative flex items-center transition-all duration-300 ${
        isFocused ? 'w-64' : 'w-48'
      }`}
    >
      {/* Search Icon */}
      <div className="absolute left-3 text-gray-400 pointer-events-none">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-10 pr-8 py-2 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 transition-all duration-300"
      />

      {/* Clear Button */}
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all"
        >
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

export default ModernSearchBar;
