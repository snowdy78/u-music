import { types, Instance } from 'mobx-state-tree';
import { Basket } from "./Basket";

export const User = 
    types.model('User', {
        id: types.number,
        login: types.string,
        email: types.string,
        password: types.string,
        is_admin: types.boolean,
        img_id: types.maybeNull(types.number),
        basket: types.maybeNull(Basket),
    })
    .actions(self => ({
        setLogin(login: string) {
            self.login = login;
        },
        setEmail(email: string) {
            self.email = email;
        },
        setPassword(password: string) {
            self.password = password;
        },
        assignAdmin(value: boolean) {
            self.is_admin = value;
        },
    }));

export interface IUser extends Instance<typeof User> {}
