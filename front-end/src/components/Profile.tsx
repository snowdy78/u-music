import React from 'react';
import { Link } from "react-router-dom";
import { useStore } from "../store/hooks/useStore";
import { ServerApi } from "../server-api";
import { AuthorizedPage } from "./AuthorizedPage";


export function Profile() {
    const store = useStore();
    const [image_data, setImageData] = React.useState<string>("")
    const image_alt = React.useRef<string>("")
    React.useMemo(() => {
        if (store.authorized_user === null) {
            return;
        }
        if (store.authorized_user.img_id === null) {
            setImageData("./src/assets/default-profile-img.png");
        } else {
            ServerApi.getImage(store.authorized_user.img_id).then(image_json => {
                setImageData(image_json.data);
            }).catch(err => image_alt.current = err.message);
        }
    }, []);

    function logout() {
        sessionStorage.clear();
        window.location.href = "/";
    }
    return (
        <AuthorizedPage>
            <div className="profile">
                <h2>Профиль</h2>
                <img className='profile__image' src={image_data} alt={image_alt.current} />
                <p>Логин: {store.authorized_user?.login}</p>
                <p>Почта: {store.authorized_user?.email}</p>
                <Link to="/basket" className='profile__basket-link'>
                    Корзина
                </Link>
                <div className='container'>
                    <Link to='/profile/edit'>
                        <button className='profile__edit-button'>
                            <img className='icon' src='./src/assets/icons/edit-white.svg'/>
                            Редактировать
                        </button>
                    </Link>
                    <button className='profile__logout-button' onClick={logout}>
                        Выйти
                    </button>
                </div>
            </div>
        </AuthorizedPage>
    );
}