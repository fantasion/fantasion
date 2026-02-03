import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
	Dropdown,
	DropdownDivider,
	DropdownHeader,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Popover,
	PopoverBody,
	PopoverHeader,
} from "./Overlay.js";

const meta: Meta<typeof Dropdown> = {
	title: "Components/Overlay",
	component: Dropdown,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const DropdownDefault: Story = {
	name: "Dropdown",
	render: () => {
		const [show, setShow] = useState(false);

		return (
			<Dropdown>
				<DropdownToggle onClick={() => setShow(!show)}>Toggle Dropdown</DropdownToggle>
				<DropdownMenu show={show}>
					<DropdownItem onClick={() => alert("Action!")}>Action</DropdownItem>
					<DropdownItem onClick={() => alert("Another action!")}>Another action</DropdownItem>
					<DropdownDivider />
					<DropdownItem onClick={() => alert("Something else!")}>Something else</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		);
	},
};

export const DropdownWithLinks: Story = {
	name: "Dropdown with Links",
	render: () => {
		const [show, setShow] = useState(false);

		return (
			<Dropdown>
				<DropdownToggle onClick={() => setShow(!show)}>Navigate</DropdownToggle>
				<DropdownMenu show={show}>
					<DropdownItem href="#home">Home</DropdownItem>
					<DropdownItem href="#about">About</DropdownItem>
					<DropdownItem href="#contact">Contact</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		);
	},
};

export const DropdownWithHeader: Story = {
	name: "Dropdown with Header",
	render: () => {
		const [show, setShow] = useState(false);

		return (
			<Dropdown>
				<DropdownToggle onClick={() => setShow(!show)}>Options</DropdownToggle>
				<DropdownMenu show={show}>
					<DropdownHeader>Header</DropdownHeader>
					<DropdownItem>Option 1</DropdownItem>
					<DropdownItem>Option 2</DropdownItem>
					<DropdownDivider />
					<DropdownHeader>Another Header</DropdownHeader>
					<DropdownItem>Option 3</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		);
	},
};

export const DropdownDisabledItems: Story = {
	name: "Dropdown with Disabled Items",
	render: () => {
		const [show, setShow] = useState(false);

		return (
			<Dropdown>
				<DropdownToggle onClick={() => setShow(!show)}>Actions</DropdownToggle>
				<DropdownMenu show={show}>
					<DropdownItem>Regular action</DropdownItem>
					<DropdownItem disabled={true}>Disabled action</DropdownItem>
					<DropdownItem active={true}>Active action</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		);
	},
};

export const PopoverDefault: Story = {
	name: "Popover",
	render: () => (
		<div style={{ display: "flex", gap: "2rem", padding: "4rem" }}>
			<div style={{ position: "relative" }}>
				<Popover placement="top">
					<PopoverHeader>Popover Title</PopoverHeader>
					<PopoverBody>And here's some amazing content. It's very engaging. Right?</PopoverBody>
				</Popover>
			</div>
		</div>
	),
};

export const PopoverPlacements: Story = {
	name: "Popover Placements",
	render: () => (
		<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem", padding: "4rem" }}>
			<div>
				<p>Top</p>
				<Popover placement="top">
					<PopoverBody>Popover on top</PopoverBody>
				</Popover>
			</div>
			<div>
				<p>Bottom</p>
				<Popover placement="bottom">
					<PopoverBody>Popover on bottom</PopoverBody>
				</Popover>
			</div>
			<div>
				<p>Left</p>
				<Popover placement="left">
					<PopoverBody>Popover on left</PopoverBody>
				</Popover>
			</div>
			<div>
				<p>Right</p>
				<Popover placement="right">
					<PopoverBody>Popover on right</PopoverBody>
				</Popover>
			</div>
		</div>
	),
};
