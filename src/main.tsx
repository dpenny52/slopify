import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import App from './App'
import './index.css'

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL as string,
  {
    verbose: true,
  }
)

// Debug: expose client for inspection
;(window as unknown as { __convex__: ConvexReactClient }).__convex__ = convex

createRoot(document.getElementById('root')!).render(
  <ConvexAuthProvider client={convex}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConvexAuthProvider>
)
