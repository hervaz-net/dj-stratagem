import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Stratagem Exchange is its own site with its own app, styles, and design
// tokens. It lives under /exchange; everything else is the parent
// site. Each side loads only its own bundle and CSS so tokens never collide.
const EXCHANGE_BASE = '/exchange'
const isExchange =
  window.location.pathname === EXCHANGE_BASE ||
  window.location.pathname.startsWith(`${EXCHANGE_BASE}/`)

// Fleet, Capital, Studio, and Workforce are standalone company sites built on
// the Exchange design system, each at its own top-level address.
const isVenture = /^\/(fleet|capital|studio|workforce|companies\/[^/]+)\/?$/.test(window.location.pathname)

const load = isExchange
  ? Promise.all([import('./exchange/index.css'), import('./exchange/App.jsx')])
  : isVenture
    ? Promise.all([import('./exchange/index.css'), import('./ventures/App.jsx')])
    : Promise.all([import('./index.css'), import('./App.jsx')])

load.then(([, { default: App }]) => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter basename={isExchange ? EXCHANGE_BASE : undefined}>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
