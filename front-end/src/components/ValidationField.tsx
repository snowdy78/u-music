import React from 'react'
type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export type InputProps = React.RefAttributes<HTMLInputElement> & React.InputHTMLAttributes<HTMLInputElement>;
export type ValidationFieldProps = {
    validate: (data: string) => boolean;
    onFail?: (data: ChangeEvent) => void;
    onPass?: (data: ChangeEvent) => void;
} & React.PropsWithChildren & InputProps;

export function ValidationField({
    className,
    value,
    children,
    validate,
    onChange,
    onFail,
    onPass,
    ...props
}: ValidationFieldProps) {
    const [inputValue, setInputValue] = React.useState<string | null>(null);
    const handleChange = (event: ChangeEvent) => {
        validate(event.target.value)
            ? onPass?.(event)
            : onFail?.(event);
        setInputValue(event.target.value);
    }
    return (
        <div className='validation-field__container'>
            <input
                {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                className={`validation-field__input` + (className === undefined ? "" : " " + className)}
                value={inputValue === null ? value : inputValue}
                onChange={(event: ChangeEvent) => {
                    onChange?.(event);
                    handleChange(event)
                }}
            />
        </div>
    )
}