import {types, Instance, flow} from 'mobx-state-tree';
import { IOrder, Order } from "./Order";
import { ServerApi } from "../server-api";
import { BasketInstrument } from "./Basket";

export const OrderStore = types.model('OrderStore', {
    orders: types.array(Order),
}).views(self => ({
    length: self.orders.length,
    map<T>(callback: (order: IOrder, index: number) => T) {
        return self.orders.map(callback);
    },
})).actions(self => ({
    eraseById(id: number) {
        const index = self.orders.findIndex(order => order.id === id);
        if (index !== -1) {
            self.orders.splice(index, 1);
        }
    },
    push(order: IOrder) {
        self.orders.push(order);
    },
    load: flow(function*() {
        const db_orders = yield ServerApi.getOrders();
        for (let i = 0; i < db_orders.length; i++) {
            const db_goods = db_orders[i].goods;
            const goods = types.array(BasketInstrument).create([]);
            for (let j = 0; j < db_goods.length; j++) {
                goods.push(BasketInstrument.create(db_goods[j]));
            }
            self.orders.push(Order.create({id: db_orders[i].id, user_id: db_orders[i].user_id, goods: goods}));
        }
    }),
}));

export interface IOrderStore extends Instance<typeof OrderStore> {}
