import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner.js";

const meta: Meta<typeof Spinner> = {
	title: "Components/Spinner",
	component: Spinner,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		animation: {
			control: "select",
			options: ["border", "grow"],
		},
		variant: {
			control: "select",
			options: ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"],
		},
		size: {
			control: "select",
			options: [undefined, "sm"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		animation: "border",
	},
};

export const Border: Story = {
	args: {
		animation: "border",
	},
};

export const Grow: Story = {
	args: {
		animation: "grow",
	},
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
			<Spinner variant="primary" />
			<Spinner variant="secondary" />
			<Spinner variant="success" />
			<Spinner variant="danger" />
			<Spinner variant="warning" />
			<Spinner variant="info" />
			<Spinner variant="dark" />
		</div>
	),
};

export const Small: Story = {
	args: {
		animation: "border",
		size: "sm",
	},
};

export const SmallVariants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
			<Spinner variant="primary" size="sm" />
			<Spinner variant="secondary" size="sm" />
			<Spinner variant="success" size="sm" />
			<Spinner variant="danger" size="sm" />
		</div>
	),
};

export const GrowVariants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
			<Spinner animation="grow" variant="primary" />
			<Spinner animation="grow" variant="secondary" />
			<Spinner animation="grow" variant="success" />
			<Spinner animation="grow" variant="danger" />
		</div>
	),
};
