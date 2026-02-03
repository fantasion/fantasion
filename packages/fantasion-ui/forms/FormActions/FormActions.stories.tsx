import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { FormActions } from "./FormActions.js";

const meta: Meta<typeof FormActions> = {
	title: "Forms/FormActions",
	component: FormActions,
	tags: ["autodocs"],
	argTypes: {
		submitLabel: {
			control: "text",
			description: "Label for the submit button",
		},
		cancelLabel: {
			control: "text",
			description: "Label for the cancel button (shown when onCancel is provided)",
		},
		error: {
			control: "text",
			description: "Error message to display above the buttons",
		},
		isSubmitting: {
			control: "boolean",
			description: "Whether the form is currently submitting",
		},
		disabled: {
			control: "boolean",
			description: "Whether the buttons are disabled",
		},
		size: {
			control: "select",
			options: [undefined, "sm", "lg"],
			description: "Button size",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		submitLabel: "Save",
	},
};

export const WithCancel: Story = {
	args: {
		submitLabel: "Save",
		cancelLabel: "Cancel",
		onCancel: fn(),
	},
};

export const Submitting: Story = {
	args: {
		submitLabel: "Saving...",
		cancelLabel: "Cancel",
		onCancel: fn(),
		isSubmitting: true,
	},
};

export const WithError: Story = {
	args: {
		submitLabel: "Save",
		cancelLabel: "Cancel",
		onCancel: fn(),
		error: "Failed to save. Please try again.",
	},
};

export const Disabled: Story = {
	args: {
		submitLabel: "Save",
		cancelLabel: "Cancel",
		onCancel: fn(),
		disabled: true,
	},
};

export const SmallSize: Story = {
	args: {
		submitLabel: "OK",
		cancelLabel: "Cancel",
		onCancel: fn(),
		size: "sm",
	},
};

export const LargeSize: Story = {
	args: {
		submitLabel: "Submit Application",
		cancelLabel: "Cancel",
		onCancel: fn(),
		size: "lg",
	},
};

export const SubmitOnly: Story = {
	args: {
		submitLabel: "Submit",
	},
};

export const CustomLabels: Story = {
	args: {
		submitLabel: "Confirm Order",
		cancelLabel: "Go Back",
		onCancel: fn(),
	},
};
