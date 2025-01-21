import { Instrument } from "./Instrument";
import { useStore } from "../store/MainStorage";

export function Catalog() {
    const store = useStore();
    return (
        <div className='catalog'>
            {store.instruments.map((value, _) => (
                <Instrument
                    key={value.id}
                    id={value.id}
                />
            ))}
        </div>
    )
}