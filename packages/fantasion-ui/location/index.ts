// Location domain components
export * from "./Address.js";
export * from "./Location.js";
export * from "./LocationAddress.js";
export * from "./LocationFuzzyName.js";
export * from "./LocationMap.js";

// Location-related utility
export const joinAddressValue = (value: (string | undefined)[] | string | undefined, delimiter = " ") =>
	Array.isArray(value) ? value.filter(Boolean).join(delimiter) : value;

// Location types (used by transport and other domains)
export type LocationType = {
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
