import { Container } from "@fantasion/ui";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../../api";
import type { Profile } from "../../../components/profiles";
import { ProfileList } from "../../../components/profiles";
import { ArticleBody } from "../../../content/Article";
import { Heading } from "../../../content/content";
import { PageLayout } from "../../../layout/PageLayout";

export const dynamic = "force-dynamic";

type ProfilesResult = {
	results: Profile[];
};

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("our-team"),
		description: t("our-team-general-description"),
	};
}

export default async function TeamPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	const profiles: ProfilesResult = await apiFetch("/profiles");

	return (
		<PageLayout>
			<Container>
				<Heading level={1}>{t("our-team")}</Heading>
				<ArticleBody text={t("our-team-general-description")} />
				<ProfileList profiles={profiles.results} />
			</Container>
		</PageLayout>
	);
}
