import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TransportDetailContent } from "../../../../components/transports/TransportDetailContent";
import { PageLayout } from "../../../../layout/PageLayout";
import { getParam } from "../../../../params";
import { createAuthenticatedFetch, requireAuth } from "../../../../server/auth";

export const dynamic = "force-dynamic";

type PageProps = {
	params: Promise<{
		lang: string;
		transportId: string;
	}>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const t = await getTranslations();
	const transportId = getParam(resolvedParams.transportId);

	return {
		title: t("transport-detail", { transportId: transportId }),
	};
}

export default async function TransportDetailPage({ params }: PageProps) {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const transportId = getParam(resolvedParams.transportId);

	await requireAuth(resolvedParams.lang);
	const fetch = await createAuthenticatedFetch();
	const transport = await fetch(`/transports/${transportId}`);

	return (
		<PageLayout thin={true}>
			<TransportDetailContent transport={transport} transportId={transportId} />
		</PageLayout>
	);
}
