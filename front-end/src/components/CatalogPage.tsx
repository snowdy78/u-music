import { StrictMode } from 'react'

import { ClientPage } from "./ClientPage.tsx"
import { CatalogButton } from "./CatalogButton.tsx"
import { InstrumentSearch } from "./InstrumentSearch.tsx"
import { Searchable } from "./InstrumentSearch.tsx"
import { Catalog } from "./Catalog.tsx"
import '@css/App.css'

export function CatalogPage() {
  const search_list: Searchable[] = [
    {name: "Gibson", href: ""},
    {name: "Fender", href: ""},
    {name: "Ibanez", href: ""},
  ];
  return <StrictMode>
      <ClientPage>
        <div className="index-intro">
          <CatalogButton/>
          <InstrumentSearch search_list={search_list}></InstrumentSearch>
        </div>
        <hr className='hr-indent' />
        <Catalog />
      </ClientPage>
    </StrictMode>
}
