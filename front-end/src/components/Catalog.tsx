import { Instrument } from "./Instrument";
import { IInstrument } from "../store/Instrument";

export type Filters = {
    filter: (value: IInstrument) => boolean;
};

export type CatalogProps = {
    filters?: Filters;
    instruments: IInstrument[];
};

export function Catalog({ filters, instruments }: CatalogProps) {
    return (
        <div className='catalog'>
            {
                instruments.map(
                    (
                        value, 
                        key
                    ) => {
                        if (!filters || filters.filter(value)) {
                            return (
                                <Instrument
                                    key={`instrument:${key}`}
                                    model_name={value.model_name}
                                    price={value.price}
                                    in_stock={value.in_stock}
                                    image={value.img_data}
                                    type={value.category}
                                />
                            )
                        }
                        return <div key={key} style={{display: 'none'}}></div>;
                    }
                )
            }
        </div>
    )
}