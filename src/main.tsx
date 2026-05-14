import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DarkModeProvider } from './context/DarkModeContext.tsx'
import { SidebarProvider } from './context/SidebarToggleContext.tsx'
import { applyTheme, getStoredTheme } from './lib/theme.ts'
import { initializeSurface } from './lib/surface.ts'
import { registerSW } from "virtual:pwa-register";
import { DashboardProvider } from './context/DashboardContext.tsx'

import { SearchProvider } from './context/SearchContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { SyncProvider } from './context/SyncContext.tsx'

// Initialize theme and surface as early as possible
applyTheme(getStoredTheme());
initializeSurface();

const updateSW = registerSW({
  onNeedRefresh() {
    // A new version of the app is available — ask the user to update
    if (confirm("A new version of Chronovah is available. Reload to update?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("[PWA] App is ready to work offline");
  },
  onRegistered(registration: ServiceWorkerRegistration | undefined) {
    console.log("[PWA] Service worker registered:", registration);
  },
  onRegisterError(error: unknown) {
    console.error("[PWA] Service worker registration failed:", error);
  },
});

// Remove the initial HTML loader once React is ready to mount
function dismissAppLoader() {
  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 350);
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SyncProvider>
        <DarkModeProvider>
          <SidebarProvider>
            <DashboardProvider>
              <SearchProvider>
                <App />
              </SearchProvider>
            </DashboardProvider>
          </SidebarProvider>
        </DarkModeProvider>
      </SyncProvider>
    </AuthProvider>
  </StrictMode>
);

// Dismiss loader after React has painted
requestAnimationFrame(() => {
  requestAnimationFrame(dismissAppLoader);
});
