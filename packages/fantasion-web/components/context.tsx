"use client";

import { getCookie, setCookie } from "cookies-next";

declare const process: { env: Record<string, string | undefined> };

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Fetch } from "../api";
import { curryAuth, TOKEN_COOKIE } from "../api";
import { useTranslation } from "../lib/i18n-context";
import { reverse } from "../routeMap";
import type { Order } from "./orders/types";

type AlertItem = {
	id?: string;
	subject?: string;
	message?: string;
	[key: string]: unknown;
};

type ToastItem = {
	id?: string;
	subject?: string;
	message?: string;
	persistent?: boolean;
	priority?: string;
	actions?: { message: string; route: string }[];
	[key: string]: unknown;
};

type User = {
	id: number;
	email?: string;
	firstName?: string | null;
	lastName?: string | null;
	passwordCreated?: boolean;
	[key: string]: unknown;
} | null;

// Define interfaces for context types
type EntityCollection<T> = {
	add: (item: T) => void;
	empty: boolean;
	remove: (itemId: string) => void;
	items: T[];
};

type SiteContextType = {
	activeOrder: Order | null;
	fetch: Fetch;
	lang: string;
	logout: () => void;
	setActiveOrder: (order: Order | null) => void;
	user: User;
};

type SiteContextProviderProps = {
	activeOrder?: Order | null;
	children: ReactNode;
	user?: User;
};

export const AlertContext = createContext<EntityCollection<AlertItem>>({
	add: () => undefined,
	empty: true,
	remove: () => undefined,
	items: [],
});
export const SiteContext = createContext<SiteContextType>({
	activeOrder: null,
	fetch: curryAuth(undefined),
	lang: "",
	logout: () => undefined,
	setActiveOrder: () => undefined,
	user: null,
});
export const ToastContext = createContext<EntityCollection<ToastItem>>({
	add: () => undefined,
	empty: true,
	remove: () => undefined,
	items: [],
});

export const useActiveOrder = () => useSite().activeOrder;
export const useAlerts = () => useContext(AlertContext);
export const useFetch = () => useSite().fetch;
/** @deprecated Use useLocale() from next-intl instead */
export const useLang = () => {
	// biome-ignore lint/suspicious/noEmptyBlockStatements: Placeholder for deprecation warning
	if (process.env.NODE_ENV === "development") {
	}
	return useLocale();
};
export const useSetActiveOrder = () => useSite().setActiveOrder;
export const useSite = () => useContext(SiteContext);
export const useToasts = () => useContext(ToastContext);
export const useUser = () => useSite().user;

export const SiteContextProvider = ({ activeOrder = null, children, user = null }: SiteContextProviderProps) => {
	const [currentOrder, setCurrentOrder] = useState(activeOrder);
	const authCookie = getCookie(TOKEN_COOKIE);
	const { i18n } = useTranslation();
	const router = useRouter();
	const lang = i18n.language;
	const logout = useCallback(() => {
		setCookie(TOKEN_COOKIE, "", { sameSite: "strict" });
		setCurrentOrder(null);
		router.push(reverse(lang, "home", {}));
	}, [lang, router]);
	const fetch = curryAuth(authCookie);

	useEffect(() => {
		const query = Object.fromEntries(
			document.location.search
				.substr(1)
				.split("&")
				.map((str) => str.split("=").map(decodeURIComponent)),
		);
		if (query.redirectTo) {
			localStorage.setItem("redirectTo", query.redirectTo);
		}
	}, []);

	const context = useMemo(
		() => ({
			activeOrder: currentOrder,
			fetch: fetch,
			lang: lang,
			logout: logout,
			setActiveOrder: setCurrentOrder,
			user: user,
		}),
		[currentOrder, fetch, lang, logout, user],
	);
	return <SiteContext.Provider value={context}>{children}</SiteContext.Provider>;
};
