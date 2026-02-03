import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./Container.js";

const meta: Meta<typeof Container> = {
	title: "Layout/Container",
	component: Container,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	argTypes: {
		fluid: {
			control: "select",
			options: [false, true, "sm", "md", "lg", "xl", "xxl"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const ContentBox = ({ label }: { label: string }) => (
	<div
		style={{
			backgroundColor: "var(--fui-color-primary)",
			color: "var(--fui-color-white)",
			padding: "2rem",
			borderRadius: "0.5rem",
			textAlign: "center",
		}}
	>
		{label}
	</div>
);

export const Default: Story = {
	args: {
		children: <ContentBox label="Default Container" />,
	},
};

export const Fluid: Story = {
	args: {
		fluid: true,
		children: <ContentBox label="Fluid Container (100% width)" />,
	},
};

export const ResponsiveBreakpoints: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<Container fluid="sm">
				<ContentBox label="fluid='sm' - 100% below sm, then responsive" />
			</Container>
			<Container fluid="md">
				<ContentBox label="fluid='md' - 100% below md, then responsive" />
			</Container>
			<Container fluid="lg">
				<ContentBox label="fluid='lg' - 100% below lg, then responsive" />
			</Container>
			<Container fluid="xl">
				<ContentBox label="fluid='xl' - 100% below xl, then responsive" />
			</Container>
			<Container fluid="xxl">
				<ContentBox label="fluid='xxl' - 100% below xxl, then responsive" />
			</Container>
		</div>
	),
};

export const AsSection: Story = {
	args: {
		as: "section",
		children: <ContentBox label="Container rendered as <section>" />,
	},
};
