import React, { useEffect } from 'react';
import { useDemo } from '../contexts/DemoContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';

// Componente que sincroniza o idioma entre LanguageContext e DemoContext
export const DemoLanguageSync = () => {
  const { language } = useLanguage();
  const { isDemoMode, updateLanguage } = useDemo();

  useEffect(() => {
    // Quando o idioma muda e estamos em modo demo, atualiza os dados
    if (isDemoMode) {
      updateLanguage(language);
    }
  }, [language, isDemoMode, updateLanguage]);

  return null;
};

export default DemoLanguageSync;
