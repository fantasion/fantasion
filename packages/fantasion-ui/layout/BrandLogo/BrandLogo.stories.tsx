import type { Meta, StoryObj } from "@storybook/react";
import { BrandLogo } from "./BrandLogo.js";

const meta: Meta<typeof BrandLogo> = {
	title: "Layout/BrandLogo",
	component: BrandLogo,
	tags: ["autodocs"],
	argTypes: {
		logoSrc: {
			control: "text",
			description: "URL to the SVG logo file",
		},
		width: {
			control: { type: "number", min: 16, max: 256 },
			description: "Width of the logo",
			table: { defaultValue: { summary: "32" } },
		},
		height: {
			control: { type: "number", min: 16, max: 256 },
			description: "Height of the logo",
			table: { defaultValue: { summary: "32" } },
		},
		viewBox: {
			control: "text",
			description: "ViewBox for the SVG (e.g., '0 0 100 100')",
		},
		symbolId: {
			control: "text",
			description: "ID of the symbol in the SVG to reference (for sprite sheets)",
		},
		alt: {
			control: "text",
			description: "Alt text / aria-label for the logo",
			table: { defaultValue: { summary: "Logo" } },
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

// Using a data URI for a simple placeholder SVG
const placeholderSvg =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23472a7e'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='14'%3ELogo%3C/text%3E%3C/svg%3E";

export const Default: Story = {
	args: {
		logoSrc: placeholderSvg,
		width: 64,
		height: 64,
		alt: "Brand Logo",
	},
};

export const Small: Story = {
	args: {
		logoSrc: placeholderSvg,
		width: 24,
		height: 24,
		alt: "Small Logo",
	},
};

export const Large: Story = {
	args: {
		logoSrc: placeholderSvg,
		width: 128,
		height: 128,
		alt: "Large Logo",
	},
};

export const WithCustomClass: Story = {
	args: {
		logoSrc: placeholderSvg,
		width: 64,
		height: 64,
		alt: "Styled Logo",
		className: "p-2 bg-light rounded",
	},
};
