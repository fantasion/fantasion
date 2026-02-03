import { joinAddressValue } from "./index.js";

export const OptionalBreak = ({ br }: { br?: boolean }) => (br ? <br /> : null);

export const AddressLine = ({
	br = true,
	value,
}: {
	br?: boolean;
	value: (string | undefined)[] | string | undefined;
}) => {
	const strValue = joinAddressValue(value);
	return strValue ? (
		<>
			{strValue}
			<OptionalBreak br={Boolean(strValue && br)} />
		</>
	) : null;
};

export type AddressProps = {
	title?: string;
	street?: string;
	streetNumber?: string;
	city?: string;
	postalCode?: string;
};

export const Address = ({ title, street, streetNumber, city, postalCode }: AddressProps) => (
	<address>
		<AddressLine value={title} />
		<AddressLine value={[street, streetNumber]} />
		<AddressLine value={city} />
		<AddressLine value={postalCode} />
	</address>
);
