import { Instrument } from "./Instrument";
import { useStore } from "../store/hooks/useStore";
import React from "react";
import { IInstrument } from "../store/Instrument";

export function Catalog() {
    const store = useStore();
    const [instruments, setInstruments] = React.useState<IInstrument[] | null>(null);
    React.useEffect(() => {
        store.loadInstruments().then(async () => {
            const array = store.instruments.getArray();
            for (const instrument of array) {
                if (instrument.hasImg()) {
                    try {
                        await instrument.loadImgData();
                    } catch(err: any) {
                        console.error('img not loaded: ' + err.message)
                    }
                }
            }
            setInstruments([...array]);
        }).catch(rejection => console.error('instruments not loaded: ' + rejection.message));
    }, []);
    return (
        <div className='catalog'>
            {
                instruments === null ? null
                : instruments.map((value, _) => (
                    <Instrument
                        key={value.id}
                        model_name={value.model_name}
                        price={value.price}
                        in_stock={value.in_stock}
                        image={value.img_data}
                        type={value.category}
                    />
                ))
            }
        </div>
    )
}