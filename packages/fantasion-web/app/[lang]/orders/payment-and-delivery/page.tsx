import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PaymentAndDeliveryContent } from "../../../../components/orders/PaymentAndDeliveryContent";
import type { Order } from "../../../../components/orders/types";
import { PageLayout } from "../../../../layout/PageLayout";
import { reverse } from "../../../../routeMap";
import { createAuthenticatedFetch, requireAuth } from "../../../../server/auth";

export const dynamic = "force-dynamic";

type AddressType = {
	id: number;
	title?: string;
	street?: string;
	streetNumber?: string;
	city?: string;
	postalCode?: string;
	countryCode?: string;
};

type AddressList = {
	results: AddressType[];
};

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("order-payment-and-delivery"),
		description: t("order-checkout-description"),
	};
}

export default async function PaymentAndDeliveryPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	await requireAuth(lang);

	const fetch = await createAuthenticatedFetch();
	const [activeOrder, userAddresses] = await Promise.all([
		fetch("/orders/active") as Promise<Order | null>,
		fetch("/user-addresses") as Promise<AddressList>,
	]);

	if (!activeOrder) {
		redirect(reverse(lang, "basket"));
	}

	return (
		<PageLayout>
			<PaymentAndDeliveryContent initialOrder={activeOrder} initialAddresses={userAddresses} />
		</PageLayout>
	);
}
