// import { Agent as HttpAgent } from "http";
// import { Agent as HttpsAgent } from "https";

import fetch from "cross-fetch";
import { resolveApiErrorClass } from "./errors";

declare const process: { env: Record<string, string | undefined> };
const apiUrl = process.env.API_URL || "http://localhost:8000/api/v1";

export const TOKEN_COOKIE = "authToken";
export const TOKEN_HEADER = "Authorization";

// const httpAgent = new HttpAgent({ keepAlive: true });
// const httpsAgent = new HttpsAgent({ keepAlive: true });

// function getAgent(url: string) {
// 	return url.startsWith("https:") ? httpsAgent : httpAgent;
// }

const resolveHeaders = (options: NonNullable<Parameters<typeof fetch>[1]>) => {
	const headers = options.headers || {};
	if (options.body) {
		return {
			...headers,
			"content-type": "application/json",
		};
	}
	return headers;
};

const resolveBody = (options: NonNullable<Parameters<typeof fetch>[1]>) =>
	options.body ? JSON.stringify(options.body) : undefined;

export const apiFetch = async (path: string, options = {}) => {
	const fullUrl = `${apiUrl}${path}`;
	const res = await fetch(fullUrl, {
		...options,
		body: resolveBody(options),
		headers: resolveHeaders(options),
	});
	const text = await res.text();

	if (!res.ok) {
		const ErrorClass = resolveApiErrorClass(res);
		const error = new ErrorClass(text);
		try {
			error.body = JSON.parse(text);
		} catch {
			error.body = {};
		}
		throw error;
	}
	return text ? JSON.parse(text) : null;
};

const withMethod =
	(cb: (url: string, options?: RequestInit) => Promise<Response>, method: string) =>
	async (url: string, options = {}) =>
		await cb(url, {
			...options,
			method: method,
		});

const getFetch = (token: string | undefined) => {
	if (!token) {
		return apiFetch;
	}
	const authorizedFetch = (url: string, options: Parameters<typeof fetch>[1] = {}) =>
		apiFetch(url, {
			...options,
			headers: {
				...options.headers,
				[TOKEN_HEADER]: `Token ${token}`,
			},
		});
	authorizedFetch.authorized = true;
	return authorizedFetch;
};

export type Fetch = ReturnType<typeof getFetch> & {
	delete: ReturnType<typeof withMethod>;
	patch: ReturnType<typeof withMethod>;
	post: ReturnType<typeof withMethod>;
	put: ReturnType<typeof withMethod>;
	authorized?: boolean;
};

export const curryAuth = (token: string | undefined): Fetch => {
	const fetchClient = getFetch(token) as Fetch;
	fetchClient.delete = withMethod(fetchClient, "DELETE");
	fetchClient.patch = withMethod(fetchClient, "PATCH");
	fetchClient.post = withMethod(fetchClient, "POST");
	fetchClient.put = withMethod(fetchClient, "PUT");
	return fetchClient;
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
