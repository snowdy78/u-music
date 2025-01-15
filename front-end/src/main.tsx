import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { ClientPage } from "./components/ClientPage"
import { IndexContent } from "./components/IndexContent"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientPage>
      <IndexContent></IndexContent>
    </ClientPage>
  </StrictMode>,
)
