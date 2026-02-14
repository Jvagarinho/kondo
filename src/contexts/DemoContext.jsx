import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabase';
import {
  generateMockCondominium,
  generateMockNotices,
  generateMockPayments,
  generateMockDocuments,
  generateMockUsers,
  generateMockStats,
  getCurrentDemoUser
} from '../lib/demoData';

const DemoContext = createContext();

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

export function DemoProvider({ children, language = 'pt' }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [demoData, setDemoData] = useState({
    condominium: null,
    notices: [],
    payments: [],
    documents: [],
    users: [],
    stats: null
  });
  const [isLoading, setIsLoading] = useState(false);

  // Inicializa os dados do demo com o idioma atual
  const initializeDemoData = useCallback((lang = currentLanguage) => {
    setDemoData({
      condominium: generateMockCondominium(lang),
      notices: generateMockNotices(lang),
      payments: generateMockPayments(lang),
      documents: generateMockDocuments(lang),
      users: generateMockUsers(lang),
      stats: generateMockStats(lang)
    });
  }, [currentLanguage]);

  // Atualiza o idioma e regenera os dados se estiver em modo demo
  const updateLanguage = useCallback((newLanguage) => {
    setCurrentLanguage(newLanguage);
    if (isDemoMode) {
      // Regenera os dados com o novo idioma
      setDemoData({
        condominium: generateMockCondominium(newLanguage),
        notices: generateMockNotices(newLanguage),
        payments: generateMockPayments(newLanguage),
        documents: generateMockDocuments(newLanguage),
        users: generateMockUsers(newLanguage),
        stats: generateMockStats(newLanguage)
      });
    }
  }, [isDemoMode]);

  // Ativa o modo demo
  const enableDemoMode = useCallback(() => {
    setIsLoading(true);
    // Simula um pequeno delay para parecer realista
    setTimeout(() => {
      initializeDemoData(currentLanguage);
      setIsDemoMode(true);
      setIsLoading(false);
      console.log('🎭 Modo Demo ativado - Kondo (' + currentLanguage + ')');
    }, 500);
  }, [initializeDemoData, currentLanguage]);

  // Desativa o modo demo
  const disableDemoMode = useCallback(() => {
    setIsDemoMode(false);
    setDemoData({
      condominium: null,
      notices: [],
      payments: [],
      documents: [],
      users: [],
      stats: null
    });
    console.log('🎭 Modo Demo desativado - Kondo');
  }, []);

  // Toggle do modo demo
  const toggleDemoMode = useCallback(() => {
    if (isDemoMode) {
      disableDemoMode();
    } else {
      enableDemoMode();
    }
  }, [isDemoMode, enableDemoMode, disableDemoMode]);

  // Simula chamadas do Supabase para Notices
  const demoNoticesQuery = useCallback(() => ({
    select: () => ({
      order: (column, { ascending }) => ({
        eq: () => ({
          data: [...demoData.notices].sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return ascending ? dateA - dateB : dateB - dateA;
          }),
          error: null
        })
      })
    }),
    insert: (data) => ({
      select: () => ({
        single: () => {
          const newNotice = {
            id: `demo-notice-${Date.now()}`,
            ...data,
            created_at: new Date().toISOString(),
            author_name: currentLanguage === 'en' ? 'Administrator' : 'Administrador'
          };
          setDemoData(prev => ({
            ...prev,
            notices: [newNotice, ...prev.notices]
          }));
          return { data: newNotice, error: null };
        }
      })
    }),
    delete: () => ({
      eq: (column, value) => {
        setDemoData(prev => ({
          ...prev,
          notices: prev.notices.filter(n => n.id !== value)
        }));
        return { error: null };
      }
    })
  }), [demoData.notices, currentLanguage]);

  // Simula chamadas do Supabase para Payments
  const demoPaymentsQuery = useCallback(() => ({
    select: () => ({
      order: () => ({
        eq: () => ({
          data: demoData.payments,
          error: null
        })
      })
    }),
    insert: (data) => ({
      select: () => ({
        single: () => {
          const newPayment = {
            id: `demo-payment-${Date.now()}`,
            ...data,
            created_at: new Date().toISOString()
          };
          setDemoData(prev => ({
            ...prev,
            payments: [newPayment, ...prev.payments]
          }));
          return { data: newPayment, error: null };
        }
      })
    }),
    update: (data) => ({
      eq: (column, value) => {
        setDemoData(prev => ({
          ...prev,
          payments: prev.payments.map(p => 
            p.id === value ? { ...p, ...data } : p
          )
        }));
        return { error: null };
      }
    }),
    delete: () => ({
      eq: (column, value) => {
        setDemoData(prev => ({
          ...prev,
          payments: prev.payments.filter(p => p.id !== value)
        }));
        return { error: null };
      }
    })
  }), [demoData.payments]);

  // Simula chamadas do Supabase para Documents
  const demoDocumentsQuery = useCallback(() => ({
    select: () => ({
      order: () => ({
        eq: () => ({
          data: demoData.documents,
          error: null
        })
      })
    }),
    insert: (data) => ({
      select: () => ({
        single: () => {
          const newDoc = {
            id: `demo-doc-${Date.now()}`,
            ...data,
            created_at: new Date().toISOString(),
            uploader_name: currentLanguage === 'en' ? 'Administrator' : 'Administrador'
          };
          setDemoData(prev => ({
            ...prev,
            documents: [newDoc, ...prev.documents]
          }));
          return { data: newDoc, error: null };
        }
      })
    }),
    delete: () => ({
      eq: (column, value) => {
        setDemoData(prev => ({
          ...prev,
          documents: prev.documents.filter(d => d.id !== value)
        }));
        return { error: null };
      }
    })
  }), [demoData.documents, currentLanguage]);

  // Simula chamadas do Supabase para Users
  const demoUsersQuery = useCallback(() => ({
    select: () => ({
      order: () => ({
        eq: () => ({
          data: demoData.users,
          error: null
        })
      })
    })
  }), [demoData.users]);

  // Simula chamadas do Supabase para Condominium
  const demoCondominiumQuery = useCallback(() => ({
    select: () => ({
      eq: () => ({
        single: () => ({
          data: demoData.condominium,
          error: null
        })
      })
    })
  }), [demoData.condominium]);

  // Mock do auth para modo demo
  const demoAuth = useCallback((isAdmin = true) => ({
    getSession: () => Promise.resolve({
      data: {
        session: {
          user: getCurrentDemoUser(isAdmin, currentLanguage)
        }
      },
      error: null
    }),
    getUser: () => Promise.resolve({
      data: {
        user: getCurrentDemoUser(isAdmin, currentLanguage)
      },
      error: null
    })
  }), [currentLanguage]);

  // Wrapper para supabase.from() no modo demo
  const getDemoSupabase = useCallback((table) => {
    switch (table) {
      case 'kondo_notices':
        return demoNoticesQuery();
      case 'kondo_payments':
        return demoPaymentsQuery();
      case 'kondo_documents':
        return demoDocumentsQuery();
      case 'kondo_users':
        return demoUsersQuery();
      case 'kondo_condominiums':
        return demoCondominiumQuery();
      default:
        return supabase.from(table);
    }
  }, [demoNoticesQuery, demoPaymentsQuery, demoDocumentsQuery, demoUsersQuery, demoCondominiumQuery]);

  const value = {
    isDemoMode,
    isLoading,
    toggleDemoMode,
    enableDemoMode,
    disableDemoMode,
    updateLanguage,
    demoData,
    getDemoSupabase,
    demoAuth,
    currentLanguage,
    // Helpers específicos
    notices: demoData.notices,
    payments: demoData.payments,
    documents: demoData.documents,
    users: demoData.users,
    condominium: demoData.condominium,
    stats: demoData.stats
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}

export default DemoContext;
