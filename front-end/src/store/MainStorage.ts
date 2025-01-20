import { Instance, types } from 'mobx-state-tree';
import { User, IUser } from './User';


const MainStorage = 
    types.model('MainStorage', {
        authorized_user: types.maybeNull(User),
    })
    .actions(self => ({
        login(user: IUser) {
            self.authorized_user = user;
        },
        logout() {
            self.authorized_user = null;
        }
    })).create({});


interface IMainStorage extends Instance<typeof MainStorage> {}

export function useStore(): IMainStorage {
    return MainStorage;
}
