import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../../api";
import { ForgottenPasswordContent } from "../../../components/auth/ForgottenPasswordContent";
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
		title: t("forgotten-password-title"),
		description: t("forgotten-password-description"),
	};
}

export default async function ForgottenPasswordPage({ params, searchParams }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	const resolvedSearchParams = await searchParams;
	const secret = getParam(resolvedSearchParams?.s);

	let token: string | null = null;
	if (secret) {
		try {
			const res = await apiFetch(`/users/verifications/${secret}`);
			token = res.token;
		} catch {
			token = null;
		}
	}

	return (
		<PageLayout>
			<ForgottenPasswordContent secret={secret} token={token} />
		</PageLayout>
	);
}
