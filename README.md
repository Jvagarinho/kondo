# 🏢 Kondo

**Sistema de Gestão de Condomínios Moderno e Intuitivo**

[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-purple)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Kondo é uma aplicação web completa para gestão de condomínios, desenvolvida com foco em usabilidade, design moderno e experiência do usuário. Centraliza documentos, controlo de pagamentos e comunicação entre administração e moradores.

![Kondo Preview](https://via.placeholder.com/800x400/1e3a5f/ffffff?text=Kondo+Dashboard)

---

## ✨ Funcionalidades

### 📋 Gestão de Comunicados
- Criação e visualização de avisos e alertas
- Marcação de comunicados urgentes
- Histórico completo de notificações
- Interface responsiva com cards animados

### 💰 Controlo de Pagamentos
- Registo e acompanhamento de pagamentos mensais
- Status visual: Pago, Pendente, Atrasado
- Filtros e pesquisa avançada
- Gestão por unidade/fractura

### 📁 Repositório de Documentos
- Upload multiplo com drag & drop
- Previews e progresso em tempo real
- Organização por data e tipo
- Download seguro de arquivos
- Controlo de acesso baseado em permissões

### 👥 Gestão de Utilizadores
- Perfis de Admin e Morador
- Atribuição de unidades/fracturas
- Dados pessoais e contactos
- Sistema de autenticação seguro

### 🌍 Internacionalização
- Suporte completo Português/Inglês
- Dados de demonstração adaptados ao idioma
- Interface 100% traduzida
- Detecção automática de locale

### 🎭 Modo Demonstração
- Dados fictícios realistas para apresentações
- Alternância rápida PT/EN no modo demo
- Perfeito para campanhas promocionais
- Simulação completa de todas as funcionalidades

---

## 🚀 Tecnologias

- **Frontend:** React 19, React Router 7, Framer Motion
- **Build Tool:** Vite 7
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Estilização:** Tailwind CSS, Glassmorphism
- **Validação:** Zod
- **Animações:** Framer Motion + CSS Animations
- **Notificações:** React Toastify
- **Validação de Formulários:** Zod + Hooks personalizados

---

## 📦 Instalação

### Pré-requisitos
- Node.js >= 18
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/Jvagarinho/kondo.git
cd kondo
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o ficheiro `.env` com as suas credenciais Supabase:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 🎮 Como Usar

### Modo Normal
1. Faça login com as suas credenciais
2. Navegue pelo dashboard principal
3. Gere comunicados, pagamentos e documentos
4. Alterne o idioma no navbar (PT/EN)

### Modo Demonstração 🎭
1. Clique no botão "🎭 Ativar Demo" no canto inferior direito
2. Explore todos os dados fictícios preenchidos
3. Teste todas as funcionalidades sem necessidade de backend
4. Alterne o idioma para ver dados em PT ou EN
5. Clique "🛑 Sair do Demo" para voltar ao modo normal

---

## 📁 Estrutura do Projeto

```
kondo/
├── public/
│   ├── logo.svg              # Logo da aplicação
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── DemoLanguageSync.jsx
│   │   ├── DemoModeToggle.jsx
│   │   ├── DropZoneAdvanced.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── EmptyState.jsx
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── DemoContext.jsx
│   │   └── LanguageContext.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Documents.jsx
│   │   ├── Notices.jsx
│   │   ├── Payments.jsx
│   │   ├── Profile.jsx
│   │   ├── Condominium.jsx
│   │   ├── Users.jsx
│   │   ├── SignIn.jsx
│   │   └── SignUp.jsx
│   ├── lib/
│   │   └── demoData.js       # Dados fictícios multilíngues
│   ├── hooks/
│   │   ├── useValidation.js
│   │   └── useDebounce.js
│   ├── App.jsx
│   └── main.jsx
├── migrations/
│   └── *.sql                 # Migrações do banco de dados
└── package.json
```

---

## 🔒 Segurança

- **Autenticação:** JWT via Supabase Auth
- **Autorização:** Row Level Security (RLS) no PostgreSQL
- **Upload de arquivos:** Políticas de acesso restrito a admins
- **Variáveis de ambiente:** Nunca commitadas no repositório
- **Validação:** Todos os inputs validados no frontend e backend

---

## 🎨 Design System

### Cores Principais
- **Azul Principal:** `#1e3a5f` - Profissional e confiável
- **Laranja Destaque:** `#ed8936` - Energia e modernidade
- **Fundo:** Glassmorphism com blur e transparência

### Características Visuais
- Design Glassmorphism moderno
- Animações suaves com Framer Motion
- Responsivo (Mobile-first)
- Empty States amigáveis com ilustrações SVG
- Feedback visual em todas as interações

---

## 🧪 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificação de código
```

---

## 📝 Funcionalidades Futuras

- [ ] Aplicativo móvel (PWA)
- [ ] Notificações push
- [ ] Relatórios financeiros avançados
- [ ] Chat integrado entre moradores
- [ ] Reserva de espaços comuns
- [ ] App Android/iOS nativo

---

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o ficheiro [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

**João Vagarinho** - [GitHub](https://github.com/Jvagarinho)

---

## 🙏 Agradecimentos

- [React](https://react.dev/) - Biblioteca UI
- [Vite](https://vitejs.dev/) - Build tool incrível
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Framer Motion](https://www.framer.com/motion/) - Animações

---

<p align="center">
  Feito com ❤️ para simplificar a gestão de condomínios
</p>
