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
import { Error404Page } from "./components/Error404Page"
import { ProfileEdit } from "./components/ProfileEdit"
import { Admin } from "./components/admin/Admin"
import { InstrumentEdit } from "./components/admin/InstrumentEdit"
import { InstrumentAdd } from "./components/admin/InstrumentAdd"
import { Error401Page } from "./components/Error401Page"
import { UserEdit } from "./components/admin/UserEdit"
import { Basket } from "./components/Basket"
import { StoreProvider } from "./store/hooks/useStore"

function AppComponent() {
  return (
    <StrictMode>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"
              Component={() => <MainContent />}
            />
            <Route path="/404"
              Component={() => <Error404Page />}
            />
            <Route path="/401"
              Component={() => <Error401Page />}
            />
            <Route path="/catalog"
              Component={() => <CatalogPage />}
            />
            <Route path='/auth'
              Component={() => <Auth />}
            />
            <Route path="/register"
              Component={() => <Register />}
            />
            <Route path="/profile"
              Component={() => <Profile />}
            />
            <Route path="/profile/edit"
              Component={() => <ProfileEdit />}
            />
            <Route path="/admin"
              Component={() => <Admin />}
            />
            <Route path="/admin/user-edit/:id"
              Component={() => <UserEdit />}
            />
            <Route path="/admin/instrument-add"
              Component={() => <InstrumentAdd />}
            />
            <Route path="/admin/instrument-edit/:id"
              Component={() => <InstrumentEdit />}
            />
            <Route path="/instrument/:id"
              Component={() => <InstrumentPage />}
            />
            <Route path="/basket"
              Component={() => <Basket />}
            />
            <Route path="/catalog?category=:category"
              Component={() => <CatalogPage />}
            />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(
  <AppComponent/>,
)
