import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';

// Ícones SVG para diferentes tipos de confirmação
const icons = {
  danger: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger', // danger, warning, info, logout
  confirmLabel,
  cancelLabel,
  isLoading = false
}) => {
  const { t } = useLanguage();

  // Handle escape key
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const iconColors = {
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    logout: '#6b7280'
  };

  const confirmButtonColors = {
    danger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    logout: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
  };

  const dialogContent = (
    <div 
      className="confirm-dialog-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="confirm-dialog-container">
        <div className="confirm-dialog">
          {/* Ícone animado */}
          <div 
            className="confirm-dialog-icon"
            style={{ color: iconColors[type] }}
          >
            {icons[type]}
          </div>

          {/* Título */}
          <h3 className="confirm-dialog-title">
            {title || t(`confirmDialog.${type}.title`)}
          </h3>

          {/* Mensagem */}
          <p className="confirm-dialog-message">
            {message || t(`confirmDialog.${type}.message`)}
          </p>

          {/* Botões */}
          <div className="confirm-dialog-actions">
            <button
              onClick={onClose}
              className="confirm-dialog-btn cancel"
              disabled={isLoading}
            >
              {cancelLabel || t('common.cancel')}
            </button>
            <button
              onClick={onConfirm}
              className={`confirm-dialog-btn confirm ${type}`}
              disabled={isLoading}
              style={{
                background: confirmButtonColors[type]
              }}
            >
              {isLoading ? (
                <span className="confirm-dialog-loading">
                  <span className="spinner-small" />
                  {t('common.processing')}
                </span>
              ) : (
                confirmLabel || t(`confirmDialog.${type}.confirm`)
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
};

// Hook personalizado para gerenciar o estado do dialog
export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = React.useState({
    isOpen: false,
    config: {}
  });

  const openDialog = (config) => {
    setDialogState({ isOpen: true, config });
  };

  const closeDialog = () => {
    setDialogState({ isOpen: false, config: {} });
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={closeDialog}
      {...dialogState.config}
    />
  );

  return { openDialog, closeDialog, ConfirmDialogComponent };
};

export default ConfirmDialog;
