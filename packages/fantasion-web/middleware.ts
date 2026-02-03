import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const locales = ["cs", "en"];
const defaultLocale = "cs";

function getPreferredLocale(request: NextRequest): string {
	// Check Accept-Language header
	const acceptLanguage = request.headers.get("Accept-Language");
	if (acceptLanguage) {
		// Parse Accept-Language header (e.g., "cs,en-US;q=0.9,en;q=0.8")
		const languages = acceptLanguage
			.split(",")
			.map((lang) => {
				const [code, q = "q=1"] = lang.trim().split(";");
				const quality = Number.parseFloat(q.split("=")[1] || "1");
				// Get the primary language code (e.g., "en-US" -> "en")
				const primaryCode = code.split("-")[0].toLowerCase();
				return { code: primaryCode, quality: quality };
			})
			.sort((a, b) => b.quality - a.quality);

		// Find the first matching locale
		for (const { code } of languages) {
			if (locales.includes(code)) {
				return code;
			}
		}
	}

	return defaultLocale;
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if the pathname already has a locale
	const pathnameHasLocale = locales.some((loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`);

	if (pathnameHasLocale) {
		return NextResponse.next();
	}

	// Skip for static files and API routes
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.startsWith("/locales") ||
		pathname.includes(".") // files with extensions (favicon.ico, etc.)
	) {
		return NextResponse.next();
	}

	// Redirect to the preferred locale
	const locale = getPreferredLocale(request);
	const newUrl = new URL(`/${locale}${pathname}`, request.url);

	return NextResponse.redirect(newUrl);
}

export const config = {
	// Match all paths except static files
	matcher: ["/((?!_next|api|locales|.*\\.).*)"],
};
