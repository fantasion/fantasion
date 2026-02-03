import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LoginContent } from "../../../components/auth/LoginContent";
import { PageLayout } from "../../../layout/PageLayout";
import { redirectIfAuthenticated } from "../../../server/auth";

export const dynamic = "force-dynamic";

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("login-title"),
		description: t("login-general-description"),
	};
}

export default async function LoginPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	await redirectIfAuthenticated(lang);

	return (
		<PageLayout>
			<LoginContent />
		</PageLayout>
	);
}
