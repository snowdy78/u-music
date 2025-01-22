import { useMemo } from 'react';
import { PropsWithChildren } from "react";
import { ClientPage } from "./ClientPage";
import { useStore } from "../store/hooks/useStore";

export function AuthorizedPage({ children }: PropsWithChildren) {
    const store = useStore();
    useMemo(() => {
        if (store.authorized_user === null) {
            window.location.href="/auth";
        }
    }, []);
    
    return (
        <ClientPage>
            {children}
        </ClientPage>
    )
}
