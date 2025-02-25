import React from 'react';
import { ClientPage } from "./components/ClientPage";
import { ServerApi } from "./server-api";
import axios from "axios";

export function Test() {
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        axios.post(ServerApi.url + "/images", {}, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
            x => {
                setUser((x.data as any).data)
            }
        ).catch(err => {
            console.error(err);
        });
    }, []);
    React.useEffect(() => {
        console.log(user);
        
    }, [user]);

    return (
        <ClientPage>
            <form encType="multipart/form-data">
                <input type="file" name="image_file" id="" />
            </form>
            <code>
                {JSON.stringify(user)}
            </code>
        </ClientPage>
    );
}