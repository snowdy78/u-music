import React from 'react';
import { ClientPage } from "./ClientPage";
import { useParams } from "react-router";
import { Instrument as InstrumentComponent } from "./Instrument";
import { DataBaseInstrumentInstance, ServerApi } from "../server-api";
import { EInstrumentCategory } from "../store/Instrument";

export function InstrumentPage() {
    const { id } = useParams<{id: string}>();
    const [instrument, setInstrument] = React.useState<DataBaseInstrumentInstance | null>(null)
    const [image_data, setImageData] = React.useState<string>("");
    if (!id)
        return null;
    React.useMemo(async () => {
        try {
            const instrument_json = await ServerApi.getInstrument(+id);
            setInstrument(instrument_json);
            if (instrument_json.img_id === null) {
                return;
            }
            const image_json = await ServerApi.getImage(+instrument_json.img_id);
            setImageData(image_json.data);
        } catch (err) {
            window.location.href = "/404";
        }
    }, [])
    return (
        <ClientPage>
            { // TODO: change the view of instrument 
                instrument 
                ? 
                    <InstrumentComponent 
                        iid={instrument.id}
                        model_name={instrument.model_name}
                        price={instrument.price}
                        in_stock={instrument.in_stock}
                        image={image_data}
                        type={EInstrumentCategory.Guitar}
                    />
                : <></>
            }
            
        </ClientPage>
    )
}