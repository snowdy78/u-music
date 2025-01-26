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
  const [search_params, setSearchParams] = useSearchParams();
  const store = useStore();
  const [instruments, setInstruments] = React.useState<IInstrument[]>([]);
  const [search_list, setSearchList] = React.useState<Searchable[]>([]);
  const [filters, setFilters] = React.useState<Filters>({
    filter: () => true,
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
        setFilters({
          filter: (value: IInstrument) => {
            return search_params.get('category') === null ? true : (
              value.category.toLowerCase() === search_params.get('category')?.toLowerCase()
            );
          }
        });
      }
    )
  }, [search_params]);
  function onLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.stopPropagation();
    const rgx = /[a-z]+$/gmi;
    const matching = e.currentTarget.href.match(rgx);
    if (matching) {
      const category = matching.at(0);
      if (category) {
        const params = new URLSearchParams();
        params.set('category', category);
        setSearchParams(params);
      }
    }
  }
  return <StrictMode>
      <ClientPage>
        <div className="index-intro">
          <CatalogButton>
            <Link to="/catalog?category=guitar" onClick={onLinkClick}>
                Гитары
            </Link>
            <Link to="/catalog?category=bass" onClick={onLinkClick}>
                Бас-гитары
            </Link>
            <Link to="/catalog?category=piano" onClick={onLinkClick}>
                Пианино
            </Link>
            <Link to="/catalog?category=drums" onClick={onLinkClick}>
                Барабаны
            </Link>
            <Link to="/catalog?category=trumpet" onClick={onLinkClick}>
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
