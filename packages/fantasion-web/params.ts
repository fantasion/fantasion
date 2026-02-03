import { parseSlug } from "./slugs";

/**
 * Gets a single param value from App Router params.
 * App Router params can be string | string[] | undefined, this normalizes to string.
 */
export function getParam(value: string | string[] | undefined): string {
	if (Array.isArray(value)) {
		return value[0] || "";
	}
	return value || "";
}

/**
 * Gets a param value and parses it as a slug (extracts numeric ID).
 */
export function getSlugParam(value: string | string[] | undefined): number {
	return parseSlug(getParam(value));
}
