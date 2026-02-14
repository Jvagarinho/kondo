# 🏢 Kondo

**Modern and Intuitive Condominium Management System**

[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-purple)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Kondo is a complete web application for condominium management, developed with a focus on usability, modern design, and user experience. It centralizes documents, payment control, and communication between management and residents.

![Kondo Preview](https://via.placeholder.com/800x400/1e3a5f/ffffff?text=Kondo+Dashboard)

---

## ✨ Features

### 📋 Notice Management
- Create and view announcements and alerts
- Mark urgent notices
- Complete notification history
- Responsive interface with animated cards

### 💰 Payment Control
- Record and track monthly payments
- Visual status: Paid, Pending, Overdue
- Advanced filters and search
- Management by unit/fraction

### 📁 Document Repository
- Multiple file upload with drag & drop
- Real-time previews and progress
- Organization by date and type
- Secure file downloads
- Permission-based access control

### 👥 User Management
- Admin and Resident profiles
- Unit/fraction assignment
- Personal data and contacts
- Secure authentication system

### 🌍 Internationalization
- Full Portuguese/English support
- Demo data adapted to language
- 100% translated interface
- Automatic locale detection

### 🎭 Demo Mode
- Realistic mock data for presentations
- Quick PT/EN switch in demo mode
- Perfect for promotional campaigns
- Complete simulation of all features

---

## 🚀 Technologies

- **Frontend:** React 19, React Router 7, Framer Motion
- **Build Tool:** Vite 7
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Styling:** Tailwind CSS, Glassmorphism
- **Validation:** Zod
- **Animations:** Framer Motion + CSS Animations
- **Notifications:** React Toastify
- **Form Validation:** Zod + Custom Hooks

---

## 📦 Installation

### Prerequisites
- Node.js >= 18
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/Jvagarinho/kondo.git
cd kondo
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit the `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🎮 How to Use

### Normal Mode
1. Log in with your credentials
2. Navigate through the main dashboard
3. Manage notices, payments, and documents
4. Switch language in the navbar (PT/EN)

### Demo Mode 🎭
1. Click the "🎭 Activate Demo" button in the bottom right corner
2. Explore all the pre-filled mock data
3. Test all features without needing a backend
4. Switch language to see data in PT or EN
5. Click "🛑 Exit Demo" to return to normal mode

---

## 📁 Project Structure

```
kondo/
├── public/
│   ├── logo.svg              # Application logo
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
│   │   └── demoData.js       # Multilingual mock data
│   ├── hooks/
│   │   ├── useValidation.js
│   │   └── useDebounce.js
│   ├── App.jsx
│   └── main.jsx
├── migrations/
│   └── *.sql                 # Database migrations
└── package.json
```

---

## 🔒 Security

- **Authentication:** JWT via Supabase Auth
- **Authorization:** Row Level Security (RLS) in PostgreSQL
- **File Upload:** Admin-only access policies
- **Environment Variables:** Never committed to repository
- **Validation:** All inputs validated on frontend and backend

---

## 🎨 Design System

### Primary Colors
- **Main Blue:** `#1e3a5f` - Professional and trustworthy
- **Accent Orange:** `#ed8936` - Energy and modernity
- **Background:** Glassmorphism with blur and transparency

### Visual Features
- Modern Glassmorphism design
- Smooth animations with Framer Motion
- Responsive (Mobile-first)
- Friendly Empty States with SVG illustrations
- Visual feedback on all interactions

---

## 🧪 Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Build preview
npm run lint         # Code linting
```

---

## 📝 Future Features

- [ ] Mobile app (PWA)
- [ ] Push notifications
- [ ] Advanced financial reports
- [ ] Integrated chat between residents
- [ ] Common area reservations
- [ ] Native Android/iOS app

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**João Vagarinho** - [GitHub](https://github.com/Jvagarinho)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI Library
- [Vite](https://vitejs.dev/) - Amazing build tool
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

<p align="center">
  Made with ❤️ to simplify condominium management
</p>
