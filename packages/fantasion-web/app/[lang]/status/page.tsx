import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StatusContent } from "../../../components/circle/StatusContent";
import type { OrdersResult } from "../../../components/orders/types";
import { PageLayout } from "../../../layout/PageLayout";
import { createAuthenticatedFetch, requireAuth } from "../../../server/auth";

export const dynamic = "force-dynamic";

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("my-status"),
		description: t("fantasion-general-description"),
	};
}

export default async function StatusPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	await requireAuth(lang);

	const fetch = await createAuthenticatedFetch();
	const orders: OrdersResult = await fetch("/orders");

	return (
		<PageLayout>
			<StatusContent initialOrders={orders} />
		</PageLayout>
	);
}
