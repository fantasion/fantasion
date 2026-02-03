import { AddressLine } from "./Address.js";
import type { LocationType } from "./index.js";

export type LocationAddressProps = {
	location: LocationType;
	title?: string;
};

export const LocationAddress = ({ location, title }: LocationAddressProps) => (
	<address>
		<AddressLine value={title} />
		<AddressLine value={location.name} />
		<AddressLine value={[location.street, location.streetNumber]} />
		<AddressLine value={[location.city, location.postalCode]} />
		<AddressLine value={location.country?.name} />
	</address>
);
