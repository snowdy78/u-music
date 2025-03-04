import { InstrumentBanner } from './InstrumentBanner'
import { InstrumentSearch } from "./InstrumentSearch"
import { CatalogButton } from './CatalogButton'
import '@css/App.css'

export function IndexContent() {
    return (
        <>
            <div className='index-intro'>
                <CatalogButton>
                    <div>
                        Гитары
                    </div>
                    <div>
                        Акустика
                    </div>
                    <div>
                        Бас-гитары
                    </div>
                    <div>
                        Пианино
                    </div>
                    <div>
                        Барабаны
                    </div>
                    <div>
                        Духовые
                    </div>
                </CatalogButton>
                <InstrumentSearch />
            </div>
            <div style={{padding: '5px 5px 0 8px'}}>
                <h2 className='category-header'>
                    Категории
                </h2>
            </div>
            <hr />
            <div className='categories'>
            <InstrumentBanner link_to="/catalog?category=guitar" background_image="./src/assets/guitar.png">
                Гитары
            </InstrumentBanner>
            <InstrumentBanner link_to="/catalog?category=drums" background_image="./src/assets/drums.png">
                Барабаны
            </InstrumentBanner>
            <InstrumentBanner link_to="/catalog?category=piano" background_image="./src/assets/piano.png">
                Пианино
            </InstrumentBanner>
            </div>
        </>
    )
}