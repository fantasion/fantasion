import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ParticipantDetailContent } from "../../../../../components/circle/ParticipantDetailContent";
import type { Participant } from "../../../../../components/family/ParticipantList";
import { getFullName } from "../../../../../components/users";
import { PageLayout } from "../../../../../layout/PageLayout";
import { getParam } from "../../../../../params";
import { createAuthenticatedFetch, requireAuth } from "../../../../../server/auth";

export const dynamic = "force-dynamic";

type PageProps = {
	params: Promise<{
		lang: string;
		participantId: string;
	}>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const t = await getTranslations();
	const participantId = getParam(resolvedParams.participantId);

	const fetch = await createAuthenticatedFetch();
	const participant: Participant = await fetch(`/participants/${participantId}`);
	const title = getFullName(participant);

	return {
		title: title,
		description: t("family-participants-description"),
	};
}

export default async function CircleParticipantDetailPage({ params }: PageProps) {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const participantId = getParam(resolvedParams.participantId);

	await requireAuth(resolvedParams.lang);

	const fetch = await createAuthenticatedFetch();
	const participant: Participant = await fetch(`/participants/${participantId}`);

	return (
		<PageLayout>
			<ParticipantDetailContent initialParticipant={participant} />
		</PageLayout>
	);
}
