import type { Meta, StoryObj } from "@storybook/react";
import { Address } from "./Address.js";

const meta: Meta<typeof Address> = {
	title: "Domain/Location/Address",
	component: Address,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
	argTypes: {
		title: {
			control: "text",
			description: "Optional address title or name",
		},
		street: {
			control: "text",
			description: "Street name",
		},
		streetNumber: {
			control: "text",
			description: "Street number",
		},
		city: {
			control: "text",
			description: "City name",
		},
		postalCode: {
			control: "text",
			description: "Postal/ZIP code",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: "Fantasion Summer Camp",
		street: "Hlavní",
		streetNumber: "123",
		city: "Praha",
		postalCode: "110 00",
	},
};

export const CzechAddress: Story = {
	args: {
		title: "Centrum volného času",
		street: "Nádražní",
		streetNumber: "45",
		city: "Brno",
		postalCode: "602 00",
	},
};

export const WithoutTitle: Story = {
	args: {
		street: "Komenského",
		streetNumber: "789",
		city: "Ostrava",
		postalCode: "701 00",
	},
};

export const MinimalAddress: Story = {
	args: {
		city: "Plzeň",
	},
};

export const CompleteAddress: Story = {
	args: {
		title: "Hotel Fantasion",
		street: "Zámecká",
		streetNumber: "1",
		city: "Karlovy Vary",
		postalCode: "360 01",
	},
};

export const MultipleAddresses: Story = {
	render: () => (
		<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
			<Address title="Prague Office" street="Václavské náměstí" streetNumber="1" city="Praha 1" postalCode="110 00" />
			<Address title="Brno Office" street="Masarykova" streetNumber="24" city="Brno" postalCode="602 00" />
		</div>
	),
};
