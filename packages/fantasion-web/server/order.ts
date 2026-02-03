import type { Order } from "../components/orders/types";
import { createAuthenticatedFetch } from "./auth";

/**
 * Gets the active order for the current user, or null if not logged in or no active order.
 * Reads auth token from cookies and fetches order data from API.
 */
export async function getActiveOrder(): Promise<Order | null> {
	const fetch = await createAuthenticatedFetch();

	if (!fetch.authorized) {
		return null;
	}

	try {
		return await fetch("/orders/active");
	} catch {
		return null;
	}
}
