import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertHeading, AlertLink } from "./Alert.js";

const meta: Meta<typeof Alert> = {
	title: "Components/Alert",
	component: Alert,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"],
			description: "Visual style variant of the alert",
			table: {
				defaultValue: { summary: "primary" },
			},
		},
		dismissible: {
			control: "boolean",
			description: "Whether the alert can be dismissed with a close button",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		onClose: {
			description: "Callback function when alert is dismissed",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "This is a primary alert — check it out!",
		variant: "primary",
	},
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
			<Alert variant="primary">This is a primary alert — check it out!</Alert>
			<Alert variant="secondary">This is a secondary alert — check it out!</Alert>
			<Alert variant="success">This is a success alert — check it out!</Alert>
			<Alert variant="danger">This is a danger alert — check it out!</Alert>
			<Alert variant="warning">This is a warning alert — check it out!</Alert>
			<Alert variant="info">This is an info alert — check it out!</Alert>
			<Alert variant="light">This is a light alert — check it out!</Alert>
			<Alert variant="dark">This is a dark alert — check it out!</Alert>
		</div>
	),
};

export const WithHeading: Story = {
	render: () => (
		<Alert variant="success">
			<AlertHeading>Well done!</AlertHeading>
			<p>
				You successfully read this important alert message. This example text is going to run a bit longer so that you
				can see how spacing within an alert works with this kind of content.
			</p>
		</Alert>
	),
};

export const WithLink: Story = {
	render: () => (
		<Alert variant="primary">
			This is a primary alert with <AlertLink href="#">an example link</AlertLink>. Give it a click if you like.
		</Alert>
	),
};

export const Dismissible: Story = {
	args: {
		children: "Holy guacamole! You should check in on some of those fields below.",
		variant: "warning",
		dismissible: true,
		onClose: () => alert("Close clicked!"),
	},
};
