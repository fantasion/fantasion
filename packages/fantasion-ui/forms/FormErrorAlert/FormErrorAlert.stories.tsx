import type { Meta, StoryObj } from "@storybook/react";
import { FormErrorAlert } from "./FormErrorAlert.js";

const meta: Meta<typeof FormErrorAlert> = {
	title: "Forms/FormErrorAlert",
	component: FormErrorAlert,
	tags: ["autodocs"],
	argTypes: {
		error: {
			control: "text",
			description: "Error message to display. If falsy, nothing is rendered.",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		error: "Failed to submit the form. Please try again.",
	},
};

export const NoError: Story = {
	args: {
		error: undefined,
	},
};

export const LongError: Story = {
	args: {
		error:
			"The server encountered an unexpected error while processing your request. Please check your internet connection and try again. If the problem persists, contact support.",
	},
};

export const MultipleErrors: Story = {
	args: {
		error: (
			<ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
				<li>Email address is already taken</li>
				<li>Password does not meet requirements</li>
				<li>Phone number format is invalid</li>
			</ul>
		),
	},
};
