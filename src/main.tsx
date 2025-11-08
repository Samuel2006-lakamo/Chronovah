import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DarkModeProvider } from './context/DarkModeContext.tsx'
import { SidebarProvider } from './context/SidebarToggleContext.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DarkModeProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </DarkModeProvider>
  </StrictMode>
);
