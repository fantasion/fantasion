import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/index.js";
import { ButtonGroup, ButtonToolbar } from "./ButtonGroup.js";

const meta: Meta<typeof ButtonGroup> = {
	title: "Components/ButtonGroup",
	component: ButtonGroup,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ButtonGroup aria-label="Basic button group">
			<Button variant="primary">Left</Button>
			<Button variant="primary">Middle</Button>
			<Button variant="primary">Right</Button>
		</ButtonGroup>
	),
};

export const OutlineVariant: Story = {
	render: () => (
		<ButtonGroup aria-label="Outline button group">
			<Button variant="outline-primary">Left</Button>
			<Button variant="outline-primary">Middle</Button>
			<Button variant="outline-primary">Right</Button>
		</ButtonGroup>
	),
};

export const Sizes: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
			<ButtonGroup size="sm" aria-label="Small button group">
				<Button variant="primary">Left</Button>
				<Button variant="primary">Middle</Button>
				<Button variant="primary">Right</Button>
			</ButtonGroup>
			<ButtonGroup aria-label="Default button group">
				<Button variant="primary">Left</Button>
				<Button variant="primary">Middle</Button>
				<Button variant="primary">Right</Button>
			</ButtonGroup>
			<ButtonGroup size="lg" aria-label="Large button group">
				<Button variant="primary">Left</Button>
				<Button variant="primary">Middle</Button>
				<Button variant="primary">Right</Button>
			</ButtonGroup>
		</div>
	),
};

export const Vertical: Story = {
	render: () => (
		<ButtonGroup vertical={true} aria-label="Vertical button group">
			<Button variant="primary">Top</Button>
			<Button variant="primary">Middle</Button>
			<Button variant="primary">Bottom</Button>
		</ButtonGroup>
	),
};

export const Toolbar: Story = {
	render: () => (
		<ButtonToolbar aria-label="Toolbar with button groups">
			<ButtonGroup aria-label="First group" style={{ marginRight: "0.5rem" }}>
				<Button variant="primary">1</Button>
				<Button variant="primary">2</Button>
				<Button variant="primary">3</Button>
			</ButtonGroup>
			<ButtonGroup aria-label="Second group">
				<Button variant="secondary">4</Button>
				<Button variant="secondary">5</Button>
				<Button variant="secondary">6</Button>
			</ButtonGroup>
		</ButtonToolbar>
	),
};
