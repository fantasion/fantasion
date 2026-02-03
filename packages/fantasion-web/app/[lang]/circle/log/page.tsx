import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CircleLogContent } from "../../../../components/circle/CircleLogContent";
import type { MediaObjectType } from "../../../../components/media";
import { PageLayout } from "../../../../layout/PageLayout";
import { createAuthenticatedFetch, requireAuth } from "../../../../server/auth";

export const dynamic = "force-dynamic";

type LogArticle = {
	id: number;
	date: string;
	title: string;
	media: MediaObjectType[];
	description?: string;
	text?: string;
};

type LogArticlesResponse = {
	results: LogArticle[];
};

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("circle-log"),
		description: t("circle-log-description"),
	};
}

export default async function CircleLogPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	await requireAuth(lang);

	const fetch = await createAuthenticatedFetch();
	const articles: LogArticlesResponse = await fetch("/expedition-log-articles");

	return (
		<PageLayout>
			<CircleLogContent articles={articles} />
		</PageLayout>
	);
}
