import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../../../api";
import { ExpeditionBatchDetail } from "../../../../components/expeditions/ExpeditionBatchDetail";
import type { Troop } from "../../../../components/expeditions/troops";
import type { MediaObjectType } from "../../../../components/media";
import { formatDateRange } from "../../../../datetime/formatters";
import { PageLayout } from "../../../../layout/PageLayout";
import { getSlugParam } from "../../../../params";

export const dynamic = "force-dynamic";

type Expedition = {
	id: number;
	title: string;
	description?: string;
};

type CaretakerType = {
	id: number | string;
	profile: {
		id: number;
		title: string;
		jobTitle?: string;
		avatar?: { localPhoto?: Record<string, string>; [key: string]: unknown } | null;
		[key: string]: unknown;
	};
	role: {
		title: string;
		[key: string]: unknown;
	};
	[key: string]: unknown;
};

type Location = {
	[key: string]: unknown;
};

type LeisureCentreType = {
	id: number;
	title: string;
	description?: string;
	detailedDescription?: string;
	location: Location;
	mailingAddress?: Location;
	media: MediaObjectType[];
	expeditions: { id: number; title: string }[];
};

type ExpeditionBatch = {
	id: number;
	startsAt: string;
	endsAt: string;
	leisureCentre?: LeisureCentreType;
	troops: Troop[];
	staff: CaretakerType[];
	expeditionId: number;
};

type PageProps = {
	params: Promise<{
		lang: string;
		expeditionBatchSlug: string;
	}>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const expeditionBatchId = getSlugParam(resolvedParams.expeditionBatchSlug);

	const expeditionBatch: ExpeditionBatch = await apiFetch(`/expedition-batches/${expeditionBatchId}`);
	const expedition: Expedition = await apiFetch(`/expeditions/${expeditionBatch.expeditionId}`);

	const title = `${expedition.title}: ${formatDateRange(resolvedParams.lang, expeditionBatch.startsAt, expeditionBatch.endsAt)}`;

	return {
		title: title,
		description: expedition.description,
	};
}

export default async function ExpeditionBatchDetailPage({ params }: PageProps) {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const expeditionBatchId = getSlugParam(resolvedParams.expeditionBatchSlug);

	const expeditionBatch: ExpeditionBatch = await apiFetch(`/expedition-batches/${expeditionBatchId}`);
	const expedition: Expedition = await apiFetch(`/expeditions/${expeditionBatch.expeditionId}`);

	return (
		<PageLayout>
			<ExpeditionBatchDetail expedition={expedition} expeditionBatch={expeditionBatch} />
		</PageLayout>
	);
}
