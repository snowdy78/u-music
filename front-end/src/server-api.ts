import axios from "axios";

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
	id: number; name: string; blob: string; type: string;
};
export type DataBaseOrderInstance = {
	id: number; user_id: number; goods: {id: number, count: number}[];
};

type RequestBodyInstance = Map<string, number|string|boolean|undefined|null>;
export class ServerApi {
	public static url = 'http://u-music-api.ru';
	private static async get(request_address: string, body?: any) {
		let response: Axios.AxiosXHR<any> | undefined;
		try {
			response = await axios.get<any>(ServerApi.url + request_address, {params: body});
		} catch(err: any) {
			console.error(err.message);
			throw new Error(err.message);
		}
		const response_data = response.data;
		if (response_data !== undefined) { 
			if (response_data.data !== undefined) {
				return response_data.data;
			}
			return response_data;
		}
		return response;
	}
	private static async post(
			url: string, 
			body: URLSearchParams|FormData|FormDataEntryValue|JSON,
			headers: any = {'Content-Type': 'application/x-www-form-urlencoded'}
	) {
		let response: Axios.AxiosXHR<any> | undefined;
		try {
			response = await axios.post<any>(ServerApi.url + url, body, {headers});
		} catch (err: any) {
			console.error(err.message);
			throw new Error(err.message);
		}
		const response_data = response.data;
		if (response_data !== undefined) { 
			if (response_data.data !== undefined) {
				return response_data.data;
			}
			return response_data;
		}
		return response;
	}
	private static async put(
		url: string, 
		body: URLSearchParams|FormData|FormDataEntryValue|JSON,
		headers: any = {'Content-Type': 'application/x-www-form-urlencoded'}
	) {
		let response: Axios.AxiosXHR<any> | undefined;
		try {
			response = await axios.put(ServerApi.url + url, body, {headers});
		} catch (err: any) {
			console.error(err.message);
			throw new Error(err.message);
		}
		const response_data = response.data;
		if (response_data !== undefined) { 
			if (response_data.data !== undefined) {
				return response_data.data;
			}
			return response_data;
		}
		return response;
	}
	private static async delete(
		url: string,
		headers: any = {'Content-Type': 'application/json'}
	) {
		let response: Axios.AxiosXHR<any> | undefined;
		try {
			response = await axios.delete(ServerApi.url + url, {headers});
		} catch (err: any) {
			console.error(err.message);
			throw new Error(err.message);
		}
		return response.data;
	}
	public static async getInstruments(
			chunk_start: number = 0,
			chunk_end: number = 1): Promise<DataBaseInstrumentInstance[]> {
		const map: RequestBodyInstance = new Map();
		map.set('chunk_start', chunk_start);
		map.set('chunk_end', chunk_end);
		return await ServerApi.get('/instruments', map);
	}
	public static async getOrders(): Promise<DataBaseOrderInstance[]> {
		return await ServerApi.get('/orders');
	}
	public static async getUsers(): Promise<DataBaseUserInstance[]> {
		return await ServerApi.get('/users');
	}
	public static async getImages(): Promise<DataBaseImageInstance[]> {
		return await ServerApi.get('/images');
	}
	public static async postRegisterUser(body: URLSearchParams): Promise<{}> {
		return await ServerApi.post('/users', body);
	}
	public static async addInstrument(body: URLSearchParams):
			Promise<{id: number}> {
		return await ServerApi.post('/instruments', body);
	}
	public static async addOrder(body: URLSearchParams): Promise<{id: number}> {
		return await ServerApi.post('/orders', body);
	}
	public static async uploadImage(
		body: FormData|FormDataEntryValue
	): Promise<DataBaseImageInstance> {
		return await ServerApi.post('/images', body, {'Accept': 'application/json', 'Content-Type': 'multipart/form-data'});
	}
	public static async updateInstrument(id: number, body: URLSearchParams): Promise<DataBaseInstrumentInstance> {
		return await ServerApi.put(`/instruments/${id}`, body);
	}
	public static async updateUser(id: number, body: URLSearchParams): Promise<DataBaseUserInstance> {
		return await ServerApi.put(`/users/${id}`, body, {'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'});
	}
	public static async deleteImage(id: number) {
		return await ServerApi.delete(`/images/${id}`);
	}
	public static async deleteUser(id: number) {
		return await ServerApi.delete(`/users/${id}`);
	}
	public static async deleteOrder(id: number) {
		return await ServerApi.delete(`/orders/${id}`);
	}
	public static async deleteInstrument(id: number) {
		return await ServerApi.delete(`/instruments/${id}`);
	}
	public static async getImage(id: number): Promise<DataBaseImageInstance> {
		return await ServerApi.get(`/images/${id}`);
	}
	public static async getInstrument(id: number):
			Promise<DataBaseInstrumentInstance> {
		return await ServerApi.get(`/instruments/${id}`);
	}
	public static async getOrder(id: number): Promise<DataBaseOrderInstance> {
		return await ServerApi.get(`/instruments/${id}`);
	}
	public static async getTotalNumberOfInstruments(): Promise<{count: number}> {
		return await ServerApi.get('/count-instruments');
	}
	public static async getUser(attrs: DataBaseUserPossibleAttrs):
			Promise<DataBaseUserInstance | null> {
		if (attrs.id) {
			return await ServerApi.get(`/users/${attrs.id}`);
		}
		if (attrs.password) {
			if (attrs.login)
				return await ServerApi.get(`/login-user/${attrs.login}/${attrs.password}`);
			if (attrs.email)
				return await ServerApi.get(`/login-user/${attrs.email}/${attrs.password}`);
		}
		return null;
	}
	public static async actionWithImageUpload(
			form_data: FormData, image_key: string,
			action: (without_img_data: URLSearchParams, img_id?: string) =>
					Promise<void>) {
		const image_data = new FormData();
		let img_id: number|undefined;
		const img = form_data.get(image_key);
		if (img && (img as File).size !== 0) {
			image_data.append(image_key, form_data.get(image_key) as File);
			const response = await ServerApi.uploadImage(image_data);
			console.log('response: ', response);
			img_id = response.id;
			console.log('img_id: ', img_id);
		}
		form_data.delete(image_key);
		if (img_id !== undefined) {
			form_data.set('img_id', JSON.stringify(img_id));
		}
		const search_url = new URLSearchParams();
		form_data.forEach((value, key) => {
			search_url.set(key, value as string);
		});
		return action(search_url);
	}
}