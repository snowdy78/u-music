import React from 'react'
import { ValidationForm, ValidationFieldInstance } from "./ValidationForm"
import { ClientPage } from "./ClientPage"
import { Link } from "react-router-dom";
import { ServerApi } from "../server-api";

export function Register() {
    const [password, setPassword] = React.useState('');
    const can_be_submitted = React.useRef(false);
    const fields: ValidationFieldInstance[] = [
        {
            placeholder: "Login",
            input_type: 'text',
            name: 'login',
            validate: (data: string) => data.length > 0,
        },
        {
            placeholder: "Email",
            input_type: 'email',
            name: 'email',
            validate: (data: string) => data.length > 0,
        },
        {
            placeholder: "Password",
            input_type: 'password',
            name: 'password',
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
            can_be_submitted.current = false;
        }
    }
    const onValidationPass = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target instanceof Element) {
            if (event.target.classList.contains('validation-error'))
                event.target.classList.remove('validation-error');
            event.target.classList.add('validation-passed');
            can_be_submitted.current = true
        }
    }
    const onSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        if (can_be_submitted.current) {
            const form = event.target as HTMLFormElement;
            ServerApi.postRegisterUser({
                login: form.login.value,
                email: form.email.value,
                password: form.password.value
            }).then(() => {
                console.log("user registered!")
            }).catch(err => console.log(err));
        }
    }
    return (
        <ClientPage>
            <iframe name="dummyframe" style={{display: 'none'}}/>
            <ValidationForm 
                action={ServerApi.url + '/user-register'}
                target="dummyframe"
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