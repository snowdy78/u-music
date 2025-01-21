import React from 'react';
import { ClientPage } from "./ClientPage";
import { useParams } from "react-router";
import { Instrument } from "./Instrument";


export function InstrumentPage() {
    const { id } = useParams<{id: string}>();
    if (!id)
        return null;
    return (
        <ClientPage>
            <Instrument id={+id}></Instrument>
        </ClientPage>
    )
}