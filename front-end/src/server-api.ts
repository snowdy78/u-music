export type ServerApiResponseError = {
  err_code: string;
};
export type DataBaseUserInstance = {
  id: number; login: string; email: string; password: string; is_admin: number;
  img_id: number | null;
};
export type DataBaseUserPossibleAttrs = {
  id?: number;
  login?: string;
  email?: string;
  password?: string;
  is_admin?: boolean;
  img_id?: number | null;
};
export type DataBaseInstrumentInstance = {
  id: number; model_name: string; category: string; price: number;
  in_stock: number;
  img_id: number | null;
};
export type DataBaseImageInstance = {
  id: number; name: string; data: string; type: string;
};
type RequestBodyInstance = Map<string, number|string|boolean|undefined|null>;
export class ServerApi {
  public static url = 'http://localhost:80/u-music';
  private static async get(url: string, body?: RequestBodyInstance) {
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
      },
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
  private static async post(
      url: string, body: URLSearchParams|FormData|FormDataEntryValue,
      headers: any = {'Content-Type': 'application/x-www-form-urlencoded'}) {
    const response = await fetch(url, {method: 'POST', headers, body})
    if (!response.ok) {
      throw new Error(`RequestError: ${response.status}`)
    }
    try {
      const blob = await response.blob();
      const text = await blob.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch(err: any) {
        console.error(text);
        throw new Error(err.message);
      }
      if (json.err_code) {
        throw new Error(json.err_code)
      };
      return json;
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
  public static async getInstruments(): Promise<DataBaseInstrumentInstance[]> {
    return await ServerApi.get(ServerApi.url + '/instruments');
  }
  public static async getUsers(): Promise<DataBaseUserInstance[]> {
    return await ServerApi.get(ServerApi.url + '/users');
  }
  public static async getImages(): Promise<DataBaseImageInstance[]> {
    return await ServerApi.get(ServerApi.url + '/images');
  }
  public static async postRegisterUser(body: URLSearchParams): Promise<{}> {
    return await ServerApi.post(ServerApi.url + '/user-register', body);
  }
  public static async addInstrument(body: URLSearchParams): Promise<{id: number}> {
    return await ServerApi.post(ServerApi.url + '/add-instrument', body);
  }
  public static async uploadImage(body: FormData|FormDataEntryValue):
  Promise<{img_id: string}> {
    return await ServerApi.post(ServerApi.url + '/upload-image', body, {});
  }
  public static async updateInstrument(body: URLSearchParams): Promise<{}> {
    return await ServerApi.post(ServerApi.url + '/update-instrument', body);
  }
  public static async updateUser(body: URLSearchParams): Promise<{}> {
    return await ServerApi.post(ServerApi.url + '/update-user', body);
  }
  public static async deleteImage(id: number) {
    const body: RequestBodyInstance = new Map();
    body.set('id', id);
    return await ServerApi.get(ServerApi.url + `/delete-image`, body);
  }
  public static async deleteUser(id: number) {
    const body: RequestBodyInstance = new Map();
    body.set('id', id);
    return await ServerApi.get(ServerApi.url + `/delete-user`, body);
  }
  public static async deleteInstrument(id: number) {
    const body: RequestBodyInstance = new Map();
    body.set('id', id);
    return await ServerApi.get(ServerApi.url + `/delete-instrument`, body);
  }
  public static async getImage(id: number):
      Promise<DataBaseImageInstance> {
    const map: RequestBodyInstance = new Map();
    map.set('id', id);
    return await ServerApi.get(ServerApi.url + '/image', map);
  }
  public static async getInstrument(id: number):
      Promise<DataBaseInstrumentInstance> {
    const map: RequestBodyInstance = new Map();
    map.set('id', id);
    return await ServerApi.get(ServerApi.url + '/instrument', map);
  }
  public static async getUser(body: DataBaseUserPossibleAttrs):
      Promise<DataBaseUserInstance> {
    const map: RequestBodyInstance = new Map();
    map.set('id', body.id);
    map.set('login', body.login);
    map.set('email', body.email);
    map.set('password', body.password);
    map.set('is_admin', body.is_admin);
    return await ServerApi.get(ServerApi.url + '/user', map);
  }
  public static async actionWithImageUpload(
    form_data: FormData,
    image_key: string,
    action: (without_img_data: URLSearchParams, img_id?: string) => Promise<void>
  ) {
    const image_data = new FormData();
    let img_id: string | undefined;
    const img = form_data.get('image');
    if (img && (img as File).size !== 0) {
      image_data.append(image_key, form_data.get(image_key) as File);
      img_id = (await ServerApi.uploadImage(image_data)).img_id;
    }
    form_data.delete(image_key);
    if (img_id !== undefined) {
      form_data.set('img_id', JSON.stringify(img_id));
    }
    const search_url = new URLSearchParams();
    form_data.forEach((value, key) => {
      search_url.append(key, value.toString());
    });
    return action(search_url);
  }
}