// Transport domain components

export type { BusHintProps } from "./BusHint.js";
export { BusHint } from "./BusHint.js";
export { BusSpinner } from "./BusSpinner.js";
export type { ItineraryStepStatusProps } from "./ItineraryStepStatus.js";
export { ItineraryStepStatus } from "./ItineraryStepStatus.js";
export type { TransportGpsLinkProps } from "./TransportGpsLink.js";
export { TransportGpsLink } from "./TransportGpsLink.js";
export type { TransportStatusProps } from "./TransportStatus.js";
export { TransportStatus } from "./TransportStatus.js";
export { TravelSpinner } from "./TravelSpinner/index.js";

// Transport constants
export const TRANSPORT_IN_PLACE = 2;
export const TRANSPORT_BOARDING = 3;
export const TRANSPORT_DEPARTED = 4;
export const TRANSPORT_ARRIVED = 5;
export const TRANSPORT_THERE = 1;
export const TRANSPORT_BACK = 2;

// Re-export from other domains
import type { LocationType } from "../location/index.js";
import type { MediaObjectType } from "../media/index.js";

export type { LocationType } from "../location/index.js";
export type { MediaObjectType } from "../media/index.js";

export type TransportStatusType =
	| typeof TRANSPORT_BOARDING
	| typeof TRANSPORT_DEPARTED
	| typeof TRANSPORT_ARRIVED
	| typeof TRANSPORT_IN_PLACE
	| (string | number);

export type TransportType = {
	status: TransportStatusType;
	description?: string | null;
	departsAt?: string | null;
	arrivesAt?: string | null;
	departsFrom?: LocationType | null;
	arrivesTo?: LocationType | null;
	gpsTrackingUrl?: string | undefined;
	[key: string]: unknown;
};

export type VehicleType = {
	title?: string | null;
	description?: string | null;
	brand?: string | null;
	model?: string | null;
	color?: string | null;
	year?: string | number | null;
	media: MediaObjectType[];
	[key: string]: unknown;
};
