
export type RegistrationInstance = {
    login: string;
    email: string;
    password: string;
}

export class ServerApi 
{
    public static url = 'http://localhost:80/u-music'
    private static async get(url: string) {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.ok)
            return await response.json();
        throw new Error("error")
    }
    private static async post(url: string, body: any) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body
        })
        if (response.ok)
            return await response.json();
        throw new Error("error")
    }
    public static async getInstruments() {
        return await ServerApi.get(ServerApi.url + '/instruments');
    }
    public static async getUsers() {
        return await ServerApi.get(ServerApi.url + '/users');
    }
    public static async postRegisterUser(body: RegistrationInstance) {
        return await ServerApi.post(ServerApi.url + '/user-register', body);
    }
}