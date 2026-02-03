import {
	type LocationType,
	Location as UiLocation,
	LocationFuzzyName as UiLocationFuzzyName,
	LocationMap as UiLocationMap,
} from "@fantasion/ui";
import { LocationPinIcon } from "../content/icons";

type LocationProps = {
	location: LocationType;
};

// Re-export types from @fantasion/ui
export type { LocationAddressProps, LocationProps, LocationType } from "@fantasion/ui";
// Re-export LocationAddress directly (no i18n needed)
export { LocationAddress } from "@fantasion/ui";

export const Location = ({ location }: LocationProps) => (
	<UiLocation location={location} locationIcon={LocationPinIcon} />
);

export const LocationMap = ({ location }: LocationProps) => {
	const key = "AIzaSyDZAOm63J4-B0hXyWW0dC9wr8gug5JEnN0";
	return <UiLocationMap location={location} googleMapsApiKey={key} />;
};

export const LocationFuzzyName = ({ location }: LocationProps) => (
	<UiLocationFuzzyName location={location} locationIcon={LocationPinIcon} />
);
