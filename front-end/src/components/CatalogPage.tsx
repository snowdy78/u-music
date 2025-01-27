import { StrictMode } from 'react'

import { ClientPage } from "./ClientPage.tsx"
import { CatalogButton } from "./CatalogButton.tsx"
import { InstrumentSearch } from "./InstrumentSearch.tsx"
import { Searchable } from "./InstrumentSearch.tsx"
import { Catalog, Filters } from "./Catalog.tsx"
import '@css/App.css'
import React from "react"
import { useStore } from "../store/hooks/useStore"
import { Link, useSearchParams } from "react-router"
import { EInstrumentCategory, IInstrument } from "../store/Instrument.ts"

export function CatalogPage() {
  const [search_params, setSearchParams] = useSearchParams();
  const store = useStore();
  const [instruments, setInstruments] = React.useState<IInstrument[]>([]);
  const [search_list, setSearchList] = React.useState<Searchable[]>([]);
  const [filters, setFilters] = React.useState<Filters>({});
  
  const category = React.useRef<string>('');
  const price_from = React.useRef<string>('');
  const price_to = React.useRef<string>('');
  const name = React.useRef<string>('');
  const stock_from = React.useRef<string>('');
  const stock_to = React.useRef<string>('');
  React.useEffect(() => {
    price_from.current = search_params.get('price_from') ?? '0';
    name.current = search_params.get('model_name') ?? '';
    stock_from.current = search_params.get('stock_from') ?? '0';
    stock_to.current = search_params.get('stock_to') ?? '';
    category.current = search_params.get('category') ?? '';

    store.loadInstruments().then(
      async () => {
        const list: Searchable[] = [];
        await store.instruments.loadImages();
        store.instruments.forEach((instrument: IInstrument, _) => {
          list.push({name: instrument.model_name, href: `instrument/${instrument.id}`});
        })
        setSearchList([...list]);
        setInstruments([...store.instruments.getArray()]);
        let max_price = 0;
        store.instruments.forEach((instrument, _) => {
          if (instrument.price > max_price)
            max_price = instrument.price;
        });
        price_to.current = search_params.get('price_to') ?? `${max_price}`;
        const filters: Filters = {};
        if (category.current) {
          filters.category_filter = (value: EInstrumentCategory) => (
            value.toLowerCase() === category.current.toLowerCase()
          )
        }
        if (name.current) {
          filters.model_name_filter = (value: string) => (
            value.toLowerCase().includes(name.current.toLowerCase())
          )
        }
        if (price_from.current || price_to.current) {
          filters.price_filter = (value: number) => (
            (price_from.current === '' || value >= parseInt(price_from.current)) && (price_to.current === '' || value <= parseInt(price_to.current))
          )
        }
        if (stock_from.current || stock_to.current) {
          filters.stock_filter = (value: number) => (
            (stock_from.current === '' || value >= parseInt(stock_from.current)) && (stock_to.current === '' || value <= parseInt(stock_to.current))
          )
        }
        setFilters(filters);
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
  function onSubmitFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const form_data = new FormData(form);
    const params = new URLSearchParams();
    form_data.forEach((value, key) => {
      params.set(key, value as string)
    });
    setSearchParams(params);
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
        <div className='container'>
          <h2 className='font-primary'>Каталог</h2>
          <hr className='hr-indent' />
          <form className='container' onSubmit={onSubmitFilters}>
            <div className='container catalog__filters'>
              <div className='catalog__filters__category-filter'>
                <select name="category" id="" defaultValue={category.current}>
                  <option value="">Любое</option>
                  <option value="guitar">Гитары</option>
                  <option value="bass">Бас-гитары</option>
                  <option value="piano">Пианино</option>
                  <option value="drums">Барабаны</option>
                  <option value="trumpet">Духовые</option>
                </select>
              </div>
              <div className='catalog__filters__model-name-filter'>
                <label htmlFor="model-name">Назвиние модели&nbsp;</label>
                <input type="text" name="model_name" id='model-name' defaultValue={name.current} />
              </div>
              <div className='catalog__filters__price-filter'>
                <label htmlFor="price-range-from">Цена от&nbsp;</label>
                <input type="text" name="price_from" id='price-range-from' placeholder={"0"} />
                <label htmlFor="price-range-to">&nbsp;до&nbsp;</label>
                <input type="text" name="price_to" id='price-range-to' placeholder={price_to.current} />
              </div>
              <div className='catalog__filters__in-stock-filter'>
                <label htmlFor="in-stock-range-from">В наличии от&nbsp;</label>
                <input type="text" name="stock_from" id='in-stock-range-from' placeholder={stock_from.current} />
                <label htmlFor="in-stock-range-to">&nbsp;до&nbsp;</label>
                <input type="text" name="stock_to" id='in-stock-range-to' placeholder={stock_to.current} />
              </div>
            </div>
            <div className='container'>
              <button type='submit' className='bg-primary catalog__filters__btn-submit'>Применить</button>
            </div>
          </form>
          <hr className='hr-indent' />
          <Catalog filters={filters} instruments={instruments} />
        </div>
      </ClientPage>
    </StrictMode>
}
