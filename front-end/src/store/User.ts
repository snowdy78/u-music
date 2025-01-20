import { types, Instance } from 'mobx-state-tree';

export const User = 
    types.model('User', {
        id: types.string,
        login: types.string,
        email: types.string,
        password: types.string,
        is_admin: types.boolean,
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
