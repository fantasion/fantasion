import { InternalServerError } from "./errors";
import { defaultLang, routes } from "./routes";

class MissingParam extends Error {}

const translateRoute = (path: string, params?: Record<string, string>) =>
	path.replace(/(:[a-zA-Z]+)/g, (match) => {
		const param = match.substring(1);
		const value = params?.[param];
		if (!value) {
			throw new MissingParam(`Cannot translate path "${path}" without "${param}"`);
		}
		return value;
	});

export const reverse = (lang: string, name: string, params?: Record<string, string>) => {
	const langIndex = (lang || defaultLang) as keyof typeof routes;
	const src = routes[langIndex];
	const route = src[name as keyof typeof src];
	if (!route) {
		throw new InternalServerError(`Failed to find route "${lang}:${name}"`);
	}
	return `/${lang}${translateRoute(route.source, params)}`;
};
