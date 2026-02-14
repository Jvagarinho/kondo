import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { AuthProvider } from './contexts/AuthContext.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { DemoProvider } from './contexts/DemoContext.jsx'
import DemoModeToggle from './components/DemoModeToggle.jsx'
import DemoLanguageSync from './components/DemoLanguageSync.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <DemoProvider>
        <AuthProvider>
          <App />
          <DemoLanguageSync />
          <DemoModeToggle />
        </AuthProvider>
      </DemoProvider>
    </LanguageProvider>
  </StrictMode>,
)
