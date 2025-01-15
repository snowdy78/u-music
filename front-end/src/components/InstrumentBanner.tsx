import { PropsWithChildren, useRef } from 'react'
import '@css/App.css'
import '@css/InstrumentBanner.css'

export interface InstrumentType extends PropsWithChildren {
    background_image: string;
    count?: number;
}

export function InstrumentBanner({ children, background_image }: InstrumentType) {
    const ref = useRef<HTMLDivElement>(null);
    function handleMouseEnter() {
        if (ref.current) {
            ref.current.style.opacity = '1';
            ref.current.style.visibility = 'visible';
        }
    }
    function handleMouseLeave() {
        if (ref.current) {
            ref.current.style.opacity = '';
            ref.current.style.visibility = '';
        }
    }
    return (
        <div className="instrument-banner" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ backgroundImage: `url('${background_image}')` }}>
            <div ref={ref} className='instrument-banner__name'>
                {children}
            </div>
        </div>
    )
}