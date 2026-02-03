import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardBody } from "../../Card/index.js";
import { Col, Row } from "../../grid/index.js";
import { FeatureSection } from "./FeatureSection.js";

const meta: Meta<typeof FeatureSection> = {
	title: "Layout/FeatureSection",
	component: FeatureSection,
	tags: ["autodocs"],
	argTypes: {
		fluid: {
			control: "select",
			options: [true, false, "sm", "md", "lg", "xl", "xxl"],
			description: "Container fluid breakpoint",
			table: { defaultValue: { summary: "xl" } },
		},
		as: {
			control: "select",
			options: ["section", "div", "article"],
			description: "HTML element for the section",
			table: { defaultValue: { summary: "section" } },
		},
		headingLevel: {
			control: { type: "number", min: 2, max: 6 },
			description: "Heading level for the title",
			table: { defaultValue: { summary: "2" } },
		},
	},
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const GradientBackground = () => (
	<div
		style={{
			width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #472a7e 0%, #6b4a9e 100%)",
		}}
	/>
);

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
	<Card className="h-100">
		<CardBody>
			<h3>{title}</h3>
			<p className="mb-0">{description}</p>
		</CardBody>
	</Card>
);

export const Default: Story = {
	args: {
		title: "Our Features",
		children: (
			<Row>
				<Col md={4} className="mb-3">
					<FeatureCard title="Fast" description="Lightning fast performance for all your needs." />
				</Col>
				<Col md={4} className="mb-3">
					<FeatureCard title="Secure" description="Enterprise-grade security to protect your data." />
				</Col>
				<Col md={4} className="mb-3">
					<FeatureCard title="Reliable" description="99.9% uptime guarantee for your peace of mind." />
				</Col>
			</Row>
		),
	},
};

export const WithBackground: Story = {
	args: {
		title: "Adventure Expeditions",
		titleClassName: "text-white",
		children: (
			<Row>
				<Col md={4} className="mb-3">
					<FeatureCard title="Mountain Trek" description="Explore the highest peaks with expert guides." />
				</Col>
				<Col md={4} className="mb-3">
					<FeatureCard title="River Rafting" description="Experience the thrill of white water rapids." />
				</Col>
				<Col md={4} className="mb-3">
					<FeatureCard title="Forest Camp" description="Connect with nature in our wilderness camps." />
				</Col>
			</Row>
		),
		background: <GradientBackground />,
	},
};

export const SimpleContent: Story = {
	args: {
		title: "Get Started Today",
		children: (
			<div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
				<p>Join thousands of families who have already discovered the joy of adventure with us.</p>
			</div>
		),
	},
};

export const NoTitle: Story = {
	args: {
		children: (
			<Row>
				<Col md={6} className="mb-3">
					<FeatureCard title="For Families" description="Create lasting memories with your loved ones." />
				</Col>
				<Col md={6} className="mb-3">
					<FeatureCard title="For Kids" description="Safe, fun, and educational adventures." />
				</Col>
			</Row>
		),
	},
};
