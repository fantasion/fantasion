import type { Meta, StoryObj } from "@storybook/react";
import { ListGroup, ListGroupItem } from "./ListGroup.js";

const meta: Meta<typeof ListGroup> = {
	title: "Components/ListGroup",
	component: ListGroup,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ListGroup>
			<ListGroupItem>First item</ListGroupItem>
			<ListGroupItem>Second item</ListGroupItem>
			<ListGroupItem>Third item</ListGroupItem>
		</ListGroup>
	),
};

export const ActiveAndDisabled: Story = {
	render: () => (
		<ListGroup>
			<ListGroupItem active={true}>Active item</ListGroupItem>
			<ListGroupItem>Regular item</ListGroupItem>
			<ListGroupItem disabled={true}>Disabled item</ListGroupItem>
		</ListGroup>
	),
};

export const ActionItems: Story = {
	render: () => (
		<ListGroup>
			<ListGroupItem as="a" href="#" action={true}>
				Link item 1
			</ListGroupItem>
			<ListGroupItem as="a" href="#" action={true}>
				Link item 2
			</ListGroupItem>
			<ListGroupItem as="a" href="#" action={true} active={true}>
				Active link item
			</ListGroupItem>
			<ListGroupItem as="a" href="#" action={true} disabled={true}>
				Disabled link item
			</ListGroupItem>
		</ListGroup>
	),
};

export const Flush: Story = {
	render: () => (
		<ListGroup flush={true}>
			<ListGroupItem>First item</ListGroupItem>
			<ListGroupItem>Second item</ListGroupItem>
			<ListGroupItem>Third item</ListGroupItem>
		</ListGroup>
	),
};

export const Horizontal: Story = {
	render: () => (
		<ListGroup horizontal={true}>
			<ListGroupItem>First</ListGroupItem>
			<ListGroupItem>Second</ListGroupItem>
			<ListGroupItem>Third</ListGroupItem>
		</ListGroup>
	),
};

export const Variants: Story = {
	render: () => (
		<ListGroup>
			<ListGroupItem variant="primary">Primary</ListGroupItem>
			<ListGroupItem variant="secondary">Secondary</ListGroupItem>
			<ListGroupItem variant="success">Success</ListGroupItem>
			<ListGroupItem variant="danger">Danger</ListGroupItem>
			<ListGroupItem variant="warning">Warning</ListGroupItem>
			<ListGroupItem variant="info">Info</ListGroupItem>
			<ListGroupItem variant="light">Light</ListGroupItem>
			<ListGroupItem variant="dark">Dark</ListGroupItem>
		</ListGroup>
	),
};
