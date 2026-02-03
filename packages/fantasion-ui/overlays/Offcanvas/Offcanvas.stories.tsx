import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../../buttons/Button/index.js";
import { Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle } from "./Offcanvas.js";

const meta: Meta<typeof Offcanvas> = {
	title: "Components/Offcanvas",
	component: Offcanvas,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

const OffcanvasDemo = ({ placement = "start" }: { placement?: "start" | "end" | "top" | "bottom" }) => {
	const [show, setShow] = useState(false);

	return (
		<>
			<Button onClick={() => setShow(true)}>Open Offcanvas ({placement})</Button>
			<Offcanvas show={show} onHide={() => setShow(false)} placement={placement}>
				<OffcanvasHeader closeButton={true} onHide={() => setShow(false)}>
					<OffcanvasTitle>Offcanvas Title</OffcanvasTitle>
				</OffcanvasHeader>
				<OffcanvasBody>
					<p>Some content for the offcanvas.</p>
					<p>Placement: {placement}</p>
				</OffcanvasBody>
			</Offcanvas>
		</>
	);
};

export const Start: Story = {
	render: () => <OffcanvasDemo placement="start" />,
};

export const End: Story = {
	render: () => <OffcanvasDemo placement="end" />,
};

export const Top: Story = {
	render: () => <OffcanvasDemo placement="top" />,
};

export const Bottom: Story = {
	render: () => <OffcanvasDemo placement="bottom" />,
};

export const StaticBackdrop: Story = {
	render: () => {
		const [show, setShow] = useState(false);

		return (
			<>
				<Button onClick={() => setShow(true)}>Static Backdrop</Button>
				<Offcanvas show={show} onHide={() => setShow(false)} backdrop="static">
					<OffcanvasHeader closeButton={true} onHide={() => setShow(false)}>
						<OffcanvasTitle>Static Backdrop</OffcanvasTitle>
					</OffcanvasHeader>
					<OffcanvasBody>
						<p>Click outside - it won't close!</p>
						<p>Only the close button works.</p>
					</OffcanvasBody>
				</Offcanvas>
			</>
		);
	},
};

export const WithScroll: Story = {
	render: () => {
		const [show, setShow] = useState(false);

		return (
			<>
				<Button onClick={() => setShow(true)}>Body Scroll Enabled</Button>
				<Offcanvas show={show} onHide={() => setShow(false)} scroll={true}>
					<OffcanvasHeader closeButton={true} onHide={() => setShow(false)}>
						<OffcanvasTitle>Scroll Enabled</OffcanvasTitle>
					</OffcanvasHeader>
					<OffcanvasBody>
						<p>The body can still scroll while this is open.</p>
					</OffcanvasBody>
				</Offcanvas>
			</>
		);
	},
};
