"use client";

import {
	ListGroup,
	ListGroupItem,
	BusHint as UiBusHint,
	BusSpinner as UiBusSpinner,
	ItineraryStepStatus as UiItineraryStepStatus,
	TransportStatus as UiTransportStatus,
} from "@fantasion/ui";
import { DateRange } from "@/datetime/DateRange";
import { DateTimeLabel } from "@/datetime/DateTimeLabel";
import { ArticleBody } from "../../content/Article";
import { Heading, Section } from "../../content/content";
import { BusDepartureIcon, CheckIcon, DownIcon, IconLabel } from "../../content/icons";
import { Link } from "../../content/links";
import { useTranslation } from "../../lib/i18n-context";
import { slug } from "../../slugs";
import { Location } from "../locations";
import type { MediaObjectType } from "../media";
import { ThumbGallery } from "../media";
import { TRANSPORT_ARRIVED, TRANSPORT_BOARDING, TRANSPORT_DEPARTED, TRANSPORT_IN_PLACE } from "./constants";

type LocationType = {
	name?: string;
	street?: string;
	streetNumber?: string;
	city?: string;
	postalCode?: string;
	country?: { name?: string };
	fuzzyName?: string | null;
	lat?: number;
	lng?: number;
	[key: string]: unknown;
};

type ExpeditionType = {
	title: string;
	[key: string]: unknown;
};

type BatchType = {
	id: number | string;
	expedition: ExpeditionType;
	[key: string]: unknown;
};

type AgeGroupType = {
	title: string;
	[key: string]: unknown;
};

type TroopType = {
	startsAt: string;
	endsAt: string;
	ageGroup: AgeGroupType;
	batch: BatchType;
	[key: string]: unknown;
};

type TroopTransportType = {
	id: number | string;
	troop: TroopType;
	[key: string]: unknown;
};

type TransportStatusType =
	| typeof TRANSPORT_BOARDING
	| typeof TRANSPORT_DEPARTED
	| typeof TRANSPORT_ARRIVED
	| typeof TRANSPORT_IN_PLACE
	| (string | number);

type TransportType = {
	status: TransportStatusType;
	description?: string | null;
	departsAt?: string | null;
	arrivesAt?: string | null;
	departsFrom?: LocationType | null;
	arrivesTo?: LocationType | null;
	gpsTrackingUrl?: string | undefined;
	[key: string]: unknown;
};

type VehicleType = {
	title?: string | null;
	description?: string | null;
	brand?: string | null;
	model?: string | null;
	color?: string | null;
	year?: string | number | null;
	media: MediaObjectType[];
	[key: string]: unknown;
};

const BusSpinner = UiBusSpinner;

const ItineraryStepStatus = ({
	boarding,
	departed,
	arrived,
}: {
	boarding?: boolean;
	departed?: boolean;
	arrived?: boolean;
}) => {
	const { t } = useTranslation();
	return (
		<UiItineraryStepStatus
			boarding={boarding}
			departed={departed}
			arrived={arrived}
			checkIcon={CheckIcon}
			busSpinnerIcon={BusSpinner}
			departedLabel={t("transport-departed")}
			arrivedLabel={t("transport-arrived")}
			boardingLabel={t("transport-boarding")}
		/>
	);
};

const BusHint = ({ enRoute, inPlace }: { enRoute?: boolean; inPlace?: boolean }) => {
	const { t } = useTranslation();
	return (
		<UiBusHint
			enRoute={enRoute}
			inPlace={inPlace}
			enRouteLabel={t("transport-en-route")}
			inPlaceLabel={t("transport-in-place")}
		/>
	);
};

type ItineraryStepProps = {
	title: string;
	date?: string | null;
	location?: LocationType | null;
	arrived?: boolean;
	boarding?: boolean;
	departed?: boolean;
	enRoute?: boolean;
	inPlace?: boolean;
};

const ItineraryStep = ({
	arrived = false,
	boarding = false,
	date,
	departed = false,
	enRoute = false,
	inPlace = false,
	location,
	title,
}: ItineraryStepProps) => {
	if (!(date && location)) {
		return null;
	}
	return (
		<div>
			<Heading level={3}>{title}</Heading>
			<div>
				<IconLabel
					icon={BusDepartureIcon}
					text={
						<>
							<DateTimeLabel date={date} /> <BusHint enRoute={enRoute} inPlace={inPlace} />
						</>
					}
				/>
			</div>
			<div>
				<ItineraryStepStatus arrived={arrived} boarding={boarding} departed={departed} />
			</div>
			<Location location={location} />
		</div>
	);
};

const TransportStatus = ({ transport }: { transport: TransportType }) => {
	const { t } = useTranslation();
	return (
		<UiTransportStatus
			transport={transport}
			downIcon={DownIcon}
			linkComponent={Link}
			gpsLinkLabel={t("transport-watch")}
		/>
	);
};

export const Itinerary = ({ transport }: { transport: TransportType }) => {
	const { t } = useTranslation();
	return (
		<Section>
			{transport.description && <ArticleBody text={transport.description} />}
			<ItineraryStep
				date={transport.departsAt}
				boarding={transport.status === TRANSPORT_BOARDING}
				departed={transport.status === TRANSPORT_DEPARTED || transport.status === TRANSPORT_ARRIVED}
				inPlace={transport.status === TRANSPORT_IN_PLACE}
				location={transport.departsFrom}
				title={t("transport-departure")}
			/>
			<TransportStatus transport={transport} />
			<ItineraryStep
				date={transport.arrivesAt}
				arrived={transport.status === TRANSPORT_ARRIVED}
				enRoute={transport.status === TRANSPORT_DEPARTED}
				location={transport.arrivesTo}
				title={t("transport-arrival")}
			/>
		</Section>
	);
};

export const Vehicle = ({ vehicle }: { vehicle: VehicleType }) => {
	const { t } = useTranslation();
	return (
		<Section>
			{vehicle.title && <Heading level={2}>{vehicle.title}</Heading>}
			{vehicle.description && <ArticleBody text={vehicle.description} />}
			<ListGroup className="mt-3">
				{(vehicle.brand || vehicle.model) && (
					<ListGroupItem>
						{t("label-with-colon", { label: t("vehicle-model") })} {vehicle.brand} {vehicle.model}
					</ListGroupItem>
				)}
				{vehicle.color && (
					<ListGroupItem>
						{t("label-with-colon", { label: t("vehicle-color") })} {vehicle.color}
					</ListGroupItem>
				)}
				{vehicle.year && (
					<ListGroupItem>
						{t("label-with-colon", { label: t("vehicle-year") })} {vehicle.year}
					</ListGroupItem>
				)}
			</ListGroup>
			<ThumbGallery media={vehicle.media ?? []} />
		</Section>
	);
};

const Troop = ({ troop }: { troop: TroopType }) => {
	const closingParen = ")";
	return (
		<Link
			route="expeditionBatchDetail"
			params={{
				expeditionBatchSlug: slug(String(troop.batch.id), troop.batch.expedition.title),
			}}
		>
			<span>
				{`${troop.batch.expedition.title}-${troop.ageGroup.title} (`}
				<DateRange start={troop.startsAt} end={troop.endsAt} />
				{closingParen}
			</span>
		</Link>
	);
};

export const TransportTroops = ({ troopTransports }: { troopTransports: TroopTransportType[] }) => {
	const { t } = useTranslation();

	if (troopTransports.length === 0) {
		return 0;
	}

	return (
		<Section className="mt-3">
			<Heading level={2}>{t("transport-carries")}</Heading>
			<ul>
				{troopTransports.map((tt: TroopTransportType) => (
					<li key={tt.id}>
						<Troop troop={tt.troop} />
					</li>
				))}
			</ul>
		</Section>
	);
};
