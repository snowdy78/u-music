import {Instance, types} from 'mobx-state-tree';

export const BasketInstrument =
    types.model('Instrument_Instance', {id: types.number, count: types.number});

export interface IBasketInstrument extends Instance<typeof BasketInstrument> {}

export const Basket =
    types
        .model('Basket', {
          user_id: types.number,
          ids_of_instruments: types.array(BasketInstrument),
        })
        .actions(self => ({
			push(instrument: IBasketInstrument) {
				self.ids_of_instruments.push(instrument);
			},
			add(id: number) {
				const item =
					self.ids_of_instruments.find(item => item.id === id);
				if (item) {
				item.count++;
				}
			},
			sub(id: number) {
				const item =
					self.ids_of_instruments.find(item => item.id === id);
				if (item) {
				item.count--;
				}
			},
			erase(id: number) {
				const index = self.ids_of_instruments.findIndex(
					item => item.id === id);
				if (index !== -1) {
				self.ids_of_instruments.splice(index, 1);
				}
			},
			save() {
				const state: any = {
					[self.user_id]: [...self.ids_of_instruments]
				};
				localStorage.setItem('basket', JSON.stringify(state));
			},
			load() {
				const basket = localStorage.getItem('basket');
				if (basket) {
					const parsed = JSON.parse(basket);
					if (parsed[self.user_id]) {
						self.ids_of_instruments.clear();
						for (let i = 0; i < parsed[self.user_id].length; i++) {
							const item = BasketInstrument.create(parsed[self.user_id][i]);
							self.ids_of_instruments.push(item);
						}
					}
				}
			},
			remove() {
				localStorage.removeItem('basket');
			},
		}));

export interface IBasket extends Instance<typeof Basket> {}
