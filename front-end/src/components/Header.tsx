import { Link } from 'react-router-dom'
import { useStore } from "../store/hooks/useStore";
import React from "react";
import { observer } from "mobx-react-lite";

export type HeaderProps = {
}

export const Header = observer(function ({}: HeaderProps) {
  const store = useStore();
  React.useEffect(() => {
    if (store.authorized_user?.basket) {
      store.authorized_user.basket.load();
    }
  }, []);
  return (
    <header>
      <div></div>
      <div>
        <Link to="/" className='logo-container'>
          <img src="/src/assets/logo.svg" className='logo-icon' alt="" />
        </Link>
      </div>
      <div></div>
      <div><Link to="/catalog">Каталог</Link></div>
      {
        store.authorized_user == null 
          ? 
            <>
              <div><Link to="/auth">Вход</Link></div>
              <div><Link to="/register">Регистрация</Link></div>
            </>
          :
            <>
              <div>
                <Link to="/basket" className='basket'>
                  <div className="pointer" style={{display: store.authorized_user?.basket?.ids_of_instruments.length ? 'flex' : ''}}>
                    {store.authorized_user?.basket?.ids_of_instruments.length}
                  </div>
                </Link>
              </div>
              <div><Link to="/profile">Профиль</Link></div>
            </>
      }
    </header>

  )
})