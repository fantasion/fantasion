import type { Meta, StoryObj } from "@storybook/react";
import { Article, ArticleBody, ArticleHeading, ArticleLead, ArticleStub } from "./Article.js";

const meta: Meta<typeof Article> = {
	title: "Content/Article",
	component: Article,
	tags: ["autodocs"],
	argTypes: {
		title: {
			control: "text",
			description: "Article title",
		},
		description: {
			control: "text",
			description: "Lead/intro text (shown in italics)",
		},
		text: {
			control: "text",
			description: "Main article content (markdown)",
		},
		level: {
			control: { type: "number", min: 1, max: 6 },
			description: "Heading level for the title",
			table: { defaultValue: { summary: "2" } },
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleText = `
This is the main article content with **bold** and *italic* text.

## A Subheading

Here's a list of items:
- First item
- Second item
- Third item

And a [link to somewhere](https://example.com).
`;

export const Default: Story = {
	args: {
		title: "Article Title",
		description: "This is a brief introduction to the article that appears in italics.",
		text: sampleText,
	},
};

export const WithSubtitle: Story = {
	args: {
		title: "Article With Subtitle",
		subTitle: "Published on January 15, 2024",
		description: "A brief lead paragraph.",
		text: sampleText,
	},
};

export const WithMedia: Story = {
	args: {
		title: "Article With Media",
		description: "This article has an image gallery.",
		text: sampleText,
		media: [
			{ src: "https://picsum.photos/400/300?random=1", height: 300, width: 400 },
			{ src: "https://picsum.photos/400/300?random=2", height: 300, width: 400 },
		],
	},
};

export const WithTitleLink: Story = {
	args: {
		title: "Clickable Title",
		titleHref: "/articles/example",
		description: "Click the title to navigate.",
		text: sampleText,
	},
};

export const LevelOne: Story = {
	args: {
		title: "Main Page Title",
		level: 1,
		text: "Content for a page-level article.",
	},
};

// ArticleBody story
export const BodyOnly: StoryObj<typeof ArticleBody> = {
	render: () => (
		<ArticleBody
			text={`# Heading

This is article body content with **markdown** support.

- List item 1
- List item 2`}
			headingOffset={1}
		/>
	),
};

// ArticleLead story
export const LeadOnly: StoryObj<typeof ArticleLead> = {
	render: () => <ArticleLead text="This is a lead paragraph that introduces the article in an italic style." />,
};

// ArticleHeading story
export const HeadingOnly: StoryObj<typeof ArticleHeading> = {
	render: () => (
		<div>
			<ArticleHeading level={1}>Level 1 Heading</ArticleHeading>
			<ArticleHeading level={2}>Level 2 Heading</ArticleHeading>
			<ArticleHeading level={3} href="/example">
				Linked Level 3 Heading
			</ArticleHeading>
		</div>
	),
};

// ArticleStub story
export const StubOnly: StoryObj<typeof ArticleStub> = {
	render: () => (
		<ArticleStub
			heading="Stub Article"
			text="A compact article format with just a heading and some markdown content."
			level={3}
		/>
	),
};
