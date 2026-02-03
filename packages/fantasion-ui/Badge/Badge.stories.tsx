import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge.js";

const meta: Meta<typeof Badge> = {
	title: "Components/Badge",
	component: Badge,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"],
			description: "Visual style variant of the badge",
			table: {
				defaultValue: { summary: "primary" },
			},
		},
		pill: {
			control: "boolean",
			description: "Use pill shape with fully rounded corners",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		lg: {
			control: "boolean",
			description: "Large size variant",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		positioned: {
			control: "boolean",
			description: "Position badge absolutely (e.g., notification badges)",
			table: {
				defaultValue: { summary: "false" },
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Badge",
		variant: "primary",
	},
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
			<Badge variant="primary">Primary</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="danger">Danger</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="info">Info</Badge>
			<Badge variant="light">Light</Badge>
			<Badge variant="dark">Dark</Badge>
		</div>
	),
};

export const Pill: Story = {
	args: {
		children: "Pill Badge",
		variant: "primary",
		pill: true,
	},
};

export const Large: Story = {
	args: {
		children: "Large Badge",
		variant: "primary",
		lg: true,
	},
};

export const Positioned: Story = {
	render: () => (
		<div style={{ position: "relative", display: "inline-block", padding: "1rem" }}>
			<button type="button" style={{ padding: "0.5rem 1rem" }}>
				Notifications
			</button>
			<Badge variant="danger" positioned={true}>
				5
			</Badge>
		</div>
	),
};

export const Empty: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
			<span>Status:</span>
			<Badge variant="success" />
			<span>Online</span>
		</div>
	),
};
