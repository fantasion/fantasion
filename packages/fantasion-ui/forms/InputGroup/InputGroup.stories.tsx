import type { Meta, StoryObj } from "@storybook/react";
import { InputGroup, InputGroupText } from "./InputGroup.js";

const meta: Meta<typeof InputGroup> = {
	title: "Forms/InputGroup",
	component: InputGroup,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<InputGroup>
			<InputGroupText>@</InputGroupText>
			<input type="text" className="fui-form-control" placeholder="Username" />
		</InputGroup>
	),
};

export const PrependAndAppend: Story = {
	render: () => (
		<InputGroup>
			<InputGroupText>$</InputGroupText>
			<input type="text" className="fui-form-control" placeholder="Amount" />
			<InputGroupText>.00</InputGroupText>
		</InputGroup>
	),
};

export const Sizes: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<InputGroup size="sm">
				<InputGroupText>Small</InputGroupText>
				<input type="text" className="fui-form-control" placeholder="Small input" />
			</InputGroup>
			<InputGroup size="md">
				<InputGroupText>Medium</InputGroupText>
				<input type="text" className="fui-form-control" placeholder="Medium input" />
			</InputGroup>
			<InputGroup size="lg">
				<InputGroupText>Large</InputGroupText>
				<input type="text" className="fui-form-control" placeholder="Large input" />
			</InputGroup>
		</div>
	),
};
