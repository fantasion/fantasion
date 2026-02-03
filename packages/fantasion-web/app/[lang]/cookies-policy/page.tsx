import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../../api";
import { StaticArticleContent } from "../../../content/StaticArticleContent";
import { PageLayout } from "../../../layout/PageLayout";

export const dynamic = "force-dynamic";

type StaticArticle = {
	title: string;
	description?: string;
	media: unknown[];
	text: string;
};

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const article: StaticArticle | null = await apiFetch("/static-articles/cookies-policy");

	return {
		title: article?.title || "Cookies Policy",
		description: article?.description,
	};
}

export default async function CookiesPolicyPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	const article: StaticArticle | null = await apiFetch("/static-articles/cookies-policy");

	if (!article) {
		return <div>{t("article-not-found")}</div>;
	}

	return (
		<PageLayout>
			<StaticArticleContent article={article} />
		</PageLayout>
	);
}
