
export class ServerApi 
{
    public static url = 'http://localhost:80/u-music'
    private static async get(url: string, body?: any) {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(body),
        })
        if (response.ok)
            return await response.json();
        throw new Error("error")
    }
    private static async post(url: string, body: any) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body
        })
        if (!response.ok)
            throw new Error(`RequestError: ${response.status}`)
        try {
            const json = await response.json();
            if (json.err_code)
                throw new Error(json.err_code);
            return json;
        } catch (e) {
            throw new Error(`${e}`)
        }
    }
    public static async getInstruments() {
        return await ServerApi.get(ServerApi.url + '/instruments');
    }
    public static async getUsers() {
        return await ServerApi.get(ServerApi.url + '/users');
    }
    public static async postRegisterUser(body: any) {
        return await ServerApi.post(ServerApi.url + '/user-register', body);
    }
}