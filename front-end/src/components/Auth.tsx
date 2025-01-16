import { ClientPage } from "./ClientPage"
import { ValidatableField } from "./ValidatableField"

export function Auth() {
    return (
        <ClientPage>
            <form>
                <label htmlFor='1'>
                    Login or Email
                </label>
                <ValidatableField validate={(data: string) => data.length > 0}/>
                <label htmlFor="2">
                    Password
                </label>
                
            </form>
        </ClientPage>
    )
}
