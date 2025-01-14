import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { ClientPage } from "./components/ClientPage.tsx"
import { Catalog } from "./components/Catalog.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientPage>
      <Catalog/>
    </ClientPage>
  </StrictMode>,
)
