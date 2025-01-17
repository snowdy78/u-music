import React from 'react'
type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export type ValidationFieldProps = {
    validate: (data: string) => boolean;
    onError?: (data: ChangeEvent) => void;
    onPass?: (data: ChangeEvent) => void;
} & React.PropsWithChildren & React.RefAttributes<HTMLInputElement> & React.InputHTMLAttributes<HTMLInputElement>;

export const ValidationField = function (props: ValidationFieldProps) {
    const handleChange = (event: ChangeEvent) =>
        props.validate(event.target.value)
            ? props.onPass?.(event)
            : props.onError?.(event)

    return (
        <div className='validation-field__container'>
            <input
                {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                className={`validation-field__input ${props.className}`}
                onChange={(event: ChangeEvent) => {
                    props.onChange?.(event);
                    handleChange(event)
                }}
            />
        </div>
    )
}