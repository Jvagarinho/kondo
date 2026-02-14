// Dados fictícios multilíngues para o modo Demo do Kondo
// Gerados para campanha promocional

// Traduções para notícias
const noticesTranslations = {
  pt: [
    {
      id: 'demo-notice-001',
      title: 'Manutenção dos Elevadores',
      content: 'Prezados moradores, informamos que haverá manutenção preventiva nos elevadores no próximo sábado, das 8h às 12h. Durante este período, os elevadores estarão fora de operação. Pedimos que programem suas atividades de acordo.',
      urgent: true,
      author_id: 'demo-admin-001',
      author_name: 'Administrador',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'demo-notice-002',
      title: 'Assembleia Geral Extraordinária',
      content: 'Convocamos todos os condôminos para a Assembleia Geral Extraordinária que ocorrerá no dia 25/02/2026, às 19h, no salão de festas. Serão discutidos temas importantes sobre as reformas previstas para o próximo semestre.',
      urgent: false,
      author_id: 'demo-admin-001',
      author_name: 'Administrador',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'demo-notice-003',
      title: 'Mudança no Horário da Piscina',
      content: 'A partir do próximo mês, o horário de funcionamento da piscina será alterado para melhor atender os condôminos. Novo horário: 6h às 22h (segunda a sábado) e 8h às 20h (domingos e feriados).',
      urgent: false,
      author_id: 'demo-admin-001',
      author_name: 'Administrador',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id: 'demo-notice-004',
      title: 'Festa Junina - Reserve a Data!',
      content: 'Já estamos organizando a tradicional Festa Junina do Residencial Aurora! Será no dia 20 de junho, a partir das 18h. Teremos quadrilha, comidas típicas, brincadeiras para as crianças e muita diversão. Mais informações em breve!',
      urgent: false,
      author_id: 'demo-admin-001',
      author_name: 'Administrador',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 10).toISOString()
    }
  ],
  en: [
    {
      id: 'demo-notice-001',
      title: 'Elevator Maintenance',
      content: 'Dear residents, we inform you that there will be preventive maintenance on the elevators next Saturday, from 8am to 12pm. During this period, the elevators will be out of operation. Please plan your activities accordingly.',
      urgent: true,
      author_id: 'demo-admin-001',
      author_name: 'Administrator',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'demo-notice-002',
      title: 'Extraordinary General Assembly',
      content: 'We invite all residents to the Extraordinary General Assembly that will take place on February 25, 2026, at 7pm, in the party room. Important topics about planned renovations for the next semester will be discussed.',
      urgent: false,
      author_id: 'demo-admin-001',
      author_name: 'Administrator',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'demo-notice-003',
      title: 'Pool Hours Change',
      content: 'Starting next month, the pool operating hours will be changed to better serve residents. New hours: 6am to 10pm (Monday to Saturday) and 8am to 8pm (Sundays and holidays).',
      urgent: false,
      author_id: 'demo-admin-001',
      author_name: 'Administrator',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id: 'demo-notice-004',
      title: 'Summer Festival - Save the Date!',
      content: 'We are already organizing the traditional Aurora Residences Summer Festival! It will be on June 20th, starting at 6pm. We will have music, typical foods, games for children and lots of fun. More information coming soon!',
      urgent: false,
      author_id: 'demo-admin-001',
      author_name: 'Administrator',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 10).toISOString()
    }
  ]
};

// Traduções para documentos
const documentsTranslations = {
  pt: [
    {
      id: 'demo-doc-001',
      name: 'Regulamento Interno 2025.pdf',
      description: 'Regulamento interno atualizado do condomínio com todas as normas e regras de convivência.',
      file_path: 'demo/regulamento-interno.pdf',
      file_type: 'application/pdf',
      file_size: 2450000,
      uploaded_by: 'demo-admin-001',
      uploader_name: 'Administrador',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 30).toISOString()
    },
    {
      id: 'demo-doc-002',
      name: 'Convocação Assembleia - Fevereiro 2026.pdf',
      description: 'Documento oficial de convocação para a assembleia geral extraordinária.',
      file_path: 'demo/convocacao-assembleia.pdf',
      file_type: 'application/pdf',
      file_size: 890000,
      uploaded_by: 'demo-admin-001',
      uploader_name: 'Administrador',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    {
      id: 'demo-doc-003',
      name: 'Relatório Financeiro - Janeiro 2026.pdf',
      description: 'Demonstrativo financeiro completo do mês de janeiro com receitas e despesas.',
      file_path: 'demo/relatorio-financeiro-jan.pdf',
      file_type: 'application/pdf',
      file_size: 1520000,
      uploaded_by: 'demo-admin-001',
      uploader_name: 'Administrador',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 15).toISOString()
    },
    {
      id: 'demo-doc-004',
      name: 'Projeto Reforma Área Comum.pdf',
      description: 'Projeto arquitetônico e orçamento para a reforma da área comum do condomínio.',
      file_path: 'demo/projeto-reforma.pdf',
      file_type: 'application/pdf',
      file_size: 5240000,
      uploaded_by: 'demo-admin-001',
      uploader_name: 'Administrador',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 20).toISOString()
    },
    {
      id: 'demo-doc-005',
      name: 'Ata Assembleia - Dezembro 2025.pdf',
      description: 'Ata oficial da assembleia geral ordinária realizada em dezembro de 2025.',
      file_path: 'demo/ata-assembleia-dez.pdf',
      file_type: 'application/pdf',
      file_size: 1100000,
      uploaded_by: 'demo-admin-001',
      uploader_name: 'Administrador',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 45).toISOString()
    }
  ],
  en: [
    {
      id: 'demo-doc-001',
      name: 'Internal Regulations 2025.pdf',
      description: 'Updated condominium internal regulations with all coexistence norms and rules.',
      file_path: 'demo/internal-regulations.pdf',
      file_type: 'application/pdf',
      file_size: 2450000,
      uploaded_by: 'demo-admin-001',
      uploader_name: 'Administrator',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 30).toISOString()
    },
    {
      id: 'demo-doc-002',
      name: 'Assembly Call - February 2026.pdf',
      description: 'Official calling document for the extraordinary general assembly.',
      file_path: 'demo/assembly-call.pdf',
      file_type: 'application/pdf',
      file_size: 890000,
      uploaded_by: 'demo-admin-001',
      uploader_name: 'Administrator',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    {
      id: 'demo-doc-003',
      name: 'Financial Report - January 2026.pdf',
      description: 'Complete financial statement for January with income and expenses.',
      file_path: 'demo/financial-report-jan.pdf',
      file_type: 'application/pdf',
      file_size: 1520000,
      uploaded_by: 'demo-admin-001',
      uploader_name: 'Administrator',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 15).toISOString()
    },
    {
      id: 'demo-doc-004',
      name: 'Common Area Renovation Project.pdf',
      description: 'Architectural project and budget for the condominium common area renovation.',
      file_path: 'demo/renovation-project.pdf',
      file_type: 'application/pdf',
      file_size: 5240000,
      uploaded_by: 'demo-admin-001',
      uploader_name: 'Administrator',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 20).toISOString()
    },
    {
      id: 'demo-doc-005',
      name: 'Assembly Minutes - December 2025.pdf',
      description: 'Official minutes of the ordinary general assembly held in December 2025.',
      file_path: 'demo/assembly-minutes-dec.pdf',
      file_type: 'application/pdf',
      file_size: 1100000,
      uploaded_by: 'demo-admin-001',
      uploader_name: 'Administrator',
      condominium_id: 'demo-condo-001',
      created_at: new Date(Date.now() - 86400000 * 45).toISOString()
    }
  ]
};

// Nomes de usuários (iguais em ambos idiomas)
const usersData = [
  {
    id: 'demo-admin-001',
    email: 'admin@auroraresidences.com',
    role: 'admin',
    unit: 'Management',
    phone: '(555) 123-4567',
    condominium_id: 'demo-condo-001',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-user-001',
    email: 'john.smith@email.com',
    role: 'user',
    unit: '101A',
    phone: '(555) 234-5678',
    condominium_id: 'demo-condo-001',
    created_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 'demo-user-002',
    email: 'mary.johnson@email.com',
    role: 'user',
    unit: '102A',
    phone: '(555) 345-6789',
    condominium_id: 'demo-condo-001',
    created_at: '2024-01-22T09:15:00Z'
  },
  {
    id: 'demo-user-003',
    email: 'robert.brown@email.com',
    role: 'user',
    unit: '201A',
    phone: '(555) 456-7890',
    condominium_id: 'demo-condo-001',
    created_at: '2024-02-01T16:45:00Z'
  },
  {
    id: 'demo-user-004',
    email: 'sarah.davis@email.com',
    role: 'user',
    unit: '202A',
    phone: '(555) 567-8901',
    condominium_id: 'demo-condo-001',
    created_at: '2024-02-10T11:20:00Z'
  },
  {
    id: 'demo-user-005',
    email: 'michael.wilson@email.com',
    role: 'user',
    unit: '301B',
    phone: '(555) 678-9012',
    condominium_id: 'demo-condo-001',
    created_at: '2024-02-15T08:30:00Z'
  }
];

const userNames = {
  pt: ['Administrador', 'Carlos Silva', 'Maria Santos', 'João Pereira', 'Ana Costa', 'Pedro Oliveira'],
  en: ['Administrator', 'John Smith', 'Mary Johnson', 'Robert Brown', 'Sarah Davis', 'Michael Wilson']
};

// Dados do condomínio
const condominiumTranslations = {
  pt: {
    id: 'demo-condo-001',
    name: 'Residencial Aurora',
    address: 'Av. das Flores, 1500 - Jardim Primavera',
    city: 'São Paulo',
    state: 'SP',
    zip: '01452-000',
    phone: '(11) 3456-7890',
    email: 'contato@residencialaurora.com.br',
    units: 48,
    created_at: '2024-01-15T10:00:00Z'
  },
  en: {
    id: 'demo-condo-001',
    name: 'Aurora Residences',
    address: '1500 Flower Avenue, Spring Garden',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phone: '(555) 987-6543',
    email: 'contact@auroraresidences.com',
    units: 48,
    created_at: '2024-01-15T10:00:00Z'
  }
};

// Funções exportadas que aceitam idioma
export const generateMockCondominium = (language = 'pt') => condominiumTranslations[language] || condominiumTranslations.pt;

export const generateMockNotices = (language = 'pt') => noticesTranslations[language] || noticesTranslations.pt;

export const generateMockDocuments = (language = 'pt') => documentsTranslations[language] || documentsTranslations.pt;

export const generateMockUsers = (language = 'pt') => {
  const names = userNames[language] || userNames.pt;
  return usersData.map((user, index) => ({
    ...user,
    name: names[index]
  }));
};

export const generateMockPayments = (language = 'pt') => {
  const userNamesList = userNames[language] || userNames.pt;
  return [
    {
      id: 'demo-payment-001',
      owner_id: 'demo-user-001',
      owner_name: userNamesList[1],
      unit: '101A',
      month: '2026-02',
      amount: language === 'en' ? 450.00 : 850.00,
      status: 'paid',
      payment_date: '2026-02-05',
      condominium_id: 'demo-condo-001',
      created_at: '2026-02-05T10:00:00Z'
    },
    {
      id: 'demo-payment-002',
      owner_id: 'demo-user-002',
      owner_name: userNamesList[2],
      unit: '102A',
      month: '2026-02',
      amount: language === 'en' ? 450.00 : 850.00,
      status: 'paid',
      payment_date: '2026-02-03',
      condominium_id: 'demo-condo-001',
      created_at: '2026-02-03T14:30:00Z'
    },
    {
      id: 'demo-payment-003',
      owner_id: 'demo-user-003',
      owner_name: userNamesList[3],
      unit: '201A',
      month: '2026-02',
      amount: language === 'en' ? 520.00 : 920.00,
      status: 'pending',
      payment_date: null,
      condominium_id: 'demo-condo-001',
      created_at: '2026-02-01T09:00:00Z'
    },
    {
      id: 'demo-payment-004',
      owner_id: 'demo-user-004',
      owner_name: userNamesList[4],
      unit: '202A',
      month: '2026-02',
      amount: language === 'en' ? 520.00 : 920.00,
      status: 'overdue',
      payment_date: null,
      condominium_id: 'demo-condo-001',
      created_at: '2026-01-28T11:00:00Z'
    },
    {
      id: 'demo-payment-005',
      owner_id: 'demo-user-005',
      owner_name: userNamesList[5],
      unit: '301B',
      month: '2026-02',
      amount: language === 'en' ? 580.00 : 980.00,
      status: 'paid',
      payment_date: '2026-02-01',
      condominium_id: 'demo-condo-001',
      created_at: '2026-02-01T08:15:00Z'
    },
    {
      id: 'demo-payment-006',
      owner_id: 'demo-user-001',
      owner_name: userNamesList[1],
      unit: '101A',
      month: '2026-01',
      amount: language === 'en' ? 450.00 : 850.00,
      status: 'paid',
      payment_date: '2026-01-08',
      condominium_id: 'demo-condo-001',
      created_at: '2026-01-08T16:00:00Z'
    },
    {
      id: 'demo-payment-007',
      owner_id: 'demo-user-002',
      owner_name: userNamesList[2],
      unit: '102A',
      month: '2026-01',
      amount: language === 'en' ? 450.00 : 850.00,
      status: 'paid',
      payment_date: '2026-01-10',
      condominium_id: 'demo-condo-001',
      created_at: '2026-01-10T11:20:00Z'
    },
    {
      id: 'demo-payment-008',
      owner_id: 'demo-user-003',
      owner_name: userNamesList[3],
      unit: '201A',
      month: '2026-01',
      amount: language === 'en' ? 520.00 : 920.00,
      status: 'paid',
      payment_date: '2026-01-12',
      condominium_id: 'demo-condo-001',
      created_at: '2026-01-12T13:45:00Z'
    }
  ];
};

export const generateMockStats = (language = 'pt') => ({
  totalUnits: 48,
  occupiedUnits: 45,
  totalResidents: 132,
  monthlyRevenue: language === 'en' ? 22500.00 : 42500.00,
  paidThisMonth: 38,
  pendingThisMonth: 5,
  overdueThisMonth: 2,
  collectionRate: 92.5
});

// Dados do usuário demo atual (simula o usuário logado)
export const getCurrentDemoUser = (isAdmin = true, language = 'pt') => {
  const names = userNames[language] || userNames.pt;
  return {
    id: isAdmin ? 'demo-admin-001' : 'demo-user-001',
    email: isAdmin ? (language === 'en' ? 'admin@auroraresidences.com' : 'admin@residencialaurora.com.br') 
                   : (language === 'en' ? 'john.smith@email.com' : 'carlos.silva@email.com'),
    user_metadata: {
      name: isAdmin ? names[0] : names[1],
      role: isAdmin ? 'admin' : 'user',
      unit: isAdmin ? (language === 'en' ? 'Management' : 'Administração') : '101A',
      condominium_id: 'demo-condo-001'
    }
  };
};

// Helper para formatar tamanho de arquivo
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper para formatar valor monetário
export const formatCurrency = (value, language = 'pt') => {
  return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'pt-BR', {
    style: 'currency',
    currency: language === 'en' ? 'USD' : 'BRL'
  }).format(value);
};

// Helper para formatar data
export const formatDate = (dateString, language = 'pt') => {
  return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR');
};

// Helper para formatar mês/ano
export const formatMonthYear = (monthString, language = 'pt') => {
  const [year, month] = monthString.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });
};
