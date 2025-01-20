import React from 'react'
type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export type InputProps = React.RefAttributes<HTMLInputElement> & React.InputHTMLAttributes<HTMLInputElement>;
export type ValidationFieldProps = {
    validate: (data: string) => boolean;
    onError?: (data: ChangeEvent) => void;
    onPass?: (data: ChangeEvent) => void;
} & React.PropsWithChildren & InputProps;

export function ValidationField({
    className,
    children,
    validate,
    onError,
    onPass,
    ...props
}: ValidationFieldProps) {
    const handleChange = (event: ChangeEvent) =>
        validate(event.target.value)
            ? onPass?.(event)
            : onError?.(event)

    return (
        <div className='validation-field__container'>
            <input
                {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                className={`validation-field__input ${className}`}
                onChange={(event: ChangeEvent) => {
                    props.onChange?.(event);
                    handleChange(event)
                }}
            />
        </div>
    )
}