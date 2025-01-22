import React from 'react';
import { Link } from "react-router-dom";
import { useStore } from "../store/hooks/useStore";
import { ClientPage } from "./ClientPage"; 
import { ServerApi } from "../server-api";


export function Profile() {
    const store = useStore();
    const image_data = React.useRef<string>("")
    const image_alt = React.useRef<string>("")
    React.useMemo(() => {
        if (store.authorized_user == null) {
            window.location.href = "/auth";
            return;
        }
        if (store.authorized_user.img_id === null) {
            image_data.current = "./src/assets/default-profile-img.png";
        } else {
            ServerApi.getImage(store.authorized_user.img_id).then(image_json => {
                image_data.current = image_json.data;
            }).catch(err => image_alt.current = err.message);
        }
    }, []);

    function logout() {
        sessionStorage.clear();
        window.location.href = "/";
    }
    return (
        <ClientPage>
            <div className="profile">
                <h2>Профиль</h2>
                <img className='profile__image' src={image_data.current} alt={image_alt.current} />
                <p>Логин: {store.authorized_user?.login}</p>
                <p>Почта: {store.authorized_user?.email}</p>
                <Link to="/basket" className='profile__basket-link'>
                    Корзина
                </Link>
                <div className='container'>
                    <button className='profile__edit-button'>
                        <img className='icon' src='./src/assets/icons/edit-white.svg'/>
                        Редактировать
                    </button>
                    <button className='profile__logout-button' onClick={logout}>
                        Выйти
                    </button>
                </div>
            </div>
        </ClientPage>
    );
}