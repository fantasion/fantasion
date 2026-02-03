import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConfirmRegistrationContent } from "../../../components/auth/ConfirmRegistrationContent";
import { PageLayout } from "../../../layout/PageLayout";
import { getParam } from "../../../params";

export const dynamic = "force-dynamic";

type PageProps = {
	params: Promise<{ lang: string }>;
	searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("verification-title"),
		description: t("verification-general-description"),
	};
}

export default async function ConfirmRegistrationPage({ params, searchParams }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	const resolvedSearchParams = await searchParams;
	const secret = getParam(resolvedSearchParams?.s) || "";

	return (
		<PageLayout>
			<ConfirmRegistrationContent secret={secret} />
		</PageLayout>
	);
}
