import { PropsWithChildren } from "react"
import { Header } from './Header'
import { Footer } from './Footer'
export type ClientPageType = PropsWithChildren & {};

export function ClientPage({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <div id='main-content'>
        {children}
      </div>
      <Footer />
    </>
  )
}
