import { PropsWithChildren } from "react"
import { Link } from 'react-router-dom'

export type HeaderProps = PropsWithChildren & {
    authorized?: true;
}

export function Header({}: HeaderProps) {
    return (
        <header>
        <div></div>
        <div>
          <Link to="/" className='logo-container'>
            <img src="./src/assets/logo.svg" className='logo-icon' alt="" />
          </Link>
        </div>
        <div></div>
        <div><Link to="/catalog">Каталог</Link></div>
        <div><Link to="/login">Вход</Link></div>
        <div><Link to="/register">Регистрация</Link></div>
      </header>

    )
}