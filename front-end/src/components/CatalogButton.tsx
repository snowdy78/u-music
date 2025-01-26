import '@css/Catalog.css'
import { PropsWithChildren, useState } from "react";
export type CatalogType = PropsWithChildren & {};

export function CatalogButton({ children }: CatalogType) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='catalog-button'>
            <button 
                className='catalog-dropdown-list' 
                onBlur={() => setIsOpen(false)} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <img src="./src/assets/icons/list.svg" className='icon' alt="" />
                Каталог
            </button>
            <div
                className='catalog-dropdown-list__open'
                onClick={() => setIsOpen(true)}
                style={isOpen ? { scale: '1 1' } : { }}
            >
                <div className='catalog-dropdown-list__items' style={isOpen ? { opacity: '1' } : { opacity: '0' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}