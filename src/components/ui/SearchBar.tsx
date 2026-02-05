import { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  value?: string;
  className?: string;
}

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  value = '',
  className = '' 
}: SearchBarProps) => {
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
    <motion.div 
      className={`relative ${className}`}
      animate={{ 
        scale: isFocused ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        {/* Search Icon */}
        <motion.div 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          animate={{ 
            scale: isFocused ? 1.1 : 1,
            color: isFocused ? '#0284c7' : '#94a3b8'
          }}
          transition={{ duration: 0.2 }}
        >
          <svg 
            width="20" 
            height="20" 
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
        </motion.div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0284c7] focus:ring-4 focus:ring-[#0284c7]/20 transition-all duration-300"
        />

        {/* Clear Button */}
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </motion.button>
        )}

        {/* Focus Glow Effect - Simplified */}
        {isFocused && (
          <motion.div
            layoutId="search-glow"
            className="absolute inset-0 rounded-xl bg-[#0284c7]/10 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ boxShadow: '0 0 20px rgba(2, 132, 199, 0.15)' }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;
