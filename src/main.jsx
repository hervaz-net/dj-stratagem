import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Stratagem Exchange is a D&J Stratagem subsidiary with its own app, styles,
// and design tokens. It lives under /exchange; everything else is the parent
// site. Each side loads only its own bundle and CSS so tokens never collide.
const EXCHANGE_BASE = '/exchange'
const isExchange =
  window.location.pathname === EXCHANGE_BASE ||
  window.location.pathname.startsWith(`${EXCHANGE_BASE}/`)

const load = isExchange
  ? Promise.all([import('./exchange/index.css'), import('./exchange/App.jsx')])
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
