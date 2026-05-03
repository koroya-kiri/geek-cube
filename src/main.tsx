import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { BgProvider } from './hooks/useBg.tsx'
import { PipelineProvider } from './hooks/usePipeline.tsx'
import { PluginProvider } from './hooks/usePlugins.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BgProvider>
        <PipelineProvider>
          <PluginProvider>
            <App />
          </PluginProvider>
        </PipelineProvider>
      </BgProvider>
    </BrowserRouter>
  </StrictMode>,
)
