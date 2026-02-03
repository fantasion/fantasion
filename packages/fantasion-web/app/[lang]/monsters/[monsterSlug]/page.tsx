import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { apiFetch } from "../../../../api";
import type { MediaObjectType } from "../../../../components/media";
import { MonsterDetail } from "../../../../components/monsters";
import { PageLayout } from "../../../../layout/PageLayout";
import { getSlugParam } from "../../../../params";

export const dynamic = "force-dynamic";

type Avatar = {
	galleryThumb?: string;
};

type Monster = {
	id: number;
	title: string;
	description?: string;
	text?: string;
	media?: MediaObjectType[];
	avatar?: Avatar | null;
};

type PageProps = {
	params: Promise<{
		lang: string;
		monsterSlug: string;
	}>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const monsterId = getSlugParam(resolvedParams.monsterSlug);
	const monster: Monster = await apiFetch(`/monsters/${monsterId}`);

	return {
		title: monster.title,
		description: monster.description,
	};
}

export default async function MonsterDetailPage({ params }: PageProps) {
	const resolvedParams = await params;
	setRequestLocale(resolvedParams.lang);
	const monsterId = getSlugParam(resolvedParams.monsterSlug);
	const monster: Monster = await apiFetch(`/monsters/${monsterId}`);

	return (
		<PageLayout>
			<MonsterDetail monster={monster} />
		</PageLayout>
	);
}
