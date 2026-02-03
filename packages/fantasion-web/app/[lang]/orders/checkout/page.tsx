import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckoutContent } from "../../../../components/orders/CheckoutContent";
import type { Order } from "../../../../components/orders/types";
import { PageLayout } from "../../../../layout/PageLayout";
import { reverse } from "../../../../routeMap";
import { createAuthenticatedFetch, requireAuth } from "../../../../server/auth";

export const dynamic = "force-dynamic";

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("order-checkout"),
		description: t("order-checkout-description"),
	};
}

export default async function CheckoutPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	await requireAuth(lang);

	const fetch = await createAuthenticatedFetch();
	const activeOrder: Order | null = await fetch("/orders/active");

	if (!activeOrder) {
		redirect(reverse(lang, "basket"));
	}

	return (
		<PageLayout>
			<CheckoutContent initialOrder={activeOrder} />
		</PageLayout>
	);
}
