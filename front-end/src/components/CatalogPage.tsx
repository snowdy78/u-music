import { StrictMode } from 'react'

import { ClientPage } from "./ClientPage.tsx"
import { CatalogButton } from "./CatalogButton.tsx"
import { InstrumentSearch } from "./InstrumentSearch.tsx"
import { Searchable } from "./InstrumentSearch.tsx"
import { Catalog, Filters } from "./Catalog.tsx"
import '@css/App.css'
import React from "react"
import { useStore } from "../store/hooks/useStore.ts"
import { Link, useSearchParams } from "react-router"
import { IInstrument } from "../store/Instrument.ts"

export function CatalogPage() {
  const [search_params, _] = useSearchParams();
  const store = useStore();
  const [instruments, setInstruments] = React.useState<IInstrument[]>([]);
  const [search_list, setSearchList] = React.useState<Searchable[]>([]);
  const [filters, setFilters] = React.useState<Filters>({
    filter: (value: IInstrument) => {
      console.log(value.category, search_params.get('category'));
      return search_params.get('category') === undefined ? true : (
        value.category.toLowerCase() === search_params.get('category')?.toLowerCase()
      );
    }
  });
  React.useEffect(() => {
    store.loadInstruments().then(
      async () => {
        const list: Searchable[] = [];
        await store.instruments.loadImages();
        store.instruments.forEach((instrument: IInstrument, _) => {
          list.push({name: instrument.model_name, href: `instrument/${instrument.id}`});
        })
        setSearchList([...list]);
        setInstruments([...store.instruments.getArray()]);
      }
    )
  }, []);
  return <StrictMode>
      <ClientPage>
        <div className="index-intro">
          <CatalogButton>
            <Link to="/catalog?category=guitar">
                Гитары
            </Link>
            <Link to="/catalog?category=bass" state={{category: 'bass'}}>
                Бас-гитары
            </Link>
            <Link to="/catalog?category=piano" state={{category: 'piano'}}>
                Пианино
            </Link>
            <Link to="/catalog?category=drums" state={{category: 'drums'}}>
                Барабаны
            </Link>
            <Link to="/catalog?category=trumpet" state={{category: 'trumpet'}}>
                Духовые
            </Link>
          </CatalogButton>
          <InstrumentSearch search_list={search_list}/>
        </div>
        <hr className='hr-indent' />
        <Catalog filters={filters} instruments={instruments} />
      </ClientPage>
    </StrictMode>
}
