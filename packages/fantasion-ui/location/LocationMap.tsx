import { joinAddressValue, type LocationType } from "./index.js";

export type LocationMapProps = {
	location: LocationType;
	googleMapsApiKey: string;
};

export const LocationMap = ({ location, googleMapsApiKey }: LocationMapProps) => {
	const query =
		location.lat && location.lng
			? `${location.lat},${location.lng}`
			: encodeURIComponent(
					joinAddressValue(
						[location.country?.name, location.city, location.street, location.streetNumber, location.postalCode],
						", ",
					) || "",
				);

	const src = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${query}`;
	return <iframe src={src} title={`Map of ${location.name}`} />;
};
