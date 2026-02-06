- Kondo Dashboard

Kondo is a React based admin dashboard focused on UX, accessibility and modern visuals. This project has reached Fase 3: UX Essenciais, with strong focus on interactions, mobile first design and robust form and file handling flows.

Status: Fase 3 - UX Essenciais

O que esta repo contem
- UI rica com Framer Motion para animacoes e glassmorphism
- Empty States com ilustracoes SVG amigaveis
- Drag and Drop Upload (multi file) para documentos com progresso em tempo real e previews
- Validacao de formularios com visuais modernos (Zod)
- Dialogos de Confirmacao com modais animados
- Layout responsivo orientado a dispositivos moveis (cards em listas, targets de toque)
- Notificacoes com Toasts (React Toastify)
- Suporte a internacionalizacao (PT/EN) via LanguageContext
- Controlo de acesso via UI baseado em papeis (admins apenas para upload/apagar)
- Recurso de reservas de acessos e logs basicos para auditoria

Principais arquivos e componentes
- DropZoneAdvanced.jsx: uploader avancado e multi-file
- Documents.jsx: pagina de documentos atualizada para usar DropZoneAdvanced
- ConfirmDialog.jsx: modal de confirmacao com animacao
- EmptyState.jsx: componentes visuais para estados vazios
- LanguageContext.jsx: i18n e traducoes
- src/supabase (back-end): politica de acesso via Row Level Security (RLS) em kondo_documents

Arquitetura e estrutura
- src/components: DropZoneAdvanced, ConfirmDialog, EmptyState, FormInput, FormSelect, etc.
- src/pages: Dashboard, Notices, Payments, Documents, Notices, etc.
- src/contexts: LanguageContext, AuthContext, etc.
- migrations: SQL de migracoes, incluindo regras de acesso (RLS)
- index.css: CSS global com tema glassmorphism, responsivo e utilitarios

Recursos-chave Implementados
- Drag & Drop Upload multi-file com previews e progresso
- Form Validation Visual com feedback responsivo
- Dialogos de Confirmacao com animacoes
- Empty States com ilustracoes amigaveis
- Mobile-first e responsivo
- Acessibilidade basica (keyboard, foco, ARIA)
- Localizacao PT/EN
- Gatilhos de notificacoes (toasts)

Configuracao Local
- Pre requisitos: Node.js (>= 18), npm (ou yarn)
- Clonar o repositorio e instalar dependencias:
  npm install
- Configurar variaveis de ambiente (exemplos):
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
- Iniciar modo de desenvolvimento:
  npm run dev
- Construir para producao:
  npm run build
- Verificar lint: npm run lint

Estrutura de Arquivos (resumo)
- src/components/DropZoneAdvanced.jsx   -> Uploader avancado com drag & drop e multi-file
- src/pages/Documents.jsx               -> integra DropZoneAdvanced para upload de documentos
- src/contexts/LanguageContext.jsx        -> i18n PT/EN
- migrations/rls_kondo_documents_v2.sql   -> migração de RLS (admin-only uploads/deletes)
- README.md                              -> este documento
- index.css                               -> estilos globais (glassmorphism, responsivo)
- etc. (ver pastas)                       

Uso de backend e seguranca
- O front-end ja restringe a UI para admins, mas a protecao real vem das regras de acesso no back-end.
- Regras de Row Level Security (RLS) ficaram ativas para a tabela de documentos (kondo_documents).
- Policies (INSERIR/DELETE) implementadas para admin ou owner conforme o esquema escolhido (com ou sem claims JWT).
- Recomenda-se validar com seu time de dados para alinhar nomes de tabelas e colunas de usuarios.

Notas de contribuicao
- The repo utiliza um fluxo de commits cuidadoso: enfrente cambios usuarios com commit messages descritivos.
- Pode abrir issues para novas features e PRs para validações extensivas.

Roadmap (próximos passos)
- Melhorias de UX: toast feedback por arquivo, resumo de uploads, re-upload de falhas
- Tests automatizados básicos para fluxo de upload
- Suporte a PWA e offline
- Conteudos + dashboards adicionais e visualizações

Licenca: MIT (ou atual)?

Obrigado por usar o Kondo. Se precisar ajustar algum trecho ou idioma, avise e atualizo rapidamente.
- Rich UI with Framer Motion animations and glassmorphism styling
- Empty States with friendly SVG illustrations
- Drag & Drop Upload (multi-file) for documents with real-time progress and previews
- Modern form validation visuals (Zod-based) with inline error states and shake feedback
- Confirm Dialogs with animated modals for destructive actions
- Mobile-first responsive layout with dedicated mobile patterns (cards on list views, improved touch targets)
- Real-time search/debounce, gradient backgrounds, particle backdrops, and 50+ CSS animations
- Localization support (PT/EN) via LanguageContext
- Basic role-based access control enforcement in UI (admins only for upload/delete)
- Toast notifications (React Toastify) for quick feedback

Files of note:
- src/components/DropZoneAdvanced.jsx  // Advanced, multi-file drag & drop uploader
- src/pages/Documents.jsx             // Documents page updated to use DropZoneAdvanced
- src/contexts/LanguageContext.jsx    // i18n strings and translations
- src/MaskCSS/*.css (via index.css)    // Global styles and responsive utilities
- migrations/rls_kondo_documents_v2.sql // Backend RLS migrations (admin-only upload/delete)

## Features (summary)
- Empty States: friendly illustrations for notices/payments/documents
- Drag & Drop Upload: multi-file, previews, per-file progress, cancellation
- Form Validation Visual: real-time validation with inline feedback
- Confirm Dialogs: modern modals with animation for destructive actions
- Mobile-First: responsive layout adapts across breakpoints
- Accessibility: focus management, ARIA attributes, keyboard navigation hooks
- Security: UI-level admin restrictions plus backend-ready RLS controls (behind the scenes)
- Localization: PT/EN translations across UI strings

## Getting Started
- Prerequisites: Node.js (>= 18), npm (or yarn)
- Install dependencies: `npm install`
- Start dev server: `npm run dev` (port may vary; the tool will pick an available port)
- Build for production: `npm run build`
- Lint: `npm run lint`

-## Security Best Practices (quick)
- Public repositories should avoid exposing secrets. This project uses environment variables for credentials (eg. Supabase URL/anon key). Ensure these are never committed.
- Add a .env.example with placeholders (already added).
- Add a .gitignore rule to ignore real .env files (already added).
- If secrets were ever committed, rotate them and purge history if necessary.

## Testing (manual)
- Drag & drop tests on Documents page using admin account
- Validate that non-admin users cannot upload or delete documents (backend/permissions must be enforced)
- Validate responsiveness on mobile widths and with device toolbar in browser
- Validate form validations for sign in/up and modal forms

## Architecture overview
- src/components
  - DropZoneAdvanced.jsx: advanced uploader with drag & drop, previews, progress, and cancel
- src/pages
  - Documents.jsx: uses DropZoneAdvanced for document uploads
- src/contexts
  - LanguageContext.jsx: i18n and translations
- migrations
  - rls_kondo_documents_v2.sql: backend security policies (RLS) for documents

## Contributing
- This repo is actively maintained; contributions are welcome.
- Please open issues for feature requests or bug reports and submit PRs with tests where possible.

## Notas de segurança
- O front-end já restringe UI para admins, mas é essencial manter as políticas de back-end (RLS) ativas para qualquer operação via API.
- As políticas podem ser ajustadas para o seu esquema real (colunas/nomes de tabelas). 

## Próximos passos
- Adicionar toasts por arquivo (feedback imediato de sucesso/erro)
- Implementar resumo de uploads ao final
- Adicionar testes automatizados simples para fluxo de upload
- Melhorar mensagens de erro com códigos HTTP bem entendidos

Feito com foco em UX, performance e segurança. Se quiser, posso adaptar o README a outro estilo ou incluir capturas de tela.

Links úteis
- Repositório: https://github.com/Jvagarinho/kondo
- Documentação do Supabase (RLS/Policies): https://supabase.com/docs/guides/database/row-level-security


Kondo is a web application for condominium management that centralizes documents, fee control, and important notices. It promotes financial transparency, organization, and efficient communication between management and residents.

---

## Technical Information

This project was built with React + Vite.

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

### Features

- Document Centralization
- Fee Control
- Important Notices
- Financial Transparency
- Resident Communication
