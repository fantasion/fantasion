import { Container } from "@fantasion/ui";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../../../api";
import { Article } from "../../../../content/Article";
import { PageLayout } from "../../../../layout/PageLayout";
import { getSlugParam } from "../../../../params";

export const dynamic = "force-dynamic";

type ExpeditionTheme = {
	id: number;
	title: string;
	description?: string;
	detailedDescription?: string;
	media: unknown;
};

type PageProps = {
	params: Promise<{
		lang: string;
		expeditionThemeSlug: string;
	}>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const expeditionThemeId = getSlugParam(resolvedParams.expeditionThemeSlug);
	const expeditionTheme: ExpeditionTheme = await apiFetch(`/expedition-themes/${expeditionThemeId}`);

	return {
		title: expeditionTheme.title,
		description: expeditionTheme.description,
	};
}

export default async function ExpeditionThemeDetailPage({ params }: PageProps) {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const expeditionThemeId = getSlugParam(resolvedParams.expeditionThemeSlug);
	const expeditionTheme: ExpeditionTheme = await apiFetch(`/expedition-themes/${expeditionThemeId}`);

	return (
		<PageLayout>
			<Container>
				<Article
					media={expeditionTheme.media as []}
					description={expeditionTheme.description}
					text={expeditionTheme.detailedDescription}
					title={expeditionTheme.title}
				/>
			</Container>
		</PageLayout>
	);
}
