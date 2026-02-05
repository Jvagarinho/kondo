import { useState } from 'react';

interface ElegantSearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  value?: string;
}

const ElegantSearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  value = ''
}: ElegantSearchBarProps) => {
  const [query, setQuery] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onSearch(newValue);
  };

  return (
    <div className="elegant-search-container">
      <div className="elegant-search-group">
        <svg 
          viewBox="0 0 24 24" 
          aria-hidden="true" 
          className="elegant-search-icon"
        >
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
          </g>
        </svg>
        <input 
          className="elegant-input" 
          type="search" 
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
        />
      </div>

      <style>{`
        .elegant-search-container {
          display: flex;
          align-items: center;
        }

        .elegant-search-group {
          display: flex;
          line-height: 28px;
          align-items: center;
          position: relative;
          max-width: 320px;
          width: 320px;
        }

        .elegant-input {
          font-family: inherit;
          width: 100%;
          height: 42px;
          padding-left: 2.5rem;
          padding-right: 1.5rem;
          box-shadow: 0 0 0 1.5px #e2e8f0, 0 4px 20px -10px rgba(0, 0, 0, 0.15);
          border: 0;
          border-radius: 12px;
          background-color: #ffffff;
          outline: none;
          color: #334155;
          font-size: 0.95rem;
          transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
          cursor: text;
          z-index: 0;
        }

        .elegant-input::placeholder {
          color: #94a3b8;
        }

        .elegant-input:hover {
          box-shadow: 0 0 0 2px #cbd5e1, 0 6px 25px -12px rgba(0, 0, 0, 0.2);
        }

        .elegant-input:focus {
          box-shadow: 0 0 0 2.5px #0284c7, 0 8px 30px -15px rgba(2, 132, 199, 0.3);
        }

        .elegant-search-icon {
          position: absolute;
          left: 1rem;
          fill: #64748b;
          width: 1.1rem;
          height: 1.1rem;
          pointer-events: none;
          z-index: 1;
          transition: fill 0.25s ease;
        }

        .elegant-search-group:focus-within .elegant-search-icon {
          fill: #0284c7;
        }
      `}</style>
    </div>
  );
};

export default ElegantSearchBar;
