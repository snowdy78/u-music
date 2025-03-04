import React from 'react';
import { ValidationForm } from "../ValidationForm";
import { AdministratedPage } from "../AdministratedPage";
import { ServerApi } from "../../server-api";
import { useParams } from "react-router";
import { EInstrumentCategory, IInstrument, Instrument } from "../../store/Instrument";
import { Instrument as InstrumentComponent } from "../Instrument";
import { arrayCategories } from "./Instruments";

export function InstrumentEdit() {
    const params = useParams<{id: string}>();
    const [error, setError] = React.useState<string>("");
    const [success, setSuccess] = React.useState<string>("");
    const [instrument_data, setInstrumentData] = React.useState<IInstrument | null>(null);
    const [image_data, setImageData] = React.useState<string>("");
    const fields = [
        {
            name: 'image',
            type: 'file',
            validate: (_: string) => true,
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
            placeholder: 'В наличии',
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
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        await ServerApi.actionWithImageUpload(
            formData,
            'image',
            async (form_data_without_image: URLSearchParams) => {
                if (params.id === undefined) {
                    return;
                }
                if (form_data_without_image.size === 1) {
                    setError('Пожалуйста измените данные');
                    return;
                }
                form_data_without_image.append('id', params.id);
                try {
                    await ServerApi.updateInstrument(form_data_without_image);
                    const instrument = await ServerApi.getInstrument(+params.id);
                    setInstrumentData(Instrument.create({
                        id: +instrument.id,
                        model_name: instrument.model_name,
                        category: instrument.category,
                        price: +instrument.price,
                        in_stock: +instrument.in_stock,
                        img_id: instrument.img_id === null ? null : +instrument.img_id
                    }))
                    setError('');
                    setSuccess("Данные успешно обновлены");
                } catch (e: any) {
                    setError(e.message);
                    setSuccess('');
                }
            }
        );
    } 
    return (
        <AdministratedPage>
            <div className='instrument-edit'>
                <div className='instrument-edit__left-part'>
                    <InstrumentComponent
                        iid={instrument_data ? instrument_data.id : -1}
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
                        encType="multipart/form-data"
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
                    {
                        error && <div className='fail-field'>{error}</div>
                    }
                    {
                        success && <div className='pass-field'>{success}</div>
                    }
                </div>
            </div>
        </AdministratedPage>
    );
}
