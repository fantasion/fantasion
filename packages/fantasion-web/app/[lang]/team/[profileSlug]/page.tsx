import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../../../api";
import type { Profile } from "../../../../components/profiles";
import { ProfileDetail } from "../../../../components/profiles";
import { PageLayout } from "../../../../layout/PageLayout";
import { getSlugParam } from "../../../../params";

export const dynamic = "force-dynamic";

type PageProps = {
	params: Promise<{
		lang: string;
		profileSlug: string;
	}>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const profileId = getSlugParam(resolvedParams.profileSlug);
	const profile: Profile = await apiFetch(`/profiles/${profileId}`);

	return {
		title: profile.title,
		description: profile.description,
	};
}

export default async function TeamProfileDetailPage({ params }: PageProps) {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const profileId = getSlugParam(resolvedParams.profileSlug);
	const profile: Profile = await apiFetch(`/profiles/${profileId}`);

	return (
		<PageLayout>
			<ProfileDetail profile={profile} />
		</PageLayout>
	);
}
