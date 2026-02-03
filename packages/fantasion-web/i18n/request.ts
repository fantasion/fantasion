import type { IntlErrorCode } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
	let locale = await requestLocale;

	if (!(locale && routing.locales.includes(locale as "cs" | "en"))) {
		locale = routing.defaultLocale;
	}

	// Always load Czech as the base, then merge the target locale on top
	// This ensures missing translations in other locales fall back to Czech
	const csMessages = (await import("../messages/cs.json")).default;
	const localeMessages = locale === "cs" ? csMessages : (await import(`../messages/${locale}.json`)).default;

	return {
		locale: locale,
		messages: locale === "cs" ? csMessages : { ...csMessages, ...localeMessages },
		timeZone: "Europe/Prague",
		onError: (error: { code: IntlErrorCode }) => {
			// Suppress MISSING_MESSAGE errors in development since we have fallbacks
			if (error.code === "MISSING_MESSAGE") {
				return;
			}
		},
		getMessageFallback: ({ key }: { namespace?: string; key: string }) => {
			// Return the key itself as fallback to help identify missing translations
			return key;
		},
	};
});
