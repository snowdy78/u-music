import React from 'react';
import { useStore } from "../store/MainStorage";
import { Link } from "react-router";


export function Footer() {
    const store = useStore();
    const is_user_admin = React.useRef(false);

    React.useMemo(() => {
        console.log(store.authorized_user);
        is_user_admin.current = store.authorized_user != null && store.authorized_user.is_admin;
    }, []); 

    return (
        <footer>
            <div className='top-section'>
                <div className='column'>
                    <div className='logo-container'>
                        Логотип
                    </div>
                    <div className='rating'>
                        Рейтинг Магазина
                    </div>
                    <div className='contacts'>
                        <h4>Контакты</h4>
                    </div>
                </div>
                <div className='column'>
                    <h3>О нас</h3>
                </div>
                <div className='column'>
                    <h3>Специальные предложения</h3>
                </div>
                <div className='column'>
                    <h3>Покупателям</h3>
                </div>
            </div>
            <div className='bottom-section'>
                <div className='column'>
                    лицензия, соглашение и тп.
                </div>
                { 
                    is_user_admin.current 
                    ?
                        <div className='column'>
                            <Link to="/admin">администрирование</Link>
                        </div> 
                    :
                        <>
                        </>
                }
            </div>

        </footer>
    )
}