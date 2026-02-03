import type { Meta, StoryObj } from "@storybook/react";
import { PriceLabel } from "./PriceLabel.js";

// Simple icon components for demonstration
const CoinIcon = () => <span style={{ fontSize: "1.2em" }}>💰</span>;
const TagIcon = () => <span style={{ fontSize: "1.2em" }}>🏷️</span>;
const CartIcon = () => <span style={{ fontSize: "1.2em" }}>🛒</span>;

const meta: Meta<typeof PriceLabel> = {
	title: "Domain/Money/PriceLabel",
	component: PriceLabel,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		priceIcon: {
			description: "Icon component to display before price",
		},
		priceText: {
			control: "text",
			description: "Price text or component to display",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		priceIcon: CoinIcon,
		priceText: "1 500 Kč",
	},
};

export const WithTag: Story = {
	args: {
		priceIcon: TagIcon,
		priceText: "2 500 Kč",
	},
};

export const WithCart: Story = {
	args: {
		priceIcon: CartIcon,
		priceText: "3 999 Kč",
	},
};

export const DifferentPrices: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<PriceLabel priceIcon={CoinIcon} priceText="50 Kč" />
			<PriceLabel priceIcon={TagIcon} priceText="1 200 Kč" />
			<PriceLabel priceIcon={CartIcon} priceText="5 000 Kč" />
			<PriceLabel priceIcon={CoinIcon} priceText="Free" />
		</div>
	),
};
