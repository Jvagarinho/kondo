import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * MobileTable - Componente de tabela responsiva
 * 
 * Em desktop: exibe como tabela normal
 * Em mobile: converte para visualização em cards
 * 
 * Props:
 * - columns: array de { key, label, render? }
 * - data: array de objetos
 * - keyExtractor: função para extrair key única
 * - emptyState: componente ou mensagem para estado vazio
 * - className: classes adicionais
 * - mobileCardClass: classe específica para cards mobile
 */
const MobileTable = ({ 
  columns, 
  data, 
  keyExtractor, 
  emptyState,
  className = '',
  actions,
  isAdmin = false 
}) => {
  const { t } = useLanguage();

  if (!data || data.length === 0) {
    return emptyState || (
      <div className="empty-state-compact">
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
          {t('table.noData')}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop View - Table */}
      <div className={`table-wrapper desktop-only ${className}`}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ 
              borderBottom: '1px solid var(--glass-border)', 
              color: 'var(--text-secondary)', 
              fontSize: '0.85rem' 
            }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '1rem 0.75rem' }}>
                  {col.label}
                </th>
              ))}
              {actions && isAdmin && (
                <th style={{ padding: '1rem 0.75rem' }}>{t('table.actions')}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr 
                key={keyExtractor ? keyExtractor(item) : index}
                style={{ 
                  borderBottom: '1px solid var(--glass-border)', 
                  fontSize: '0.9rem',
                  transition: 'background 0.2s'
                }}
              >
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '1rem 0.75rem' }}>
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
                {actions && isAdmin && (
                  <td style={{ padding: '1rem 0.75rem' }}>
                    {actions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Cards */}
      <div className="mobile-cards mobile-only">
        {data.map((item, index) => (
          <div 
            key={keyExtractor ? keyExtractor(item) : index}
            className="mobile-card-item"
          >
            {columns.map(col => (
              <div key={col.key} className="mobile-card-row">
                <span className="mobile-card-label">{col.label}</span>
                <span className="mobile-card-value">
                  {col.render ? col.render(item) : item[col.key]}
                </span>
              </div>
            ))}
            {actions && isAdmin && (
              <div className="mobile-card-actions">
                {actions(item)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default MobileTable;
