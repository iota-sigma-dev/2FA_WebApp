import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer'

// Polyfills para librerías que dependen de Node.js (ej: otplib)
window.Buffer = window.Buffer || Buffer;
window.process = window.process || { env: {} } as any;
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
