import { Link } from "react-router-dom";
import { ClientPage } from "./ClientPage"
import { ValidationForm, ValidationFieldInstance } from './ValidationForm';

import React from 'react';

export function Auth() {
    const validation_form: ValidationFieldInstance[] = [
        {
            placeholder: "Login",
            input_type: 'text',
            validate: (data: string) => data.length > 0
        },
        { 
            placeholder: "Password",
            input_type: 'password',
            validate: (data: string) => data.length >= 8
        }
    ]
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
    return (
        <ClientPage>
            <ValidationForm header="Вход" fields={validation_form} onValidationError={onValidationError} onValidationPass={onValidationPass}>
                
                <Link to="/register" className='forget-password'>Забыли пароль?</Link>
                <hr />
                <button>Войти</button>
            </ValidationForm>
        </ClientPage>
    )
}
