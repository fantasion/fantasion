import type { Meta, StoryObj } from "@storybook/react";
import { Quote, QuoteCarousel } from "./QuoteCarousel.js";

const meta: Meta<typeof QuoteCarousel> = {
	title: "Content/QuoteCarousel",
	component: QuoteCarousel,
	tags: ["autodocs"],
	argTypes: {
		intervalMs: {
			control: { type: "number", min: 1000, max: 30_000, step: 1000 },
			description: "Rotation interval in milliseconds",
			table: { defaultValue: { summary: "9000" } },
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleQuotes = [
	{
		text: "The best summer camp experience my kids have ever had!",
		author: "Marie K.",
	},
	{
		text: "Amazing activities and wonderful staff. **Highly recommended!**",
		author: "Jan P.",
	},
	{
		text: "My daughter talks about it all year long.",
		author: "Eva M.",
	},
	{
		text: "A magical experience that builds friendships for life.",
		author: "Tomáš H.",
	},
];

export const Default: Story = {
	args: {
		quotes: sampleQuotes,
	},
};

export const FastRotation: Story = {
	args: {
		quotes: sampleQuotes,
		intervalMs: 3000,
	},
};

export const SingleQuote: Story = {
	args: {
		quotes: [sampleQuotes[0]],
	},
};

export const WithMarkdown: Story = {
	args: {
		quotes: [
			{
				text: "This is a quote with **bold** and *italic* text.",
				author: "Markdown User",
			},
			{
				text: "You can even include [links](https://example.com) in quotes.",
				author: "Link Lover",
			},
		],
	},
};

// Single Quote component
export const SingleQuoteComponent: StoryObj<typeof Quote> = {
	render: () => <Quote text="A standalone quote without rotation." author="Static Author" />,
};
