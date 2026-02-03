import type { Meta, StoryObj } from "@storybook/react";
import { MarkdownContent } from "./MarkdownContent.js";

const meta: Meta<typeof MarkdownContent> = {
	title: "Content/MarkdownContent",
	component: MarkdownContent,
	tags: ["autodocs"],
	argTypes: {
		headingOffset: {
			control: { type: "number", min: 0, max: 5 },
			description: "Shift heading levels (e.g., 2 means h1 becomes h3)",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMarkdown = `# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold** and *italic* text.

- List item 1
- List item 2
- List item 3

1. Numbered item 1
2. Numbered item 2
3. Numbered item 3

> This is a blockquote with some important information.

Here's some \`inline code\` and a code block:

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

[A link to somewhere](https://example.com)

---

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;

export const Default: Story = {
	args: {
		children: sampleMarkdown,
	},
};

export const WithHeadingOffset: Story = {
	args: {
		children: sampleMarkdown,
		headingOffset: 2,
	},
};

export const SimpleText: Story = {
	args: {
		children: `This is a simple paragraph with **bold** and *italic* text.

And another paragraph with a [link](https://example.com).`,
	},
};

export const CodeBlock: Story = {
	args: {
		children: `Here's some code:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = async (id: number): Promise<User> => {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
};
\`\`\`
`,
	},
};

export const Lists: Story = {
	args: {
		children: `## Shopping List

- Apples
- Bananas
- Oranges
- Grapes

## Recipe Steps

1. Preheat oven to 350°F
2. Mix dry ingredients
3. Add wet ingredients
4. Bake for 25 minutes
`,
	},
};

export const Blockquote: Story = {
	args: {
		children: `> The only way to do great work is to love what you do.
>
> — Steve Jobs

This is wisdom to live by.
`,
	},
};
