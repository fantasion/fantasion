"use client";

import { Button, Card, CardBody, Col, Container, Row } from "@fantasion/ui";
import { Article, ArticleBody } from "../content/Article";
import { Heading } from "../content/content";
import { Link } from "../content/links";
import { useTranslation } from "../lib/i18n-context";
import { slug } from "../slugs";
import { ExpeditionLinks } from "./expeditions/expeditionLinks";
import { LocationAddress } from "./locations";
import type { MediaObjectType } from "./media";

type Location = {
	[key: string]: unknown;
};

type Expedition = {
	id: number;
	title: string;
};

type LeisureCentreType = {
	id: number;
	title: string;
	description?: string;
	detailedDescription?: string;
	location: Location;
	mailingAddress?: Location;
	media: MediaObjectType[];
	expeditions: Expedition[];
};

type LeisureCentreLocationBlockProps = {
	location: Location;
	mailingAddress?: Location;
};

type LeisureCentreProps = {
	leisureCentre: LeisureCentreType;
};

type LeisureCentreListProps = {
	leisureCentres: LeisureCentreType[];
};

type LeisureCentreStubProps = {
	leisureCentre?: LeisureCentreType;
};

const LeisureCentreLocationBlock = ({ location, mailingAddress }: LeisureCentreLocationBlockProps) => {
	const { t } = useTranslation();
	return (
		<Container>
			<Row>
				<Col className="mt-3" md={6}>
					<Card>
						<CardBody>
							<LocationAddress location={location} title={t("leisure-centre-location")} />
						</CardBody>
					</Card>
				</Col>
				{mailingAddress ? (
					<Col className="mt-3" md={6}>
						<Card>
							<CardBody>
								<LocationAddress location={mailingAddress} title={t("leisure-centre-mailing-address")} />
							</CardBody>
						</Card>
					</Col>
				) : null}
			</Row>
		</Container>
	);
};

export const LeisureCentre = ({ leisureCentre }: LeisureCentreProps) => (
	<Container>
		<Article
			description={leisureCentre.description}
			media={leisureCentre.media}
			beforeText={
				<LeisureCentreLocationBlock location={leisureCentre.location} mailingAddress={leisureCentre.mailingAddress} />
			}
			afterText={
				leisureCentre.expeditions.length === 0 ? null : <ExpeditionLinks expeditions={leisureCentre.expeditions} />
			}
			selfLink={{
				route: "leisureCentreDetail",
				params: {
					leisureCentreSlug: slug(leisureCentre),
				},
			}}
			text={leisureCentre.detailedDescription}
			title={leisureCentre.title}
		/>
	</Container>
);

export const LeisureCentreList = ({ leisureCentres }: LeisureCentreListProps) =>
	leisureCentres.map((leisureCentre: LeisureCentreType) => (
		<LeisureCentre key={leisureCentre.id} leisureCentre={leisureCentre} />
	));

export const LeisureCentreStub = ({ leisureCentre }: LeisureCentreStubProps) => {
	const { t } = useTranslation();
	if (!leisureCentre) {
		return null;
	}
	return (
		<section className="mt-3">
			<header>
				<Heading level={2}>
					<Link
						route="leisureCentreDetail"
						params={{
							leisureCentreSlug: slug(leisureCentre),
						}}
					>
						{t("expedition-where-is-it")}
					</Link>
				</Heading>
				<p>{leisureCentre.title}</p>
			</header>
			<ArticleBody text={leisureCentre.description} />
			<div className="mt-3">
				<Link
					as={Button}
					route="leisureCentreDetail"
					params={{
						leisureCentreSlug: slug(leisureCentre),
					}}
					variant="secondary"
				>
					{t("expedition-base-more-info")}
				</Link>
			</div>
		</section>
	);
};
