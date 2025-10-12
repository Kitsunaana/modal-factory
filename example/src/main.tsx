import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from "./App"
import "./index.css"
import { SidebarProvider } from './widgets/sidebar/_provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SidebarProvider>
      <App />
    </SidebarProvider>
  </StrictMode>,
)
