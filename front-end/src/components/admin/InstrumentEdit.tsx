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
            name: 'image_file',
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
            setImageData(image.blob);
        });
    }, []);
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        await ServerApi.actionWithImageUpload(
            formData,
            'image_file',
            async (form_data_with_image_id: URLSearchParams) => {
                if (params.id === undefined) {
                    return;
                }
                const not_changed_keys = [];
                for (const [key, value] of form_data_with_image_id) {
                    if (!value || (instrument_data as any)[key] == value) {
                        not_changed_keys.push(key);
                    }
                }
                if (not_changed_keys.length === form_data_with_image_id.size) {
                    setError('Пожалуйста измените данные');
                    return;
                }
                for (const key of not_changed_keys) {
                    form_data_with_image_id.delete(key);
                }
                try {
                    const instrument = await ServerApi.updateInstrument(+params.id, form_data_with_image_id);
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
