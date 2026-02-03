import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../../api";
import { ExpeditionThemeList } from "../../../components/expeditions/expeditionThemes";
import type { MediaObjectType } from "../../../components/media";
import { PageLayout } from "../../../layout/PageLayout";

export const dynamic = "force-dynamic";

type ExpeditionTheme = {
	id: number;
	title: string;
	description?: string;
	detailedDescription?: string;
	media: MediaObjectType[];
	expeditions: { id: number; title: string }[];
};

type ExpeditionThemesResponse = {
	results: ExpeditionTheme[];
};

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("adventures-title"),
		description: t("adventures-general-description"),
	};
}

export default async function AdventuresPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	const expeditionThemes: ExpeditionThemesResponse = await apiFetch("/expedition-themes");

	return (
		<PageLayout>
			<ExpeditionThemeList expeditionThemes={expeditionThemes.results} />
		</PageLayout>
	);
}
