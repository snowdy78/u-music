
export class ServerApi 
{
    public static url = 'http://localhost:80/u-music'
    public static instrumentsUrl = ServerApi.url + '/instruments';
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
    public static async getInstruments() {
        return await ServerApi.get(ServerApi.instrumentsUrl);
    }
}