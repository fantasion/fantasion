import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./FormField.js";

const meta: Meta<typeof FormField> = {
	title: "Forms/FormField",
	component: FormField,
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "Field label text",
		},
		labelColon: {
			control: "boolean",
			description: "Whether to append colon after label",
			table: { defaultValue: { summary: "true" } },
		},
		type: {
			control: "select",
			options: ["text", "email", "password", "number", "tel", "url", "textarea", "select", "checkbox", "radio"],
			description: "Input type",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "Field size",
			table: { defaultValue: { summary: "md" } },
		},
		required: {
			control: "boolean",
			description: "Whether field is required (shows bold label)",
		},
		disabled: {
			control: "boolean",
			description: "Whether field is disabled",
		},
		error: {
			control: "text",
			description: "Error message to display",
		},
		helpText: {
			control: "text",
			description: "Help text shown below the field",
		},
		placeholder: {
			control: "text",
			description: "Placeholder text",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Email",
		name: "email",
		type: "email",
		placeholder: "Enter your email",
	},
};

export const Required: Story = {
	args: {
		label: "Full Name",
		name: "fullName",
		type: "text",
		required: true,
		placeholder: "John Doe",
	},
};

export const WithError: Story = {
	args: {
		label: "Email",
		name: "email",
		type: "email",
		error: "Please enter a valid email address",
		defaultValue: "invalid-email",
	},
};

export const WithHelpText: Story = {
	args: {
		label: "Password",
		name: "password",
		type: "password",
		helpText: "Must be at least 8 characters with one uppercase letter",
	},
};

export const Select: Story = {
	args: {
		label: "Country",
		name: "country",
		type: "select",
		options: [
			{ value: "cz", label: "Czech Republic" },
			{ value: "sk", label: "Slovakia" },
			{ value: "pl", label: "Poland" },
			{ value: "de", label: "Germany" },
		],
	},
};

export const SelectRequired: Story = {
	args: {
		label: "Priority",
		name: "priority",
		type: "select",
		required: true,
		options: [
			{ value: "low", label: "Low" },
			{ value: "medium", label: "Medium" },
			{ value: "high", label: "High" },
		],
	},
};

export const Textarea: Story = {
	args: {
		label: "Description",
		name: "description",
		type: "textarea",
		placeholder: "Enter a detailed description...",
		rows: 4,
	},
};

export const Checkbox: Story = {
	args: {
		label: "I agree to the terms and conditions",
		name: "terms",
		type: "checkbox",
	},
};

export const RadioGroup: Story = {
	render: () => (
		<fieldset>
			<legend>Preferred contact method:</legend>
			<FormField label="Email" name="contact" type="radio" value="email" />
			<FormField label="Phone" name="contact" type="radio" value="phone" />
			<FormField label="Mail" name="contact" type="radio" value="mail" />
		</fieldset>
	),
};

export const Disabled: Story = {
	args: {
		label: "Username",
		name: "username",
		type: "text",
		defaultValue: "johndoe",
		disabled: true,
	},
};

export const SmallSize: Story = {
	args: {
		label: "Postal Code",
		name: "postalCode",
		type: "text",
		size: "sm",
		placeholder: "12345",
	},
};

export const LargeSize: Story = {
	args: {
		label: "Bio",
		name: "bio",
		type: "textarea",
		size: "lg",
		placeholder: "Tell us about yourself...",
	},
};

export const NoColon: Story = {
	args: {
		label: "Remember me",
		name: "remember",
		type: "checkbox",
		labelColon: false,
	},
};
