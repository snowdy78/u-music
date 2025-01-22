import { Instrument } from "./Instrument";
import { useStore } from "../store/hooks/useStore";
import React from "react";
import { IInstrumentStore } from "../store/InstrumentStore";

export function Catalog() {
    const store = useStore();
    const [instruments, setInstruments] = React.useState<IInstrumentStore | null>(null);
    React.useEffect(() => {
        store.loadInstruments().then(() => {
            store.instruments.forEach((instrument, _) => {
                if (instrument.hasImg()) {
                    instrument.loadImgData();
                }
            });
            setInstruments(store.instruments);
        });
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