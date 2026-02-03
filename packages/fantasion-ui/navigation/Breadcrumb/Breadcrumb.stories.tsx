import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb.js";

const meta: Meta<typeof Breadcrumb> = {
	title: "Navigation/Breadcrumb",
	component: Breadcrumb,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbItem href="/">Home</BreadcrumbItem>
			<BreadcrumbItem href="/library">Library</BreadcrumbItem>
			<BreadcrumbItem active={true}>Data</BreadcrumbItem>
		</Breadcrumb>
	),
};

export const TwoLevels: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbItem href="/">Home</BreadcrumbItem>
			<BreadcrumbItem active={true}>Library</BreadcrumbItem>
		</Breadcrumb>
	),
};

export const SingleLevel: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbItem active={true}>Home</BreadcrumbItem>
		</Breadcrumb>
	),
};

export const LongPath: Story = {
	render: () => (
		<Breadcrumb>
			<BreadcrumbItem href="/">Home</BreadcrumbItem>
			<BreadcrumbItem href="/products">Products</BreadcrumbItem>
			<BreadcrumbItem href="/products/electronics">Electronics</BreadcrumbItem>
			<BreadcrumbItem href="/products/electronics/phones">Phones</BreadcrumbItem>
			<BreadcrumbItem active={true}>iPhone 15</BreadcrumbItem>
		</Breadcrumb>
	),
};
