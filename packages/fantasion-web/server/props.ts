import type { IncomingMessage, ServerResponse } from "node:http";
import process from "node:process";
import { getCookie } from "cookies-next";
import type { Fetch } from "../api";
import { curryAuth, TOKEN_COOKIE } from "../api";
import { NotFound } from "../errors";
import { reverse } from "../routeMap";
import { defaultLang } from "../routes";

type User = {
	id: number;
	email?: string;
	[key: string]: unknown;
};

type PagePropsBase = {
	locale?: string;
	lang?: string;
	req?: IncomingMessage & { cookies?: Record<string, string>; url?: string };
	res?: ServerResponse & { statusCode?: number };
	fetch: Fetch;
	user?: User | null;
	origin?: string;
	baseUrl?: string;
	[k: string]: unknown;
};

type PropsResult = {
	props?: Record<string, unknown>;
	redirect?: { destination: string; permanent: boolean };
	notFound?: boolean;
};

const origin = `https://${process.env.FRONTEND_HOST || "fantasion.cz"}`;

const determineLocale = (locale?: string) => (!locale || locale === "default" ? defaultLang : locale);

const getAuthCookie = (props: PagePropsBase) =>
	getCookie(TOKEN_COOKIE, {
		req: props.req,
		res: props.res,
	});

const getUser = async (props: PagePropsBase) => (props.fetch.authorized ? props.fetch("/users/me") : null);

const getPageProps = async (props: PagePropsBase) => {
	const locale = determineLocale(props.locale);
	return {
		props: {
			origin: origin,
			baseUrl: `${origin}/${locale}`,
			lang: locale,
			user: await getUser(props),
		},
	};
};

const createFetch = (props: PagePropsBase) => curryAuth(getAuthCookie(props));

const resolvePropGetter = async (
	fn: ((p: PagePropsBase) => PropsResult | Promise<PropsResult>) | undefined,
	props: PagePropsBase,
) => (fn ? await fn(props) : undefined);

const withFetch = (fn: (props: PagePropsBase) => Promise<PropsResult>) => (props: PagePropsBase) =>
	fn({
		...props,
		fetch: createFetch(props),
	});

const defaultProps = {
	statusCode: 200,
};

export const requireUser = (fn?: (props: PagePropsBase) => PropsResult | undefined) => (props: PagePropsBase) => {
	if (!props.user) {
		const redirectTo = encodeURIComponent(props.req?.url || "/");
		return {
			redirect: {
				destination: `${reverse(props.lang ?? "cs", "login")}?redirectTo=${redirectTo}`,
				permanent: false,
			},
		};
	}
	return fn ? fn(props) : undefined;
};

export const withPageProps = (fn?: (props: PagePropsBase) => PropsResult | Promise<PropsResult>) =>
	withFetch(async (props: PagePropsBase) => {
		try {
			const pageProps = await getPageProps(props);
			const resolvedProps = await resolvePropGetter(fn, {
				...props,
				...pageProps.props,
			});
			const result = {
				...pageProps,
				...resolvedProps,
				props: {
					...defaultProps,
					...pageProps?.props,
					...resolvedProps?.props,
				},
			};
			if (props.res) {
				props.res.statusCode = result.props.statusCode;
			}
			return result;
		} catch (error) {
			if (error instanceof NotFound) {
				return {
					notFound: true,
					props: {
						statusCode: 404,
					},
				};
			}
			throw error;
		}
	});
