import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { Button } from "./Button.js";

const meta: Meta<typeof Button> = {
	title: "Components/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["primary", "secondary", "link", "outline-primary", "outline-secondary"],
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Button",
		variant: "primary",
	},
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="link">Link</Button>
			<Button variant="inline">Link</Button>
		</div>
	),
};

export const OutlineVariants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
			<Button variant="outline-primary">Primary</Button>
			<Button variant="outline-secondary">Secondary</Button>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
	),
};

export const Block: Story = {
	render: () => (
		<div style={{ width: "300px" }}>
			<Button block={true}>Block Button</Button>
		</div>
	),
};

export const Loading: Story = {
	args: {
		children: "Loading...",
		loading: true,
	},
};

export const Disabled: Story = {
	args: {
		children: "Disabled",
		disabled: true,
	},
};

export const Icon: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
			<Button icon={true} size="sm">
				+
			</Button>
			<Button icon={true}>+</Button>
			<Button icon={true} size="lg">
				+
			</Button>
		</div>
	),
};

export const ClickTest: Story = {
	args: {
		children: "Click me",
		onClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button");

		await userEvent.click(button);
		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};

export const DisabledClickTest: Story = {
	args: {
		children: "Disabled Button",
		disabled: true,
		onClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button");

		// Verify button is disabled
		await expect(button).toBeDisabled();

		// Attempt to click (should not trigger onClick)
		await userEvent.click(button, { skipPointerEventsCheck: true });
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};
