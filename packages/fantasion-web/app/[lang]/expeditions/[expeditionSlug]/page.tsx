import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../../../api";
import { ExpeditionDetail } from "../../../../components/expeditions/ExpeditionDetail";
import type { ExpeditionBatchType, ExpeditionThemeType } from "../../../../components/expeditions/expeditions";
import type { MediaObjectType } from "../../../../components/media";
import { PageLayout } from "../../../../layout/PageLayout";
import { getSlugParam } from "../../../../params";

export const dynamic = "force-dynamic";

type Expedition = {
	id: number;
	title: string;
	description?: string;
	detailedDescription?: string;
	batches: ExpeditionBatchType[];
	media: MediaObjectType[];
	theme?: ExpeditionThemeType | null;
};

type PageProps = {
	params: Promise<{
		lang: string;
		expeditionSlug: string;
	}>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const expeditionId = getSlugParam(resolvedParams.expeditionSlug);
	const expedition: Expedition = await apiFetch(`/expeditions/${expeditionId}`);

	return {
		title: expedition.title,
		description: expedition.description,
	};
}

export default async function ExpeditionDetailPage({ params }: PageProps) {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const expeditionId = getSlugParam(resolvedParams.expeditionSlug);
	const expedition: Expedition = await apiFetch(`/expeditions/${expeditionId}`);

	return (
		<PageLayout>
			<ExpeditionDetail expedition={expedition} />
		</PageLayout>
	);
}
