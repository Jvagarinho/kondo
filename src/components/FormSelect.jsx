import React, { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ValidationIcons = {
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

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  options = [],
  className = '',
  hint
}) => {
  const { t } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);
  const [localTouched, setLocalTouched] = useState(false);
  
  const hasError = error && (touched || localTouched);

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
    if (isFocused) return '#0284c7';
    return 'var(--glass-border)';
  };

  const getStatusClass = () => {
    if (hasError) return 'form-input-error';
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
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          className={`form-input form-select ${getStatusClass()}`}
          style={{
            borderColor: getStatusColor()
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="form-select-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
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

export default FormSelect;
