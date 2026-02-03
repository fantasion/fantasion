"use client";

import { Button, Col, Container, Row } from "@fantasion/ui";
import classnames from "classnames";
import { Heading, MarkdownContent } from "../../content/content";
import { Link } from "../../content/links";
import { useTranslation } from "../../lib/i18n-context";
import type { PublicObject } from "../../slugs";
import { slug } from "../../slugs";
import { GeneralNewsletterForm } from "../GeneralNewsletterForm";
import { SlideShowGallery } from "../media";
import styles from "./ExpeditionList.module.scss";
import type { ExpeditionBatchType, ExpeditionType } from "./expeditions";
import { ExpeditionBatchSummary } from "./expeditions";

const COL_FULL_WIDTH = 12;
const COL_HALF_WIDTH = 6;

type Media = {
	[key: string]: unknown;
};

interface Expedition extends ExpeditionType, PublicObject {
	description: string;
	media: Media[];
	batches: ExpeditionBatchType[];
}

type ExpeditionListData = {
	results: Expedition[];
};

type ExpeditionC2aProps = {
	expedition: Expedition;
};

type ExpeditionProps = {
	expedition: Expedition;
};

type ExpeditionListProps = {
	expeditions: ExpeditionListData;
	[key: string]: unknown;
};

const ExpeditionC2A = ({ expedition }: ExpeditionC2aProps) => {
	const { t } = useTranslation();
	return (
		<div className="mt-3">
			<Link
				as={Button}
				route="expeditionDetail"
				params={{ expeditionSlug: slug(expedition) }}
				size="lg"
				variant="secondary"
				className={styles.bfb}
			>
				{t("expedition-button-more-info")}
			</Link>
		</div>
	);
};

const Expedition = ({ expedition }: ExpeditionProps) => {
	const params = { expeditionSlug: slug(expedition) };
	return (
		<Row as="article" className={styles.expedition}>
			<Col
				md={expedition.media.length === 0 ? COL_FULL_WIDTH : COL_HALF_WIDTH}
				className={classnames("d-flex align-items-center", styles.descriptionColumn)}
			>
				<div className={styles.expeditionDescription}>
					<Heading level={2}>
						<Link route="expeditionDetail" params={params}>
							{expedition.title}
						</Link>
					</Heading>
					<MarkdownContent>{expedition.description}</MarkdownContent>
					<ExpeditionBatchSummary expedition={expedition} batches={expedition.batches} className={styles.batches} />
					<ExpeditionC2A expedition={expedition} />
				</div>
			</Col>
			{expedition.media.length === 0 ? null : (
				<Col md={6} className={classnames("d-flex align-items-center", styles.galleryColumn)}>
					<Link as={SlideShowGallery} route="expeditionDetail" params={params} media={expedition.media} square={true} />
				</Col>
			)}
		</Row>
	);
};

// @TODO: Design expeditions empty state
const NoExpeditions = () => {
	const { t } = useTranslation();
	return (
		<Container>
			<div className="above-decoration bg-primary p-4 text-white">
				<p>{t("expedition-list-empty")}</p>
				<GeneralNewsletterForm title={t("expedition-get-in-touch")} hideTitle={false} variant="secondary" />
			</div>
		</Container>
	);
};

export const ExpeditionList = ({ expeditions, ...props }: ExpeditionListProps) => {
	if (expeditions.results.length === 0) {
		return <NoExpeditions />;
	}
	return (
		<Container fluid="lg" {...props}>
			{expeditions.results.map((expedition) => (
				<Expedition expedition={expedition} key={expedition.id} />
			))}
		</Container>
	);
};
