import '@css/App.css'
import { PropsWithChildren } from "react"

export type ClientPageType = PropsWithChildren & {};

export function ClientPage({ children }: PropsWithChildren) {
  return (
    <>
      <header>
        <div></div>
        <div>
          <a href="" className='logo-container'>
            <img src="./src/assets/logo.svg" className='logo-icon' alt="" />
          </a>
        </div>
        <div></div>
        <div><a href="catalog.html">Каталог</a></div>
        <div><a href="login.html">Вход</a></div>
        <div><a href="register.html">Регистрация</a></div>
      </header>
      <div id='main-content'>
        {children}
      </div>
      <footer></footer>
    </>
  )
}
