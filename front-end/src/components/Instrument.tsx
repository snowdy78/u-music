import { useState } from 'react'
import '@css/App.css'
import '@css/Instrument.css'
import { EInstrumentCategory } from "../store/Instrument";
import { useStore } from "../store/hooks/useStore";
import React from 'react';
import { BasketInstrument } from "../store/Basket";
import { observer } from "mobx-react-lite";

export type InstrumentType = {
    iid: number;
    model_name: string;
    price: number;
    in_stock: number | 0;
    image?: string | null;
    type: EInstrumentCategory;
    onBought?: () => void
}

export const Instrument = observer(({iid, model_name, price, in_stock, type, image, onBought}: InstrumentType) => {
    const store = useStore();
    const [bought_count, setBought] = useState(0);
    const sub = () => {
        if (bought_count > 0) {
            setBought(bought_count - 1);
            if (store.authorized_user?.basket) {
                if (bought_count - 1 === 0) {
                    store.authorized_user.basket.erase(iid);
                } else {
                    store.authorized_user.basket.sub(iid);
                }
                store.authorized_user.basket.save();
            }
        }
    };
    const add = () => {
        if (bought_count < in_stock) {
            setBought(bought_count + 1);
            if (store.authorized_user?.basket) {
                if (bought_count + 1 === 1) {
                    store.authorized_user.basket.push(BasketInstrument.create({id: iid, count: 1}));
                } else {
                    store.authorized_user.basket.add(iid);
                }
                store.authorized_user.basket.save();
            }
        }
    };
    function handleBought() {
        add();
    } 
    React.useEffect(() => {
        if (store.authorized_user?.basket) {
            store.authorized_user.basket.load();
            const item = store.authorized_user.basket.ids_of_instruments.find(item => item.id === iid);
            if (item) {
                setBought(item.count);
            }
        }
    }, []);
    return (
        <div className="instrument">
            <div className='instrument__image' style={{ backgroundImage: image ? `url("${image}")` : ""}}/>
            <div className='instrument__name'>
                {type}: {model_name}
            </div>
            <div className='instrument__price'>
                {price} р.
            </div>
            <div className={`instrument__stock ${in_stock == 0 ? 'color-primary' : ''}`}>
                В наличии: {in_stock}
            </div>
            <button className="instrument__button bg-primary" onClick={() => { if (bought_count === 0) handleBought(); onBought?.();}}>
                {
                    bought_count ? <div>
                        <button className='increment-btn' onClick={sub}>-</button>
                        В корзине {bought_count}
                        <button className='increment-btn' onClick={add}>+</button>
                    </div> : <div>Купить</div>}
            </button>
        </div>
    )
})