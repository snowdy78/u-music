import { flow, Instance, types } from 'mobx-state-tree';
import { User } from './User';
import { DataBaseUserInstance, ServerApi } from "../server-api";
import { InstrumentStore } from "./InstrumentStore";



export const MainStorage = 
    types.model('MainStorage', {
        authorized_user: types.maybeNull(User),
        instruments: InstrumentStore,
    })
    .actions(self => ({
        login(user: DataBaseUserInstance) {
            self.authorized_user = User.create({
                id: user.id,
                login: user.login,
                email: user.email,
                password: user.password,
                is_admin: user.is_admin === 0 ? false : true,
                img_id: user.img_id
            });
        },
        logout() {
            self.authorized_user = null;
        },
        loadInstruments: flow(function* loadInstruments() {
            try {
                const response = yield ServerApi.getInstruments();
                console.log(response);
                for (let i = 0; i < response.length; i++) {
                    self.instruments.insert({
                        id: +response[i].id,
                        model_name: response[i].model_name,
                        category: response[i].category,
                        price: +response[i].price,
                        in_stock: +response[i].in_stock,
                        img_id: response[i].img_id === null ? null : +response[i].img_id,
                    });
                }
            } catch (err) {
                console.error(err);
                throw err;
            }
        }),
    }));


export interface IMainStorage extends Instance<typeof MainStorage> {}
