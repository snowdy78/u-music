import { StrictMode } from 'react'

import { ClientPage } from "./ClientPage.tsx"
import { Catalog } from "./Catalog.tsx"
import { InstrumentSearch } from "./InstrumentSearch.tsx"
import { Searchable } from "./InstrumentSearch.tsx"


export function CatalogPage() {
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
