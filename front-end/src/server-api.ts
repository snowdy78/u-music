export type ServerApiResponseError = {
  err_code: string;
};
export type DataBaseUserInstance = {
  id: number; login: string; email: string; password: string; is_admin: number;
};
export type DataBaseUserPossibleAttrs = {
  id?: number;
  login?: string;
  email?: string;
  password?: string;
  is_admin?: boolean;
}

export class ServerApi {
  public static url = 'http://localhost:80/u-music';
  private static async get(
      url: string, body?: Map<string, number|string|boolean|undefined>) {
    if (body && body.size > 0) {
      url += '?'
      body.forEach((value, key) => {
        if (value) url += `${key}=${value}&`
      })
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
    if (response.ok) {
      try {
        const json = await response.json();
        if (json.err_code) throw new Error(json.err_code);
        return json;
      } catch (e) {
        throw new Error(`${e}`)
      }
    }
    throw new Error('error')
  }
  private static async post(url: string, body: URLSearchParams) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body
    })
    if (!response.ok) {
      throw new Error(`RequestError: ${response.status}`)
    }
    try {
      const json = await response.json();
      if (json.err_code) throw new Error(json.err_code);
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
  public static async postRegisterUser(body: URLSearchParams): Promise<{}> {
    return await ServerApi.post(ServerApi.url + '/user-register', body);
  }
  public static async getUser(body: DataBaseUserPossibleAttrs):
      Promise<DataBaseUserInstance> {
    const map: Map<string, number|string|boolean|undefined> = new Map();
    map.set('id', body.id);
    map.set('login', body.login);
    map.set('email', body.email);
    map.set('password', body.password);
    map.set('is_admin', body.is_admin);
    return await ServerApi.get(ServerApi.url + '/user', map);
  }
}