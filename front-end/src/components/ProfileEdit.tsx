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
            name: 'image',
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
            validate: (data: string) => data.length >= 8 || data.length === 0,
            onPass,
            onFail
        },
        {
            placeholder: "Повторите пароль",
            name: 'password_repeat',
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
        if (!store.authorized_user) {
            window.location.href = '/auth';
            return;
        }
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        if (!password_is_valid.current) {
            setError('Пароли не совпадают');
            return;
        }
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
        const except = ['password_repeat', 'image'];
        formData.forEach((value, key) => {
            if (except.find(item => item === key) !== undefined || value === '' || value.toString() === user_array_data[key])
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