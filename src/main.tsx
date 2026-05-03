import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { BgProvider } from './hooks/useBg.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BgProvider>
        <App />
      </BgProvider>
    </BrowserRouter>
  </StrictMode>,
)
