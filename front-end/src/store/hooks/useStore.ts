import { InstrumentStore } from "../InstrumentStore";
import { IMainStorage, MainStorage } from "../MainStorage";
import { IUser, User } from "../User";

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
            img_id: user_json.img_id === null ? null : +user_json.img_id
        });
    }
    return MainStorage.create({
        authorized_user: user,
        instruments: InstrumentStore.create({}),
    });
}
