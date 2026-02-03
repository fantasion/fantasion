import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { SelectBubble } from "./SelectBubble.js";

const meta: Meta<typeof SelectBubble> = {
	title: "Search/SelectBubble",
	component: SelectBubble,
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "The label text displayed in the bubble",
		},
		tooltip: {
			control: "text",
			description: "Optional tooltip shown on hover",
		},
		disabled: {
			control: "boolean",
			description: "Whether the bubble is disabled",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "JavaScript",
		onRemove: fn(),
	},
};

export const WithTooltip: Story = {
	args: {
		label: "React",
		tooltip: "A JavaScript library for building user interfaces",
		onRemove: fn(),
	},
};

export const LongLabel: Story = {
	args: {
		label: "This is a very long label that should be truncated",
		onRemove: fn(),
	},
};

export const Disabled: Story = {
	args: {
		label: "TypeScript",
		onRemove: fn(),
		disabled: true,
	},
};

export const NoRemoveButton: Story = {
	args: {
		label: "Read-only tag",
	},
};

export const Multiple: Story = {
	render: () => (
		<div style={{ display: "flex", flexWrap: "wrap" }}>
			<SelectBubble label="React" onRemove={fn()} />
			<SelectBubble label="TypeScript" onRemove={fn()} />
			<SelectBubble label="Node.js" onRemove={fn()} />
			<SelectBubble label="GraphQL" onRemove={fn()} />
		</div>
	),
};

export const CustomRemoveIcon: Story = {
	args: {
		label: "Custom icon",
		onRemove: fn(),
		removeIcon: "✕",
	},
};
