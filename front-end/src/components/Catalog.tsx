import '@css/Catalog.css'
import { PropsWithChildren, useRef, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside.ts";
export type CatalogType = PropsWithChildren & {};

export function Catalog({ children }: CatalogType) {
    const [isOpen, setIsOpen] = useState(false);
    const button = useRef<HTMLButtonElement>(null);
    const list = useRef<HTMLDivElement>(null);
    useClickOutside(button, event => {
        if (button.current
            && event.target instanceof Node
            && !button.current.contains(event.target))
            setIsOpen(false)
    });
    return (
        <div className='catalog'>
            <button ref={button} className='catalog-dropdown-list' onClick={() => setIsOpen(!isOpen)}>
                <img src="./src/assets/icons/list.svg" className='icon' alt="" />
                Каталог
            </button>
            <div
                ref={list}
                className='catalog-dropdown-list__open'
                style={isOpen ? { maxHeight: '300px' } : { maxHeight: '0' }}
            >
                <div className='catalog-dropdown-list__items' style={isOpen ? { opacity: '1' } : { opacity: '0' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}