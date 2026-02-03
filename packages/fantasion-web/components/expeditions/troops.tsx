"use client";

import { Card, CardBody, CardHeader, ListGroup, ListGroupItem } from "@fantasion/ui";
import classnames from "classnames";
import { DateTimeLabel } from "@/datetime/DateTimeLabel";
import { getDaysDuration } from "@/datetime/formatters";
import { ArticleStub } from "../../content/Article";
import { Heading, Section } from "../../content/content";
import { BusDepartureIcon, DurationIcon, IconLabel, PersonIcon, StoryIcon } from "../../content/icons";
import { Link } from "../../content/links";
import { PriceTag } from "../../content/money/PriceTag";
import { useTranslation } from "../../lib/i18n-context";
import { slug } from "../../slugs";
import {
	TRANSPORT_ARRIVED,
	TRANSPORT_BACK,
	type TRANSPORT_BOARDING,
	TRANSPORT_DEPARTED,
	type TRANSPORT_IN_PLACE,
	TRANSPORT_THERE,
} from "../transports/constants";
import { SignupButton } from "./expeditions";
import styles from "./troops.module.scss";

type Id = number;

type TransportStatus =
	| typeof TRANSPORT_IN_PLACE
	| typeof TRANSPORT_BOARDING
	| typeof TRANSPORT_DEPARTED
	| typeof TRANSPORT_ARRIVED;

type TransportDirection = typeof TRANSPORT_THERE | typeof TRANSPORT_BACK;

type Price = {
	id: Id;
	active: boolean;
	price: number | string;
	expired?: boolean;
	future?: boolean;
	availableSince?: string | null;
	availableUntil?: string | null;
	[key: string]: unknown;
};

type AgeGroup = {
	title: string;
	ageMin: number;
	ageMax: number;
};

type Program = {
	id: number;
	title: string;
};

type TransportStop = {
	name: string;
};

type Transport = {
	id: Id;
	status: TransportStatus;
	departsFrom: TransportStop;
	arrivesTo: TransportStop;
	departsAt?: string;
	arrivesAt?: string;
};

type TroopTransport = {
	id: Id;
	direction: TransportDirection;
	transport: Transport;
};

export type Troop = {
	id: Id;
	ageGroup: AgeGroup;
	startsAt: string;
	endsAt: string;
	program: Program;
	troopTransports: TroopTransport[];
	prices: Price[];
	priceIncludes?: string;
	[key: string]: unknown;
};

type TroopLabelProps = {
	ageMin: number;
	ageMax: number;
	startsAt: string;
	endsAt: string;
};

type ExpeditionBase = {
	id: number;
	title: string;
};

type LeisureCentreBase = {
	id: number;
	title: string;
	location?: { fuzzyName?: string | null; title?: string | null } | null;
};

type BatchBase = {
	id: number;
	startsAt: string;
	endsAt: string;
	leisureCentre?: LeisureCentreBase | null;
	troops: Troop[];
};

type TroopCardProps = {
	expedition: ExpeditionBase;
	batch: BatchBase;
	troop: Troop;
};

export const isPriceAvailable = (price: Price) => price.active;

type PriceLike = { active: boolean };
type TroopLike = { prices: PriceLike[]; [key: string]: unknown };
export const isTroopAvailable = (troop: TroopLike) => troop.prices.some((price) => price.active);

export const TroopLabel = ({ ageMin, ageMax, startsAt, endsAt }: TroopLabelProps) => {
	const { t } = useTranslation();
	return (
		<IconLabel
			icon={PersonIcon}
			text={`${t("age-limit", { ageMin: ageMin, ageMax: ageMax })}, ${t("expedition-length", {
				daysLength: getDaysDuration(startsAt, endsAt),
			})}`}
		/>
	);
};

const TroopTransportLinkLabel = ({ direction, transport }: { direction: TransportDirection; transport: Transport }) => {
	const { t } = useTranslation();
	if (transport.status === TRANSPORT_DEPARTED) {
		return t("transport-en-route");
	}
	if (transport.status === TRANSPORT_ARRIVED) {
		return t("transport-arrived");
	}
	const dest = direction === TRANSPORT_BACK ? transport.arrivesTo : transport.departsFrom;
	const date = direction === TRANSPORT_BACK ? transport.arrivesAt : transport.departsAt;
	if (date) {
		const closingParen = ")";
		return (
			<span>
				{`${dest.name} (`}
				<DateTimeLabel date={date} />
				{closingParen}
			</span>
		);
	}
	return dest.name;
};

const TroopTransportDirection = ({ direction }: { direction: TransportDirection }) => {
	const { t } = useTranslation();
	if (direction === TRANSPORT_THERE) {
		return `${t("transport-there")}: `;
	}
	if (direction === TRANSPORT_BACK) {
		return `${t("transport-back")}: `;
	}
	return null;
};

const TroopTransportLink = ({ troopTransport }: { troopTransport: TroopTransport }) => (
	<Link route="transportDetail" params={{ transportId: String(troopTransport.transport.id) }}>
		<TroopTransportDirection direction={troopTransport.direction} />
		<TroopTransportLinkLabel direction={troopTransport.direction} transport={troopTransport.transport} />
	</Link>
);

export const TroopCard = ({ expedition, batch, troop }: TroopCardProps) => {
	const { t } = useTranslation();
	return (
		<Section component={Card}>
			<CardHeader>
				<Heading level={3} className="mt-2">
					{troop.ageGroup.title}
				</Heading>
			</CardHeader>
			<ListGroup flush={true}>
				<ListGroupItem>
					<IconLabel
						icon={PersonIcon}
						text={t("age-limit", {
							ageMin: troop.ageGroup.ageMin,
							ageMax: troop.ageGroup.ageMax,
						})}
					/>
				</ListGroupItem>
				<ListGroupItem>
					<IconLabel
						icon={DurationIcon}
						text={t("expedition-length", {
							daysLength: getDaysDuration(troop.startsAt, troop.endsAt),
						})}
					/>
				</ListGroupItem>
				<ListGroupItem>
					<IconLabel
						icon={StoryIcon}
						text={
							<Link route="adventureDetail" params={{ expeditionThemeSlug: slug(troop.program) }}>
								{troop.program.title}
							</Link>
						}
					/>
				</ListGroupItem>
				{troop.troopTransports.map((tt: TroopTransport) => (
					<ListGroupItem key={tt.id}>
						<IconLabel icon={BusDepartureIcon} text={<TroopTransportLink troopTransport={tt} />} />
					</ListGroupItem>
				))}
				<ListGroupItem>
					<ul className="mb-0">
						{troop.prices.map((price: Price) => (
							<li key={price.id}>
								<PriceTag {...price} />
							</li>
						))}
					</ul>
				</ListGroupItem>
				{troop.priceIncludes && (
					<ListGroupItem>
						<ArticleStub
							className={classnames("mt-3", styles.priceIncludes)}
							heading={t("signup-troop-price-includes")}
							text={troop.priceIncludes}
						/>
					</ListGroupItem>
				)}
			</ListGroup>
			{isTroopAvailable(troop) ? (
				<CardBody>
					<SignupButton expedition={expedition} batch={batch} troop={troop} />
				</CardBody>
			) : null}
		</Section>
	);
};
