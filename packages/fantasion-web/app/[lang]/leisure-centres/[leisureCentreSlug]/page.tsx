import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../../../api";
import { LeisureCentre } from "../../../../components/leisureCentres";
import type { MediaObjectType } from "../../../../components/media";
import { PageLayout } from "../../../../layout/PageLayout";
import { getSlugParam } from "../../../../params";

export const dynamic = "force-dynamic";

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
	expeditions: Array<{ id: number; title: string }>;
};

type PageProps = {
	params: Promise<{
		lang: string;
		leisureCentreSlug: string;
	}>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const leisureCentreId = getSlugParam(resolvedParams.leisureCentreSlug);
	const leisureCentre: LeisureCentreType = await apiFetch(`/leisure-centres/${leisureCentreId}`);

	return {
		title: leisureCentre.title,
		description: leisureCentre.description,
	};
}

export default async function LeisureCentreDetailPage({ params }: PageProps) {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const leisureCentreId = getSlugParam(resolvedParams.leisureCentreSlug);
	const leisureCentre: LeisureCentreType = await apiFetch(`/leisure-centres/${leisureCentreId}`);

	return (
		<PageLayout>
			<LeisureCentre leisureCentre={leisureCentre} />
		</PageLayout>
	);
}
