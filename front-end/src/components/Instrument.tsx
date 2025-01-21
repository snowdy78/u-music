import React from 'react'
import '@css/App.css'
import '@css/Instrument.css'
import { ServerApi } from "../server-api";
import { EInstrumentCategory } from "../store/Instrument";

export type InstrumentType = {
    id: number;
}

export function Instrument({id}: InstrumentType) {
    const image_data = React.useRef<string>("");
    const model_name = React.useRef<string | null>(null);
    const price = React.useRef<number | null>(null);
    const in_stock = React.useRef<number | null>(null);
    const category = React.useRef<EInstrumentCategory | null>(null);
    React.useMemo(() => {
        ServerApi.getInstrument(id).then(
            async (instrument) => {
                model_name.current = instrument.model_name;
                price.current = instrument.price;
                in_stock.current = instrument.in_stock;
                category.current = instrument.category;
                const image_json = await ServerApi.getImage(instrument.img_id);
                image_data.current = image_json.data;
            }
        ).catch(err => console.log(err));
    }, []);
    if (!model_name.current || !price.current || !in_stock.current || !category.current)
        return null;
    const [is_bought, setIsBought] = React.useState(in_stock.current === 0);
    function handleClick() {
        setIsBought(true);
    }
    return (
        <div className="instrument">
            <div className='instrument__image'>
                <img src={image_data.current} alt="nothing" />
            </div>
            <div className='instrument__name'>
                {category.current}: {model_name.current}
            </div>
            <div className='instrument__price'>
                {price.current} р.
            </div>
            <div className={`instrument__stock ${in_stock.current === 0 ? 'color-primary' : ''}`}>
                В наличии: {in_stock.current}
            </div>
            <button className="instrument__button" onClick={handleClick}>
                {is_bought ? 'Куплено' : 'Купить'}
            </button>
        </div>
    )
}