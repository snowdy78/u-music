import React from 'react';
import { useStore } from "../store/hooks/useStore";
import { AuthorizedPage } from "./AuthorizedPage";
import { InstrumentType } from "./Instrument";
import { IInstrument } from "../store/Instrument";
import { observer } from "mobx-react-lite";

export function BasketInstrument({model_name, price, in_stock, type, image}: InstrumentType) {
    
    return (
        <div className="basket__instrument">
            <div style={image ? { backgroundImage:`url(${image})`} : undefined}></div>
            <div>{model_name}</div>
            <div>{price}</div>
            <div>{in_stock}</div>
            <div>{type}</div>
        </div>
    );
}


export const Basket = observer(function() {
    const store = useStore();
    const [instruments, setInstruments] = React.useState<IInstrument[]>([]);
    React.useEffect(() => {
        if (store.authorized_user?.basket) {
            store.authorized_user.basket.load();
            store.loadInstruments().then(async () => {
                await store.instruments.loadImages();
                const array = store.instruments.getArray();
                setInstruments(
                    array.filter((instrument: IInstrument): boolean => 
                        store.authorized_user?.basket?.ids_of_instruments.findIndex(
                            (value, _) => value.id === instrument.id
                        ) !== -1
                    )
                );
            });
        }
    }, []);
    return (
        <AuthorizedPage>
            <div className="basket">
                <h3>Корзина</h3>
                <div className="basket__content">
                    {instruments.map((instrument: IInstrument, key: number) => {
                        return (
                            <BasketInstrument 
                                key={`basket-instrument:`+key}
                                iid={instrument.id}
                                model_name={instrument.model_name}
                                price={instrument.price}
                                in_stock={instrument.in_stock}
                                type={instrument.category}
                                image={instrument.img_data ?? ''}

                            />
                        )
                    })}
                </div>
            </div>
        </AuthorizedPage>
    );
})
