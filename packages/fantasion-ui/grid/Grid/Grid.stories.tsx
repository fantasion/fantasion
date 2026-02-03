import type { Meta, StoryObj } from "@storybook/react";
import { Col, Row } from "./Grid.js";

const meta: Meta<typeof Row> = {
	title: "Layout/Grid",
	component: Row,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ColBox = ({ children }: { children: React.ReactNode }) => (
	<div
		style={{
			backgroundColor: "var(--fui-color-primary)",
			color: "var(--fui-color-white)",
			padding: "1rem",
			borderRadius: "0.25rem",
			textAlign: "center",
		}}
	>
		{children}
	</div>
);

export const Default: Story = {
	render: () => (
		<Row>
			<Col>
				<ColBox>1 of 2</ColBox>
			</Col>
			<Col>
				<ColBox>2 of 2</ColBox>
			</Col>
		</Row>
	),
};

export const ThreeColumns: Story = {
	render: () => (
		<Row>
			<Col>
				<ColBox>1 of 3</ColBox>
			</Col>
			<Col>
				<ColBox>2 of 3</ColBox>
			</Col>
			<Col>
				<ColBox>3 of 3</ColBox>
			</Col>
		</Row>
	),
};

export const SpecificWidths: Story = {
	render: () => (
		<Row>
			<Col span={4}>
				<ColBox>Col 4</ColBox>
			</Col>
			<Col span={8}>
				<ColBox>Col 8</ColBox>
			</Col>
		</Row>
	),
};

export const Responsive: Story = {
	render: () => (
		<Row>
			<Col xs={12} md={6} lg={4}>
				<ColBox>Col 1</ColBox>
			</Col>
			<Col xs={12} md={6} lg={4}>
				<ColBox>Col 2</ColBox>
			</Col>
			<Col xs={12} md={12} lg={4}>
				<ColBox>Col 3</ColBox>
			</Col>
		</Row>
	),
};

export const Offset: Story = {
	render: () => (
		<Row>
			<Col span={4}>
				<ColBox>Col 4</ColBox>
			</Col>
			<Col span={4} offset={4}>
				<ColBox>Col 4 offset 4</ColBox>
			</Col>
		</Row>
	),
};

export const Alignment: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<Row align="start" style={{ height: "100px", backgroundColor: "var(--fui-color-gray-100)" }}>
				<Col>
					<ColBox>align start</ColBox>
				</Col>
				<Col>
					<ColBox>align start</ColBox>
				</Col>
			</Row>
			<Row align="center" style={{ height: "100px", backgroundColor: "var(--fui-color-gray-100)" }}>
				<Col>
					<ColBox>align center</ColBox>
				</Col>
				<Col>
					<ColBox>align center</ColBox>
				</Col>
			</Row>
			<Row align="end" style={{ height: "100px", backgroundColor: "var(--fui-color-gray-100)" }}>
				<Col>
					<ColBox>align end</ColBox>
				</Col>
				<Col>
					<ColBox>align end</ColBox>
				</Col>
			</Row>
		</div>
	),
};

export const Justification: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<Row justify="start">
				<Col span={2}>
					<ColBox>start</ColBox>
				</Col>
				<Col span={2}>
					<ColBox>start</ColBox>
				</Col>
			</Row>
			<Row justify="center">
				<Col span={2}>
					<ColBox>center</ColBox>
				</Col>
				<Col span={2}>
					<ColBox>center</ColBox>
				</Col>
			</Row>
			<Row justify="end">
				<Col span={2}>
					<ColBox>end</ColBox>
				</Col>
				<Col span={2}>
					<ColBox>end</ColBox>
				</Col>
			</Row>
			<Row justify="between">
				<Col span={2}>
					<ColBox>between</ColBox>
				</Col>
				<Col span={2}>
					<ColBox>between</ColBox>
				</Col>
			</Row>
			<Row justify="around">
				<Col span={2}>
					<ColBox>around</ColBox>
				</Col>
				<Col span={2}>
					<ColBox>around</ColBox>
				</Col>
			</Row>
		</div>
	),
};
