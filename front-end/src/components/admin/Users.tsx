import { ContentComponentProps } from "./Admin";

export function UsersRouting({name, header, ...props}: ContentComponentProps): React.JSX.Element {
    return (
        <h3
            {...props}
        >
            {header}
        </h3>
    );
};
