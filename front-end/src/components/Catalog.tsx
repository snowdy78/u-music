import React from "react";
import { InstrumentCategory } from "../instrument";
import { Instrument } from "./Instrument";
import { ServerApi } from "../server-api";

export function Catalog() {
    type InstrumentInstance = {
        id: number;
        model_name: string;
        category: string;
        price: number;
        in_stock: number;
    };
    const [instruments, setInstruments] = React.useState<InstrumentInstance[]>([]);
    React.useEffect(() => {
        (async () => {
            try {
                setInstruments(await ServerApi.getInstruments());
            } catch (error) {
                console.log();
            }
        })()
    }, [])
    return (
        <div className='catalog'>
            {instruments.map((value, _) => (
                <Instrument
                    key={value.id} 
                    model_name={value.model_name}
                    price={value.price}
                    in_stock={value.in_stock}
                    type={InstrumentCategory.Guitar}
                    image="./src/assets/guitar.png"
                />
            ))}
        </div>
    )
}