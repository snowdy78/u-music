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
	id: number; name: string; data: string; type: string;
};
export type DataBaseOrderInstance = {
	id: number; user_id: number; goods: {id: number, count: number}[];
};

type RequestBodyInstance = Map<string, number|string|boolean|undefined|null>;
export class ServerApi {
	public static url = 'http://u-music-api.ru';
	private static async get(request_address: string, body?: any) {
		let full_url = `${ServerApi.url}${request_address}`;
		const response = await fetch(full_url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body
		})
		if (response.ok) {
			try {
				const json = await response.json();
				if (json.err_code) throw new Error(json.err_code);
				return json.data;
			} catch (e) {
				throw new Error(`${e}`)
			}
		}
		throw new Error('error');
	}
	private static async post(
			url: string, 
			body: URLSearchParams|FormData|FormDataEntryValue,
			headers: any = {Accept: 'application/json', 'Content-Type': 'application/json'}
	) {
		url = `${ServerApi.url}${url}`;
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
			} catch (err: any) {
				console.error(text);
				throw new Error(err.message);
			}
			if (json.err_code) {
				throw new Error(json.err_code)
			};
			return json.data;
		} catch (e: any) {
			throw new Error(e.message)
		}
	}
	private static async put(
		url: string, 
		body: URLSearchParams|FormData|FormDataEntryValue,
		headers: any = {Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
	) {
		url = `${ServerApi.url}${url}`;
		const response = await fetch(url, {method: 'PUT', headers, body})
		if (!response.ok) {
			throw new Error(`RequestError: ${response.status}`)
		}
		try {
			const blob = await response.blob();
			const text = await blob.text();
			let json: any;
			try {
				json = JSON.parse(text);
			} catch (err: any) {
				console.error(text);
				throw new Error(err.message);
			}
			if (json.err_code) {
				throw new Error(json.err_code)
			};
			return json.data;
		} catch (e: any) {
			throw new Error(e.message)
		}
	}
	private static async delete(
		url: string,
		headers: any = {Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
	) {
		url = `${ServerApi.url}${url}`;
		const response = await fetch(url, {method: 'DELETE', headers});
		if (!response.ok) {
			throw new Error(`RequestError: ${response.status}`)
		}
		try {
			const blob = await response.blob();
			const text = await blob.text();
			let json: any;
			try {
				json = JSON.parse(text);
			} catch (err: any) {
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
	): Promise<{img_id: string}> {
		return await ServerApi.post('/images', body);
	}
	public static async updateInstrument(id: number, body: URLSearchParams): Promise<DataBaseInstrumentInstance> {
		return await ServerApi.put(`/instruments/${id}`, body);
	}
	public static async updateUser(id: number, body: URLSearchParams): Promise<DataBaseUserInstance> {
		return await ServerApi.put(`/users/${id}`, body);
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
		let img_id: string|undefined;
		const img = form_data.get('image');
		if (img && (img as File).size !== 0) {
			image_data.append(image_key, form_data.get(image_key) as File);
			img_id = (await ServerApi.uploadImage(image_data)).img_id;
			console.log(img_id);
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