import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import '@css/App.css'
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom'
import { ClientPage } from './components/ClientPage'
import { IndexContent } from './components/IndexContent'
import { CatalogPage } from './components/CatalogPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
            <Routes>
                <Route path="/" Component={() => (<ClientPage><IndexContent /></ClientPage>)} />
                <Route path="/catalog" Component={() => (<CatalogPage />)} />
            </Routes>
        </BrowserRouter>
  </StrictMode>,
)
