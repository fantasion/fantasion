import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OrderDetailContent } from "../../../../components/orders/OrderDetailContent";
import type { Order } from "../../../../components/orders/types";
import { PageLayout } from "../../../../layout/PageLayout";
import { getParam } from "../../../../params";
import { createAuthenticatedFetch, requireAuth } from "../../../../server/auth";

export const dynamic = "force-dynamic";

type PageProps = {
	params: Promise<{
		lang: string;
		orderId: string;
	}>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const t = await getTranslations();
	const orderId = getParam(resolvedParams.orderId);

	const fetch = await createAuthenticatedFetch();
	const order: Order = await fetch(`/orders/${orderId}`);
	const title = t("order-id-title", { orderNumber: order.variableSymbol || orderId });

	return {
		title: title,
		description: t("order-checkout-description"),
	};
}

export default async function OrderDetailPage({ params }: PageProps) {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const orderId = getParam(resolvedParams.orderId);

	await requireAuth(resolvedParams.lang);

	const fetch = await createAuthenticatedFetch();
	const order: Order = await fetch(`/orders/${orderId}`);

	return (
		<PageLayout>
			<OrderDetailContent initialOrder={order} />
		</PageLayout>
	);
}
