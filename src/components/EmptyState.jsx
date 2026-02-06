import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Ilustrações SVG amigáveis para cada tipo de empty state
const illustrations = {
  notices: (
    <svg viewBox="0 0 200 200" className="empty-state-illustration">
      <defs>
        <linearGradient id="bellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="bellGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5f3ff" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      {/* Círculo de fundo */}
      <circle cx="100" cy="100" r="70" fill="url(#bellGradient)" opacity="0.3" />
      
      {/* Sino */}
      <g transform="translate(100, 85)">
        <path
          d="M-25-15 C-25-30 -15-40 0-40 C15-40 25-30 25-15 L25 10 C25 15 30 20 35 25 L-35 25 C-30 20 -25 15 -25 10 Z"
          fill="url(#bellGradient)"
          stroke="#0284c7"
          strokeWidth="2"
        />
        {/* Badalo do sino */}
        <circle cx="0" cy="28" r="6" fill="#0284c7" />
        {/* Linhas de som */}
        <line x1="-40" y1="-10" x2="-50" y2="-15" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="-42" y1="0" x2="-52" y2="0" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="40" y1="-10" x2="50" y2="-15" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="42" y1="0" x2="52" y2="0" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </g>
      
      {/* Documentos flutuantes */}
      <rect x="50" y="130" width="30" height="40" rx="4" fill="white" stroke="#0284c7" strokeWidth="1.5" opacity="0.8" transform="rotate(-15 65 150)" />
      <rect x="120" y="130" width="30" height="40" rx="4" fill="white" stroke="#7c3aed" strokeWidth="1.5" opacity="0.8" transform="rotate(15 135 150)" />
    </svg>
  ),
  
  payments: (
    <svg viewBox="0 0 200 200" className="empty-state-illustration">
      <defs>
        <linearGradient id="moneyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0fdf4" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      {/* Círculo de fundo */}
      <circle cx="100" cy="100" r="70" fill="url(#moneyGradient)" opacity="0.3" />
      
      {/* Moeda/Nota central */}
      <g transform="translate(100, 100)">
        <circle cx="0" cy="0" r="35" fill="#16a34a" opacity="0.9" />
        <circle cx="0" cy="0" r="28" fill="none" stroke="white" strokeWidth="2" />
        <text x="0" y="8" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">$</text>
      </g>
      
      {/* Moedas menores */}
      <circle cx="55" cy="70" r="12" fill="#16a34a" opacity="0.6" />
      <text x="55" y="74" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">$</text>
      
      <circle cx="145" cy="130" r="12" fill="#16a34a" opacity="0.6" />
      <text x="145" y="134" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">$</text>
      
      {/* Gráfico simples */}
      <path d="M50 160 L70 145 L90 155 L110 135 L130 145 L150 125" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      
      {/* Seta para cima */}
      <path d="M140 50 L150 35 L160 50" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="150" y1="35" x2="150" y2="65" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  
  documents: (
    <svg viewBox="0 0 200 200" className="empty-state-illustration">
      <defs>
        <linearGradient id="docGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fefce8" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      {/* Círculo de fundo */}
      <circle cx="100" cy="100" r="70" fill="url(#docGradient)" opacity="0.3" />
      
      {/* Documento principal */}
      <g transform="translate(100, 95)">
        {/* Folha de papel */}
        <path
          d="M-25-35 L15-35 L25-25 L25 35 L-25 35 Z"
          fill="white"
          stroke="#ca8a04"
          strokeWidth="2"
        />
        {/* Dobra do papel */}
        <path d="M15-35 L15-25 L25-25" fill="#fefce8" stroke="#ca8a04" strokeWidth="2" />
        {/* Linhas do documento */}
        <line x1="-15" y1="-15" x2="15" y2="-15" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <line x1="-15" y1="5" x2="10" y2="5" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <line x1="-15" y1="15" x2="5" y2="15" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </g>
      
      {/* Documentos flutuantes */}
      <rect x="45" y="130" width="25" height="35" rx="3" fill="white" stroke="#ca8a04" strokeWidth="1.5" opacity="0.6" transform="rotate(-20 57 147)" />
      <rect x="130" y="50" width="25" height="35" rx="3" fill="white" stroke="#ca8a04" strokeWidth="1.5" opacity="0.6" transform="rotate(20 142 67)" />
      
      {/* Ícone de upload/seta */}
      <circle cx="100" cy="160" r="15" fill="#ca8a04" opacity="0.2" />
      <path d="M100 152 L100 168 M95 157 L100 152 L105 157" fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  
  search: (
    <svg viewBox="0 0 200 200" className="empty-state-illustration">
      <defs>
        <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5f3ff" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      {/* Círculo de fundo */}
      <circle cx="100" cy="100" r="70" fill="url(#searchGradient)" opacity="0.3" />
      
      {/* Lupa */}
      <g transform="translate(100, 95)">
        <circle cx="-5" cy="-5" r="25" fill="none" stroke="#7c3aed" strokeWidth="3" />
        <line x1="15" y1="15" x2="32" y2="32" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      </g>
      
      {/* Elementos de busca flutuantes */}
      <text x="50" y="70" fill="#7c3aed" fontSize="20" opacity="0.3">?</text>
      <text x="150" y="130" fill="#7c3aed" fontSize="16" opacity="0.3">?</text>
      <text x="60" y="150" fill="#7c3aed" fontSize="14" opacity="0.3">?</text>
    </svg>
  ),
  
  generic: (
    <svg viewBox="0 0 200 200" className="empty-state-illustration">
      <defs>
        <linearGradient id="genericGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      {/* Círculo de fundo */}
      <circle cx="100" cy="100" r="70" fill="url(#genericGradient)" opacity="0.3" />
      
      {/* Caixa vazia */}
      <g transform="translate(100, 100)">
        <path
          d="M-30-20 L0-35 L30-20 L30 20 L0 35 L-30 20 Z"
          fill="white"
          stroke="#0284c7"
          strokeWidth="2"
        />
        <path d="M-30-20 L0-5 L30-20" fill="none" stroke="#0284c7" strokeWidth="2" />
        <path d="M0-35 L0-5" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.5" />
        
        {/* Ponto de interrogação */}
        <text x="0" y="15" textAnchor="middle" fill="#0284c7" fontSize="20" fontWeight="bold">?</text>
      </g>
    </svg>
  )
};

const EmptyState = ({ 
  type = 'generic', 
  title, 
  message, 
  actionLabel, 
  onAction, 
  compact = false,
  searchMode = false
}) => {
  const { t } = useLanguage();
  
  const illustration = searchMode ? illustrations.search : (illustrations[type] || illustrations.generic);
  
  if (compact) {
    return (
      <div className="empty-state-compact">
        <div className="empty-state-icon-compact">
          {illustration}
        </div>
        <p className="empty-state-text-compact">
          {searchMode ? (message || t('emptyStates.noSearchResults')) : (message || t(`emptyStates.${type}.message`))}
        </p>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-state-illustration-container">
        {illustration}
      </div>
      <h3 className="empty-state-title">
        {searchMode ? (title || t('emptyStates.search.title')) : (title || t(`emptyStates.${type}.title`))}
      </h3>
      <p className="empty-state-message">
        {searchMode ? (message || t('emptyStates.noSearchResults')) : (message || t(`emptyStates.${type}.message`))}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="empty-state-action">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
