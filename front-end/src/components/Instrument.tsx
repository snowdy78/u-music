import { useState } from 'react'
import '@css/App.css'
import '@css/Instrument.css'
import { InstrumentCategory } from "../instrument";


export type InstrumentType = {
    model_name: string;
    price: number;
    in_stock: number | 0;
    image: string;
    type: InstrumentCategory;
}

export function Instrument({model_name, price, in_stock, type, image}: InstrumentType) {
    const [is_bought, setIsBought] = useState(in_stock == 0);
    function handleClick() {
        setIsBought(true);
    }
    return (
        <div className="instrument">
            <div className='instrument__image'>
                <img src={image} alt="nothing" />
            </div>
            <div className='instrument__name'>
                {type}: {model_name}
            </div>
            <div className='instrument__price'>
                {price} р.
            </div>
            <div className={`instrument__stock ${in_stock == 0 ? 'color-primary' : ''}`}>
                В наличии: {in_stock}
            </div>
            <button className="instrument__button" onClick={handleClick}>
                {is_bought ? 'Куплено' : 'Купить'}
            </button>
        </div>
    )
}