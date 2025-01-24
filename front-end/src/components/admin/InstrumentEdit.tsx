import React from 'react';
import { ValidationForm } from "../ValidationForm";
import { AdministratedPage } from "../AdministratedPage";
import { ServerApi } from "../../server-api";
import { useParams } from "react-router";
import { EInstrumentCategory, IInstrument, Instrument } from "../../store/Instrument";
import { Instrument as InstrumentComponent } from "../Instrument";

function arrayCategories() {
    const categories = [];
    for (let category in EInstrumentCategory) {
        categories.push({value: category});
    }
    return categories;
}

export function InstrumentEdit() {
    const params = useParams<{id: string}>();
    const [instrument_data, setInstrumentData] = React.useState<IInstrument | null>(null);
    const [image_data, setImageData] = React.useState<string>("");
    const fields = [
        {
            name: 'image',
            type: 'file',
            validate: (data: string) => true,
        },
        {
            name: 'model_name',
            placeholder: 'Название модели',
            type: 'text',
            value: instrument_data?.model_name,
            validate: (data: string) => data.length > 0
        },
        {
            name: 'price',
            placeholder: 'Цена',
            type: 'number',
            value: instrument_data?.price,
            validate: (data: string) => data.length > 0
        },
        {
            name: 'in_stock',
            placeholder: 'в наличии',
            type: 'number',
            value: instrument_data?.in_stock,
            validate: (data: string) => data.length > 0
        },
        {
            name: 'category',
            placeholder: 'Категория',
            value: instrument_data?.category,
            list: "categories",
            validate: (data: string) => data.length > 0
        }
    ];
    React.useEffect(() => {
        if (!params.id) 
            return;
        ServerApi.getInstrument(+params.id).then(async (res) => {
            setInstrumentData(Instrument.create({
                id: +res.id,
                model_name: res.model_name,
                category: res.category,
                price: +res.price,
                in_stock: +res.in_stock,
                img_id: res.img_id === null ? null : +res.img_id
            }));
            if (res.img_id === null)
                return;
            const image = await ServerApi.getImage(+res.img_id);
            setImageData(image.data);
        });
    }, []);
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
    } 
    return (
        <AdministratedPage>
            <div className='instrument-edit'>
                <div className='instrument-edit__left-part'>
                    <InstrumentComponent
                        model_name={instrument_data ? instrument_data.model_name : ''}
                        price={instrument_data ? instrument_data.price : -1}
                        in_stock={instrument_data ? instrument_data.in_stock : -1}
                        type={instrument_data ? instrument_data.category : EInstrumentCategory.Guitar}
                        image={image_data}
                    />
                </div>
                <div className='instrument-edit__right-part'>
                    <ValidationForm
                        header='Изменение инструмента'
                        fields={fields}
                        onValidationFail={() => {}}
                        onValidationPass={() => {}}
                        onSubmit={onSubmit}
                    >
                        <button type="submit">
                            Изменить
                        </button>
                    </ValidationForm>
                    <datalist id='categories'>
                        {
                            arrayCategories()
                                .map(category => <option key={category.value} value={category.value}/>)
                        }
                    </datalist>
                </div>
            </div>
        </AdministratedPage>
    );
}
