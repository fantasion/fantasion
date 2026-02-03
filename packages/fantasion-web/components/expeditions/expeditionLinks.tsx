"use client";

import { Heading } from "@/content/Heading";
import { Link } from "@/content/links";
import { slug } from "@/slugs";
import { useTranslation } from "../../lib/i18n-context";

type Expedition = {
	id: number;
	title: string;
};

type ExpeditionLinkProps = {
	expedition: Expedition;
};

type ExpeditionLinksProps = {
	expeditions: Expedition[];
};

const ExpeditionLink = ({ expedition }: ExpeditionLinkProps) => (
	<li>
		<Link route="expeditionDetail" params={{ expeditionSlug: slug(expedition) }}>
			{expedition.title}
		</Link>
	</li>
);

export const ExpeditionLinks = ({ expeditions }: ExpeditionLinksProps) => {
	const { t } = useTranslation();
	return (
		<section className="mt-3">
			<Heading level={2}>{t("adventure-expeditions-title")}</Heading>
			<ul>
				{expeditions.map((expedition: Expedition) => (
					<ExpeditionLink key={expedition.id} expedition={expedition} />
				))}
			</ul>
		</section>
	);
};
