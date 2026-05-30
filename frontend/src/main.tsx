import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../src/App/App.tsx'
import { AuthProvider } from './Services/AuthContext.tsx'
import './i18.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
