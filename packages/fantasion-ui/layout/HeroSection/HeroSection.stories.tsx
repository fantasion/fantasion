import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../buttons/Button/index.js";
import { HeroSection } from "./HeroSection.js";

const meta: Meta<typeof HeroSection> = {
	title: "Layout/HeroSection",
	component: HeroSection,
	tags: ["autodocs"],
	argTypes: {
		fluid: {
			control: "select",
			options: [true, false, "sm", "md", "lg", "xl", "xxl"],
			description: "Container fluid breakpoint",
			table: { defaultValue: { summary: "xl" } },
		},
		reversed: {
			control: "boolean",
			description: "Reverse the column order",
			table: { defaultValue: { summary: "false" } },
		},
	},
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const PlaceholderVisual = () => (
	<div
		style={{
			width: 300,
			height: 300,
			background: "linear-gradient(135deg, #472a7e 0%, #d7a600 100%)",
			borderRadius: "50%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "white",
			fontSize: "1.5rem",
		}}
	>
		Visual
	</div>
);

const GradientBackground = () => (
	<div
		style={{
			width: "100%",
			height: "100%",
			background: "linear-gradient(180deg, #fffaeb 0%, #f5f0e0 100%)",
		}}
	/>
);

export const Default: Story = {
	args: {
		hiddenTitle: "Welcome to Our Site",
		children: (
			<>
				<p style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
					Discover amazing adventures and unforgettable experiences for your family.
				</p>
				<Button variant="primary">Get Started</Button>
			</>
		),
		visual: <PlaceholderVisual />,
	},
};

export const WithBackground: Story = {
	args: {
		hiddenTitle: "Welcome",
		children: (
			<>
				<h2>Make Something Amazing</h2>
				<p>Start your journey today with our comprehensive platform.</p>
				<Button variant="primary">Learn More</Button>
			</>
		),
		visual: <PlaceholderVisual />,
		background: <GradientBackground />,
	},
};

export const Reversed: Story = {
	args: {
		hiddenTitle: "About Us",
		children: (
			<>
				<h2>Our Story</h2>
				<p>We've been helping families create memories since 2010.</p>
			</>
		),
		visual: <PlaceholderVisual />,
		reversed: true,
	},
};

export const ContentOnly: Story = {
	args: {
		hiddenTitle: "Simple Hero",
		children: (
			<div style={{ textAlign: "center", padding: "4rem 0" }}>
				<h2>Welcome to Our Platform</h2>
				<p>The best way to organize your adventures.</p>
				<Button variant="primary" size="lg">
					Get Started Free
				</Button>
			</div>
		),
		background: <GradientBackground />,
	},
};
