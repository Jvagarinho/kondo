import React from 'react';
import { useDemo } from '../contexts/DemoContext';
import { useLanguage } from '../contexts/LanguageContext';

const DemoModeToggle = () => {
  const { isDemoMode, isLoading, toggleDemoMode } = useDemo();
  const { language } = useLanguage();

  // Traduções para o botão de demo
  const demoLabels = {
    pt: {
      active: 'Modo Demo Ativo',
      exit: 'Sair do Demo',
      activate: 'Ativar Demo',
      loading: 'Carregando...',
      tooltip: 'Clique para ativar dados fictícios para fotos da campanha'
    },
    en: {
      active: 'Demo Mode Active',
      exit: 'Exit Demo',
      activate: 'Activate Demo',
      loading: 'Loading...',
      tooltip: 'Click to activate mock data for campaign photos'
    }
  };

  const labels = demoLabels[language] || demoLabels.en;

  return (
    <div 
      className={`demo-mode-toggle ${isDemoMode ? 'active' : ''}`}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px'
      }}
    >
      {/* Banner indicativo quando demo está ativo */}
      {isDemoMode && (
        <div
          style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px 12px 4px 12px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(238, 90, 111, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <span style={{ fontSize: '18px' }}>📸</span>
          <span>{labels.active}</span>
        </div>
      )}

      {/* Botão principal */}
      <button
        onClick={toggleDemoMode}
        disabled={isLoading}
        style={{
          background: isDemoMode 
            ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '14px 24px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: isLoading ? 'wait' : 'pointer',
          boxShadow: isDemoMode 
            ? '0 4px 15px rgba(238, 90, 111, 0.4)' 
            : '0 4px 15px rgba(102, 126, 234, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'all 0.3s ease',
          opacity: isLoading ? 0.7 : 1,
          transform: isLoading ? 'scale(0.95)' : 'scale(1)'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = isDemoMode 
              ? '0 6px 20px rgba(238, 90, 111, 0.5)' 
              : '0 6px 20px rgba(102, 126, 234, 0.5)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = isDemoMode 
            ? '0 4px 15px rgba(238, 90, 111, 0.4)' 
            : '0 4px 15px rgba(102, 126, 234, 0.4)';
        }}
      >
        {isLoading ? (
          <>
            <span style={{ 
              width: '16px', 
              height: '16px', 
              border: '2px solid rgba(255,255,255,0.3)', 
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span>{labels.loading}</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '18px' }}>
              {isDemoMode ? '🛑' : '🎭'}
            </span>
            <span>
              {isDemoMode ? labels.exit : labels.activate}
            </span>
          </>
        )}
      </button>

      {/* Tooltip informativo */}
      {!isDemoMode && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            maxWidth: '250px',
            textAlign: 'center',
            opacity: 0,
            animation: 'fadeIn 0.5s ease-out 1s forwards'
          }}
        >
          {labels.tooltip}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DemoModeToggle;
