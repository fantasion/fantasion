import { Container } from "@fantasion/ui";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../../api";
import type { MediaObjectType } from "../../../components/media";
import { MonsterList } from "../../../components/monsters";
import { ArticleBody } from "../../../content/Article";
import { Heading } from "../../../content/content";
import { PageLayout } from "../../../layout/PageLayout";

export const dynamic = "force-dynamic";

type Monster = {
	id: number;
	title: string;
	description?: string;
	text?: string;
	media?: MediaObjectType[];
	avatar?: { galleryThumb?: string } | null;
};

type MonstersResponse = {
	results: Monster[];
};

type StaticArticle = {
	text: string;
};

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("bestiary"),
		description: t("bestiary-description"),
	};
}

export default async function BestiaryPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();

	const [monsters, bestiaryInfo] = await Promise.all([
		apiFetch("/monsters") as Promise<MonstersResponse>,
		apiFetch("/static-articles/bestiary-info") as Promise<StaticArticle>,
	]);

	return (
		<PageLayout>
			<Container>
				<Heading level={1}>{t("bestiary")}</Heading>
				<ArticleBody text={bestiaryInfo.text} />
				<MonsterList monsters={monsters.results} />
			</Container>
		</PageLayout>
	);
}
