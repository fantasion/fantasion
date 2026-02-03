import type { ComponentType } from "react";
import type { LocationType } from "./index.js";
import { LocationAddress } from "./LocationAddress.js";

export type LocationProps = {
	location: LocationType;
	locationIcon: ComponentType;
};

export const Location = ({ location, locationIcon: LocationIcon }: LocationProps) => (
	<div className="d-flex">
		<div className="me-2">
			<LocationIcon />
		</div>
		<div>
			<LocationAddress location={location} />
		</div>
	</div>
);
