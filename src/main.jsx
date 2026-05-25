import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import './i18n'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

async function renderApp() {
  let AppWrapper = App

  // Only load Clerk if the publishable key is configured
  if (PUBLISHABLE_KEY) {
    const { ClerkProvider } = await import('@clerk/react')
    const OriginalApp = App
    AppWrapper = function ClerkWrappedApp() {
      return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <OriginalApp />
        </ClerkProvider>
      )
    }
  } else {
    console.warn('Clerk publishable key not found. Running without authentication.')
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AppWrapper />
    </StrictMode>,
  )
}

renderApp()
