import { InstrumentBanner } from './InstrumentBanner'
import { InstrumentSearch } from "./InstrumentSearch"
import { Catalog } from './Catalog'
import '@css/App.css'

export function IndexContent() {
    return (
        <>
            <div className='index-intro'>
                <Catalog>

                </Catalog>
                <InstrumentSearch />
            </div>
            <h2 className='category-header'>
                Категории
            </h2>
            <hr />
            <div className='categories'>
            <InstrumentBanner background_image="./src/assets/guitar.png">
                Гитары
            </InstrumentBanner>
            <InstrumentBanner background_image="./src/assets/drums.png">
                Барабаны
            </InstrumentBanner>
            <InstrumentBanner background_image="./src/assets/piano.png">
                Пианино
            </InstrumentBanner>
            </div>
        </>
    )
}