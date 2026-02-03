import type { Meta, StoryObj } from "@storybook/react";
import { ContactInfoCard } from "./ContactInfoCard.js";

const meta: Meta<typeof ContactInfoCard> = {
	title: "Layout/ContactInfoCard",
	component: ContactInfoCard,
	tags: ["autodocs"],
	argTypes: {
		separator: {
			control: "text",
			description: "Separator between label and value",
			table: { defaultValue: { summary: '": "' } },
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		contactItems: [
			{ label: "Email", value: "info@example.com", href: "mailto:info@example.com" },
			{ label: "Phone", value: "+1 234 567 890", href: "tel:+1234567890" },
			{ label: "Tax ID", value: "12345678" },
		],
	},
};

export const WithAddress: Story = {
	args: {
		contactItems: [
			{ label: "Email", value: "contact@company.com", href: "mailto:contact@company.com" },
			{ label: "Phone", value: "+420 123 456 789", href: "tel:+420123456789" },
		],
		address: {
			street: "Main Street",
			streetNumber: "123",
			city: "Prague",
			postalCode: "110 00",
		},
		addressLabel: "Our Address",
	},
};

export const WithBankAccount: Story = {
	args: {
		contactItems: [{ label: "Email", value: "billing@company.com", href: "mailto:billing@company.com" }],
		bankAccount: {
			accountNumber: "1234567890/0100",
			bankName: "Example Bank",
			iban: "CZ65 0100 0000 0012 3456 7890",
			bic: "KOMBCZPP",
		},
		bankLabels: {
			sectionTitle: "Bank Connection",
			accountNumber: "Account Number",
			bankName: "Bank",
			iban: "IBAN",
			bic: "BIC/SWIFT",
		},
	},
};

export const Complete: Story = {
	args: {
		contactItems: [
			{ label: "Email", value: "info@fantasion.cz", href: "mailto:info@fantasion.cz" },
			{ label: "Phone", value: "+420 703 629 310", href: "tel:+420703629310" },
			{ label: "Tax ID", value: "14166658" },
		],
		address: {
			street: "Blažíčkova",
			streetNumber: "984/20",
			city: "Praha 4 Krč",
			postalCode: "140 00",
		},
		addressLabel: "Address",
		bankAccount: {
			accountNumber: "2902084329/2010",
			bankName: "Fio banka",
			iban: "CZ47 2010 0000 0029 0208 4329",
			bic: "FIOBCZPP",
		},
		bankLabels: {
			sectionTitle: "Bank Connection",
			accountNumber: "Account Number",
			bankName: "Bank",
			iban: "IBAN",
			bic: "BIC",
		},
	},
};

export const MinimalContact: Story = {
	args: {
		contactItems: [{ label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" }],
	},
};
