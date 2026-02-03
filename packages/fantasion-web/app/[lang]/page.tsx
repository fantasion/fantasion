import { Container } from "@fantasion/ui";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../api";
import { ExpeditionList } from "../../components/expeditions/ExpeditionList";
import { HomeAbout, HomeExpeditionSection, HomeFlavour } from "../../components/home";
import { PageLayout } from "../../layout/PageLayout";

export const dynamic = "force-dynamic";

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("fantasion-title"),
		description: t("fantasion-general-description"),
	};
}

export default async function HomePage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);

	const [aboutUs, expeditions, flavourTexts] = await Promise.all([
		apiFetch("/static-articles/about-us"),
		apiFetch("/expeditions"),
		apiFetch("/flavour-texts"),
	]);

	const flavourResults = flavourTexts?.results ?? [];

	return (
		<PageLayout>
			<HomeFlavour flavourTexts={flavourResults} />

			<HomeExpeditionSection>
				<ExpeditionList expeditions={expeditions} />
			</HomeExpeditionSection>

			{aboutUs ? (
				<Container className="above-decoration mt-3">
					<HomeAbout article={aboutUs} />
				</Container>
			) : null}
		</PageLayout>
	);
}
