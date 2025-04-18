import React from 'react';
import { useStore } from "../store/hooks/useStore";
import { AuthorizedPage } from "./AuthorizedPage";
import { InstrumentType } from "./Instrument";
import { IInstrument, Instrument } from "../store/Instrument";
import { observer } from "mobx-react-lite";
import { Link } from "react-router";
import { IBasketInstrument, BasketInstrument as BasketInstrumentModel } from "../store/Basket";
import { ServerApi } from "../server-api";

export type BasketInstrumentProps = {
    bought_count: number;
    onRemove?: () => void;
    onAddCount?: () => void;
    onSubCount?: () => void;
} & InstrumentType;

export function BasketInstrument({
    iid, 
    model_name, 
    price, 
    in_stock, 
    image, 
    bought_count,
    onRemove,
    onAddCount,
    onSubCount,
}: BasketInstrumentProps) {
    
    return (
        <div className="basket__instrument">
            <Link to={'/instrument/' + iid} className='basket__instrument__image' style={image ? { backgroundImage:`url(${image})`} : undefined}></Link>
            <div className='basket__instrument__info'>
                <div className='basket__instrument__model-name'>Название:&nbsp;{model_name}</div>
                <div/>
                <div className='basket__instrument__stock'>В наличии:&nbsp;{in_stock}</div>
                <div className='basket__instrument__count'>
                    <button className='basket__instrument__sub' onClick={() => onSubCount?.()}>-</button>
                    Количество:&nbsp;{bought_count}    
                    <button className='basket__instrument__add' onClick={() => onAddCount?.()}>+</button>
                </div>
                <div className='basket__instrument__price'>
                    <button className='basket__instrument__remove' onClick={onRemove}>
                        Удалить
                    </button>
                    Цена: {price}
                </div>
            </div>
        </div>
    );
}


export const Basket = observer(function() {
    const store = useStore();
    const [instruments, setInstruments] = React.useState<IInstrument[]>([]);
    const [basket_instruments, setBasketInstruments] = React.useState<IBasketInstrument[]>([]);
    const [total_price, setTotalPrice] = React.useState(0);
    const [discount, _1] = React.useState(0);
    const [vat, _2] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const [order_success, setOrderSuccess] = React.useState<string>('');
    const [order_error, setOrderError] = React.useState<string>('');
    function updateInstruments() {
        if (!store.authorized_user?.basket) {
            return;
        }
        const ids = store.authorized_user.basket.ids_of_instruments.map(item => item.id);
        ServerApi.getSelectedInstruments(ids).then(
            data => {
                console.log(data);
                const new_instruments: IInstrument[] = [];
                const new_basket_instruments: IBasketInstrument[] = [];
                for (let i = 0; i < data.length; i++) {
                    new_instruments[i] = Instrument.create(data[i]);
                    new_basket_instruments[i] = BasketInstrumentModel.create({
                        id: data[i].id,
                        count: store.authorized_user?.basket?.ids_of_instruments[i].count ?? 0
                    });
                }
                for (let i = 0; i < new_instruments.length; i++) {
                    new_instruments[i].loadImgData();
                }
                setInstruments(new_instruments);
                setBasketInstruments(new_basket_instruments);
            }
        );
    }
    React.useEffect(() => {
        if (store.authorized_user?.basket) {
            store.authorized_user.basket.load();
            updateInstruments();
        }
    }, []);
    React.useEffect(() => {
        let total_price = 0;
        for (let i = 0; i < instruments.length; i++) {
            total_price += instruments[i].price * basket_instruments[i].count;
        }
        setTotalPrice(total_price);
    }, [instruments, basket_instruments]);
    React.useEffect(() => {
        setTotal(total_price - discount + vat);
    }, [total_price, discount, vat]);
    function onInstrumentRemove(id: number) {
        if (!store.authorized_user?.basket) {
            return;
        }
        const instrument = store.authorized_user.basket.ids_of_instruments.find(item => item.id === id);
        if (instrument) {
            store.authorized_user.basket.erase(id);
            store.authorized_user.basket.save();
            updateInstruments();
        }
    }
    function onInstrumentAdd(id: number) {
        if (!store.authorized_user?.basket) {
            return;
        }
        const basket = store.authorized_user.basket;
        const instrument = store.instruments.findById(id);
        const instrument_from_basket = basket.ids_of_instruments.find(item => item.id === id);
        if (instrument_from_basket !== undefined && instrument !== undefined && instrument.in_stock > instrument_from_basket.count) {
            basket.add(id);
            basket.save();
            updateInstruments();
        }
    }

    function onInstrumentSub(id: number) {
        if (!store.authorized_user?.basket) {
            return;
        }
        const basket = store.authorized_user.basket;
        const instrument_from_basket = basket.ids_of_instruments.find(item => item.id === id);
        if (instrument_from_basket !== undefined && instrument_from_basket.count > 1) {
            basket.sub(id);
            basket.save();
            updateInstruments();
        }
    }
    async function onSubmitOrder() {
        if (!store.authorized_user?.basket) {
            return;
        }
        const cart = store.authorized_user.basket;
        try {
            await ServerApi.addOrder({
                user_id: cart.user_id,
                goods: cart.ids_of_instruments
            });
            setOrderSuccess(`Заказ успешно создан`);
            setOrderError('')
        } catch(err: any) {
            setOrderSuccess('');
            setOrderError(err.message);
        }
    }
    return (
        <AuthorizedPage>
            <div className="basket">
                <h3>Корзина</h3>
                <div className="basket-grid">
                    <div className='basket-grid__instruments'>
                        {instruments.map((instrument: IInstrument, key: number) => {
                            return (
                                <BasketInstrument 
                                    key={`basket-instrument:`+key}
                                    iid={instrument.id}
                                    model_name={instrument.model_name}
                                    price={instrument.price}
                                    in_stock={instrument.in_stock}
                                    type={instrument.category}
                                    bought_count={basket_instruments[key].count}
                                    image={instrument.img_data ?? ''}
                                    onRemove={() => onInstrumentRemove(instrument.id)}
                                    onAddCount={() => onInstrumentAdd(instrument.id)}
                                    onSubCount={() => onInstrumentSub(instrument.id)}
                                />
                            )
                        })}
                    </div>
                    <div>

                        <div className='basket-grid__total-info'>
                            <div>
                                <p>Всего:</p>
                                <p>Скидки:</p>
                                <p>НДС:</p>
                                <p className='total-info__price'>Итого:</p>
                            </div>
                            <div>
                                <p>{total_price}р.</p>
                                <p>-{discount}р.</p>
                                <p>+{vat}р.</p>
                                <p className='total-info__price'>{total}р.</p>
                            </div>
                            <button className='total-info__button' onClick={onSubmitOrder}>
                                Заказать
                            </button>
                        </div>
                        <div>
                            {order_success ? <p className='pass-field'>{order_success}</p> : null}
                        </div>
                        <div>
                            {order_error ? <p className='fail-field'>{order_error}</p> : null}
                        </div>
                    </div>
                </div>
            </div>
        </AuthorizedPage>
    );
})
