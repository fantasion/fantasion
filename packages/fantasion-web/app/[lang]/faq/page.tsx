import { Container } from "@fantasion/ui";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../../api";
import { Faqs } from "../../../components/faq";
import { PageLayout } from "../../../layout/PageLayout";

export const dynamic = "force-dynamic";

type FaqItem = {
	id: string | number;
	question: string;
	shortAnswer: string;
	detailedAnswer: string;
};

type FaqsResponse = {
	results: FaqItem[];
};

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("faq-title"),
		description: t("faq-description"),
	};
}

export default async function FaqPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	const faqs: FaqsResponse = await apiFetch("/faqs");

	return (
		<PageLayout>
			<Container className="above-decoration mt-3">
				<Faqs faqs={faqs} />
			</Container>
		</PageLayout>
	);
}
