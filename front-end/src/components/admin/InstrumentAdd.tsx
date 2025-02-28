import React from "react";
import { AdministratedPage } from "../AdministratedPage"
import { ValidationFieldInstance, ValidationForm } from "../ValidationForm";
import { arrayCategories } from "./Instruments";
import { ServerApi, ErrorResponse } from "../../server-api";

export function InstrumentAdd() {
    const can_be_submitted = React.useRef(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    function onFail(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target instanceof Element) {
            if (event.target.classList.contains('validation-passed'))
                event.target.classList.remove('validation-passed');
            event.target.classList.add('validation-error');
            can_be_submitted.current = false;
        }
    }
    function onPass(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target instanceof Element) {
            if (event.target.classList.contains('validation-error'))
                event.target.classList.remove('validation-error');
            event.target.classList.add('validation-passed');
        }
    }
    const fields: ValidationFieldInstance[] = [
        {
            placeholder: "Фото инструмента",
            name: "image_file",
            type: "file",
            validate: (data: string) => data.length > 0,
            onPass,
            onFail
        },
        {
            placeholder: "Модель",
            name: "model_name",
            type: "text",
            validate: (data: string) => data.length > 0,
            onPass,
            onFail
        },
        {
            placeholder: "Цена",
            name: "price",
            type: "number",
            validate: (data: string) => data.length > 0,
            onPass,
            onFail
        },
        {
            placeholder: "Количество",
            name: "in_stock",
            type: "number",
            validate: (data: string) => data.length > 0,
            onPass,
            onFail
        },
        {
            name: 'category',
            placeholder: 'Категория',
            list: "categories",
            validate: (data: string) => data.length > 0,
            onPass,
            onFail
        }
    ];
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!can_be_submitted.current){
            setError('Заполните все поля');
            return;
        }
        const form = event.target as HTMLFormElement;
        const form_data = new FormData(form);
        try {
            await ServerApi.actionWithImageUpload(
                form_data, 
                'image_file', 
                async (instrument_data: URLSearchParams) => {
                    try {
                        const response = await ServerApi.addInstrument(instrument_data);
                        console.log("response: ", response);
                        if (typeof response === 'object' && 'message' in response) {
                            setError(response.message);
                        } else {
                            setSuccess("Инструмент успешно добавлен");
                        }
                    } catch (e: any) {
                        setError(e.message);
                        setSuccess('');
                    }
                }
            );
        } catch (err: any) {
            setError(err.message);
        }
    }
    return (
        <AdministratedPage>
            <ValidationForm
                header="Добавление инструмента"
                fields={fields}
                onValidationPass={() => can_be_submitted.current = true}
                onValidationFail={() => can_be_submitted.current = false}
                encType="multipart/form-data"
                onSubmit={onSubmit}
            >
                <button type="submit">
                    Добавить
                </button>
            </ValidationForm>
            <datalist id='categories'>
                {
                    arrayCategories()
                        .map(category => <option key={category.value} value={category.value} />)
                }
            </datalist>
            {
                error.length > 0 ? <div className='fail-field'>{error}</div> : null
            }
            {
                success.length > 0 ? <div className='pass-field'>{success}</div> : null
            }
        </AdministratedPage>
    );
}