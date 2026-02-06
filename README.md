# Kondo

Kondo is a React-based admin dashboard focused on UX, accessibility and modern visuals. This project has reached Fase 3: UX Essenciais, with a strong emphasis on delightful interactions, responsive design and robust form/file handling flows.

Status: Fase 3 - UX Essenciais

What’s inside this repo:
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
