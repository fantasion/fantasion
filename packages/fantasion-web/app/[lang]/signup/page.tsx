import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SignupContent } from "../../../components/auth/SignupContent";
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
		title: t("fantasion-title"),
		description: t("fantasion-general-description"),
	};
}

export default async function SignupPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);

	return (
		<PageLayout>
			<SignupContent />
		</PageLayout>
	);
}
