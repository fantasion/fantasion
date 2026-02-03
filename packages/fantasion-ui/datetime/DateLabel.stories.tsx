import type { Meta, StoryObj } from "@storybook/react";
import { DateLabel } from "./DateLabel.js";

const meta: Meta<typeof DateLabel> = {
	title: "Domain/DateTime/DateLabel",
	component: DateLabel,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		date: {
			control: "date",
			description: "Date to display (Date object, string, or number)",
		},
		locale: {
			control: "text",
			description: "Locale for date formatting (e.g., 'cs', 'en')",
			table: {
				defaultValue: { summary: "cs" },
			},
		},
		dateStyle: {
			control: "select",
			options: ["full", "long", "medium", "short"],
			description: "Date formatting style",
		},
		timeStyle: {
			control: "select",
			options: ["full", "long", "medium", "short"],
			description: "Time formatting style",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const Default: Story = {
	args: {
		date: today,
		locale: "cs",
	},
};

export const CzechShort: Story = {
	args: {
		date: today,
		locale: "cs",
		dateStyle: "short",
	},
};

export const CzechMedium: Story = {
	args: {
		date: today,
		locale: "cs",
		dateStyle: "medium",
	},
};

export const CzechLong: Story = {
	args: {
		date: today,
		locale: "cs",
		dateStyle: "long",
	},
};

export const CzechFull: Story = {
	args: {
		date: today,
		locale: "cs",
		dateStyle: "full",
	},
};

export const EnglishFormats: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
			<DateLabel date={today} locale="en" dateStyle="short" />
			<DateLabel date={today} locale="en" dateStyle="medium" />
			<DateLabel date={today} locale="en" dateStyle="long" />
			<DateLabel date={today} locale="en" dateStyle="full" />
		</div>
	),
};

export const DifferentDates: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
			<div>
				<strong>Today:</strong> <DateLabel date={today} locale="cs" dateStyle="long" />
			</div>
			<div>
				<strong>Tomorrow:</strong> <DateLabel date={tomorrow} locale="cs" dateStyle="long" />
			</div>
			<div>
				<strong>Specific Date:</strong> <DateLabel date={new Date("2026-12-25")} locale="cs" dateStyle="long" />
			</div>
		</div>
	),
};
