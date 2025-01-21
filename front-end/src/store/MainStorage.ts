import { Instance, types } from 'mobx-state-tree';
import { IUser, User } from './User';
import { DataBaseUserInstance } from "../server-api";
import { InstrumentStore } from "./InstrumentStore";



const MainStorage = 
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

export function useStore(): IMainStorage {
    let user: IUser | null = null;
    if (sessionStorage.getItem('authorized-user') !== null) {
        const user_json = JSON.parse(sessionStorage.getItem('authorized-user') as string);
        user = User.create({
            id: user_json.id,
            login: user_json.login,
            email: user_json.email,
            password: user_json.password,
            is_admin: user_json.is_admin == 0 ? false : true,
            img_id: user_json.img_id
        });
    }
    return MainStorage.create({
        authorized_user: user,
        instruments: InstrumentStore.create({}),
    });
}
