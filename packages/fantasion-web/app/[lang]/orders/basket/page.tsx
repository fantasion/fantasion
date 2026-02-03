import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BasketContent } from "../../../../components/orders/BasketContent";
import { PageLayout } from "../../../../layout/PageLayout";
import { requireAuth } from "../../../../server/auth";

export const dynamic = "force-dynamic";

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("order-basket"),
		description: t("order-checkout-description"),
	};
}

export default async function BasketPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	await requireAuth(lang);

	return (
		<PageLayout>
			<BasketContent />
		</PageLayout>
	);
}
