import { Link } from "react-router-dom";
import { ClientPage } from "./ClientPage"
import { ValidationForm, ValidationFieldInstance } from './ValidationForm';
import React from 'react';
import { ServerApi } from "../server-api";

export function Auth() {
    const can_be_submitted = React.useRef(false);
    const [error, setError] = React.useState('');
    const validation_form: ValidationFieldInstance[] = [
        {
            placeholder: "Login",
            name: 'login',
            type: 'text',
            validate: (data: string) => data.length > 0
        },
        {
            placeholder: "Password",
            name: 'password',
            type: 'password',
            validate: (data: string) => data.length >= 8
        }
    ]
    const onValidationError = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target instanceof Element) {
            if (event.target.classList.contains('validation-passed'))
                event.target.classList.remove('validation-passed');
            event.target.classList.add('validation-error');
            can_be_submitted.current = false;
        }
    }
    const onValidationPass = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target instanceof Element) {
            if (event.target.classList.contains('validation-error'))
                event.target.classList.remove('validation-error');
            event.target.classList.add('validation-passed');
            can_be_submitted.current = true;
        }
    }
    const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!can_be_submitted.current)
            return;
        const form_elements = event.target.elements as any;
        try {
            const user_json = await ServerApi.getUser({
                login: form_elements['login'].value,
                password: form_elements['password'].value
            });
            sessionStorage.setItem('authorized-user', JSON.stringify(user_json));
            window.location.href = '/';
        } catch (err: any) {
            setError(err.message);
        }
    }
    return (
        <ClientPage>
            <ValidationForm
                header="Вход"
                fields={validation_form}
                onValidationError={onValidationError}
                onValidationPass={onValidationPass}
                onSubmit={onSubmit}
            >
                <Link to="/register" className='forget-password'>Забыли пароль?</Link>
                <hr />
                <button type="submit">Войти</button>
            </ValidationForm>
            {
                error.length > 0
                    ?
                    <div className='fail-field'>
                        <p>{error}</p>
                    </div>
                    : null
            }

        </ClientPage>
    )
}
