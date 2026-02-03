import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../../api";
import { LeisureCentreList } from "../../../components/leisureCentres";
import type { MediaObjectType } from "../../../components/media";
import { PageLayout } from "../../../layout/PageLayout";

export const dynamic = "force-dynamic";

type Location = {
	[key: string]: unknown;
};

type LeisureCentre = {
	id: number;
	title: string;
	description?: string;
	detailedDescription?: string;
	location: Location;
	mailingAddress?: Location;
	media: MediaObjectType[];
	expeditions: { id: number; title: string }[];
};

type LeisureCentresResponse = {
	results: LeisureCentre[];
};

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("leisure-centre-title"),
		description: t("fantasion-general-description"),
	};
}

export default async function LeisureCentresPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	const leisureCentres: LeisureCentresResponse = await apiFetch("/leisure-centres");

	return (
		<PageLayout>
			<LeisureCentreList leisureCentres={leisureCentres.results} />
		</PageLayout>
	);
}
