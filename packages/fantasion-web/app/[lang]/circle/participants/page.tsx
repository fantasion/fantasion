import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ParticipantsContent } from "../../../../components/circle/ParticipantsContent";
import type { Participant } from "../../../../components/family/ParticipantList";
import { PageLayout } from "../../../../layout/PageLayout";
import { createAuthenticatedFetch, requireAuth } from "../../../../server/auth";

export const dynamic = "force-dynamic";

type ParticipantsResponse = {
	results: Participant[];
};

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	setRequestLocale(lang);
	const t = await getTranslations();
	return {
		title: t("family-participants"),
		description: t("family-participants-description"),
	};
}

export default async function CircleParticipantsPage({ params }: PageProps) {
	const { lang } = await params;
	setRequestLocale(lang);
	await requireAuth(lang);

	const fetch = await createAuthenticatedFetch();
	const participants: ParticipantsResponse = await fetch("/participants");

	return (
		<PageLayout>
			<ParticipantsContent initialParticipants={participants} />
		</PageLayout>
	);
}
