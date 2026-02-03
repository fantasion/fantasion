import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";
import { Button } from "../../buttons/Button/index.js";
import { Overlay, Tooltip, TooltipContent } from "./Tooltip.js";

const meta: Meta<typeof Tooltip> = {
	title: "Components/Tooltip",
	component: Tooltip,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tooltip content="Tooltip on top">
			<Button>Hover me</Button>
		</Tooltip>
	),
};

export const Placements: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "2rem", padding: "4rem" }}>
			<Tooltip content="Tooltip on top" placement="top">
				<Button>Top</Button>
			</Tooltip>
			<Tooltip content="Tooltip on bottom" placement="bottom">
				<Button>Bottom</Button>
			</Tooltip>
			<Tooltip content="Tooltip on left" placement="left">
				<Button>Left</Button>
			</Tooltip>
			<Tooltip content="Tooltip on right" placement="right">
				<Button>Right</Button>
			</Tooltip>
		</div>
	),
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
			<Tooltip content="Dark tooltip" variant="dark">
				<Button>Dark</Button>
			</Tooltip>
			<Tooltip content="Light tooltip" variant="light">
				<Button>Light</Button>
			</Tooltip>
			<Tooltip content="Primary tooltip" variant="primary">
				<Button>Primary</Button>
			</Tooltip>
		</div>
	),
};

export const StandaloneContent: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
			<TooltipContent placement="top">Standalone tooltip content</TooltipContent>
		</div>
	),
};

export const WithOverlay: Story = {
	render: () => {
		const [show, setShow] = useState(false);
		const targetRef = useRef<HTMLButtonElement>(null);

		return (
			<div style={{ padding: "4rem" }}>
				<Button ref={targetRef} onClick={() => setShow(!show)}>
					Toggle Overlay
				</Button>
				<Overlay target={targetRef.current} show={show} placement="bottom">
					<TooltipContent placement="bottom">Overlay with tooltip content</TooltipContent>
				</Overlay>
			</div>
		);
	},
};
