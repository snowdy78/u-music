import React from 'react';
import { ValidationFieldInstance, ValidationForm } from "./ValidationForm";
import { AuthorizedPage } from "./AuthorizedPage";
import { ServerApi } from "../server-api";
import { useStore } from "../store/hooks/useStore";

export function ProfileEdit() {
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const password_is_valid = React.useRef(true);
    const store = useStore();
    if (store.authorized_user === null) {
        return null;
    }
    const onFail = (event: React.ChangeEvent<HTMLInputElement>) => {
        const field = validation_form_fields.find(field => field.name === event.target.name);
        if (field === undefined)
            return;
        if (event.target instanceof Element) {
            if (event.target.classList.contains('validation-passed'))
                event.target.classList.remove('validation-passed');
            if (field.value !== event.target.value)
                event.target.classList.add('validation-error');
        }
    }
    const onPass = (event: React.ChangeEvent<HTMLInputElement>) => {
        const field = validation_form_fields.find(field => field.name === event.target.name);
        if (field === undefined)
            return;
        if (event.target instanceof Element) {
            if (event.target.classList.contains('validation-error'))
                event.target.classList.remove('validation-error');
            if (field.value !== event.target.value)
                event.target.classList.add('validation-passed');
        }
    }
    const validation_form_fields: ValidationFieldInstance[] = [
        {
            placeholder: "Фото профиля",
            name: 'image_file',
            id: 'avatar-upload',
            type: 'file',
            maxLength: 1024000,
            validate: () => true,
            onPass,
            onFail
        },
        {
            placeholder: "Логин",
            name: 'login',
            type: 'text',
            value: store.authorized_user.login,
            validate: (data: string) => data.length > 0 && store.authorized_user?.login !== data,
            onPass,
            onFail
        },
        {
            placeholder: "Email",
            name: 'email',
            type: 'email',
            value: store.authorized_user.email,
            validate: (data: string) => data.length > 0 && store.authorized_user?.email !== data,
            onPass,
            onFail
        },
        {
            placeholder: "Пароль",
            name: 'password',
            type: 'password',
            className: 'input_password',
            validate: (data: string) => {
                const password = document.querySelector('.input_repeat-password') as HTMLInputElement;
                const valid = data.length >= 8;
                password_is_valid.current = valid && password.value === data;
                return valid;
            },
            onPass,
            onFail
        },
        {
            placeholder: "Повторите пароль",
            name: 'password_confirmation',
            className: 'input_repeat-password',
            type: 'password',
            validate: (data: string) => {
                const password = document.querySelector('.input_password') as HTMLInputElement;
                const valid = password.value === data;
                password_is_valid.current = valid;
                return valid;
            },
            onPass,
            onFail
        },
    ];
    async function onSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!store.authorized_user) {
            window.location.href = '/auth';
            return;
        }
        if (!password_is_valid.current) {
            setError('Пароли не совпадают');
            return;
        }
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        await ServerApi.actionWithImageUpload(
            formData, 
            'image_file', 
            async (user_data: URLSearchParams) => {
                if (!store.authorized_user) {
                    return;
                }
                user_data.delete('password_confirmation');
                const keys: string[] = [];
                user_data.forEach((value, key) => {                    
                    if (!!value && value !== (store.authorized_user as any)[key]) {
                        return;
                    }
                    keys.push(key);
                });
                
                for (let i = 0; i < keys.length; i++) {
                    user_data.delete(keys[i]);
                }
                if (user_data.size === 1 && user_data.get('img_id') === undefined) {
                    setError("Пожалуйста измените данные");
                    return;
                }
                try {
                    for (const [key, value] of user_data) {
                        console.log('max', key, value);
                    }
                    const user_json = await ServerApi.updateUser(store.authorized_user.id, user_data);
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
        );
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