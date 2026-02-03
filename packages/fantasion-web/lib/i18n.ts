import { routing } from "../i18n/routing";
import { defaultLang } from "../routes";

export type Locale = "cs" | "en";

export const locales = routing.locales;

export function getLocale(lang: string | undefined): Locale {
	if (lang && routing.locales.includes(lang as Locale)) {
		return lang as Locale;
	}
	return defaultLang as Locale;
}
