"use client";

import { Col, Container, Row } from "@fantasion/ui";
import { ArticleBody, ArticleLead } from "@/content/Article";
import { Heading } from "@/content/Heading";
import { Breadcrumbs } from "@/layout/Breadcrumbs";
import { slug } from "@/slugs";
import { useTranslation } from "../../lib/i18n-context";
import { LeisureCentreStub } from "../leisureCentres";
import type { MediaObjectType } from "../media";
import { ThumbGallery } from "../media";
import {
	ExpeditionBatches,
	type ExpeditionBatchType,
	ExpeditionTheme,
	type ExpeditionThemeType,
	getDefaultBase,
} from "./expeditions";

type Expedition = {
	id: number;
	title: string;
	description?: string;
	detailedDescription?: string;
	batches: ExpeditionBatchType[];
	media: MediaObjectType[];
	theme?: ExpeditionThemeType | null;
	[key: string]: unknown;
};

type ExpeditionDetailContentProps = {
	expedition: Expedition;
};

export function ExpeditionDetail({ expedition }: ExpeditionDetailContentProps) {
	const { t } = useTranslation();
	const defaultBase = getDefaultBase(expedition.batches);
	return (
		<Container as="article" className="mt-3">
			<Breadcrumbs
				links={[
					{ route: "adventureList", children: t("adventures-title") },
					{
						route: "expeditionDetail",
						params: { expeditionSlug: slug(Number(expedition.id), expedition.title) },
						children: expedition.title,
					},
				]}
			/>
			<Row>
				<Col lg={6}>
					<Heading level={1}>{expedition.title}</Heading>
					<ArticleLead text={expedition.description} />
					<ArticleBody text={expedition.detailedDescription} />
				</Col>
				<Col lg={6}>
					<ExpeditionBatches batches={expedition.batches} expedition={expedition} />
				</Col>
				<Col lg={6}>
					<ThumbGallery className="mt-3" media={expedition.media} />
				</Col>
				<Col lg={6}>{expedition.theme ? <ExpeditionTheme theme={expedition.theme} /> : null}</Col>
				{/* @ts-expect-error - Type mismatch between getDefaultBase return and LeisureCentreStub props */}
				<Col lg={6}>{defaultBase ? <LeisureCentreStub leisureCentre={defaultBase} /> : null}</Col>
			</Row>
		</Container>
	);
}
