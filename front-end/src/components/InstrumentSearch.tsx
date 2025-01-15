import '@css/Search.css'
import '@css/App.css'

export function InstrumentSearch() {
    return (
        <div className="search">
            <img src="./src/assets/icons/search.svg" className='icon' alt="" />
            <input type="text" className='search__input' placeholder="Поиск" />
        </div>
    );
}