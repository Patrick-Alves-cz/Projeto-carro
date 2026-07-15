import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'
import { DataProvider } from './contexts/DataContext.jsx'
import { ConfirmProvider } from './contexts/ConfirmContext.jsx'
import './styles/globals.css'

// HashRouter is used deliberately: this app is designed to eventually ship
// as a static bundle inside an Electron/.exe shell with no HTTP server,
// where BrowserRouter's history API routes would 404 on refresh/deep-link.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ToastProvider>
        <ConfirmProvider>
          <DataProvider>
            <App />
          </DataProvider>
        </ConfirmProvider>
      </ToastProvider>
    </HashRouter>
  </React.StrictMode>
)

// Remove the static boot splash once React has taken over the DOM.
const splash = document.getElementById('boot-splash')
if (splash) {
  splash.style.transition = 'opacity 0.4s ease'
  splash.style.opacity = '0'
  setTimeout(() => splash.remove(), 400)
}
