import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import '@css/App.css'
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom'
import { CatalogPage } from './components/CatalogPage'
import { Auth } from './components/Auth'
import { Register } from './components/Register'
import { MainContent } from "./components/MainContent"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
            <Routes>
                <Route path="/" 
                  Component={() => <MainContent />} 
                />
                <Route path="/catalog" 
                  Component={() => <CatalogPage />} 
                />
                <Route path='/auth' 
                  Component={() => <Auth/> } 
                />
                <Route path="/register"
                  Component={() => <Register /> }
                />
            </Routes>
        </BrowserRouter>
  </StrictMode>,
)
