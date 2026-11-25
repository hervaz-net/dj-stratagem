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

// Persona homepages (the old subagent sites, and Exchange's marketing
// duplicates) are modes of the one desk. They load the parent app, which
// redirects into /command. The marketplace, accounts, and role pages stay
// on the Exchange bundle.
const exchangePath = window.location.pathname.replace(/\/$/, "") || "/"
const exchangeHandoff =
  exchangePath === "/exchange" ||
  /^\/exchange\/(platform|solutions|supply|fleet|about|contact|pricing|project|about-us|company|team|contact-us|features|product|how-it-works|howitworks|partners)$/.test(exchangePath) ||
  /^\/exchange\/projects(\/[^/]+)?$/.test(exchangePath) ||
  /^\/exchange\/construction-projects\/[^/]+\/[^/]+$/.test(exchangePath)
const isExchangeProduct = isExchange && !exchangeHandoff

const load = isExchangeProduct
  ? Promise.all([import('./exchange/index.css'), import('./exchange/App.jsx')])
  : Promise.all([import('./index.css'), import('./App.jsx')])

load.then(([, { default: App }]) => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter basename={isExchangeProduct ? EXCHANGE_BASE : undefined}>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
