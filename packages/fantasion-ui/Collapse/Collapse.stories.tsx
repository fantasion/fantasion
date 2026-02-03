import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Collapse } from "./Collapse.js";

const meta: Meta<typeof Collapse> = {
	title: "Components/Collapse",
	component: Collapse,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
	argTypes: {
		in: {
			control: "boolean",
			description: "Show or hide the collapse content",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		dimension: {
			control: "select",
			options: ["height", "width"],
			description: "Dimension to collapse on (height or width)",
			table: {
				defaultValue: { summary: "height" },
			},
		},
		timeout: {
			control: "number",
			description: "Transition duration in milliseconds",
			table: {
				defaultValue: { summary: "350" },
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const CollapseDemo = ({ dimension = "height" }: { dimension?: "height" | "width" }) => {
	const [open, setOpen] = useState(false);

	return (
		<div>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				style={{
					padding: "0.5rem 1rem",
					marginBottom: "1rem",
					cursor: "pointer",
				}}
			>
				{open ? "Close" : "Open"}
			</button>
			<Collapse in={open} dimension={dimension}>
				<div
					style={{
						padding: "1rem",
						backgroundColor: "var(--fui-color-gray-100)",
						borderRadius: "0.5rem",
						...(dimension === "width" && { width: "300px", whiteSpace: "nowrap" }),
					}}
				>
					<p style={{ margin: 0 }}>
						This is the collapsible content. It can contain any elements like text, images, or other components.
					</p>
					{dimension === "height" && (
						<p style={{ margin: "1rem 0 0" }}>Additional content here to show the full height collapse animation.</p>
					)}
				</div>
			</Collapse>
		</div>
	);
};

export const Default: Story = {
	render: () => <CollapseDemo />,
};

export const Horizontal: Story = {
	render: () => <CollapseDemo dimension="width" />,
};

export const InitiallyOpen: Story = {
	args: {
		in: true,
		children: (
			<div
				style={{
					padding: "1rem",
					backgroundColor: "var(--fui-color-gray-100)",
					borderRadius: "0.5rem",
				}}
			>
				This collapse is initially open.
			</div>
		),
	},
};
