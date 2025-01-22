import { ValidationField } from "./ValidationField"
import React from 'react';

export type ValidationFieldInstance = {
    validate: (data: string) => boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

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
                    fields.map(({className, ...value}, key) => {
                        return (
                            <ValidationField
                                {...value}
                                key={key}
                                className={`${className} auth-form__input`}
                                onError={onValidationError}
                                onPass={onValidationPass}
                            />
                        )
                    })
                }
            </div>
            {children}
        </form>
    )
}
