import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { ClientPage } from "./components/ClientPage.tsx"
import { Catalog } from "./components/Catalog.tsx"
import { InstrumentSearch } from "./components/InstrumentSearch.tsx"
import { Searchable } from "./components/InstrumentSearch.tsx"


function Component() {
  const search_list: Searchable[] = [
    {name: "Gibson", href: ""},
    {name: "Fender", href: ""},
    {name: "Ibanez", href: ""},
  ];
  return <StrictMode>
      <ClientPage>
        <div className="index-intro">
          <Catalog/>
          <InstrumentSearch search_list={search_list}></InstrumentSearch>
        </div>
      </ClientPage>
    </StrictMode>
}

createRoot(document.getElementById('root')!).render(
  <Component/>,
)
