import { useMemo } from 'react';
import { PropsWithChildren } from "react";
import { ClientPage } from "./ClientPage";
import { useStore } from "../store/hooks/useStore";

export function AdministratedPage({ children }: PropsWithChildren) {
    const store = useStore();
    useMemo(() => {
        if (store.authorized_user === null || !store.authorized_user.is_admin) {
            window.location.href="/auth";
        }
    }, []);
    
    return (
        <ClientPage>
            {children}
        </ClientPage>
    )
}
