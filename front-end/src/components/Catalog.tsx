import { Instrument } from "./Instrument";
import { EInstrumentCategory, IInstrument } from "../store/Instrument";

export type Filters = {
    category_filter?: (value: EInstrumentCategory) => boolean;
    model_name_filter?: (value: string) => boolean;
    price_filter?: (value: number) => boolean;
    stock_filter?: (value: number) => boolean;
};

export type CatalogProps = {
    filters?: Filters;
    instruments: IInstrument[];
    onBought?: (instrument: IInstrument) => void;
};

export function Catalog({ filters, instruments, onBought }: CatalogProps) {
    return (
        <div className='catalog'>
            {
                instruments.map(
                    (
                        value,
                        key
                    ) => {
                        let satisfies = true;
                        const filter_attrs = {
                            category_filter: value.category,
                            model_name_filter: value.model_name,
                            price_filter: value.price,
                            stock_filter: value.in_stock
                        };
                        Object.keys(filters || {}).forEach(
                            (key: string, _: number) => {
                                if (filters) {
                                    const filter = filters[key as keyof Filters];
                                    const arg = filter_attrs[key as keyof Filters] as never;
                                    satisfies = satisfies && (filter === undefined || filter(arg));
                                }
                            }
                        )
                        if (satisfies) {
                            return (
                                <Instrument
                                    key={`instrument:${key}`}
                                    iid={value.id}
                                    model_name={value.model_name}
                                    price={value.price}
                                    in_stock={value.in_stock}
                                    image={value.img_data}
                                    type={value.category}
                                    onBought={() => onBought?.(value)}
                                />
                            )
                        }
                        return <div key={key} style={{ display: 'none' }}></div>;
                    }
                )
            }
        </div>
    )
}