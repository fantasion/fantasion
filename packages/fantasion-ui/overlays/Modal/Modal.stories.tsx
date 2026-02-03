import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Button } from "../../buttons/Button/index.js";
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "./Modal.js";

const meta: Meta<typeof Modal> = {
	title: "Components/Modal",
	component: Modal,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

const ModalDemo = () => {
	const [show, setShow] = useState(false);
	return (
		<>
			<Button onClick={() => setShow(true)}>Open Modal</Button>
			<Modal show={show} onHide={() => setShow(false)}>
				<ModalHeader closeButton={true} onHide={() => setShow(false)}>
					<ModalTitle>Modal Title</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<p>This is the modal body content.</p>
				</ModalBody>
				<ModalFooter>
					<Button variant="secondary" onClick={() => setShow(false)}>
						Close
					</Button>
					<Button variant="primary" onClick={() => setShow(false)}>
						Save Changes
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};

export const Default: Story = {
	render: () => <ModalDemo />,
};

export const Centered: Story = {
	render: () => {
		const [show, setShow] = useState(false);
		return (
			<>
				<Button onClick={() => setShow(true)}>Centered Modal</Button>
				<Modal show={show} onHide={() => setShow(false)} centered={true}>
					<ModalHeader closeButton={true} onHide={() => setShow(false)}>
						<ModalTitle>Centered Modal</ModalTitle>
					</ModalHeader>
					<ModalBody>This modal is vertically centered.</ModalBody>
				</Modal>
			</>
		);
	},
};

export const OpenCloseTest: Story = {
	render: () => <ModalDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Initially modal should not be visible
		const openButton = canvas.getByRole("button", { name: /open modal/i });
		await expect(openButton).toBeInTheDocument();

		// Click to open modal
		await userEvent.click(openButton);

		// Wait for modal to appear (checking document body for modal)
		const modalTitle = await within(document.body).findByText("Modal Title");
		await expect(modalTitle).toBeInTheDocument();

		// Close modal using close button
		const closeButton = within(document.body).getByRole("button", { name: /close/i });
		await userEvent.click(closeButton);

		// Modal should be hidden (wait a bit for animation)
		await new Promise((resolve) => setTimeout(resolve, 500));
	},
};
