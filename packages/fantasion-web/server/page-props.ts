import { getCurrentUser, type User } from "./auth";
import { getBaseUrl, getOrigin } from "./request-context";

type BasePageProps = {
	statusCode: number;
	origin: string;
	baseUrl: string;
	lang: string;
	user: User;
};

/**
 * Gets base props that all pages need (user, origin, baseUrl, etc.)
 */
export async function getBasePageProps(lang = "cs"): Promise<BasePageProps> {
	const [user, origin, baseUrl] = await Promise.all([getCurrentUser(), getOrigin(), getBaseUrl(lang)]);

	return {
		statusCode: 200,
		origin: origin,
		baseUrl: baseUrl,
		lang: lang,
		user: user,
	};
}
