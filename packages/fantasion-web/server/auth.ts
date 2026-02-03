import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { curryAuth, TOKEN_COOKIE } from "../api";
import { reverse } from "../routeMap";

export type User = {
	id: number;
	email?: string;
	[key: string]: unknown;
} | null;

/**
 * Gets the current authenticated user, or null if not logged in.
 * Reads auth token from cookies and fetches user data from API.
 */
export async function getCurrentUser(): Promise<User> {
	const cookieStore = await cookies();
	const token = cookieStore.get(TOKEN_COOKIE)?.value;

	if (!token) {
		return null;
	}

	const fetch = curryAuth(token);

	try {
		return fetch.authorized ? await fetch("/users/me") : null;
	} catch {
		return null;
	}
}

/**
 * Creates an authenticated fetch client using the current auth token.
 * Returns a fetch function that automatically adds Authorization header.
 */
export async function createAuthenticatedFetch() {
	const cookieStore = await cookies();
	const token = cookieStore.get(TOKEN_COOKIE)?.value;
	return curryAuth(token);
}

/**
 * Requires user to be authenticated. Redirects to login if not.
 * Use this at the top of protected page components.
 */
export async function requireAuth(lang = "cs"): Promise<User> {
	const user = await getCurrentUser();

	if (!user) {
		const headersList = await headers();
		const currentPath = headersList.get("x-invoke-path") || headersList.get("next-url") || "/";
		const redirectTo = encodeURIComponent(currentPath);
		redirect(`${reverse(lang, "login")}?redirectTo=${redirectTo}`);
	}

	return user;
}

/**
 * Redirects to status page if user is already logged in.
 * Use this on public pages like register/login that shouldn't be accessible when logged in.
 */
export async function redirectIfAuthenticated(lang = "cs"): Promise<void> {
	const user = await getCurrentUser();

	if (user) {
		redirect(reverse(lang, "status"));
	}
}
