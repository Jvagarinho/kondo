import React from 'react';
import { ButtonProps } from '../../types/common.types';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  style
}) => {
  const baseStyles = 'font-semibold cursor-pointer transition-all duration-300 border-none outline-none';

  const variantStyles = {
    primary: 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0',
    secondary: 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 hover:-translate-y-0.5',
    danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:-translate-y-0.5',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-6 py-2.5 rounded-xl text-base',
    lg: 'px-8 py-3 rounded-xl text-lg'
  };

  const disabledStyles = disabled || loading
    ? 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:brightness-100 hover:shadow-lg'
    : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant as keyof typeof variantStyles]} ${sizeStyles[size as keyof typeof sizeStyles]} ${disabledStyles} ${className}`}
      style={style}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
