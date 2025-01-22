import React from 'react';
import { ValidationFieldInstance, ValidationForm } from "./ValidationForm";
import { AuthorizedPage } from "./AuthorizedPage";
import { ServerApi } from "../server-api";
import { useStore } from "../store/hooks/useStore";

export function ProfileEdit() {
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const store = useStore();
    if (store.authorized_user === null) {
        return null;
    }
    const validation_form_fields: ValidationFieldInstance[] = [
        {
            placeholder: "Фото профиля",
            name: 'image',
            id: 'avatar-upload',
            type: 'file',
            maxLength: 1024000,
            validate: () => true
        },
        {
            placeholder: "Логин",
            name: 'login',
            type: 'text',
            value: store.authorized_user.login,
            validate: (data: string) => data.length > 0,
        },
        {
            placeholder: "Email",
            name: 'email',
            type: 'email',
            value: store.authorized_user.email,
            validate: (data: string) => data.length > 0
        },
        {
            placeholder: "Пароль",
            name: 'password',
            type: 'password',
            validate: (data: string) => data.length >= 8
        },
        {
            placeholder: "Повторите пароль",
            name: 'password_repeat',
            type: 'password',
            validate: (data: string) => data.length >= 8
        },
    ];
    async function onSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        if (!store.authorized_user) {
            window.location.href = '/auth';
            return;
        }
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const user_data = new URLSearchParams();
        user_data.append('id', store.authorized_user.id);
        let image_id: string | undefined;
        const img = formData.get('image');
        if (img && (img as File).size !== 0) {
            const image_data = new FormData();
            image_data.append('image', img as File);
            image_id = (await ServerApi.uploadImage(image_data)).img_id;
        }
        const user_array_data: any = {
            ...store.authorized_user,
        };
        formData.forEach((value, key) => {
            if (key === 'image' || value === '' || value.toString() === user_array_data[key])
                return;
            user_data.append(key, value.toString());
        });
        if (image_id !== undefined)
            user_data.append('img_id', JSON.stringify(image_id));
        if (user_data.size === 1) {
            setError("Пожалуйста измените данные");
            return;
        }
        try {
            await ServerApi.updateUser(user_data);
            const user_json = await ServerApi.getUser({id: +store.authorized_user.id});
            sessionStorage.removeItem('authorized-user');
            sessionStorage.setItem('authorized-user', JSON.stringify({
                ...user_json,
            }));
            setError('');
            setSuccess("Данные успешно обновлены");
        } catch (e: any) {
            setError(e.message);
            setSuccess('');
        }
    }
    return (
        <AuthorizedPage>
            <iframe name="dummy-frame" style={{display: 'none'}}></iframe>
            <ValidationForm 
                header="Редактирование профиля"
                fields={validation_form_fields}
                onSubmit={onSubmit}
                encType="multipart/form-data"
            >
                <button type='submit'>
                    <img className='icon' src='/src/assets/icons/edit-primary.svg'/>
                    Редактировать
                </button>
            </ValidationForm>
            {
                success === '' 
                    ? null 
                    :
                        <div className='pass-field'>{success}</div>
            }
            {
                error === '' 
                    ? null 
                    :
                        <div className='fail-field'>{error}</div>

            }
        </AuthorizedPage>
    );
}