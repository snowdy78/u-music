import '@css/Catalog.css'
import { PropsWithChildren, useRef, useState } from "react";
export type CatalogType = PropsWithChildren & {};

export function Catalog({ children }: CatalogType) {
    const [isOpen, setIsOpen] = useState(false);
    const button = useRef<HTMLButtonElement>(null);
    const list = useRef<HTMLDivElement>(null);
    return (
        <div className='catalog'>
            <button 
                ref={button} 
                className='catalog-dropdown-list' 
                onBlur={() => setIsOpen(false)} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <img src="./src/assets/icons/list.svg" className='icon' alt="" />
                Каталог
            </button>
            <div
                ref={list}
                className='catalog-dropdown-list__open'
                style={isOpen ? { scale: '1 1' } : { }}
            >
                <div className='catalog-dropdown-list__items' style={isOpen ? { opacity: '1' } : { opacity: '0' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}