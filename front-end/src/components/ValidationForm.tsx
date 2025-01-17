import { ValidationField } from "./ValidationField"
import React from 'react';

export type ValidationFieldInstance = {
    placeholder: string;
    input_type: string;
    validate: (data: string) => boolean;
}

export type ValidationFormProps = {
    header?: string;
    fields: ValidationFieldInstance[];
    onValidationError?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onValidationPass?: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & React.PropsWithChildren & React.HTMLProps<HTMLFormElement>

export function ValidationForm({ 
    children, 
    header, 
    fields, 
    onValidationPass, 
    onValidationError,
    ...props 
}: ValidationFormProps) {
    return (
        <form {...props} className='auth-form'>
            <h3>{header}</h3>
            <div className="auth-form__input-fields">
                {
                    fields.map((value, key) => (
                        <ValidationField
                            key={key}
                            name={value.placeholder.toLocaleLowerCase()}
                            className='auth-form__input'
                            placeholder={value.placeholder}
                            type={value.input_type}
                            validate={value.validate}
                            onError={onValidationError}
                            onPass={onValidationPass}
                        />
                    ))
                }
            </div>
            {children}
        </form>
    )
}
