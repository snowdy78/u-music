import { ValidationField } from "./ValidationField"
import React from 'react';

export type ValidationFieldInstance = {
    validate: (data: string) => boolean;
    onFail?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPass?: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export type ValidationFormProps = {
    header?: string;
    fields: ValidationFieldInstance[];
    onValidationFail?: () => void;
    onValidationPass?: () => void;
} & React.PropsWithChildren & React.HTMLProps<HTMLFormElement>

export function ValidationForm({ 
    children, 
    header, 
    fields, 
    onValidationPass, 
    onValidationFail,
    ...props 
}: ValidationFormProps) {
    const [validated, setValidated] = React.useState<boolean[]>(new Array<boolean>().fill(false, 0, fields.length));
    React.useMemo(() => {
        if (validated.every(valid => valid)) {
            onValidationPass?.();
        } else {
            onValidationFail?.();
        }
    }, [validated]);
    function parseValidation(validate: (data: string) => boolean, data: string) {
        const index = fields.findIndex(field => field.validate === validate);
        if (index !== -1) {
            const new_validated = [...validated];
            new_validated[index] = validate(data);
            setValidated(new_validated);
            return new_validated[index];
        }
        return validate(data);
    }
    return (
        <form {...props} className='auth-form'>
            <h3>{header}</h3>
            <div className="auth-form__input-fields">
                {
                    fields.map(({className, validate, ...value}, key) => {
                        return (
                            <ValidationField
                                {...value}
                                key={key}
                                className={`auth-form__input` + (className !== undefined ? ` ${className}` : '')}
                                validate={(data: string) => parseValidation(validate, data)}
                            />
                        )
                    })
                }
            </div>
            {children}
        </form>
    )
}
