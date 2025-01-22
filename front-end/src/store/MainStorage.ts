import { Instance, types } from 'mobx-state-tree';
import { IUser, User } from './User';
import { DataBaseUserInstance } from "../server-api";
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
        }
    }));


export interface IMainStorage extends Instance<typeof MainStorage> {}
