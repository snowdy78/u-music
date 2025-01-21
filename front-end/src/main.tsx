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
import { Profile } from "./components/Profile"
import { InstrumentPage } from "./components/InstrumentPage"

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
                <Route path="/profile"
                  Component={() => <Profile/>}
                />
                <Route path="/admin"/>
                <Route path="/basket"/>
                <Route path="/instrument/:id" Component={() => <InstrumentPage/>}/>
            </Routes>
        </BrowserRouter>
  </StrictMode>,
)
