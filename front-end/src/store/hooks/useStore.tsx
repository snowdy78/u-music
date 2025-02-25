import React from "react";
import { ServerApi } from "../../server-api";
import { Basket } from "../Basket";
import { InstrumentStore } from "../InstrumentStore";
import { IMainStorage, MainStorage } from "../MainStorage";
import { IUser, User } from "../User";

function createStore() {
    let register_user: IUser | null = null;
    let user_json: any;
    if (sessionStorage.getItem('authorized-user') !== null) {
        user_json = JSON.parse(sessionStorage.getItem('authorized-user') as string);
        try {
            register_user = User.create({
                id: user_json.id,
                login: user_json.login,
                email: user_json.email,
                password: user_json.password,
                is_admin: user_json.is_admin == 0 ? false : true,
                img_id: user_json.img_id === null ? null : +user_json.img_id,
                basket: Basket.create({
                    user_id: +user_json.id,
                    ids_of_instruments: [],
                }),
            });
        } catch (err: any) {
            window.location.href = "/401";
            console.error(err);
            throw err;
        }
    }
    const storage = MainStorage.create({
        authorized_user: register_user,
        instruments: InstrumentStore.create({}),
    });
    if (user_json) {
        ServerApi.getUser({id: +user_json.id}).then(user => {
            if (!sessionStorage.getItem('authorized-user')) 
                return;
            const user_json = JSON.parse(sessionStorage.getItem('authorized-user') as string);
            if (user) {
                if (user.id === user_json.id 
                    && user.email === user_json.email 
                    && user.login === user_json.login
                    && user.password === user_json.password
                    && user.is_admin === user_json.is_admin
                    && user.img_id === user_json.img_id
                ) {
                    return;
                }
                storage.login(user);
                sessionStorage.setItem('authorized-user', JSON.stringify(user));
                window.location.reload();
            }
        }).catch(err => {
            window.location.href = "/401";
            sessionStorage.removeItem('authorized-user');
            console.error(err);
        });
    }
    return storage;
}
type StoreContextType = {
    store: IMainStorage;
};

export const StoreContext = React.createContext<StoreContextType>({store: createStore()});

type StoreProviderProps = React.PropsWithChildren;

export function StoreProvider({ children }: StoreProviderProps) {
    const [store] = React.useState(createStore());
    return (
        <StoreContext.Provider value={{store}}>
            {children}
        </StoreContext.Provider>
    );
};
export function useStore(): IMainStorage {
    const context = React.useContext<StoreContextType>(StoreContext);
    return context.store;
}
