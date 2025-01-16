import React from "react";
import { InstrumentCategory } from "../instrument";
import { Instrument } from "./Instrument";

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
                const res = await axios.get("http://localhost:8800/instruments") as any 
                console.log(res.data);
                setInstruments([...res.data]);
            } catch (error) {
                console.log();
            }
        })()
    }, [])
    return (
        <div className='catalog'>
            {instruments.map((key, value) => (
                <Instrument
                    key={key} 
                    model_name={value.model_name}
                    price={1000}
                    in_stock={10}
                    type={InstrumentCategory.Guitar}
                    image="./src/assets/guitar.png"
                />
            ))}
        </div>
    )
}