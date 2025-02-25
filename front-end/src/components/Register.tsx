import React from 'react'
import { ValidationFieldInstance, ValidationForm } from "./ValidationForm"
import { ClientPage } from "./ClientPage"
import { Link } from "react-router-dom";
import { ServerApi } from "../server-api";

export function Register() {
    const [password, setPassword] = React.useState('');
    const can_be_submitted = React.useRef(false);
    const [is_registered, setIsRegistered] = React.useState(false);
    const [error, setError] = React.useState('');
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
            can_be_submitted.current = true
        }
    }
    const fields: ValidationFieldInstance[] = [
        {
            placeholder: "Login",
            type: 'text',
            name: 'login',
            validate: (data: string) => data.length > 0,
            onFail,
            onPass
        },
        {
            placeholder: "Email",
            type: 'email',
            name: 'email',
            validate: (data: string) => data.length > 0,
            onFail,
            onPass
        },
        {
            placeholder: "Password",
            type: 'password',
            name: 'password',
            validate: (data: string) => {
                setPassword(data)
                return data.length >= 8
            },
            onFail,
            onPass
        },
        {
            placeholder: "Repeat password",
            type: 'password',
            name: 'password_confirmation',
            validate: (data: string) => data === password,
            onFail,
            onPass
        },
    ];
    const onValidationFail = () => {
        can_be_submitted.current = false
    }
    const onValidationPass = () => {
        can_be_submitted.current = true
    }
    const beforeSubmit = (event: React.MouseEvent) => {
        if (can_be_submitted.current) {
            return;
        }
        event.preventDefault();
    }
    const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target;
        const data = new URLSearchParams();
        const form_data = new FormData(form);
        for (const pair of form_data) {
            data.append(pair[0], pair[1].toString());
        }
        try {
            await ServerApi.postRegisterUser(data);
            setIsRegistered(true);
            setError('');
        } catch (err: any) {
            setError(`${err.name}: ${err.message}`);
            setIsRegistered(false);
        }
    }
    return (
        <ClientPage>
            <iframe name="dummy-frame" style={{ display: 'none' }} />
            <ValidationForm
                header="Регистрация"
                target="dummy-frame"
                fields={fields}
                onValidationFail={onValidationFail}
                onValidationPass={onValidationPass}
                onSubmit={onSubmit}
            >
                <Link to='/auth'>Уже есть аккаунт?</Link>
                <hr />
                <button type='submit' onClick={beforeSubmit}>Регистрация</button>
            </ValidationForm>
            {
                is_registered
                ?   <div className="pass-field">
                        <p>Аккаунт успешно создан:&nbsp;</p>
                        <Link to='/auth'>Войти</Link>
                    </div>
                :   <></>
            }
            {
                error !== '' 
                ?   <div className='fail-field'>
                        <p>{error}</p>
                    </div> 
                :   <></>
            }
        </ClientPage>
    )
}