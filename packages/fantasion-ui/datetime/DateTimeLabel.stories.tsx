import type { Meta, StoryObj } from "@storybook/react";
import { DateTimeLabel } from "./DateTimeLabel.js";

const meta: Meta<typeof DateTimeLabel> = {
	title: "Domain/DateTime/DateTimeLabel",
	component: DateTimeLabel,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		date: {
			control: "date",
			description: "Date and time to display",
		},
		locale: {
			control: "text",
			description: "Locale for formatting (e.g., 'cs', 'en')",
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

const now = new Date();

export const Default: Story = {
	args: {
		date: now,
		locale: "cs",
	},
};

export const CzechShort: Story = {
	args: {
		date: now,
		locale: "cs",
		dateStyle: "short",
		timeStyle: "short",
	},
};

export const CzechMedium: Story = {
	args: {
		date: now,
		locale: "cs",
		dateStyle: "medium",
		timeStyle: "medium",
	},
};

export const CzechLong: Story = {
	args: {
		date: now,
		locale: "cs",
		dateStyle: "long",
		timeStyle: "long",
	},
};

export const EnglishFormats: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
			<DateTimeLabel date={now} locale="en" dateStyle="short" timeStyle="short" />
			<DateTimeLabel date={now} locale="en" dateStyle="medium" timeStyle="medium" />
			<DateTimeLabel date={now} locale="en" dateStyle="long" timeStyle="long" />
		</div>
	),
};

export const TimeOnly: Story = {
	args: {
		date: now,
		locale: "cs",
		dateStyle: undefined,
		timeStyle: "medium",
	},
};
