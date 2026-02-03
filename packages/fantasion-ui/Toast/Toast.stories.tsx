import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastBody, ToastContainer, ToastHeader } from "./Toast.js";

const meta: Meta<typeof Toast> = {
	title: "Components/Toast",
	component: Toast,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Toast>
			<ToastHeader onClose={() => {}}>Toast Title</ToastHeader>
			<ToastBody>Hello, this is a toast message!</ToastBody>
		</Toast>
	),
};

export const Variants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<Toast variant="primary">
				<ToastBody>Primary toast</ToastBody>
			</Toast>
			<Toast variant="success">
				<ToastBody>Success toast</ToastBody>
			</Toast>
			<Toast variant="danger">
				<ToastBody>Danger toast</ToastBody>
			</Toast>
			<Toast variant="warning">
				<ToastBody>Warning toast</ToastBody>
			</Toast>
			<Toast variant="info">
				<ToastBody>Info toast</ToastBody>
			</Toast>
		</div>
	),
};

export const InContainer: Story = {
	render: () => (
		<div style={{ position: "relative", minHeight: "200px" }}>
			<ToastContainer position="top-end">
				<Toast>
					<ToastHeader onClose={() => {}}>Notification</ToastHeader>
					<ToastBody>This toast is in a container!</ToastBody>
				</Toast>
			</ToastContainer>
		</div>
	),
};
