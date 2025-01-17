import React from 'react'
import { ValidationForm, ValidationFieldInstance } from "./ValidationForm"
import { ClientPage } from "./ClientPage"
import { Link } from "react-router-dom";
import { on } from "events";


export function Register() {
    const [password, setPassword] = React.useState('');
    const can_be_submitted = React.useRef(false);
    const fields: ValidationFieldInstance[] = [
        {
            placeholder: "Login",
            input_type: 'text',
            validate: (data: string) => data.length > 0,
        },
        {
            placeholder: "Email",
            input_type: 'email',
            validate: (data: string) => data.length > 0,
        },
        {
            placeholder: "Password",
            input_type: 'password',
            validate: (data: string) => {
                setPassword(data)
                return data.length >= 8
            },
        },
        {
            placeholder: "Repeat password",
            input_type: 'password',
            validate: (data: string) => data.length >= 8 && data === password,
        },
    ];
    const onValidationError = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target instanceof Element) {
            if (event.target.classList.contains('validation-passed'))
                event.target.classList.remove('validation-passed');
            event.target.classList.add('validation-error');
        }
    }
    const onValidationPass = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target instanceof Element) {
            if (event.target.classList.contains('validation-error'))
                event.target.classList.remove('validation-error');
            event.target.classList.add('validation-passed');
        }
    }
    const onSubmit = () => {
        if (can_be_submitted.current) {
            console.log('submit');
        }
    }
    return (
        <ClientPage>
            <iframe name='dummyframe' style={{display: 'none'}}></iframe>
            <ValidationForm 
                action={'http://localhost:8800/users'}
                method='post'
                header="Регистрация"
                fields={fields}
                onValidationError={onValidationError}
                onValidationPass={onValidationPass}
                onSubmit={onSubmit}
            >
                <Link to='/auth'>Уже есть аккаунт?</Link>
                <hr />
                <button type='submit'>Регистрация</button>
            </ValidationForm>
        </ClientPage>
    )
}