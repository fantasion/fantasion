import type { Meta, StoryObj } from "@storybook/react";
import { Money } from "./Money.js";

const meta: Meta<typeof Money> = {
	title: "Domain/Money/Money",
	component: Money,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		amount: {
			control: "number",
			description: "Monetary amount (number or string)",
		},
		currency: {
			control: "text",
			description: "ISO 4217 currency code (e.g., 'CZK', 'EUR', 'USD')",
			table: {
				defaultValue: { summary: "CZK" },
			},
		},
		locale: {
			control: "text",
			description: "Locale for formatting (e.g., 'cs-CZ', 'en-US')",
			table: {
				defaultValue: { summary: "cs-CZ" },
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		amount: 1234.56,
		currency: "CZK",
		locale: "cs-CZ",
	},
};

export const CzechKoruna: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
			<div>
				<strong>Small amount:</strong> <Money amount={50} currency="CZK" locale="cs-CZ" />
			</div>
			<div>
				<strong>Medium amount:</strong> <Money amount={1500} currency="CZK" locale="cs-CZ" />
			</div>
			<div>
				<strong>Large amount:</strong> <Money amount={25_000} currency="CZK" locale="cs-CZ" />
			</div>
			<div>
				<strong>With decimals:</strong> <Money amount={1234.56} currency="CZK" locale="cs-CZ" />
			</div>
		</div>
	),
};

export const Euro: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
			<div>
				<strong>Czech locale:</strong> <Money amount={99.99} currency="EUR" locale="cs-CZ" />
			</div>
			<div>
				<strong>English locale:</strong> <Money amount={99.99} currency="EUR" locale="en-US" />
			</div>
			<div>
				<strong>German locale:</strong> <Money amount={99.99} currency="EUR" locale="de-DE" />
			</div>
		</div>
	),
};

export const USDollar: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
			<div>
				<strong>US locale:</strong> <Money amount={1234.56} currency="USD" locale="en-US" />
			</div>
			<div>
				<strong>Czech locale:</strong> <Money amount={1234.56} currency="USD" locale="cs-CZ" />
			</div>
		</div>
	),
};

export const Zero: Story = {
	args: {
		amount: 0,
		currency: "CZK",
		locale: "cs-CZ",
	},
};

export const Negative: Story = {
	args: {
		amount: -500,
		currency: "CZK",
		locale: "cs-CZ",
	},
};

export const LargeNumbers: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
			<div>
				<strong>Thousand:</strong> <Money amount={1000} currency="CZK" locale="cs-CZ" />
			</div>
			<div>
				<strong>Million:</strong> <Money amount={1_000_000} currency="CZK" locale="cs-CZ" />
			</div>
			<div>
				<strong>Billion:</strong> <Money amount={1_000_000_000} currency="CZK" locale="cs-CZ" />
			</div>
		</div>
	),
};
