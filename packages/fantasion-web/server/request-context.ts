import { headers } from "next/headers";
import { defaultLang } from "../routes";

/**
 * Determines the locale from the provided value.
 * Converts "default" to the actual default language.
 */
export function determineLocale(locale?: string): string {
	return !locale || locale === "default" ? defaultLang : locale;
}

/**
 * Gets the origin from request headers.
 * Respects x-forwarded-proto and x-forwarded-host for proxy setups.
 */
export async function getOrigin(): Promise<string> {
	const headersList = await headers();
	const proto = headersList.get("x-forwarded-proto") || "https";
	const host = headersList.get("x-forwarded-host") || headersList.get("host");

	if (!host) {
		return "https://fantasion.cz";
	}

	return `${proto}://${host}`;
}

/**
 * Gets the base URL for the current locale.
 * Example: "https://fantasion.cz/cs"
 */
export async function getBaseUrl(locale?: string): Promise<string> {
	const lang = determineLocale(locale);
	const origin = await getOrigin();
	return `${origin}/${lang}`;
}

/**
 * Gets the current request path from headers.
 */
export async function getCurrentPath(): Promise<string> {
	const headersList = await headers();
	return headersList.get("x-invoke-path") || headersList.get("next-url") || "/";
}
