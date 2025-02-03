import { Instrument } from "./Instrument";
import { EInstrumentCategory, IInstrument } from "../store/Instrument";
import ReactPaginate from 'react-paginate';
import React from "react";

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
    onPageChange?: (page: number) => void;
    totalInstruments: number;
    chunkSize: number;
};

export function Catalog({ filters, instruments, onBought, onPageChange, totalInstruments, chunkSize }: CatalogProps) {
    const [pageCount, setPageCount] = React.useState<number>(1);
    React.useEffect(() => {
        setPageCount(Math.ceil(totalInstruments / chunkSize));
    }, [instruments]);
    return (
        <div className='catalog'>
            <div className='catalog-items'>
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
            <ReactPaginate 
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={(item: {selected: number}) => onPageChange?.(item.selected + 1)}
                containerClassName="pagination"
                pageClassName="pagination__page"
                pageLinkClassName="pagination__page pagination__page-link"
                previousClassName="pagination__page pagination__previous-page"
                previousLinkClassName="pagination__page-link pagination__previous-page-link"
                nextClassName="pagination__page pagination__next-page"
                nextLinkClassName="pagination__page-link pagination__next-page-link"
                breakClassName="pagination__page pagination__break-page-item"
                breakLinkClassName="pagination__page pagination__break-page-link"
                activeClassName="pagination__active"
                disabledClassName="pagination__disabled"
                renderOnZeroPageCount={null}
            />
        </div>
    )
}