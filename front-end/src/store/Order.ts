import {types, Instance} from 'mobx-state-tree';
import { BasketInstrument, IBasketInstrument } from "./Basket";


export const Order = types.model('Order', {
    id: types.number,
    user_id: types.number,
    goods: types.array(BasketInstrument),
}).views(self => ({
    map<T>(callback: (order: IBasketInstrument, index: number) => T) {
        return self.goods.map(callback);
    }
}))
.actions(self => ({

}));

export interface IOrder extends Instance<typeof Order> {}
