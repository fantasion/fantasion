"use client";

import { AlertProvider } from "@/components/alerts";
import { SiteContextProvider } from "@/components/context";
import { MetaBase, MetaPage } from "@/components/meta";
import type { Order } from "@/components/orders/types";
import { Tracking } from "@/components/tracking";

type User = {
	id: number;
	email?: string;
	firstName?: string | null;
	lastName?: string | null;
	passwordCreated?: boolean;
	[key: string]: unknown;
} | null;

type ProvidersProps = {
	children: React.ReactNode;
	user?: User;
	activeOrder?: Order | null;
};

export default function Providers({ children, user, activeOrder }: ProvidersProps) {
	return (
		<>
			<Tracking />
			<MetaBase />
			<MetaPage title="Fantasion" />
			<SiteContextProvider user={user} activeOrder={activeOrder}>
				<AlertProvider>{children}</AlertProvider>
			</SiteContextProvider>
		</>
	);
}
