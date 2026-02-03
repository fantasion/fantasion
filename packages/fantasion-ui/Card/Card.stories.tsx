import type { Meta, StoryObj } from "@storybook/react";
import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CardImg,
	CardLink,
	CardSubtitle,
	CardText,
	CardTitle,
} from "./Card.js";

const meta: Meta<typeof Card> = {
	title: "Components/Card",
	component: Card,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
	argTypes: {
		children: {
			description: "Card content (typically CardHeader, CardBody, CardFooter)",
		},
		className: {
			control: "text",
			description: "Additional CSS classes",
		},
	},
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Card style={{ width: "18rem" }}>
			<CardBody>
				<CardTitle>Card Title</CardTitle>
				<CardText>Some quick example text to build on the card title.</CardText>
			</CardBody>
		</Card>
	),
};

export const WithImage: Story = {
	render: () => (
		<Card style={{ width: "18rem" }}>
			<CardImg variant="top" src="https://via.placeholder.com/286x180" alt="Card image" />
			<CardBody>
				<CardTitle>Card Title</CardTitle>
				<CardText>Some quick example text to build on the card title.</CardText>
				<CardLink href="#">Card Link</CardLink>
			</CardBody>
		</Card>
	),
};

export const WithHeaderAndFooter: Story = {
	render: () => (
		<Card style={{ width: "18rem" }}>
			<CardHeader>Featured</CardHeader>
			<CardBody>
				<CardTitle>Special Title</CardTitle>
				<CardSubtitle>Card Subtitle</CardSubtitle>
				<CardText>With supporting text below as a natural lead-in.</CardText>
			</CardBody>
			<CardFooter>Last updated 3 mins ago</CardFooter>
		</Card>
	),
};
