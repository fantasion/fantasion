import { Col, Container, Row } from "@fantasion/ui";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactCard } from "../../../components/ContactCard";
import { PageLayout } from "../../../layout/PageLayout";

export const dynamic = "force-dynamic";

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("contacts-title"),
		description: t("fantasion-general-description"),
	};
}

export default async function ContactPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();

	return (
		<PageLayout>
			<Container>
				<Row>
					<Col md={6}>
						<h1>{t("contacts-title")}</h1>
						<ContactCard />
					</Col>
					<Col md={6} />
				</Row>
			</Container>
		</PageLayout>
	);
}
