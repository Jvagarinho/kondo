import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full p-1 bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Toggle theme"
    >
      <div
        className={`
          w-6 h-6 rounded-full bg-white dark:bg-gray-900 shadow-md
          transform transition-transform duration-300 ease-in-out
          ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}
        `}
      >
        {theme === 'light' ? (
          <svg
            className="w-4 h-4 text-yellow-500 absolute top-1 left-1 transition-all"
            fill="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Sun"
          >
            <circle cx="12" cy="12" r="5" />
            <path
              d="M12 1v2M12 17v2M12 4.5c-3.9 0-7.5-3.4-7.5-7.5 0-4.1 3.1-7.5 7-5-7.5 7.5zm0 12c0 1.7-1.3 3-3 3-3s1.3-3 3-3-3zm-8 0a1 1 0 011 2v2a1 1 0 01-2 0V6a1 1 0 011-2 0z"
              fillRule="evenodd"
              clipRule="evenodd"
              className="transform transition-opacity duration-300"
              style={{ opacity: '1' }}
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-blue-500 absolute top-1 right-1 transition-all"
            fill="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Moon"
          >
            <path
              d="M21 12.79A9 9 0 1111.21 0 9 9 0 11.21 0 00-4.41 2.86-7-4 41 7h-4.13l2.65-2.66a.5.5 0 01.7.29-.71l2.65 2.66c.19.19.34.28.5.28h.01zm-6.28 3.72c.78-.6 1.28-1.18 2-1.72-.08.08-.16-.18-.22-.29a1 1 0 01-1.6-1.6c-.35 0-.69-.07-.98.2l-2.3 2.3h-4.29c.7.6 1.28 1.02 1.72.08.08.16.18.22.29.5.5.5.5 0 .01-.01.02-.03.03zM12 5.5a6.5 6.5 0 013 6.5 6.5 0 10-13 6.5zm0 12.5c0-2.3-1.3-4.3-3.1-5.9.8.8 1.8-1.8 2.7 2.8 1.8 0 0 1.6-1.3 2.7-2.8 3.1-5.9-8.8zm0 12a6.5 6.5 0 016-6.5 6.5 0 16-6.5zm-3.42 8.42c.78-.59 1.26-1.4 2-2.2-.08-.08-.18-.18-.29-.29l-2.3 2.3h-4.29c-.7.6-1.28 1.02-1.72-.08-.08-.16-.18-.22-.29-.5-.5-.5-.5 0 .01-.01.02-.03.03zM12 10a2 2 0 012 2 0 12 2 0 12-2z"
              fillRule="evenodd"
              clipRule="evenodd"
              className="transform transition-opacity duration-300"
              style={{ opacity: '1' }}
            />
          </svg>
        )}
        <span className="sr-only">
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;
