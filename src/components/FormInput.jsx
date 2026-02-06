import React, { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Ícones SVG para estados de validação
const ValidationIcons = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
};

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
  className = '',
  icon: IconComponent,
  hint,
  showValidationIcon = true,
  validateOnBlur = true
}) => {
  const { t } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);
  const [localTouched, setLocalTouched] = useState(false);
  
  const hasError = error && (touched || localTouched);
  const isSuccess = !error && (touched || localTouched) && value && value.toString().length > 0;

  const handleBlur = useCallback((e) => {
    setIsFocused(false);
    setLocalTouched(true);
    if (onBlur) onBlur(e);
  }, [onBlur]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const getStatusColor = () => {
    if (hasError) return '#ef4444';
    if (isSuccess) return '#16a34a';
    if (isFocused) return '#0284c7';
    return 'var(--glass-border)';
  };

  const getStatusClass = () => {
    if (hasError) return 'form-input-error';
    if (isSuccess) return 'form-input-success';
    if (isFocused) return 'form-input-focused';
    return '';
  };

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      
      <div className="form-input-wrapper">
        {IconComponent && (
          <div className={`form-input-icon ${hasError ? 'error' : ''} ${isSuccess ? 'success' : ''}`}>
            {IconComponent}
          </div>
        )}
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`form-input ${getStatusClass()} ${IconComponent ? 'with-icon' : ''} ${showValidationIcon ? 'with-validation' : ''}`}
          style={{
            borderColor: getStatusColor(),
            paddingRight: showValidationIcon ? '2.75rem' : (IconComponent ? '2.75rem' : '1rem')
          }}
        />
        
        {showValidationIcon && (hasError || isSuccess) && (
          <div className={`form-validation-icon ${hasError ? 'error' : 'success'}`}>
            {hasError ? ValidationIcons.error : ValidationIcons.success}
          </div>
        )}
      </div>
      
      {hasError ? (
        <div className="form-error-message">
          <span className="form-error-icon">{ValidationIcons.error}</span>
          {error}
        </div>
      ) : hint ? (
        <div className="form-hint">
          <span className="form-hint-icon">{ValidationIcons.info}</span>
          {hint}
        </div>
      ) : null}
    </div>
  );
};

export default FormInput;
