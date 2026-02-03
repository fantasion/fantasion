import type { ComponentType } from "react";
import { IconLabel } from "../content/IconLabel.js";
import type { LocationType } from "./index.js";

export type LocationFuzzyNameProps = {
	location: LocationType;
	locationIcon: ComponentType;
};

export const LocationFuzzyName = ({ location, locationIcon }: LocationFuzzyNameProps) => (
	<IconLabel icon={locationIcon} text={location.fuzzyName || location.name || ""} />
);
