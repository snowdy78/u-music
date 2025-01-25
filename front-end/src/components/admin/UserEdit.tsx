import React from "react";
import { DataBaseUserInstance, ServerApi } from "../../server-api";
import { AdministratedPage } from "../AdministratedPage";
import { useParams } from "react-router";
import { ValidationFieldInstance, ValidationForm } from "../ValidationForm";

export function UserEdit() {
    const params = useParams<{id: string}>();
    const [user, setUser] = React.useState<DataBaseUserInstance | null>(null);
    const [error, setError] = React.useState<string>('');
    const [success, setSuccess] = React.useState<string>('');
    React.useEffect(() => {
        if (!params.id) 
            return;
        ServerApi.getUser({id: +params.id})
            .then(setUser)
            .catch(_ => {
                window.location.href = '/404';
            });
    }, []);
    const fields: ValidationFieldInstance[] = [
        {
            placeholder: "Фото профиля",
            name: 'image',
            type: 'file',
            validate: (_: string) => true
        },
        {
            placeholder: "Логин",
            name: 'login',
            type: 'text',
            value: user ? user.login : '',
            validate: (data: string) => data.length > 0
        },
        {
            placeholder: "Почта",
            name: 'email',
            type: 'email',
            value: user ? user.email : '',
            validate: (data: string) => data.length > 0
        },
        {
            placeholder: "Администратор?",
            name: 'is_admin',
            type: 'text',
            value: user ? user.is_admin.toString() : '',
            validate: (data: string) => data.length > 0
        }
    ];
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const form_data = new FormData(form);
        try {
            await ServerApi.actionWithImageUpload(
                form_data,
                'image',
                async (user_data: URLSearchParams) => {
                    if (!params.id) {
                        return;
                    }
                    user_data.append('id', params.id);
                    try {
                        await ServerApi.updateUser(user_data);
                        setError('');
                        setSuccess('Пользователь успешно обновлен');
                    } catch (err: any) {
                        setError(err.message);
                        setSuccess('');
                    }
                }
            );
        } catch (err: any) {
            setError(err.message);
            setSuccess('');
        }
    }
    return (
        <AdministratedPage>
            <ValidationForm
                header='Редактирование пользователя'
                fields={fields}
                onSubmit={onSubmit}
            >
                <button className='' type='submit'>
                    <img className='icon' src='/src/assets/icons/edit-primary.svg'/>
                    Редактирование
                </button>
            </ValidationForm>
            {
                success ? 
                <div className='pass-field'>{success}</div> :
                error ?
                <div className='fail-field'>{error}</div> :
                null
            }
        </AdministratedPage>
    )
}