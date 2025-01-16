import React from 'react'
type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type ValidatableComponentProps = {
    validate: (data: string) => boolean;
    onError?: (data: ChangeEvent) => void;
    onPass?: (data: ChangeEvent) => void;
} & React.PropsWithChildren & React.RefAttributes<HTMLInputElement>;

export function ValidatableField(props: ValidatableComponentProps) {
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (props.validate(event.target.value) && props.onPass) {
            props.onPass(event);            
        } else if (props.onError) {
            props.onError(event);
        }
    }
    return (
        <div>
            <input type="text" onChange={handleChange} {...props} />
        </div>
    )
} 