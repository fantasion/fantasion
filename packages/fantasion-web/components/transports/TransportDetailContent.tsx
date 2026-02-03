"use client";

import { Col, Container, Row } from "@fantasion/ui";
import classnames from "classnames";
import type { MediaObjectType } from "@/components/media";
import { Heading } from "@/content/Heading";
import { Breadcrumbs } from "@/layout/Breadcrumbs";
import { useTranslation } from "../../lib/i18n-context";
import { Itinerary, TransportTroops, Vehicle } from "./transports";
import styles from "./transports.module.scss";

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
};

type ExpeditionType = {
	title: string;
};

type BatchType = {
	id: number | string;
	expedition: ExpeditionType;
};

type AgeGroupType = {
	title: string;
};

type TroopType = {
	startsAt: string;
	endsAt: string;
	ageGroup: AgeGroupType;
	batch: BatchType;
};

type TroopTransportType = {
	id: number | string;
	troop: TroopType;
};

type VehicleType = {
	title?: string | null;
	description?: string | null;
	brand?: string | null;
	model?: string | null;
	color?: string | null;
	year?: string | number | null;
	media: MediaObjectType[];
};

type TransportType = {
	status: string | number;
	description?: string | null;
	departsAt?: string | null;
	arrivesAt?: string | null;
	departsFrom?: LocationType | null;
	arrivesTo?: LocationType | null;
	gpsTrackingUrl?: string | undefined;
	troopTransports: TroopTransportType[];
	vehicle: VehicleType;
};

type TransportDetailContentProps = {
	transport: TransportType;
	transportId: string;
};

export function TransportDetailContent({ transport, transportId }: TransportDetailContentProps) {
	const { t } = useTranslation();
	const title = t("transport-detail", { transportId: transportId });
	return (
		<Container as="article" className={classnames("mt-3", styles.page)}>
			<Breadcrumbs links={[{ route: "adventureList", children: t("adventures-title") }, { children: title }]} />
			<header>
				<Heading level={1}>{title}</Heading>
			</header>
			<Row>
				<Col md={6} lg={5} xl={6} className="mt-3">
					<Itinerary transport={transport} />
					<TransportTroops troopTransports={transport.troopTransports} />
				</Col>
				<Col md={6} lg={5} xl={6} className="mt-3">
					<Vehicle vehicle={transport.vehicle} />
				</Col>
			</Row>
		</Container>
	);
}
