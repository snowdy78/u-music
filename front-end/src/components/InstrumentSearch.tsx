import '@css/Search.css'
import '@css/App.css'
import React from 'react'
import { Link } from "react-router-dom";

export type Searchable = {
    name: string;
    href: string;
}

export type InstrumentSearchProps = {
    search_list?: Searchable[];
}
export function InstrumentSearch({ search_list }: InstrumentSearchProps) {
    const [result_list_visible, setResultListVisible] = React.useState(false);
    const [searching, setSearching] = React.useState<string>("");
    const results = React.useRef<Searchable[]>([]);
    // TODO search by category probably
    React.useMemo(() => {
        // updating results
        results.current = [];
        if (search_list) {
            results.current.push(...search_list.filter(
                str => str.name.toLowerCase().includes(searching.toLowerCase())));
        }
    }, [searching])
    type InputStateEvent = React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>;
    function updateInputState(event?: InputStateEvent) {
        if (event) {
            setSearching(event.target.value);
            return;
        }
    }
    function close(event: React.FocusEvent<HTMLInputElement>) {
        const result_list = document.querySelector('.search__result-list') as Element;
        if (!result_list.contains(event.relatedTarget) || result_list === event.relatedTarget) {
            setResultListVisible(false);
        }
    }
    return (
        <div className="search-container">
            <div className="search">
                <img src="./src/assets/icons/search.svg" className='icon' alt="" />
                <input
                    type="text"
                    className='search__input'
                    placeholder="Поиск"
                    onFocus={() => setResultListVisible(true)}
                    onBlur={close}
                    onChange={updateInputState}
                />
            </div>
            <div className='search__result-list' style={{ scale: result_list_visible ? '1 1' : '' }}>
                <div className='search__result-list__items'>
                    {
                        results.current.map(
                            (item, index) =>
                                <div key={`search:`+index} className='result-list__item'>
                                    <img src="./src/assets/icons/search-white.svg" className='icon' alt="" />
                                    <Link to={item.href} className='result-list__item__link'>{item.name}</Link>
                                </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}